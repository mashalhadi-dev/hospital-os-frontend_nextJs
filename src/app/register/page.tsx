'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useAuthStore, type UserRole, normalizeBackendUser } from '@/store/auth-store';
import { ThemeSwitcher } from '@/components/ui/ThemeSwitcher';
import { FrostedGlassCard } from '@/components/ui/FrostedGlassCard';
import { PillButton } from '@/components/ui/PillButton';
import { PillTag } from '@/components/ui/PillTag';
import { toast } from '@/store/toast-store';
import { api } from '@/services/api';
import type { HospitalWorkspace } from '@/services/api';
import {
  ArrowRight,
  Mail,
  Key,
  User as UserIcon,
  Phone,
  ShieldCheck,
} from 'lucide-react';

export default function RegisterPage() {
  const router = useRouter();
  const { setAuth } = useAuthStore();

  const [role, setRole] = useState<UserRole>('PATIENT');
  const [hospitals, setHospitals] = useState<HospitalWorkspace[]>([]);
  const [hospitalId, setHospitalId] = useState('');
  useEffect(() => {
    api.hospitals.list().then(({ data }) => {
      setHospitals(data);
      setHospitalId(data[0]?.id ?? '');
    }).catch(() => setHospitals([]));
  }, []);
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [registrationSecret, setRegistrationSecret] = useState('');
  const [department, setDepartment] = useState('');
  const [specialization, setSpecialization] = useState('');
  const [shift, setShift] = useState('');
  const [deskNumber, setDeskNumber] = useState('');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState<'MALE' | 'FEMALE' | 'OTHER' | ''>('');
  const [address, setAddress] = useState('');
  const [medicalHistory, setMedicalHistory] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!fullName.trim() || !email.trim() || !password) {
      toast.error('Missing Required Fields', 'Please complete all required fields.');
      return;
    }

    if (password.length < 8) {
      toast.error('Invalid Password', 'Password must be at least 8 characters long.');
      return;
    }

    if (password.length > 72) {
      toast.error('Invalid Password', 'Password must not exceed 72 characters.');
      return;
    }

    setIsLoading(true);

    try {
      const payload = {
        name: fullName.trim(),
        email: email.trim().toLowerCase(),
        password,
        hospitalId,
        role,
        phone: phone.trim() ? phone.trim() : undefined,
        registrationSecret:
          role === 'PATIENT' ? undefined : registrationSecret.trim(),
        specialization: role === 'DOCTOR' ? specialization.trim() : undefined,
        department:
          role === 'DOCTOR' || role === 'NURSE'
            ? department.trim()
            : undefined,
        shift: role === 'NURSE' ? shift.trim() || undefined : undefined,
        deskNumber:
          role === 'RECEPTIONIST' ? deskNumber.trim() || undefined : undefined,
        age: role === 'PATIENT' ? Number(age) : undefined,
        gender: role === 'PATIENT' && gender ? gender : undefined,
        address: role === 'PATIENT' ? address.trim() || undefined : undefined,
        medicalHistory:
          role === 'PATIENT'
            ? medicalHistory.trim() || undefined
            : undefined,
      };

      const response = await api.auth.register(payload);
      const user = normalizeBackendUser(response.data.user);
      setAuth(user, response.data.accessToken);
      toast.success('Account Created Successfully', `Welcome to DocNode, ${user.fullName}!`);
      router.push(`/${user.role.toLowerCase()}`);
    } catch (err) {
      const axiosError = err as { response?: { data?: { message?: string | string[] } }; message?: string };
      const message = axiosError.response?.data?.message;
      const errorMessage = Array.isArray(message)
        ? message.join(', ')
        : message ||
          (err instanceof Error ? err.message : undefined) ||
          'Failed to register account with backend.';
      toast.error('Registration Error', errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-dvh flex flex-col bg-canvas transition-colors duration-300 relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-10 right-1/4 w-96 h-96 bg-[#6b62f2]/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-10 left-1/4 w-96 h-96 bg-[#00d2ff]/10 rounded-full blur-[120px] pointer-events-none" />

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
          <Link href="/login">
            <PillButton variant="ghost" size="sm">
              Sign In
            </PillButton>
          </Link>
        </div>
      </header>

      {/* Registration Card */}
      <main className="flex-1 flex items-center justify-center px-4 py-8 z-10">
        <div className="max-w-2xl w-full">
          <FrostedGlassCard variant="elevated" padding="xl" className="space-y-6">
            <div className="text-center space-y-2">
              <PillTag variant="accent" size="sm" icon={ShieldCheck} className="mx-auto">
                PROVIDER & PATIENT PORTAL REGISTRATION
              </PillTag>
              <h1 className="text-2xl font-extrabold text-text-primary tracking-tight">
                Create DocNode Account
              </h1>
              <p className="text-xs text-text-secondary">
                Select your system role to customize your specialized clinical tools and dashboards.
              </p>
            </div>

            <form onSubmit={handleRegisterSubmit} className="space-y-5">
              {/* Role Selection Tabs */}
              <div>
                <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-text-secondary">Hospital workspace</label>
                <select required value={hospitalId} onChange={(event) => setHospitalId(event.target.value)} className="w-full rounded-xl border border-border-input bg-surface-low px-4 py-2.5 text-sm text-text-primary">
                  <option value="">Select a hospital</option>
                  {hospitals.map((hospital) => <option key={hospital.id} value={hospital.id}>{hospital.name}</option>)}
                </select>
                <Link href="/register-hospital" className="mt-2 inline-block text-xs text-accent hover:underline">Register a new hospital workspace</Link>
              </div>
              <div>
                <label className="block text-xs font-semibold text-text-secondary mb-2 uppercase tracking-wider">
                  Account Clearance Role
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                  {(['DOCTOR', 'NURSE', 'RECEPTIONIST', 'PATIENT'] as UserRole[]).map((r) => (
                    <button
                      type="button"
                      key={r}
                      onClick={() => setRole(r)}
                      className={`px-3 py-2.5 rounded-xl border text-xs font-semibold transition-all ${
                        role === r
                          ? 'bg-accent text-white border-accent shadow-md shadow-accent/30'
                          : 'bg-white/5 hover:bg-white/10 text-text-secondary border-white/10'
                      }`}
                    >
                      {r}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-text-secondary mb-1.5 uppercase tracking-wider">
                    Full Legal Name
                  </label>
                  <div className="relative">
                    <UserIcon className="w-4 h-4 text-text-muted absolute left-3.5 top-3.5" />
                    <input
                      type="text"
                      required
                      placeholder="Dr. Alexander Wright"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-accent transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-text-secondary mb-1.5 uppercase tracking-wider">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-text-muted absolute left-3.5 top-3.5" />
                    <input
                      type="email"
                      required
                      placeholder="alex.wright@docnode.med"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-accent transition-colors"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-text-secondary mb-1.5 uppercase tracking-wider">
                    Password (min 8 chars)
                  </label>
                  <div className="relative">
                    <Key className="w-4 h-4 text-text-muted absolute left-3.5 top-3.5" />
                    <input
                      type="password"
                      required
                      minLength={8}
                      maxLength={72}
                      placeholder="••••••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-accent transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-text-secondary mb-1.5 uppercase tracking-wider">
                    Phone Number
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-text-muted absolute left-3.5 top-3.5" />
                    <input
                      type="tel"
                      required={role === 'PATIENT'}
                      placeholder="+1 (555) 019-8822"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-accent transition-colors"
                    />
                  </div>
                </div>
              </div>

              {role !== 'PATIENT' && (
                <div>
                  <label className="block text-xs font-semibold text-text-secondary mb-1.5 uppercase tracking-wider">
                    Staff Registration Secret
                  </label>
                  <input
                    type="password"
                    required
                    autoComplete="off"
                    value={registrationSecret}
                    onChange={(event) => setRegistrationSecret(event.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-sm text-text-primary focus:outline-none focus:border-accent transition-colors"
                  />
                </div>
              )}

              {(role === 'DOCTOR' || role === 'NURSE') && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                  <div>
                    <label className="block text-xs font-semibold text-text-secondary mb-1.5 uppercase tracking-wider">
                      Hospital Department
                    </label>
                    <input
                      type="text"
                      required
                      value={department}
                      onChange={(event) => setDepartment(event.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-sm text-text-primary focus:outline-none focus:border-accent transition-colors"
                    />
                  </div>

                  {role === 'DOCTOR' ? (
                    <div>
                      <label className="block text-xs font-semibold text-text-secondary mb-1.5 uppercase tracking-wider">
                        Specialization
                      </label>
                      <input
                        type="text"
                        required
                        value={specialization}
                        onChange={(event) => setSpecialization(event.target.value)}
                        className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-sm text-text-primary focus:outline-none focus:border-accent transition-colors"
                      />
                    </div>
                  ) : (
                    <div>
                      <label className="block text-xs font-semibold text-text-secondary mb-1.5 uppercase tracking-wider">
                        Shift (optional)
                      </label>
                      <input
                        type="text"
                        value={shift}
                        onChange={(event) => setShift(event.target.value)}
                        className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-sm text-text-primary focus:outline-none focus:border-accent transition-colors"
                      />
                    </div>
                  )}
                </div>
              )}

              {role === 'RECEPTIONIST' && (
                <div>
                  <label className="block text-xs font-semibold text-text-secondary mb-1.5 uppercase tracking-wider">
                    Desk Number (optional)
                  </label>
                  <input
                    type="text"
                    value={deskNumber}
                    onChange={(event) => setDeskNumber(event.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-sm text-text-primary focus:outline-none focus:border-accent transition-colors"
                  />
                </div>
              )}

              {role === 'PATIENT' && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-text-secondary mb-1.5 uppercase tracking-wider">
                        Age
                      </label>
                      <input
                        type="number"
                        required
                        min={0}
                        max={130}
                        value={age}
                        onChange={(event) => setAge(event.target.value)}
                        className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-sm text-text-primary focus:outline-none focus:border-accent transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-text-secondary mb-1.5 uppercase tracking-wider">
                        Gender
                      </label>
                      <select
                        required
                        value={gender}
                        onChange={(event) =>
                          setGender(event.target.value as typeof gender)
                        }
                        className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-sm text-text-primary focus:outline-none focus:border-accent transition-colors"
                      >
                        <option value="">Select gender</option>
                        <option value="FEMALE">Female</option>
                        <option value="MALE">Male</option>
                        <option value="OTHER">Other</option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-text-secondary mb-1.5 uppercase tracking-wider">
                      Address (optional)
                    </label>
                    <input
                      type="text"
                      value={address}
                      onChange={(event) => setAddress(event.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-sm text-text-primary focus:outline-none focus:border-accent transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-text-secondary mb-1.5 uppercase tracking-wider">
                      Medical History (optional)
                    </label>
                    <textarea
                      value={medicalHistory}
                      onChange={(event) => setMedicalHistory(event.target.value)}
                      rows={3}
                      className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-sm text-text-primary focus:outline-none focus:border-accent transition-colors"
                    />
                  </div>
                </div>
              )}

              <PillButton
                variant="accent"
                size="lg"
                icon={ArrowRight}
                iconPosition="right"
                fullWidth
                disabled={isLoading}
              >
                {isLoading ? 'Registering Account...' : `Register & Activate ${role} Portal`}
              </PillButton>
            </form>

            <div className="border-t border-white/10 pt-4 text-center">
              <p className="text-xs text-text-muted">
                Already registered?{' '}
                <Link href="/login" className="text-accent font-semibold hover:underline">
                  Sign in here
                </Link>
              </p>
            </div>
          </FrostedGlassCard>
        </div>
      </main>
    </div>
  );
}
