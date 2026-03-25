import Link from "next/link";
import { BarChart3, PlaySquare } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/30">
      <header className="border-b">
        <div className="container flex h-16 items-center justify-between">
          <Link href="/" className="text-lg font-bold">TeamProgressHub</Link>
          <nav className="flex items-center gap-2">
            <Link href="/" className="inline-flex items-center gap-2 rounded-md px-3 py-2 text-sm hover:bg-secondary">
              <BarChart3 className="h-4 w-4" /> Dashboard
            </Link>
            <Link href="/leaderboard" className="inline-flex items-center gap-2 rounded-md px-3 py-2 text-sm hover:bg-secondary">
              🏆 Leaderboard
            </Link>
            <Link href="/videos" className="inline-flex items-center gap-2 rounded-md px-3 py-2 text-sm hover:bg-secondary">
              <PlaySquare className="h-4 w-4" /> Videos
            </Link>
            <ThemeToggle />
          </nav>
        </div>
      </header>
      <main className="container py-8">{children}</main>
    </div>
  );
}
