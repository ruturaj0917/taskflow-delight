import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { AuthCard } from "@/components/auth/AuthCard";
import { OAuthButtons } from "@/components/auth/OAuthButtons";
import { useAuth } from "@/contexts/AuthContext";

export const Route = createFileRoute("/signup")({
  head: () => ({ meta: [{ title: "Sign up — TaskFlow" }] }),
  component: SignUpPage,
});

function strength(p: string): "weak" | "medium" | "strong" {
  let s = 0;
  if (p.length >= 8) s++;
  if (/[A-Z]/.test(p) && /[a-z]/.test(p)) s++;
  if (/\d/.test(p)) s++;
  if (/[^A-Za-z0-9]/.test(p)) s++;
  if (s >= 4) return "strong";
  if (s >= 2) return "medium";
  return "weak";
}

function SignUpPage() {
  const { signUpWithEmail, isAuthenticated, loading } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPwd, setShowPwd] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (!loading && isAuthenticated) navigate({ to: "/dashboard" });
  }, [loading, isAuthenticated, navigate]);

  const validate = () => {
    const e: Record<string, string> = {};
    if (name.trim().length < 2) e.name = "Name must be at least 2 characters";
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) e.email = "Invalid email address";
    if (password.length < 8) e.password = "Min 8 characters";
    if (password !== confirm) e.confirm = "Passwords do not match";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const submit = async (ev: React.FormEvent) => {
    ev.preventDefault();
    if (!validate()) return;
    setSubmitting(true);
    try {
      await signUpWithEmail(email, password, name.trim());
      setDone(true);
    } catch (err) {
      setErrors({ form: err instanceof Error ? err.message : "Sign-up failed" });
    } finally {
      setSubmitting(false);
    }
  };

  if (done) {
    return (
      <AuthCard title="Create account" subtitle="Almost there">
        <div className="success-block">
          <div className="emoji">📬</div>
          <h3>Check your email!</h3>
          <p>We sent a verification link to {email}.<br />Verify your email to activate your account.</p>
          <Link to="/signin" className="btn btn-primary">Back to Sign In</Link>
        </div>
      </AuthCard>
    );
  }

  const s = password ? strength(password) : null;

  return (
    <AuthCard title="Create account" subtitle="Start organizing your life with TaskFlow">
      <form className="auth-form" onSubmit={submit}>
        <OAuthButtons />
        <div className="auth-divider">OR</div>
        <div className="field">
          <label className="field-label">Full name</label>
          <input className={`input ${errors.name ? "error" : ""}`} autoComplete="name"
            value={name} onChange={(e) => setName(e.target.value)} required />
          {errors.name && <div className="field-error">{errors.name}</div>}
        </div>
        <div className="field">
          <label className="field-label">Email</label>
          <input className={`input ${errors.email ? "error" : ""}`} type="email" autoComplete="email"
            value={email} onChange={(e) => setEmail(e.target.value)} required />
          {errors.email && <div className="field-error">{errors.email}</div>}
        </div>
        <div className="field">
          <label className="field-label">Password</label>
          <div className="input-group">
            <input className={`input ${errors.password ? "error" : ""}`}
              type={showPwd ? "text" : "password"} autoComplete="new-password"
              value={password} onChange={(e) => setPassword(e.target.value)} required />
            <button type="button" className="input-toggle" onClick={() => setShowPwd((v) => !v)}>
              {showPwd ? "🙈" : "👁"}
            </button>
          </div>
          {s && <div className={`strength ${s}`}><span /></div>}
          {errors.password && <div className="field-error">{errors.password}</div>}
        </div>
        <div className="field">
          <label className="field-label">Confirm password</label>
          <input className={`input ${errors.confirm ? "error" : ""}`}
            type={showPwd ? "text" : "password"} autoComplete="new-password"
            value={confirm} onChange={(e) => setConfirm(e.target.value)} required />
          {errors.confirm && <div className="field-error">{errors.confirm}</div>}
        </div>
        {errors.form && <div className="field-error">{errors.form}</div>}
        <button type="submit" className="btn btn-primary btn-block" disabled={submitting}>
          {submitting ? <><div className="spinner sm" /> Creating...</> : "Sign Up"}
        </button>
      </form>
      <div className="auth-bottom">
        Already have an account? <Link to="/signin">Sign in</Link>
      </div>
    </AuthCard>
  );
}
