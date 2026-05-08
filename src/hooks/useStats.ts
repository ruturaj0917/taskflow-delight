import { useMemo } from "react";
import type { Category, Stats, Task } from "@/types/task";

const CATEGORIES: Category[] = ["Work", "Personal", "Health", "Finance", "Learning"];

function isOverdue(t: Task, today: string) {
  return !t.completed && !!t.due && t.due < today;
}

export function useStats(tasks: Task[]): Stats {
  return useMemo(() => {
    const today = new Date().toISOString().slice(0, 10);
    const total = tasks.length;
    const completed = tasks.filter((t) => t.completed).length;
    const pending = total - completed;
    const overdue = tasks.filter((t) => isOverdue(t, today)).length;
    const highPriority = tasks.filter((t) => !t.completed && t.priority === "High").length;
    const byCategory = CATEGORIES.reduce((acc, c) => {
      acc[c] = tasks.filter((t) => !t.completed && t.category === c).length;
      return acc;
    }, {} as Record<Category, number>);
    return {
      total,
      completed,
      pending,
      overdue,
      highPriority,
      completionRate: total === 0 ? 0 : Math.round((completed / total) * 100),
      byCategory,
    };
  }, [tasks]);
}
