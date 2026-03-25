import { triggerManualSync } from "@/app/actions/sync-actions";
import { RefreshIndicator } from "@/components/dashboard/refresh-indicator";
import { StageStepper } from "@/components/dashboard/stage-stepper";
import { TeamSwitcher } from "@/components/dashboard/team-switcher";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getDashboardData } from "@/lib/sync";

export const dynamic = "force-dynamic";

export default async function Home({ searchParams }: { searchParams: { team?: string } }) {
  const data = await getDashboardData(searchParams.team);

  return (
    <div className="space-y-6">
      <section className="flex flex-col gap-3 rounded-xl border bg-card p-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold">Mission Dashboard</h1>
          <p className="text-sm text-muted-foreground">Track stage progression, unlocks, and team momentum.</p>
          <p className="text-xs text-muted-foreground">Last sync: {data.lastSyncedAt ?? "Never"}</p>
          <RefreshIndicator />
        </div>
        <div className="flex w-full items-center gap-2 md:w-auto">
          {data.activeTeamName && <TeamSwitcher teams={data.teams} selectedTeam={data.activeTeamName} />}
          <form action={triggerManualSync}>
            <Button type="submit">Sync now</Button>
          </form>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader><CardTitle>Total Points</CardTitle></CardHeader>
          <CardContent className="text-3xl font-bold">
            {data.teams.find((team) => team.name === data.activeTeamName)?.total_points ?? 0}
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Completed Stages</CardTitle></CardHeader>
          <CardContent className="text-3xl font-bold">
            {data.teams.find((team) => team.name === data.activeTeamName)?.completed_stages ?? 0}/4
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Overall Progress</CardTitle></CardHeader>
          <CardContent className="text-3xl font-bold">
            {data.teams.find((team) => team.name === data.activeTeamName)?.progress_percent ?? 0}%
          </CardContent>
        </Card>
      </section>

      <StageStepper stages={data.stages} tasks={data.tasks} stageProgress={data.stageProgress} taskProgress={data.taskProgress} />
    </div>
  );
}
