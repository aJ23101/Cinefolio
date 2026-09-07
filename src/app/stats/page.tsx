import { AppShell } from "@/components/AppShell";
import { StatsCharts } from "@/components/StatsCharts";
export default function StatsPage() { return <AppShell><div className="stats-header"><p className="eyebrow">The numbers</p><h1 className="mt-2 text-4xl font-semibold">Your film life, in motion.</h1><p className="mt-2 text-[var(--muted)]">A small archive of the films that found their way to you.</p></div><StatsCharts /></AppShell>; }
