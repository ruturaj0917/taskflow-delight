import { useSyncExternalStore } from "react";

export type ToastKind = "success" | "error" | "info";
export interface ToastItem { id: number; message: string; kind: ToastKind; }

let toasts: ToastItem[] = [];
const listeners = new Set<() => void>();
let nextId = 1;

function emit() { listeners.forEach((l) => l()); }

export function toast(message: string, kind: ToastKind = "success", durationMs = 3000) {
  const id = nextId++;
  toasts = [...toasts, { id, message, kind }];
  emit();
  setTimeout(() => {
    toasts = toasts.filter((t) => t.id !== id);
    emit();
  }, durationMs);
}

function subscribe(cb: () => void) {
  listeners.add(cb);
  return () => listeners.delete(cb);
}

const getSnapshot = () => toasts;

export function useToasts() {
  return useSyncExternalStore(subscribe, getSnapshot, getSnapshot);
}
