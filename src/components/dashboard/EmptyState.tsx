export function EmptyState({ onAdd }: { onAdd: () => void }) {
  return (
    <div className="empty">
      <div className="icon">🎯</div>
      <p>No tasks here</p>
      <button className="btn btn-primary" onClick={onAdd}>+ Add your first task</button>
    </div>
  );
}
