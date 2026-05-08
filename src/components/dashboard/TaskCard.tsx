import type { Task } from "@/types/task";

function formatDue(due: string | null): { text: string; klass: string } | null {
  if (!due) return null;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const d = new Date(due + "T00:00:00");
  const diff = Math.round((d.getTime() - today.getTime()) / 86400000);
  if (diff < 0) return { text: `Overdue ${-diff}d`, klass: "overdue" };
  if (diff === 0) return { text: "Due today", klass: "today" };
  if (diff === 1) return { text: "Tomorrow", klass: "" };
  return { text: d.toLocaleDateString(undefined, { month: "short", day: "numeric" }), klass: "" };
}

export function TaskCard({
  task,
  onToggle,
  onEdit,
  onDelete,
}: {
  task: Task;
  onToggle: (t: Task) => void;
  onEdit: (t: Task) => void;
  onDelete: (t: Task) => void;
}) {
  const due = formatDue(task.due);
  return (
    <div className={`task-card ${task.completed ? "done" : ""}`}>
      <button
        className={`checkbox ${task.completed ? "checked" : ""}`}
        onClick={() => onToggle(task)}
        aria-label="Toggle complete"
      >
        {task.completed && "✓"}
      </button>
      <div className="task-main">
        <div className="task-title-row">
          <span className={`priority-dot ${task.priority.toLowerCase()}`} />
          <span className="task-title">{task.title}</span>
          <span className={`tag cat-${task.category.toLowerCase()}`}>{task.category}</span>
          <span className="tag priority">{task.priority}</span>
          {due && <span className={`due ${due.klass}`}>{due.text}</span>}
        </div>
        {task.description && <div className="task-desc">{task.description}</div>}
      </div>
      <div className="task-actions">
        <button onClick={() => onEdit(task)} aria-label="Edit">✏️</button>
        <button className="delete" onClick={() => onDelete(task)} aria-label="Delete">🗑️</button>
      </div>
    </div>
  );
}
