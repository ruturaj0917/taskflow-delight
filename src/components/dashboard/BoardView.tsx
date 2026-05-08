import type { Task } from "@/types/task";
import { BoardTaskCard } from "./BoardTaskCard";

export function BoardView({
  tasks,
  onToggle,
  onEdit,
}: {
  tasks: Task[];
  onToggle: (t: Task) => void;
  onEdit: (t: Task) => void;
}) {
  const high = tasks.filter((t) => !t.completed && t.priority === "High");
  const normal = tasks.filter((t) => !t.completed && t.priority !== "High");
  const done = tasks.filter((t) => t.completed);

  const col = (icon: string, title: string, items: Task[]) => (
    <div className="board-col">
      <div className="board-col-header">
        <span>{icon}</span>
        <span>{title}</span>
        <span className="count">{items.length}</span>
      </div>
      <div className="board-col-body">
        {items.map((t) => (
          <BoardTaskCard key={t.id} task={t} onToggle={onToggle} onEdit={onEdit} />
        ))}
      </div>
    </div>
  );

  return (
    <div className="board">
      {col("🔴", "High Priority", high)}
      {col("🟡", "Normal", normal)}
      {col("🟢", "Completed", done)}
    </div>
  );
}
