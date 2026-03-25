import { fetchProgressSheet } from "@/lib/google-sheets";
import { supabaseAdmin } from "@/lib/supabase";

const STAGE_COUNT = 4;

export async function ensureSeedData() {
  const stageRows = Array.from({ length: STAGE_COUNT }, (_, index) => ({
    stage_number: index + 1,
    name: `Stage ${index + 1}`,
    required_previous_stage: index === 0 ? null : index
  }));

  const taskRows = Array.from({ length: 12 }, (_, index) => {
    const taskNumber = index + 1;
    const stageNumber = Math.floor(index / 3) + 1;
    const position = ((index % 3) + 1);

    return {
      stage_number: stageNumber,
      task_number: taskNumber,
      name: `Stage ${stageNumber} - Task ${position}`,
      default_points: 100
    };
  });

  const sampleTeams = ["Armavir", "Yerevan", "Gyumri", "Vanadzor", "Dilijan"].map((name) => ({ name }));

  await supabaseAdmin.from("stages").upsert(stageRows, { onConflict: "stage_number" });
  await supabaseAdmin.from("tasks").upsert(taskRows, { onConflict: "task_number" });
  await supabaseAdmin.from("teams").upsert(sampleTeams, { onConflict: "name" });

  const videos = [
    ["Welcome Sprint", "Team kickoff and roadmap", "https://www.youtube.com/embed/dQw4w9WgXcQ"],
    ["Collaboration Mastery", "How teams collaborate effectively", "https://www.youtube.com/embed/ysz5S6PUM-U"],
    ["Metrics Deep Dive", "Using data for better execution", "https://www.youtube.com/embed/J---aiyznGQ"],
    ["Agile Flow", "Building agile rituals", "https://www.youtube.com/embed/tgbNymZ7vqY"],
    ["Leadership Moments", "How to lead under pressure", "https://www.youtube.com/embed/aqz-KE-bpKQ"],
    ["Retrospective Framework", "Learning loops for teams", "https://www.youtube.com/embed/5qap5aO4i9A"]
  ].map(([title, description, youtube_url]) => ({ title, description, youtube_url }));

  await supabaseAdmin.from("videos").upsert(videos, { onConflict: "youtube_url" });
}

export async function syncFromGoogleSheet() {
  await ensureSeedData();

  const rows = await fetchProgressSheet();

  for (const row of rows) {
    const { data: team, error: teamError } = await supabaseAdmin
      .from("teams")
      .upsert(
        {
          name: row.Team,
          total_points: row.TotalPoints,
          completed_stages: [row.Stage1_Completed, row.Stage2_Completed, row.Stage3_Completed, row.Stage4_Completed].filter(Boolean)
            .length,
          progress_percent: Math.round((row.taskCompleted.filter(Boolean).length / 12) * 100),
          updated_at: new Date().toISOString()
        },
        { onConflict: "name" }
      )
      .select("id")
      .single();

    if (teamError || !team) {
      throw new Error(teamError?.message ?? `Team sync failed for ${row.Team}`);
    }

    const stageProgressRows = Array.from({ length: STAGE_COUNT }, (_, i) => ({
      team_id: team.id,
      stage_number: i + 1,
      completed: [row.Stage1_Completed, row.Stage2_Completed, row.Stage3_Completed, row.Stage4_Completed][i]
    }));

    await supabaseAdmin.from("progress").upsert(stageProgressRows, {
      onConflict: "team_id,stage_number"
    });

    const taskProgressRows = Array.from({ length: 12 }, (_, i) => ({
      team_id: team.id,
      stage_number: Math.floor(i / 3) + 1,
      task_number: i + 1,
      completed: row.taskCompleted[i],
      points_earned: row.taskCompleted[i] ? row.taskPoints[i] : 0
    }));

    await supabaseAdmin.from("task_progress").upsert(taskProgressRows, {
      onConflict: "team_id,task_number"
    });
  }

  await supabaseAdmin.from("app_meta").upsert({ key: "last_sync_at", value: new Date().toISOString() }, { onConflict: "key" });
}

export async function getDashboardData(selectedTeamName?: string) {
  await ensureSeedData();

  const [{ data: teams }, { data: stages }, { data: tasks }, { data: lastSync }] = await Promise.all([
    supabaseAdmin.from("teams").select("*").order("name"),
    supabaseAdmin.from("stages").select("*").order("stage_number"),
    supabaseAdmin.from("tasks").select("*").order("task_number"),
    supabaseAdmin.from("app_meta").select("value").eq("key", "last_sync_at").maybeSingle()
  ]);

  const activeTeam =
    teams?.find((team) => team.name === selectedTeamName) ??
    teams?.[0] ??
    null;

  if (!activeTeam) {
    return {
      teams: [],
      stages: stages ?? [],
      tasks: tasks ?? [],
      taskProgress: [],
      stageProgress: [],
      lastSyncedAt: null,
      activeTeamName: null
    };
  }

  const [{ data: taskProgress }, { data: stageProgress }] = await Promise.all([
    supabaseAdmin.from("task_progress").select("*").eq("team_id", activeTeam.id),
    supabaseAdmin.from("progress").select("*").eq("team_id", activeTeam.id)
  ]);

  return {
    teams: teams ?? [],
    stages: stages ?? [],
    tasks: tasks ?? [],
    taskProgress: taskProgress ?? [],
    stageProgress: stageProgress ?? [],
    lastSyncedAt: lastSync?.value ?? null,
    activeTeamName: activeTeam.name
  };
}
