import { createFileRoute, Navigate } from "@tanstack/react-router";
import { useAuth } from "@/contexts/AuthContext";
import { Loader } from "@/components/ui/Loader";

export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  const { loading, isAuthenticated } = useAuth();
  if (loading) return <Loader />;
  return <Navigate to={isAuthenticated ? "/dashboard" : "/signin"} />;
}
