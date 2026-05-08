import { useEffect, useState } from "react";
import type { Category, Priority, Task, TaskInput } from "@/types/task";

const CATEGORIES: Category[] = ["Work", "Personal", "Health", "Finance", "Learning"];
const PRIORITIES: Priority[] = ["High", "Medium", "Low"];

export function TaskModal({
  open,
  initial,
  onClose,
  onSave,
}: {
  open: boolean;
  initial?: Task | null;
  onClose: () => void;
  onSave: (input: TaskInput, id?: string) => Promise<void>;
}) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState<Category>("Work");
  const [priority, setPriority] = useState<Priority>("Medium");
  const [due, setDue] = useState<string>("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!open) return;
    setTitle(initial?.title ?? "");
    setDescription(initial?.description ?? "");
    setCategory(initial?.category ?? "Work");
    setPriority(initial?.priority ?? "Medium");
    setDue(initial?.due ?? "");
    setSaving(false);
  }, [open, initial]);

  if (!open) return null;

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    setSaving(true);
    try {
      await onSave(
        {
          title: title.trim(),
          description: description.trim() || undefined,
          category,
          priority,
          due: due || null,
        },
        initial?.id,
      );
      onClose();
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="modal-overlay" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <form className="modal" onSubmit={submit}>
        <div className="modal-title">{initial ? "Edit task" : "New task"}</div>
        <div className="modal-body">
          <div className="field">
            <label className="field-label">Title *</label>
            <input
              className="input"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              autoFocus
              required
              maxLength={200}
            />
          </div>
          <div className="field">
            <label className="field-label">Description</label>
            <textarea
              className="input"
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              maxLength={1000}
              style={{ resize: "vertical", minHeight: 64 }}
            />
          </div>
          <div className="modal-row">
            <div className="field">
              <label className="field-label">Category</label>
              <select className="input" value={category} onChange={(e) => setCategory(e.target.value as Category)}>
                {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div className="field">
              <label className="field-label">Priority</label>
              <select className="input" value={priority} onChange={(e) => setPriority(e.target.value as Priority)}>
                {PRIORITIES.map((p) => <option key={p} value={p}>{p}</option>)}
              </select>
            </div>
          </div>
          <div className="field">
            <label className="field-label">Due date</label>
            <input className="input" type="date" value={due} onChange={(e) => setDue(e.target.value)} />
          </div>
        </div>
        <div className="modal-actions">
          <button type="button" className="btn btn-ghost" onClick={onClose} disabled={saving}>Cancel</button>
          <button type="submit" className="btn btn-primary" disabled={saving || !title.trim()}>
            {saving ? <div className="spinner sm" /> : null}
            {initial ? "Save" : "Create"}
          </button>
        </div>
      </form>
    </div>
  );
}
