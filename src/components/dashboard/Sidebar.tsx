import type { Category, Stats } from "@/types/task";
import { useAuth } from "@/contexts/AuthContext";
import { UserAvatar } from "@/components/ui/UserAvatar";
import { useState } from "react";

export type Filter =
  | { kind: "all" }
  | { kind: "today" }
  | { kind: "overdue" }
  | { kind: "completed" }
  | { kind: "category"; value: Category };

const CATS: { value: Category; emoji: string }[] = [
  { value: "Work", emoji: "💼" },
  { value: "Personal", emoji: "👤" },
  { value: "Health", emoji: "💪" },
  { value: "Finance", emoji: "💰" },
  { value: "Learning", emoji: "📚" },
];

export function Sidebar({
  filter,
  onFilter,
  stats,
  open,
  onClose,
}: {
  filter: Filter;
  onFilter: (f: Filter) => void;
  stats: Stats;
  open: boolean;
  onClose: () => void;
}) {
  const { user, signOut } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const fullName = (user?.user_metadata?.full_name as string | undefined) || user?.email?.split("@")[0] || "You";

  const isActive = (f: Filter) =>
    f.kind === filter.kind &&
    (f.kind !== "category" || (filter.kind === "category" && f.value === filter.value));

  const item = (f: Filter, icon: string, label: string, badge?: number) => (
    <button
      className={`nav-item ${isActive(f) ? "active" : ""}`}
      onClick={() => { onFilter(f); onClose(); }}
    >
      <span className="nav-icon">{icon}</span>
      <span>{label}</span>
      {badge !== undefined && badge > 0 && (
        <span className={`nav-badge ${isActive(f) ? "" : "muted"}`}>{badge}</span>
      )}
    </button>
  );

  return (
    <aside className={`sidebar ${open ? "open" : ""}`}>
      <div className="sidebar-logo"><span className="logo-dot" /> TaskFlow</div>
      <div className="sidebar-nav">
        <div className="sidebar-section">Tasks</div>
        {item({ kind: "all" }, "📋", "All Tasks", stats.pending)}
        {item({ kind: "today" }, "📅", "Today")}
        {item({ kind: "overdue" }, "⚠️", "Overdue", stats.overdue)}
        {item({ kind: "completed" }, "✅", "Completed", stats.completed)}

        <div className="sidebar-section">Categories</div>
        {CATS.map((c) =>
          item({ kind: "category", value: c.value }, c.emoji, c.value, stats.byCategory[c.value]),
        )}
      </div>
      <div className="sidebar-footer">
        <div className="progress-row">
          <span>Overall progress</span>
          <span>{stats.completionRate}%</span>
        </div>
        <div className="progress-bar"><span style={{ width: `${stats.completionRate}%` }} /></div>
        <div className="progress-meta">{stats.completed} of {stats.total} tasks done</div>

        <div className="user-card">
          <UserAvatar name={fullName} email={user?.email} />
          <div style={{ minWidth: 0, flex: 1 }}>
            <div className="name">{fullName}</div>
            <div className="email">{user?.email}</div>
          </div>
          <button className="user-menu-btn" onClick={() => setMenuOpen((v) => !v)} aria-label="Menu">⋯</button>
          {menuOpen && (
            <div className="user-dropdown" onMouseLeave={() => setMenuOpen(false)}>
              <button onClick={() => setMenuOpen(false)}>👤 {fullName}</button>
              <button onClick={() => { setMenuOpen(false); void signOut(); }}>🚪 Sign out</button>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
}
