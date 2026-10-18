import { create } from 'zustand';

export type ToastType = 'success' | 'error' | 'info' | 'warning' | 'ai';

export interface ToastMessage {
  id: string;
  title: string;
  description?: string;
  type: ToastType;
  duration?: number;
}

// Internal timer registry — keyed by toast ID.
// Held in module scope (not Zustand state) to avoid unnecessary re-renders.
const _timers = new Map<string, ReturnType<typeof setTimeout>>();

interface ToastStore {
  toasts: ToastMessage[];
  addToast: (toast: Omit<ToastMessage, 'id'>) => string;
  removeToast: (id: string) => void;
  clearAllTimers: () => void;
}

export const useToastStore = create<ToastStore>((set) => ({
  toasts: [],

  addToast: (toast) => {
    const id = Math.random().toString(36).substring(2, 9);
    const newToast = { ...toast, id };
    set((state) => ({ toasts: [...state.toasts, newToast] }));

    // Errors linger longer so users can read them; AI/info auto-dismiss sooner.
    const duration =
      toast.duration ??
      (toast.type === 'error' || toast.type === 'warning' ? 8000 : 4000);
    const timer = setTimeout(() => {
      _timers.delete(id);
      set((state) => ({
        toasts: state.toasts.filter((t) => t.id !== id),
      }));
    }, duration);

    _timers.set(id, timer);
    // Return the toast ID so callers can schedule early removal if needed
    return id;
  },

  removeToast: (id) => {
    // Clear the pending auto-dismiss timer to prevent memory leak
    const timer = _timers.get(id);
    if (timer !== undefined) {
      clearTimeout(timer);
      _timers.delete(id);
    }
    set((state) => ({
      toasts: state.toasts.filter((t) => t.id !== id),
    }));
  },

  clearAllTimers: () => {
    _timers.forEach((timer) => clearTimeout(timer));
    _timers.clear();
    set({ toasts: [] });
  },
}));

export const toast = {
  success: (title: string, description?: string) =>
    useToastStore.getState().addToast({ title, description, type: 'success' }),
  error: (title: string, description?: string) =>
    useToastStore.getState().addToast({ title, description, type: 'error' }),
  info: (title: string, description?: string) =>
    useToastStore.getState().addToast({ title, description, type: 'info' }),
  warning: (title: string, description?: string) =>
    useToastStore.getState().addToast({ title, description, type: 'warning' }),
  ai: (title: string, description?: string) =>
    useToastStore.getState().addToast({ title, description, type: 'ai' }),
};
