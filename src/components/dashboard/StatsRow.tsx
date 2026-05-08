import type { Stats } from "@/types/task";

export function StatsRow({ stats }: { stats: Stats }) {
  const cards: { label: string; value: number; klass: string; suffix?: string }[] = [
    { label: "Total Tasks", value: stats.total, klass: "yellow" },
    { label: "Completed", value: stats.completed, klass: "green" },
    { label: "Overdue", value: stats.overdue, klass: "red" },
    { label: "High Priority", value: stats.highPriority, klass: "blue" },
  ];
  return (
    <div className="stats-row">
      {cards.map((c) => (
        <div key={c.label} className={`stat-card ${c.klass}`}>
          <div className="stat-label">{c.label}</div>
          <div className="stat-value">{c.value}</div>
          <div className="stat-change">{stats.completionRate}% completion rate</div>
        </div>
      ))}
    </div>
  );
}
