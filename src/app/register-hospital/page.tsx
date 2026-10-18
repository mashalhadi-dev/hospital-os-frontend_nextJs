'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { api } from '@/services/api';
import { useAuthStore, normalizeBackendUser } from '@/store/auth-store';
import { FrostedGlassCard } from '@/components/ui/FrostedGlassCard';
import { PillButton } from '@/components/ui/PillButton';
import { toast } from '@/store/toast-store';

export default function RegisterHospitalPage() {
  const router = useRouter();
  const { setAuth } = useAuthStore();
  const [busy, setBusy] = useState(false);
  const [form, setForm] = useState({ name: '', slug: '', address: '', phone: '', ownerName: '', email: '', password: '' });
  const update = (key: keyof typeof form, value: string) => setForm((current) => ({ ...current, [key]: value }));
  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    try {
      const { data } = await api.hospitals.register(form);
      setAuth(normalizeBackendUser(data.user), data.accessToken);
      toast.success('Workspace ready', `${data.hospital.name} is set up.`);
      router.push('/admin');
    } catch (error) {
      const message = (error as { response?: { data?: { message?: string } } }).response?.data?.message;
      toast.error('Could not register hospital', message ?? 'Check the workspace details and try again.');
    } finally { setBusy(false); }
  }
  return <main className="min-h-dvh bg-canvas px-4 py-12 text-text-primary">
    <div className="mx-auto max-w-2xl">
      <Link href="/register" className="text-sm text-accent hover:underline">← Back to account registration</Link>
      <FrostedGlassCard variant="elevated" padding="xl" className="mt-6">
        <h1 className="text-2xl font-bold">Create a hospital workspace</h1>
        <p className="mt-2 text-sm text-text-secondary">Set up your hospital and owner account. You will be signed in as its administrator.</p>
        <form onSubmit={submit} className="mt-6 grid gap-4 sm:grid-cols-2">
          {([
            ['name', 'Hospital name'], ['slug', 'Workspace slug'], ['address', 'Address'], ['phone', 'Hospital phone'],
            ['ownerName', 'Owner full name'], ['email', 'Owner email'], ['password', 'Password'],
          ] as const).map(([key, label]) => <label key={key} className="grid gap-1.5 text-xs font-semibold text-text-secondary">
            {label}<input required={!['address', 'phone'].includes(key)} type={key === 'email' ? 'email' : key === 'password' ? 'password' : 'text'} minLength={key === 'password' ? 8 : undefined} value={form[key]} onChange={(event) => update(key, event.target.value)} className="rounded-xl border border-border-input bg-surface-low px-3 py-2.5 text-sm text-text-primary" />
          </label>)}
          <div className="sm:col-span-2"><PillButton variant="accent" fullWidth disabled={busy}>{busy ? 'Creating workspace…' : 'Create hospital workspace'}</PillButton></div>
        </form>
      </FrostedGlassCard>
    </div>
  </main>;
}
