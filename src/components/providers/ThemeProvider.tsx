/**
 * ThemeProvider
 *
 * Client component that hydrates the Zustand theme store on mount.
 * Place this near the top of the component tree (inside layout.tsx)
 * so the correct class is applied before first paint.
 *
 * Also injects a blocking <script> to prevent FOUC (Flash of Unstyled Content)
 * by reading localStorage synchronously before React hydrates.
 */
"use client";

import { useEffect } from "react";
import { useThemeStore } from "@/store/theme-store";

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const hydrate = useThemeStore((s) => s.hydrate);

  useEffect(() => {
    hydrate();
  }, [hydrate]);

  return <>{children}</>;
}

/**
 * Inline script to prevent theme flash.
 * This runs synchronously before React hydration, reading localStorage
 * and applying the correct class to <html> immediately.
 *
 * Render this inside <head> or at the top of <body> in layout.tsx.
 */
export function ThemeScript() {
  const script = `
(function() {
  try {
    var mode = localStorage.getItem('hn-theme');
    if (mode !== 'dark' && mode !== 'light') {
      mode = window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
    }
    document.documentElement.classList.remove('dark', 'light');
    document.documentElement.classList.add(mode);
    var meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute('content', mode === 'dark' ? '#0a0a0a' : '#f8f9fa');
  } catch(e) {
    document.documentElement.classList.add('dark');
  }
})();
  `.trim();

  return (
    <script
      dangerouslySetInnerHTML={{ __html: script }}
      suppressHydrationWarning
    />
  );
}
