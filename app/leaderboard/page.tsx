import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { supabaseAdmin } from "@/lib/supabase";

export const dynamic = "force-dynamic";

export default async function LeaderboardPage() {
  const { data: teams } = await supabaseAdmin.from("teams").select("*").order("total_points", { ascending: false });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Leaderboard</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b text-left">
                <th className="py-2">Rank</th>
                <th>Team</th>
                <th>Total Points</th>
                <th>Completed Stages</th>
                <th>Progress %</th>
              </tr>
            </thead>
            <tbody>
              {teams?.map((team, index) => (
                <tr key={team.id} className="border-b">
                  <td className="py-3">#{index + 1}</td>
                  <td>{team.name}</td>
                  <td>{team.total_points}</td>
                  <td>{team.completed_stages}</td>
                  <td>{team.progress_percent}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}
