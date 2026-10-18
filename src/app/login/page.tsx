'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useAuthStore, normalizeBackendUser } from '@/store/auth-store';
import { ThemeSwitcher } from '@/components/ui/ThemeSwitcher';
import { FrostedGlassCard } from '@/components/ui/FrostedGlassCard';
import { PillButton } from '@/components/ui/PillButton';
import { toast } from '@/store/toast-store';
import { api } from '@/services/api';
import {
  UserPlus,
  ArrowRight,
  Mail,
  Key,
} from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const { setAuth } = useAuthStore();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Handle standard credential form login against backend API
  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password) {
      toast.error('Missing Credentials', 'Please enter both your work email and password.');
      return;
    }

    if (password.length < 8) {
      toast.error('Invalid Password', 'Password must be at least 8 characters long.');
      return;
    }

    setIsLoading(true);
    try {
      const res = await api.auth.login({
        email: email.trim().toLowerCase(),
        password: password,
      });

      if (res.data && res.data.accessToken) {
        const userObj = normalizeBackendUser(res.data.user);

        setAuth(userObj, res.data.accessToken);
        toast.success('Authentication Successful', `Welcome back, ${userObj.fullName}!`);
        router.push(`/${userObj.role.toLowerCase()}`);
        return;
      }
    } catch (err) {
      const axiosError = err as { response?: { data?: { message?: string | string[] } }; message?: string };
      const message = axiosError.response?.data?.message;
      const errorMessage = Array.isArray(message)
        ? message.join(', ')
        : message || 'Invalid email or password. Please verify your credentials.';
      toast.error('Authentication Failed', errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-dvh flex flex-col bg-canvas transition-colors duration-300 relative overflow-hidden">
      {/* Background Decorative Glow Elements */}
      <div className="absolute top-10 left-1/4 w-96 h-96 bg-[#6b62f2]/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-10 right-1/4 w-96 h-96 bg-[#00d2ff]/10 rounded-full blur-[120px] pointer-events-none" />

      {/* Header Bar */}
      <header className="flex items-center justify-between px-6 lg:px-12 py-5 z-10">
        <Link href="/" className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl shadow-[0_0_20px_rgba(107,98,242,0.5)] overflow-hidden">
            <Image src="/logo.png" alt="DocNode Logo" width={40} height={40} className="object-cover w-full h-full" />
          </div>
          <div>
            <span className="text-xl font-bold tracking-tight text-text-primary block leading-none">
              DocNode
            </span>
            <span className="text-[10px] font-mono text-text-muted tracking-wider">
              AI CLINICAL OS
            </span>
          </div>
        </Link>

        <div className="flex items-center gap-4">
          <ThemeSwitcher />
          <Link href="/register">
            <PillButton variant="secondary" size="sm" icon={UserPlus}>
              Register Account
            </PillButton>
          </Link>
        </div>
      </header>

      {/* Main Login Workspace */}
      <main className="flex-1 flex items-center justify-center px-4 py-8 z-10">
        <div className="max-w-xl w-full space-y-6">
          {/* Form Card */}
          <FrostedGlassCard variant="elevated" padding="xl" className="space-y-6">
            <div className="text-center space-y-2">
              <h1 className="text-2xl font-extrabold text-text-primary tracking-tight">
                Sign in to DocNode
              </h1>
              <p className="text-xs text-text-secondary">
                Enter your registered hospital credentials to authenticate against NestJS backend.
              </p>
            </div>

            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-text-secondary mb-1.5 uppercase tracking-wider">
                  Work Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-text-muted absolute left-3.5 top-3.5" />
                  <input
                    type="email"
                    required
                    placeholder="doctor.name@docnode.med"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-accent transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-text-secondary mb-1.5 uppercase tracking-wider">
                  Password
                </label>
                <div className="relative">
                  <Key className="w-4 h-4 text-text-muted absolute left-3.5 top-3.5" />
                  <input
                    type="password"
                    required
                    placeholder="••••••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-accent transition-colors"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between text-xs pt-1">
                <label className="flex items-center gap-2 cursor-pointer text-text-secondary">
                  <input type="checkbox" defaultChecked className="rounded accent-accent" />
                  <span>Remember session on this station</span>
                </label>
                <span className="text-accent hover:underline cursor-pointer">Forgot password?</span>
              </div>

              <PillButton
                variant="accent"
                size="lg"
                icon={ArrowRight}
                iconPosition="right"
                fullWidth
                disabled={isLoading}
              >
                {isLoading ? 'Verifying Identity...' : 'Authenticate Workspace'}
              </PillButton>
            </form>

            <div className="border-t border-white/10 pt-4 text-center">
              <p className="text-xs text-text-muted">
                Don&apos;t have a registered provider or patient account?{' '}
                <Link href="/register" className="text-accent font-semibold hover:underline">
                  Create Account
                </Link>
              </p>
            </div>
          </FrostedGlassCard>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-4 text-center text-[11px] text-text-muted border-t border-white/5">
        DocNode Hospital OS — HIPAA & GDPR Compliant Medical Neural Network v4.8
      </footer>
    </div>
  );
}
