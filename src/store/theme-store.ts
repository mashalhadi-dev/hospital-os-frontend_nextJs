/**
 * DocNode Theme Store
 *
 * Zustand store managing Dark ↔ Light mode.
 * - Persists preference to localStorage under "hn-theme"
 * - Applies ".dark" or ".light" class on <html>
 * - Triggers a brief transition class for smooth cross-fade
 * - Exposes `mode`, `toggle()`, and `setMode()` for consumers
 */

import { create } from "zustand";

export type ThemeMode = "dark" | "light";

interface ThemeState {
  /** Current active theme */
  mode: ThemeMode;
  /** Whether the store has been hydrated from storage */
  hydrated: boolean;
  /** Toggle between dark and light */
  toggle: () => void;
  /** Set a specific mode */
  setMode: (mode: ThemeMode) => void;
  /** Hydrate from localStorage (call once on mount) */
  hydrate: () => void;
}

const STORAGE_KEY = "hn-theme";
const TRANSITION_CLASS = "theme-transitioning";
const TRANSITION_DURATION = 450; // ms – matches CSS transition

/**
 * Apply the theme class to the document root and persist to storage.
 */
function applyTheme(mode: ThemeMode, animate = true) {
  if (typeof document === "undefined") return;

  const root = document.documentElement;

  // Add a transition class so every element smoothly cross-fades
  if (animate) {
    root.classList.add(TRANSITION_CLASS);
    setTimeout(() => root.classList.remove(TRANSITION_CLASS), TRANSITION_DURATION);
  }

  // Swap mode classes
  root.classList.remove("dark", "light");
  root.classList.add(mode);

  // Update meta theme-color for mobile browsers
  const meta = document.querySelector('meta[name="theme-color"]');
  if (meta) {
    meta.setAttribute("content", mode === "dark" ? "#0a0a0a" : "#f8f9fa");
  }

  // Persist
  try {
    localStorage.setItem(STORAGE_KEY, mode);
  } catch {
    // localStorage may be unavailable (SSR, incognito quota)
  }
}

/**
 * Read the saved theme or fall back to system preference, defaulting to dark.
 */
function getInitialMode(): ThemeMode {
  if (typeof window === "undefined") return "dark";

  try {
    const saved = localStorage.getItem(STORAGE_KEY) as ThemeMode | null;
    if (saved === "dark" || saved === "light") return saved;
  } catch {
    // ignore
  }

  // Respect system preference, default to dark (the design system default)
  if (typeof window.matchMedia === "function") {
    return window.matchMedia("(prefers-color-scheme: light)").matches
      ? "light"
      : "dark";
  }

  return "dark";
}

export const useThemeStore = create<ThemeState>((set, get) => ({
  mode: "dark", // SSR-safe default; hydrate() corrects this on client
  hydrated: false,

  toggle: () => {
    const next = get().mode === "dark" ? "light" : "dark";
    applyTheme(next);
    set({ mode: next });
  },

  setMode: (mode: ThemeMode) => {
    applyTheme(mode);
    set({ mode });
  },

  hydrate: () => {
    if (get().hydrated) return;
    const mode = getInitialMode();
    applyTheme(mode, false); // no animation on first paint
    set({ mode, hydrated: true });
  },
}));
