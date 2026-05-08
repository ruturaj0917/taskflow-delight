export type ViewMode = "list" | "board";

export function Topbar({
  title,
  search,
  onSearch,
  view,
  onView,
  onAdd,
  onMenu,
}: {
  title: string;
  search: string;
  onSearch: (s: string) => void;
  view: ViewMode;
  onView: (v: ViewMode) => void;
  onAdd: () => void;
  onMenu: () => void;
}) {
  return (
    <header className="topbar">
      <button className="hamburger" onClick={onMenu} aria-label="Menu">☰</button>
      <h1>{title}</h1>
      <input
        className="search-box"
        placeholder="Search tasks..."
        value={search}
        onChange={(e) => onSearch(e.target.value)}
      />
      <button
        className="btn btn-ghost btn-sm"
        onClick={() => onView(view === "list" ? "board" : "list")}
      >
        {view === "list" ? "🗂 Board" : "📋 List"}
      </button>
      <button className="btn btn-primary btn-sm" onClick={onAdd}>+ New Task</button>
    </header>
  );
}
