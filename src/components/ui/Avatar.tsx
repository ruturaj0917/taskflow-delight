export function Avatar({ name, email }: { name?: string | null; email?: string | null }) {
  const source = (name || email || "?").trim();
  const initials = source
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? "")
    .join("") || "?";
  return <div className="avatar">{initials}</div>;
}
