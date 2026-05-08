import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import type { Task, TaskInput } from "@/types/task";

export function useTasks() {
  const { user } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchTasks = useCallback(async () => {
    if (!user) return;
    const { data, error } = await supabase
      .from("tasks")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) {
      console.error("[tasks] fetch failed", error);
      return;
    }
    setTasks((data ?? []) as Task[]);
    setLoading(false);
  }, [user]);

  useEffect(() => {
    if (!user) return;
    fetchTasks();
    const channel = supabase
      .channel(`tasks:${user.id}`)
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "tasks", filter: `user_id=eq.${user.id}` },
        () => fetchTasks(),
      )
      .subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
  }, [user, fetchTasks]);

  const createTask = async (input: TaskInput) => {
    if (!user) throw new Error("Not signed in");
    const { error } = await supabase.from("tasks").insert({
      user_id: user.id,
      title: input.title,
      description: input.description ?? null,
      category: input.category,
      priority: input.priority,
      due: input.due ?? null,
    });
    if (error) throw error;
  };

  const updateTask = async (id: string, patch: Partial<TaskInput>) => {
    const { error } = await supabase.from("tasks").update(patch).eq("id", id);
    if (error) throw error;
  };

  const toggleTask = async (id: string, completed: boolean) => {
    const { error } = await supabase.from("tasks").update({ completed }).eq("id", id);
    if (error) throw error;
  };

  const deleteTask = async (id: string) => {
    const { error } = await supabase.from("tasks").delete().eq("id", id);
    if (error) throw error;
  };

  return { tasks, loading, createTask, updateTask, toggleTask, deleteTask, refresh: fetchTasks };
}
