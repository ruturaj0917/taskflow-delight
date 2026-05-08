import type { Task } from "@/types/task";

export function BoardTaskCard({
  task,
  onToggle,
  onEdit,
}: {
  task: Task;
  onToggle: (t: Task) => void;
  onEdit: (t: Task) => void;
}) {
  return (
    <div className={`board-card ${task.completed ? "done" : ""}`} onDoubleClick={() => onEdit(task)}>
      <div className="row1">
        <button
          className={`checkbox ${task.completed ? "checked" : ""}`}
          onClick={() => onToggle(task)}
          aria-label="Toggle"
        >
          {task.completed && "✓"}
        </button>
        <span className="b-title">{task.title}</span>
      </div>
      {task.description && <div className="task-desc">{task.description}</div>}
      <div className="b-meta">
        <span className={`priority-dot ${task.priority.toLowerCase()}`} />
        <span className={`tag cat-${task.category.toLowerCase()}`}>{task.category}</span>
        <span className="tag priority">{task.priority}</span>
      </div>
    </div>
  );
}
