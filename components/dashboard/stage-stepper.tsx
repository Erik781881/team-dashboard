import { Lock, Trophy } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import type { Stage, Task, TeamStageProgress, TeamTaskProgress } from "@/types";

export function StageStepper({
  stages,
  tasks,
  stageProgress,
  taskProgress
}: {
  stages: Stage[];
  tasks: Task[];
  stageProgress: TeamStageProgress[];
  taskProgress: TeamTaskProgress[];
}) {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      {stages.map((stage) => {
        const currentStageProgress = stageProgress.find((s) => s.stage_number === stage.stage_number);
        const previousStageCompleted =
          stage.stage_number === 1 || stageProgress.find((s) => s.stage_number === stage.stage_number - 1)?.completed;
        const unlocked = Boolean(previousStageCompleted);
        const stageTasks = tasks.filter((t) => t.stage_number === stage.stage_number);
        const stageTaskProgress = taskProgress.filter((tp) => tp.stage_number === stage.stage_number);
        const completion = stageTasks.length
          ? Math.round((stageTaskProgress.filter((t) => t.completed).length / stageTasks.length) * 100)
          : 0;

        return (
          <Card key={stage.id} className={!unlocked ? "opacity-70" : ""}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>{stage.name}</CardTitle>
                {!unlocked ? <Lock className="h-4 w-4" /> : <Badge>{currentStageProgress?.completed ? "Done" : "Active"}</Badge>}
              </div>
              <CardDescription>
                {!unlocked ? "🔒 Complete previous stage" : `${completion}% tasks completed`}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Progress value={unlocked ? completion : 0} className="mb-4" />
              <div className="space-y-2">
                {stageTasks.map((task) => {
                  const tp = taskProgress.find((p) => p.task_number === task.task_number);
                  return (
                    <div key={task.id} className="flex items-center justify-between rounded-md border p-2 text-sm">
                      <span>{task.name}</span>
                      <span className="flex items-center gap-2">
                        <Trophy className="h-3.5 w-3.5" />
                        {tp?.completed ? tp.points_earned : 0} pts
                      </span>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
