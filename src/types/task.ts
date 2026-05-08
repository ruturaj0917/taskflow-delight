export type Category = "Work" | "Personal" | "Health" | "Finance" | "Learning";
export type Priority = "High" | "Medium" | "Low";

export interface Task {
  id: string;
  user_id: string;
  title: string;
  description: string | null;
  category: Category;
  priority: Priority;
  due: string | null;
  completed: boolean;
  created_at: string;
  updated_at: string;
}

export interface TaskInput {
  title: string;
  description?: string;
  category: Category;
  priority: Priority;
  due?: string | null;
}

export interface Stats {
  total: number;
  completed: number;
  pending: number;
  overdue: number;
  highPriority: number;
  completionRate: number;
  byCategory: Record<Category, number>;
}
