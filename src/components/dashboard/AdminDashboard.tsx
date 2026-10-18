'use client';

import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { FrostedGlassCard } from '@/components/ui/FrostedGlassCard';
import { PillTag } from '@/components/ui/PillTag';
import { Skeleton, ApiErrorBanner } from '@/components/ui/Skeleton';
import { api, type BackendUser } from '@/services/api';
import { useAuthStore } from '@/store/auth-store';
import { usePatients, useAppointments, useBilling } from '@/hooks/useApi';
import {
  Users,
  Building2,
  Search,
  DollarSign,
  RefreshCw,
} from 'lucide-react';

export function AdminDashboard() {
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('ALL');
  const [patientFilter, setPatientFilter] = useState('ALL');
  const [userSearchQuery, setUserSearchQuery] = useState('');
  const currentUser = useAuthStore((state) => state.user);
  const [staffDraft, setStaffDraft] = useState({ role: 'DOCTOR' as 'DOCTOR' | 'NURSE' | 'RECEPTIONIST', name: '', email: '', password: '', department: '', specialization: '', deskNumber: '' });
  const [staffSaving, setStaffSaving] = useState(false);

  // Live data from API
  const {
    data: patients,
    isLoading: patientsLoading,
    isError: patientsError,
    refetch: refetchPatients,
  } = usePatients();

  const {
    data: appointments,
    isLoading: appointmentsLoading,
  } = useAppointments();

  const {
    data: billing,
    isLoading: billingLoading,
  } = useBilling();
  const {
    data: users,
    isLoading: usersLoading,
    isError: usersError,
    refetch: refetchUsers,
  } = useQuery<BackendUser[]>({
    queryKey: ['admin', 'users'],
    queryFn: async () => (await api.admin.getUsers()).data,
  });

  // Computed stats
  const totalPatients = patients?.length ?? 0;
  const today = new Date().toDateString();
  const totalRevenue = billing?.filter((invoice) => invoice.status === 'PAID' && new Date(invoice.createdAt).toDateString() === today).reduce((sum, inv) => sum + (inv.paidAmount ?? 0), 0) ?? 0;
  const activeDoctorQueues = new Set((appointments ?? []).filter((appointment) => ['PENDING', 'IN_QUEUE', 'CONFIRMED'].includes(appointment.status)).map((appointment) => appointment.doctorId)).size;
  const completedToday = (appointments ?? []).filter((appointment) => appointment.status === 'COMPLETED' && new Date(appointment.appointmentDate).toDateString() === today).length;
  const pendingInvoices = billing?.filter((inv) => inv.status === 'PENDING').length ?? 0;

  // Patient-based user directory (real data)
  const filteredPatients = patients?.filter((p) => {
    const matchesRole = patientFilter === 'ALL' || patientFilter === 'PATIENT';
    const matchesSearch =
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.phone.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesRole && matchesSearch;
  }) ?? [];

  const filteredUsers = users?.filter((user) => {
    const matchesRole = roleFilter === 'ALL' || user.role === roleFilter;
    const query = userSearchQuery.toLowerCase();
    return (
      matchesRole &&
      (user.name.toLowerCase().includes(query) ||
        user.email.toLowerCase().includes(query))
    );
  }) ?? [];

  const addStaff = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!currentUser?.hospitalId) return;
    setStaffSaving(true);
    try {
      await api.auth.createStaff({
        name: staffDraft.name,
        email: staffDraft.email,
        password: staffDraft.password,
        hospitalId: currentUser.hospitalId,
        role: staffDraft.role,
        department: staffDraft.role !== 'RECEPTIONIST' ? staffDraft.department : undefined,
        specialization: staffDraft.role === 'DOCTOR' ? staffDraft.specialization : undefined,
        deskNumber: staffDraft.role === 'RECEPTIONIST' ? staffDraft.deskNumber : undefined,
      });
      setStaffDraft({ role: 'DOCTOR', name: '', email: '', password: '', department: '', specialization: '', deskNumber: '' });
      await refetchUsers();
    } catch {
      window.alert('Could not add staff. Check the email and staff details.');
    } finally { setStaffSaving(false); }
  };

  const editStaff = async (user: BackendUser) => {
    const profileId = user.role === 'DOCTOR' ? user.doctorProfile?.id : user.role === 'NURSE' ? user.nurseProfile?.id : user.role === 'RECEPTIONIST' ? user.receptionistProfile?.id : undefined;
    if (!profileId) return;
    try {
      if (user.role === 'DOCTOR') {
        const specialization = window.prompt('Doctor specialization', '');
        const department = window.prompt('Department', '');
        if (specialization !== null && department !== null) await api.doctors.update(profileId, { specialization, department });
      } else if (user.role === 'NURSE') {
        const department = window.prompt('Department', '');
        if (department !== null) await api.nurses.update(profileId, { department });
      } else {
        const deskNumber = window.prompt('Reception desk number', '');
        if (deskNumber !== null) await api.receptionists.update(profileId, { deskNumber });
      }
      await refetchUsers();
    } catch { window.alert('Could not update this staff profile.'); }
  };

  const removeStaff = async (user: BackendUser) => {
    const profileId = user.role === 'DOCTOR' ? user.doctorProfile?.id : user.role === 'NURSE' ? user.nurseProfile?.id : user.role === 'RECEPTIONIST' ? user.receptionistProfile?.id : undefined;
    if (!profileId || !window.confirm(`Remove ${user.name} from this hospital workspace?`)) return;
    try {
      if (user.role === 'DOCTOR') await api.doctors.delete(profileId);
      else if (user.role === 'NURSE') await api.nurses.delete(profileId);
      else await api.receptionists.delete(profileId);
      await refetchUsers();
    } catch { window.alert('Staff with linked clinical or scheduling records cannot be removed.'); }
  };

  return (
    <div className="space-y-6">
      {/* Executive Overview Banner — Live Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <FrostedGlassCard variant="glow" padding="md" className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-text-muted uppercase tracking-wider">Total Patients</span>
            <Users className="w-5 h-5 text-accent" />
          </div>
          <div className="flex items-baseline justify-between">
            {patientsLoading ? (
              <Skeleton className="h-7 w-16" />
            ) : (
              <span className="text-2xl font-extrabold text-text-primary font-mono">{totalPatients}</span>
            )}
            <PillTag variant="accent" size="sm">Registered</PillTag>
          </div>
        </FrostedGlassCard>

        <FrostedGlassCard variant="elevated" padding="md" className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-text-muted uppercase tracking-wider">Active Doctor Queues</span>
            <Building2 className="w-5 h-5 text-emerald-400" />
          </div>
          <div className="flex items-baseline justify-between">
            {appointmentsLoading ? (
              <Skeleton className="h-7 w-16" />
            ) : (
              <span className="text-2xl font-extrabold text-text-primary font-mono">{activeDoctorQueues}</span>
            )}
              <span className="text-xs text-emerald-400 font-semibold">{appointments?.filter((appointment) => appointment.status === 'IN_QUEUE').length ?? 0} waiting</span>
          </div>
        </FrostedGlassCard>

        <FrostedGlassCard variant="elevated" padding="md" className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-text-muted uppercase tracking-wider">Revenue Collected Today</span>
            <DollarSign className="w-5 h-5 text-indigo-400" />
          </div>
          <div className="flex items-baseline justify-between">
            {billingLoading ? (
              <Skeleton className="h-7 w-24" />
            ) : (
              <span className="text-2xl font-extrabold text-text-primary font-mono">
                ${totalRevenue.toLocaleString('en-US', { minimumFractionDigits: 0 })}
              </span>
            )}
              <span className="text-xs text-indigo-400 font-semibold">{pendingInvoices} pending</span>
          </div>
        </FrostedGlassCard>

        <FrostedGlassCard variant="elevated" padding="md" className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-text-muted uppercase tracking-wider">Completed Consultations Today</span>
            <Users className="w-5 h-5 text-sky-400" />
          </div>
          <div className="flex items-baseline justify-between">
              <span className="text-2xl font-extrabold text-text-primary font-mono">{appointmentsLoading ? '—' : completedToday}</span>
            <span className="text-xs text-sky-400 font-semibold">Today&apos;s visits</span>
          </div>
        </FrostedGlassCard>
      </div>

      {/* Patient Directory — Live Data */}
      <FrostedGlassCard variant="elevated" padding="lg" className="space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-lg font-bold text-text-primary">Registered Patient Directory</h3>
            <p className="text-xs text-text-secondary">View all registered patient profiles from the database.</p>
          </div>
          <button
            onClick={() => void refetchPatients()}
            className="p-2 rounded-xl text-text-muted hover:text-text-primary hover:bg-white/5 transition-colors"
            aria-label="Refresh patient directory"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>

        {/* Filters & Search */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 w-full sm:w-80">
            <Search className="w-4 h-4 text-text-muted" />
            <input
              type="text"
              placeholder="Search patient name or phone..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-transparent border-none text-xs text-text-primary placeholder:text-text-muted focus:outline-none w-full"
            />
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto">
            {['ALL', 'PATIENT'].map((r) => (
              <button
                key={r}
                onClick={() => setPatientFilter(r)}
                className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                  patientFilter === r ? 'bg-accent text-white' : 'bg-white/5 text-text-secondary hover:bg-white/10'
                }`}
              >
                {r}
              </button>
            ))}
          </div>
        </div>

        {/* Patient Table */}
        {patientsError && (
          <ApiErrorBanner
            title="Could not load patient directory"
            onRetry={() => void refetchPatients()}
          />
        )}

        <div className="overflow-x-auto rounded-xl border border-white/10">
          <table className="w-full text-left text-xs">
            <thead className="bg-white/5 text-text-muted uppercase font-mono text-[10px] tracking-wider border-b border-white/10">
              <tr>
                <th className="p-3.5">Patient Name</th>
                <th className="p-3.5">Age / Gender</th>
                <th className="p-3.5">Phone</th>
                <th className="p-3.5">Registered</th>
                <th className="p-3.5">Medical History</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-text-primary">
              {patientsLoading &&
                Array.from({ length: 4 }).map((_, i) => (
                  <tr key={i}>
                    {Array.from({ length: 5 }).map((_, j) => (
                      <td key={j} className="p-3.5">
                        <Skeleton className="h-3 w-full" />
                      </td>
                    ))}
                  </tr>
                ))}
              {!patientsLoading && filteredPatients.length === 0 && (
                <tr>
                  <td colSpan={5} className="p-6 text-center text-text-muted">
                    No patient records found.
                  </td>
                </tr>
              )}
              {filteredPatients.map((p) => (
                <tr key={p.id} className="hover:bg-white/5 transition-colors">
                  <td className="p-3.5 font-medium">
                    <div className="font-semibold">{p.name}</div>
                    <div className="text-[10px] text-text-muted font-mono">{p.id.slice(-8).toUpperCase()}</div>
                  </td>
                  <td className="p-3.5">
                    <span className="px-2 py-0.5 rounded-md text-[10px] font-mono font-bold bg-accent/20 text-accent border border-accent/30">
                      {p.age}y / {p.gender}
                    </span>
                  </td>
                  <td className="p-3.5 text-text-secondary">{p.phone}</td>
                  <td className="p-3.5 text-text-muted text-[11px] font-mono">
                    {new Date(p.createdAt).toLocaleDateString()}
                  </td>
                  <td className="p-3.5 text-text-secondary max-w-[200px] truncate">
                    {p.medicalHistory || <span className="text-text-muted">—</span>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </FrostedGlassCard>

      {/* User Management */}
      <FrostedGlassCard variant="elevated" padding="lg" className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5 text-accent" />
            <div>
              <h3 className="text-base font-bold text-text-primary">User Management</h3>
              <p className="text-xs text-text-secondary">Accounts loaded from PostgreSQL.</p>
            </div>
          </div>
          <button
            onClick={() => void refetchUsers()}
            className="p-2 rounded-xl text-text-muted hover:text-text-primary hover:bg-white/5"
            aria-label="Refresh user list"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
        <div className="flex flex-col sm:flex-row gap-3">
          <input
            value={userSearchQuery}
            onChange={(event) => setUserSearchQuery(event.target.value)}
            placeholder="Search accounts by name or email"
            className="flex-1 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs text-text-primary"
          />
          <select
            value={roleFilter}
            onChange={(event) => setRoleFilter(event.target.value)}
            className="rounded-xl border border-white/10 bg-canvas px-3 py-2 text-xs text-text-primary"
          >
            <option value="ALL">All roles</option>
            <option value="ADMIN">ADMIN</option>
            <option value="DOCTOR">DOCTOR</option>
            <option value="NURSE">NURSE</option>
            <option value="RECEPTIONIST">RECEPTIONIST</option>
            <option value="PATIENT">PATIENT</option>
          </select>
        </div>
        <form onSubmit={addStaff} className="grid gap-2 rounded-xl border border-border-input bg-surface-low p-4 sm:grid-cols-3">
          <h4 className="text-sm font-semibold text-text-primary sm:col-span-3">Add workspace staff</h4>
          <select value={staffDraft.role} onChange={(event) => setStaffDraft({ ...staffDraft, role: event.target.value as typeof staffDraft.role })} className="rounded-lg border border-border-input bg-canvas px-3 py-2 text-xs text-text-primary"><option value="DOCTOR">Doctor</option><option value="NURSE">Nurse</option><option value="RECEPTIONIST">Receptionist</option></select>
          <input required placeholder="Full name" value={staffDraft.name} onChange={(event) => setStaffDraft({ ...staffDraft, name: event.target.value })} className="rounded-lg border border-border-input bg-canvas px-3 py-2 text-xs text-text-primary" />
          <input required type="email" placeholder="Work email" value={staffDraft.email} onChange={(event) => setStaffDraft({ ...staffDraft, email: event.target.value })} className="rounded-lg border border-border-input bg-canvas px-3 py-2 text-xs text-text-primary" />
          <input required minLength={8} type="password" placeholder="Temporary password" value={staffDraft.password} onChange={(event) => setStaffDraft({ ...staffDraft, password: event.target.value })} className="rounded-lg border border-border-input bg-canvas px-3 py-2 text-xs text-text-primary" />
          {staffDraft.role !== 'RECEPTIONIST' && <input required placeholder="Department" value={staffDraft.department} onChange={(event) => setStaffDraft({ ...staffDraft, department: event.target.value })} className="rounded-lg border border-border-input bg-canvas px-3 py-2 text-xs text-text-primary" />}
          {staffDraft.role === 'DOCTOR' && <input required placeholder="Specialization" value={staffDraft.specialization} onChange={(event) => setStaffDraft({ ...staffDraft, specialization: event.target.value })} className="rounded-lg border border-border-input bg-canvas px-3 py-2 text-xs text-text-primary" />}
          {staffDraft.role === 'RECEPTIONIST' && <input placeholder="Desk number" value={staffDraft.deskNumber} onChange={(event) => setStaffDraft({ ...staffDraft, deskNumber: event.target.value })} className="rounded-lg border border-border-input bg-canvas px-3 py-2 text-xs text-text-primary" />}
          <button disabled={staffSaving} className="rounded-lg bg-accent px-3 py-2 text-xs font-semibold text-white disabled:opacity-50">{staffSaving ? 'Adding…' : 'Add staff'}</button>
        </form>
        {usersError && <ApiErrorBanner title="Could not load user list" onRetry={() => void refetchUsers()} />}
        <div className="overflow-x-auto rounded-xl border border-white/10">
          <table className="w-full text-left text-xs">
            <thead className="bg-white/5 text-text-muted uppercase font-mono text-[10px]">
              <tr>
                <th className="p-3">Name</th>
                <th className="p-3">Email</th>
                <th className="p-3">Role</th>
                <th className="p-3">Created</th>
                <th className="p-3">Workspace actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-text-primary">
              {!usersLoading && filteredUsers.length === 0 && (
                <tr><td colSpan={5} className="p-5 text-center text-text-muted">No accounts found.</td></tr>
              )}
              {filteredUsers.map((user) => (
                <tr key={user.id}>
                  <td className="p-3">{user.name}</td>
                  <td className="p-3">{user.email}</td>
                  <td className="p-3">{user.role}</td>
                  <td className="p-3">{new Date(user.createdAt).toLocaleDateString()}</td>
                  <td className="flex gap-2 p-3">{['DOCTOR', 'NURSE', 'RECEPTIONIST'].includes(user.role) && <><button onClick={() => void editStaff(user)} className="font-semibold text-accent">Edit</button><button onClick={() => void removeStaff(user)} className="font-semibold text-rose-500">Remove</button></>}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </FrostedGlassCard>
    </div>
  );
}
