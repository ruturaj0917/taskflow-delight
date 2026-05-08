import { useToasts } from "@/hooks/useToast";

export function ToastContainer() {
  const toasts = useToasts();
  return (
    <div className="toast-container">
      {toasts.map((t) => (
        <div key={t.id} className={`toast ${t.kind}`}>{t.message}</div>
      ))}
    </div>
  );
}
