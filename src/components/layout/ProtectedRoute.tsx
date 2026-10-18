'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore, UserRole } from '@/store/auth-store';
import { Loader2, Lock } from 'lucide-react';
import { FrostedGlassCard } from '@/components/ui/FrostedGlassCard';
import { PillButton } from '@/components/ui/PillButton';

export interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: UserRole[];
}

// Role-based fallback URLs for different user roles
const ROLE_FALLBACK_URLS: Record<UserRole, string> = {
  ADMIN: '/admin',
  DOCTOR: '/doctor',
  NURSE: '/nurse',
  RECEPTIONIST: '/receptionist',
  PATIENT: '/patient',
};

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  allowedRoles,
}) => {
  const router = useRouter();
  const { user, token, isAuthenticated, hydrated, initialize } = useAuthStore();

  useEffect(() => {
    if (!hydrated) {
      initialize();
    }
  }, [hydrated, initialize]);

  useEffect(() => {
    if (hydrated) {
      if (!isAuthenticated || !token || !user) {
        router.replace('/login');
      } else if (allowedRoles && !allowedRoles.includes(user.role)) {
        // Redirect to user's role-specific dashboard if role mismatch
        const roleSpecificUrl = ROLE_FALLBACK_URLS[user.role] || '/login';
        router.replace(roleSpecificUrl);
      }
    }
  }, [hydrated, isAuthenticated, token, user, router, allowedRoles]);

  // Loading state while verifying authentication token in client storage
  if (!hydrated) {
    return (
      <div className="min-h-dvh flex items-center justify-center bg-canvas p-6">
        <FrostedGlassCard variant="elevated" padding="lg" className="max-w-md w-full text-center space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-[#6b62f2]/15 text-[#8a84f8] mx-auto flex items-center justify-center border border-[#6b62f2]/20">
            <Loader2 className="w-6 h-6 animate-spin" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-text-primary">Authenticating Session</h3>
            <p className="text-xs text-text-secondary mt-1">
              Verifying DocNode JWT Security Credentials & Role Permissions...
            </p>
          </div>
        </FrostedGlassCard>
      </div>
    );
  }

  // Strictly block unauthenticated users from seeing portal contents
  if (!isAuthenticated || !token || !user) {
    return null;
  }

  // Role validation: ensure user's role is allowed
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return (
      <div className="min-h-dvh flex items-center justify-center bg-canvas p-6">
        <FrostedGlassCard variant="glowing" padding="xl" className="max-w-lg w-full text-center space-y-6">
          <div className="w-16 h-16 rounded-full bg-rose-500/15 text-rose-400 mx-auto flex items-center justify-center border border-rose-500/30">
            <Lock className="w-8 h-8" />
          </div>
          <div className="space-y-2">
            <h3 className="text-2xl font-extrabold text-text-primary">Access Restricted</h3>
            <p className="text-sm text-text-secondary leading-relaxed">
              Your account role <span className="font-mono text-accent font-bold">[{user.role}]</span> does not possess clearance for this clinical workspace area. Your role-specific access is available at your dashboard.
            </p>
          </div>
          <div className="flex justify-center gap-3 pt-2">
            <PillButton variant="primary" onClick={() => router.push(ROLE_FALLBACK_URLS[user.role])}>
              Go to Your Dashboard
            </PillButton>
          </div>
        </FrostedGlassCard>
      </div>
    );
  }

  return <>{children}</>;
};
