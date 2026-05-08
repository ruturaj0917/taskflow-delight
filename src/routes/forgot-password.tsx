import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { AuthCard } from "@/components/auth/AuthCard";
import { useAuth } from "@/contexts/AuthContext";

export const Route = createFileRoute("/forgot-password")({
  head: () => ({ meta: [{ title: "Reset password — TaskFlow" }] }),
  component: ForgotPage,
});

function ForgotPage() {
  const { resetPassword } = useAuth();
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");
    try {
      await resetPassword(email);
      setDone(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to send link");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AuthCard title="Reset password" subtitle="Enter your email and we'll send a reset link">
      {done ? (
        <div className="success-block">
          <div className="emoji">📬</div>
          <h3>Reset link sent!</h3>
          <p>Check your inbox at {email}</p>
          <Link to="/signin" className="btn btn-ghost">Back to Sign In</Link>
        </div>
      ) : (
        <form className="auth-form" onSubmit={submit}>
          <div className="field">
            <label className="field-label">Email</label>
            <input className="input" type="email" autoComplete="email" required
              value={email} onChange={(e) => setEmail(e.target.value)} />
            {error && <div className="field-error">{error}</div>}
          </div>
          <button type="submit" className="btn btn-primary btn-block" disabled={submitting}>
            {submitting ? <><div className="spinner sm" /> Sending...</> : "Send Reset Link"}
          </button>
          <div className="auth-bottom">
            <Link to="/signin">Back to Sign In</Link>
          </div>
        </form>
      )}
    </AuthCard>
  );
}
