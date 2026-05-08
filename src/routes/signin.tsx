import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { AuthCard } from "@/components/auth/AuthCard";
import { OAuthButtons } from "@/components/auth/OAuthButtons";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "@/hooks/useToast";

export const Route = createFileRoute("/signin")({
  head: () => ({ meta: [{ title: "Sign in — TaskFlow" }] }),
  component: SignInPage,
});

function SignInPage() {
  const { signInWithEmail, isAuthenticated, loading } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPwd, setShowPwd] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!loading && isAuthenticated) navigate({ to: "/dashboard" });
  }, [loading, isAuthenticated, navigate]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      await signInWithEmail(email, password);
      navigate({ to: "/dashboard" });
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Sign-in failed";
      if (/email.*not.*confirm/i.test(msg)) {
        toast("Please verify your email first", "info");
      }
      setError("Invalid email or password");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AuthCard title="Welcome back" subtitle="Sign in to your TaskFlow account">
      <form className="auth-form" onSubmit={submit}>
        <OAuthButtons />
        <div className="auth-divider">OR</div>
        <div className="field">
          <label className="field-label">Email</label>
          <input
            className={`input ${error ? "error" : ""}`}
            type="email" autoComplete="email" required
            value={email} onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="field">
          <label className="field-label">Password</label>
          <div className="input-group">
            <input
              className={`input ${error ? "error" : ""}`}
              type={showPwd ? "text" : "password"}
              autoComplete="current-password" required
              value={password} onChange={(e) => setPassword(e.target.value)}
            />
            <button type="button" className="input-toggle" onClick={() => setShowPwd((v) => !v)}>
              {showPwd ? "🙈" : "👁"}
            </button>
          </div>
          {error && <div className="field-error">{error}</div>}
        </div>
        <div className="field-hint-row">
          <Link to="/forgot-password">Forgot password?</Link>
        </div>
        <button type="submit" className="btn btn-primary btn-block" disabled={submitting}>
          {submitting ? <><div className="spinner sm" /> Signing in...</> : "Sign In"}
        </button>
      </form>
      <div className="auth-bottom">
        Don&apos;t have an account? <Link to="/signup">Sign up</Link>
      </div>
    </AuthCard>
  );
}
