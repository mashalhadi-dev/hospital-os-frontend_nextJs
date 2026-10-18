/**
 * ThemeSwitcher
 *
 * Animated toggle button for Dark ↔ Light mode.
 * Renders a smooth sun/moon icon transition with a pill-shaped track.
 */
"use client";

import { useThemeStore } from "@/store/theme-store";

export function ThemeSwitcher() {
  const { mode, toggle, hydrated } = useThemeStore();

  // Don't render until hydrated to prevent mismatch
  if (!hydrated) {
    return (
      <div
        className="h-[38px] w-[76px] rounded-pill bg-glass-subtle animate-pulse"
        aria-hidden="true"
      />
    );
  }

  const isDark = mode === "dark";

  return (
    <button
      id="theme-switcher"
      type="button"
      role="switch"
      aria-checked={isDark}
      aria-label={`Switch to ${isDark ? "light" : "dark"} mode`}
      onClick={toggle}
      className="
        group relative flex h-[38px] w-[76px] items-center
        rounded-pill border border-border
        bg-glass-subtle p-[3px]
        transition-all duration-300 ease-in-out
        hover:border-border-strong hover:bg-glass-hover
        focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent
        cursor-pointer
      "
    >
      {/* Sliding knob */}
      <span
        className="
          flex h-[30px] w-[30px] items-center justify-center
          rounded-pill bg-accent shadow-glow
          transition-transform duration-300 ease-in-out
        "
        style={{
          transform: isDark ? "translateX(0px)" : "translateX(38px)",
        }}
      >
        {/* Moon icon (dark mode) */}
        <svg
          className="absolute transition-all duration-300 ease-in-out"
          style={{
            opacity: isDark ? 1 : 0,
            transform: isDark ? "rotate(0deg) scale(1)" : "rotate(-90deg) scale(0)",
          }}
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="white"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
        </svg>

        {/* Sun icon (light mode) */}
        <svg
          className="absolute transition-all duration-300 ease-in-out"
          style={{
            opacity: isDark ? 0 : 1,
            transform: isDark ? "rotate(90deg) scale(0)" : "rotate(0deg) scale(1)",
          }}
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="white"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="12" cy="12" r="5" />
          <line x1="12" y1="1" x2="12" y2="3" />
          <line x1="12" y1="21" x2="12" y2="23" />
          <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
          <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
          <line x1="1" y1="12" x2="3" y2="12" />
          <line x1="21" y1="12" x2="23" y2="12" />
          <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
          <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
        </svg>
      </span>

      {/* Background label hints */}
      <span
        className="absolute right-[10px] text-[10px] font-semibold uppercase tracking-wider transition-opacity duration-300"
        style={{
          opacity: isDark ? 0.4 : 0,
          color: "var(--hn-text-secondary)",
        }}
      >
        ☀
      </span>
      <span
        className="absolute left-[10px] text-[10px] font-semibold uppercase tracking-wider transition-opacity duration-300"
        style={{
          opacity: isDark ? 0 : 0.4,
          color: "var(--hn-text-secondary)",
        }}
      >
        ☾
      </span>
    </button>
  );
}
