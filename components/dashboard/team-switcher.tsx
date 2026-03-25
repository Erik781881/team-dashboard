"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { Team } from "@/types";

export function TeamSwitcher({ teams, selectedTeam }: { teams: Team[]; selectedTeam: string }) {
  const router = useRouter();
  const params = useSearchParams();

  const onValueChange = (value: string) => {
    const next = new URLSearchParams(params.toString());
    next.set("team", value);
    router.push(`/?${next.toString()}`);
  };

  return (
    <div className="w-full max-w-xs">
      <Select value={selectedTeam} onValueChange={onValueChange}>
        <SelectTrigger>
          <SelectValue placeholder="Select team" />
        </SelectTrigger>
        <SelectContent>
          {teams.map((team) => (
            <SelectItem key={team.id} value={team.name}>
              {team.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
