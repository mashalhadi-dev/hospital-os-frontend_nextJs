import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { AppProviders } from "@/components/providers/AppProviders";
import { ThemeScript } from "@/components/providers/ThemeProvider";
import "./globals.css";

/* ── Fonts ── */
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

/* ── Metadata ── */
export const metadata: Metadata = {
  title: "DocNode — AI Medical Workspace",
  description:
    "Continuous synthetic anamnesis, autonomous multivariable diagnostics, and real-time triage summaries orchestrated at hospital scale.",
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: "#0a0a0a" },
    { media: "(prefers-color-scheme: light)", color: "#f8f9fa" },
  ],
};

/* ── Root Layout ── */
export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} dark`}
      suppressHydrationWarning
    >
      <head>
        {/* Prevent FOUC – sets .dark/.light before React hydrates */}
        <ThemeScript />
        <meta name="theme-color" content="#0a0a0a" />
      </head>
      <body className="min-h-dvh flex flex-col antialiased">
        <AppProviders>
          {children}
        </AppProviders>
      </body>
    </html>
  );
}
