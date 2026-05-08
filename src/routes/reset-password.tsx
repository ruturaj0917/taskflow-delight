import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { AuthCard } from "@/components/auth/AuthCard";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "@/hooks/useToast";

export const Route = createFileRoute("/reset-password")({
  head: () => ({ meta: [{ title: "New password — TaskFlow" }] }),
  component: ResetPage,
});

function ResetPage() {
  const { updatePassword } = useAuth();
  const navigate = useNavigate();
  const [pwd, setPwd] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (pwd.length < 8) return setError("Min 8 characters");
    if (pwd !== confirm) return setError("Passwords do not match");
    setSubmitting(true);
    try {
      await updatePassword(pwd);
      toast("Password updated!", "success");
      navigate({ to: "/signin" });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AuthCard title="New password" subtitle="Choose a strong new password">
      <form className="auth-form" onSubmit={submit}>
        <div className="field">
          <label className="field-label">New password</label>
          <input className="input" type="password" autoComplete="new-password" required
            value={pwd} onChange={(e) => setPwd(e.target.value)} />
        </div>
        <div className="field">
          <label className="field-label">Confirm password</label>
          <input className="input" type="password" autoComplete="new-password" required
            value={confirm} onChange={(e) => setConfirm(e.target.value)} />
          {error && <div className="field-error">{error}</div>}
        </div>
        <button type="submit" className="btn btn-primary btn-block" disabled={submitting}>
          {submitting ? <><div className="spinner sm" /> Updating...</> : "Update Password"}
        </button>
      </form>
    </AuthCard>
  );
}
