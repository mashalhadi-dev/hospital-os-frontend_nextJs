'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { ProtectedRoute } from '@/components/layout/ProtectedRoute';
import { useAuthStore, UserRole } from '@/store/auth-store';
import { ThemeSwitcher } from '@/components/ui/ThemeSwitcher';
import { PillButton } from '@/components/ui/PillButton';
import { PillTag } from '@/components/ui/PillTag';
import { toast } from '@/store/toast-store';
import {
  Sparkles,
  LogOut,
  Search,
  ShieldCheck,
} from 'lucide-react';

export interface DashboardLayoutProps {
  children: React.ReactNode;
  allowedRoles?: UserRole[];
  activeRoleTitle?: string;
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({
  children,
  allowedRoles,
  activeRoleTitle,
}) => {
  const router = useRouter();
  const { user, logout } = useAuthStore();
  const [searchQuery, setSearchQuery] = useState('');

  const userRoleDisplay = activeRoleTitle || user?.role || 'CLINICIAN';

  return (
    <ProtectedRoute allowedRoles={allowedRoles}>
      <div className="flex flex-1 flex-col min-h-dvh bg-canvas transition-colors duration-300">
        {/* ═══════════════════════════════════════════════════════
            SLEEK COMPACT CAPSULE NAVBAR
            ═══════════════════════════════════════════════════════ */}
        <header className="sticky top-4 z-40 px-4 sm:px-6 lg:px-8 max-w-[1600px] w-full mx-auto">
          <nav className="glass flex items-center justify-between px-5 py-2.5 rounded-full border border-white/15 [.light_&]:border-black/10 shadow-[0_8px_32px_rgba(0,0,0,0.25)] [.light_&]:shadow-[0_8px_30px_rgba(0,0,0,0.06)] backdrop-blur-xl transition-all duration-300">
            {/* Left: Brand Logo & Verified Session Tag */}
            <div className="flex items-center gap-3">
              <Link href="/" className="flex items-center gap-2.5">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl shadow-[0_0_16px_rgba(107,98,242,0.5)] overflow-hidden">
                  <Image src="/logo.png" alt="DocNode Logo" width={36} height={36} className="object-cover w-full h-full" />
                </div>
                <div className="hidden sm:block">
                  <span className="text-lg font-bold tracking-tight text-text-primary block leading-none">
                    DocNode
                  </span>
                  <span className="text-[9px] font-mono text-text-muted tracking-wider uppercase">
                    AI CLINICAL OS
                  </span>
                </div>
              </Link>

              <PillTag variant="accent" size="sm" icon={Sparkles} className="hidden md:inline-flex">
                AI CORE V4.8
              </PillTag>

              {/* Verified RBAC Badge (Non-interactive) */}
              <div className="hidden lg:flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/5 [.light_&]:bg-black/5 border border-white/10 [.light_&]:border-black/10">
                <ShieldCheck className="w-3.5 h-3.5 text-accent" />
                <span className="text-[11px] font-mono font-semibold uppercase text-text-primary tracking-wider">
                  {user?.role || 'AUTHORIZED'}
                </span>
              </div>
            </div>

            {/* Center Search Bar */}
            <div className="hidden md:flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 [.light_&]:bg-black/5 border border-white/10 [.light_&]:border-black/10 w-56 lg:w-72 focus-within:border-accent transition-all">
              <Search className="w-3.5 h-3.5 text-text-muted" />
              <input
                type="text"
                placeholder="Search MRN, Patient Name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-transparent border-none text-xs text-text-primary placeholder:text-text-muted focus:outline-none w-full"
              />
            </div>

            {/* Right Controls & User Session Info */}
            <div className="flex items-center gap-2.5">
              <ThemeSwitcher />

              {/* User Profile Info & Logout */}
              <div className="flex items-center gap-2 pl-2 border-l border-white/10 [.light_&]:border-black/10">
                <div className="h-8 w-8 rounded-full bg-accent/20 border border-accent/40 flex items-center justify-center text-accent font-bold text-xs uppercase">
                  {user?.fullName ? user.fullName.split(' ').map((n) => n[0]).join('') : 'HN'}
                </div>

                <div className="hidden xl:block text-left">
                  <span className="text-xs font-bold text-text-primary block leading-none">
                    {user?.fullName || 'DocNode User'}
                  </span>
                  <span className="text-[9px] font-mono text-accent uppercase">
                    {userRoleDisplay}
                  </span>
                </div>

                <PillButton
                  variant="ghost"
                  size="sm"
                  icon={LogOut}
                  onClick={() => {
                    logout();
                    toast.info('Logged Out', 'Your clinical session has been terminated safely.');
                    router.push('/login');
                  }}
                >
                  <span className="hidden sm:inline">Logout</span>
                </PillButton>
              </div>
            </div>
          </nav>
        </header>

        {/* ═══════════════════════════════════════════════════════
            MAIN CONTENT WORKSPACE
            ═══════════════════════════════════════════════════════ */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-[1600px] w-full mx-auto space-y-6 pt-6 animate-dashboard-enter">
          {children}
        </main>

      </div>
    </ProtectedRoute>
  );
};
