import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Loader } from "@/components/ui/Loader";
import { Sidebar, type Filter } from "@/components/dashboard/Sidebar";
import { Topbar, type ViewMode } from "@/components/dashboard/Topbar";
import { StatsRow } from "@/components/dashboard/StatsRow";
import { TaskList } from "@/components/dashboard/TaskList";
import { BoardView } from "@/components/dashboard/BoardView";
import { TaskModal } from "@/components/dashboard/TaskModal";
import { EmptyState } from "@/components/dashboard/EmptyState";
import { useTasks } from "@/hooks/useTasks";
import { useStats } from "@/hooks/useStats";
import { toast } from "@/hooks/useToast";
import type { Priority, Task, TaskInput } from "@/types/task";

export const Route = createFileRoute("/dashboard")({
  head: () => ({ meta: [{ title: "Dashboard — TaskFlow" }] }),
  component: DashboardPage,
});

function DashboardPage() {
  const { isAuthenticated, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !isAuthenticated) navigate({ to: "/signin" });
  }, [loading, isAuthenticated, navigate]);

  if (loading || !isAuthenticated) return <Loader />;

  return <DashboardInner />;
}

function DashboardInner() {
  const { tasks, createTask, updateTask, toggleTask, deleteTask } = useTasks();
  const stats = useStats(tasks);

  const [filter, setFilter] = useState<Filter>({ kind: "all" });
  const [view, setView] = useState<ViewMode>("list");
  const [search, setSearch] = useState("");
  const [priorityFilter, setPriorityFilter] = useState<"All" | Priority>("All");
  const [sort, setSort] = useState<"due" | "priority" | "az">("due");
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Task | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const today = new Date().toISOString().slice(0, 10);

  const title = useMemo(() => {
    switch (filter.kind) {
      case "all": return "All Tasks";
      case "today": return "Today";
      case "overdue": return "Overdue";
      case "completed": return "Completed";
      case "category": return filter.value;
    }
  }, [filter]);

  const filtered = useMemo(() => {
    let list = tasks;
    switch (filter.kind) {
      case "today": list = list.filter((t) => !t.completed && t.due === today); break;
      case "overdue": list = list.filter((t) => !t.completed && t.due && t.due < today); break;
      case "completed": list = list.filter((t) => t.completed); break;
      case "category": list = list.filter((t) => t.category === filter.value); break;
      case "all": list = list.filter((t) => !t.completed); break;
    }
    if (priorityFilter !== "All") list = list.filter((t) => t.priority === priorityFilter);
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter((t) =>
        t.title.toLowerCase().includes(q) ||
        (t.description ?? "").toLowerCase().includes(q),
      );
    }
    const prRank: Record<Priority, number> = { High: 0, Medium: 1, Low: 2 };
    const sorted = [...list];
    if (sort === "due") sorted.sort((a, b) => (a.due ?? "9999") < (b.due ?? "9999") ? -1 : 1);
    else if (sort === "priority") sorted.sort((a, b) => prRank[a.priority] - prRank[b.priority]);
    else sorted.sort((a, b) => a.title.localeCompare(b.title));
    return sorted;
  }, [tasks, filter, priorityFilter, sort, search, today]);

  const handleSave = async (input: TaskInput, id?: string) => {
    try {
      if (id) {
        await updateTask(id, input);
        toast("Task updated ✏️", "info");
      } else {
        await createTask(input);
        toast("Task created!", "success");
      }
    } catch (e) {
      toast(e instanceof Error ? e.message : "Failed to save", "error");
    }
  };

  const handleToggle = async (t: Task) => {
    try {
      await toggleTask(t.id, !t.completed);
      toast(t.completed ? "Task reopened" : "Task completed! 🎉", t.completed ? "info" : "success");
    } catch (e) {
      toast(e instanceof Error ? e.message : "Failed", "error");
    }
  };

  const handleDelete = async (t: Task) => {
    if (!confirm(`Delete "${t.title}"?`)) return;
    try {
      await deleteTask(t.id);
      toast("Task deleted 🗑️", "error");
    } catch (e) {
      toast(e instanceof Error ? e.message : "Failed", "error");
    }
  };

  const openNew = () => { setEditing(null); setModalOpen(true); };
  const openEdit = (t: Task) => { setEditing(t); setModalOpen(true); };

  return (
    <div className="app">
      <Sidebar
        filter={filter}
        onFilter={setFilter}
        stats={stats}
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />
      <main className="main">
        <Topbar
          title={title}
          search={search}
          onSearch={setSearch}
          view={view}
          onView={setView}
          onAdd={openNew}
          onMenu={() => setSidebarOpen((v) => !v)}
        />
        <div className="content">
          <StatsRow stats={stats} />

          {view === "list" && (
            <div className="toolbar">
              <div className="chips">
                {(["All", "High", "Medium", "Low"] as const).map((p) => (
                  <button
                    key={p}
                    className={`chip ${priorityFilter === p ? "active" : ""}`}
                    onClick={() => setPriorityFilter(p)}
                  >{p}</button>
                ))}
              </div>
              <select className="select" value={sort} onChange={(e) => setSort(e.target.value as typeof sort)}>
                <option value="due">Due Date</option>
                <option value="priority">Priority</option>
                <option value="az">A–Z</option>
              </select>
            </div>
          )}

          {filtered.length === 0 ? (
            <EmptyState onAdd={openNew} />
          ) : view === "list" ? (
            <TaskList tasks={filtered} onToggle={handleToggle} onEdit={openEdit} onDelete={handleDelete} />
          ) : (
            <BoardView tasks={filtered} onToggle={handleToggle} onEdit={openEdit} />
          )}
        </div>
      </main>
      <TaskModal
        open={modalOpen}
        initial={editing}
        onClose={() => setModalOpen(false)}
        onSave={handleSave}
      />
    </div>
  );
}
