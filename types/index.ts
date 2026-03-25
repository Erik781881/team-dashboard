export type Team = {
  id: string;
  name: string;
  total_points: number;
  completed_stages: number;
  progress_percent: number;
  updated_at: string;
};

export type Stage = {
  id: string;
  stage_number: number;
  name: string;
  required_previous_stage: number | null;
};

export type Task = {
  id: string;
  stage_number: number;
  task_number: number;
  name: string;
  points: number;
};

export type TeamTaskProgress = {
  id: string;
  team_id: string;
  stage_number: number;
  task_number: number;
  completed: boolean;
  points_earned: number;
};

export type TeamStageProgress = {
  id: string;
  team_id: string;
  stage_number: number;
  completed: boolean;
};

export type DashboardPayload = {
  teams: Team[];
  stages: Stage[];
  tasks: Task[];
  taskProgress: TeamTaskProgress[];
  stageProgress: TeamStageProgress[];
  lastSyncedAt: string | null;
};

export type Video = {
  id: string;
  title: string;
  description: string;
  youtube_url: string;
};
