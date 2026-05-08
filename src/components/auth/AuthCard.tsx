import { Link } from "@tanstack/react-router";
import type { ReactNode } from "react";

export function AuthCard({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle: string;
  children: ReactNode;
}) {
  return (
    <div className="auth-page">
      <div className="auth-card">
        <Link to="/" className="auth-brand" style={{ color: "var(--text)", textDecoration: "none" }}>
          <span className="logo-dot" /> TaskFlow
        </Link>
        <h1 className="auth-title">{title}</h1>
        <p className="auth-subtitle">{subtitle}</p>
        {children}
      </div>
    </div>
  );
}
