'use client';

import React, { useState } from 'react';
import { FrostedGlassCard } from '@/components/ui/FrostedGlassCard';
import { PillButton } from '@/components/ui/PillButton';
import { PillTag } from '@/components/ui/PillTag';
import { SkeletonCard, ApiErrorBanner } from '@/components/ui/Skeleton';
import { toast } from '@/store/toast-store';
import {
  useAppointments,
  useBilling,
  useBookableDoctors,
  useCreateAppointment,
  usePrescriptions,
} from '@/hooks/useApi';
import { useAuthStore } from '@/store/auth-store';
import type { Appointment, BillingInvoice, CreateAppointmentDto } from '@/types';
import {
  Calendar,
  Pill,
  CreditCard,
  Clock,
  X,
  RefreshCw,
} from 'lucide-react';

export function PatientDashboard() {
  const [showBookApptModal, setShowBookApptModal] = useState(false);
  const [selectedDoctorId, setSelectedDoctorId] = useState('');
  const [appointmentDate, setAppointmentDate] = useState('');
  const [appointmentSymptoms, setAppointmentSymptoms] = useState('');

  const { user } = useAuthStore();
  const {
    data: appointments,
    isLoading: apptLoading,
    isError: apptError,
    error: apptErrorObj,
    refetch: refetchAppts,
  } = useAppointments();

  const {
    data: invoices,
    isLoading: billingLoading,
    isError: billingError,
    error: billingErrorObj,
    refetch: refetchBilling,
  } = useBilling();

  const { data: doctors, isLoading: doctorsLoading } = useBookableDoctors();
  const {
    data: prescriptions,
    isLoading: prescriptionsLoading,
    isError: prescriptionsError,
    error: prescriptionsErrorObj,
    refetch: refetchPrescriptions,
  } = usePrescriptions();
  const createAppointment = useCreateAppointment();

  const handleBookAppt = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!user?.patientProfileId) {
      toast.error('Patient Profile Missing', 'This account is not linked to a patient profile.');
      return;
    }
    try {
      const payload: CreateAppointmentDto = {
        patientId: user.patientProfileId,
        doctorId: selectedDoctorId,
        appointmentDate: new Date(appointmentDate).toISOString(),
        ...(appointmentSymptoms.trim()
          ? { symptoms: appointmentSymptoms.trim() }
          : {}),
      };
      await createAppointment.mutateAsync(payload);
      setShowBookApptModal(false);
      setAppointmentDate('');
      setAppointmentSymptoms('');
      toast.success('Appointment Requested', 'Your appointment request was saved.');
    } catch (error) {
      const apiError = error as {
        response?: { data?: { message?: string } };
      };
      toast.error(
        'Appointment Request Failed',
        apiError.response?.data?.message || 'Could not save the appointment request.',
      );
    }
  };

  const initials = user?.fullName
    ? user.fullName.split(' ').slice(0, 2).map((n) => n[0]).join('')
    : 'P';

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-text-primary tracking-tight">
            Personal Health Portal (PHR)
          </h2>
          <p className="text-xs text-text-secondary">
            View your medical records, upcoming consultations, active prescriptions, and billing.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <PillButton
            variant="accent"
            size="sm"
            icon={Calendar}
            onClick={() => setShowBookApptModal(true)}
          >
            Book Consultation
          </PillButton>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: PHR Profile & Prescriptions */}
        <div className="lg:col-span-7 space-y-6">
          {/* PHR Profile Card */}
          <FrostedGlassCard variant="glow" padding="lg" className="space-y-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-accent/20 text-accent font-bold text-lg border border-accent/30">
                  {initials}
                </div>
                <div>
                  <h3 className="text-lg font-bold text-text-primary">{user?.fullName ?? 'Patient'}</h3>
                  <span className="text-xs text-text-muted font-mono">{user?.email}</span>
                </div>
              </div>
              <PillTag variant="accent" size="sm">
                PATIENT PORTAL
              </PillTag>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 font-mono text-xs">
              <div className="p-3 rounded-xl bg-white/5 border border-white/10">
                <span className="text-[10px] text-text-muted block uppercase">Account Role</span>
                <span className="font-bold text-accent text-sm">{user?.role ?? 'PATIENT'}</span>
              </div>
              <div className="p-3 rounded-xl bg-white/5 border border-white/10">
                <span className="text-[10px] text-text-muted block uppercase">Phone</span>
                <span className="font-bold text-text-primary">{user?.phone ?? '—'}</span>
              </div>
              <div className="p-3 rounded-xl bg-white/5 border border-white/10 col-span-2 sm:col-span-1">
                <span className="text-[10px] text-text-muted block uppercase">Member Since</span>
                <span className="font-bold text-text-primary text-[11px]">
                  {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : '—'}
                </span>
              </div>
            </div>
          </FrostedGlassCard>

          {/* Patient-scoped prescription records */}
          <FrostedGlassCard variant="elevated" padding="lg" className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Pill className="w-5 h-5 text-accent" />
                <h3 className="text-base font-bold text-text-primary">My Active Prescriptions</h3>
              </div>
              <button
                onClick={() => void refetchPrescriptions()}
                className="text-[11px] text-accent hover:underline"
                aria-label="Refresh prescriptions"
              >
                <RefreshCw className="w-3 h-3" />
              </button>
            </div>
            {prescriptionsLoading && <SkeletonCard rows={2} />}
            {prescriptionsError && (
              <ApiErrorBanner
                title="Could not load prescriptions"
                message={(prescriptionsErrorObj as Error)?.message}
                onRetry={() => void refetchPrescriptions()}
              />
            )}
            {!prescriptionsLoading && !prescriptionsError && (
              <div className="space-y-3">
                {prescriptions?.length === 0 && (
                  <div className="text-xs text-text-muted text-center py-6 border border-dashed border-white/10 rounded-xl">
                    No prescriptions are recorded for your account.
                  </div>
                )}
                {prescriptions?.map((prescription) => (
                  <div key={prescription.id} className="rounded-xl bg-white/5 border border-white/10 p-3 text-xs">
                    <div className="flex items-center justify-between gap-2">
                      <h4 className="font-semibold text-text-primary">{prescription.diagnosis}</h4>
                      <span className="text-[10px] text-text-muted">
                        {new Date(prescription.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    {prescription.instructions && (
                      <p className="mt-1 text-text-secondary">{prescription.instructions}</p>
                    )}
                    <ul className="mt-2 space-y-1 text-text-muted">
                      {prescription.items?.map((item) => (
                        <li key={item.id}>
                          {item.medicine?.name ?? 'Medication'} — {item.dosage} · quantity {item.quantity}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            )}
          </FrostedGlassCard>
        </div>

        {/* Right Column: Appointments & Billing */}
        <div className="lg:col-span-5 space-y-6">
          {/* Upcoming Consultations */}
          <FrostedGlassCard variant="elevated" padding="lg" className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-accent" />
                <h3 className="text-base font-bold text-text-primary">Upcoming Appointments</h3>
              </div>
              <button onClick={() => void refetchAppts()} className="text-[11px] text-accent hover:underline flex items-center gap-1">
                <RefreshCw className="w-3 h-3" />
              </button>
            </div>

            {apptLoading && <SkeletonCard rows={3} />}
            {apptError && (
              <ApiErrorBanner
                title="Could not load appointments"
                message={(apptErrorObj as Error)?.message}
                onRetry={() => void refetchAppts()}
              />
            )}

            {!apptLoading && !apptError && (
              <div className="space-y-3">
                {appointments?.length === 0 && (
                  <div className="text-center text-xs text-text-muted py-6 border border-dashed border-white/10 rounded-xl">
                    No appointments found. Book a consultation to get started.
                  </div>
                )}
                {appointments?.map((apt: Appointment) => (
                  <div
                    key={apt.id}
                    className="p-3.5 rounded-xl bg-white/5 border border-white/10 space-y-2 text-xs"
                  >
                    <div className="flex items-center justify-between">
                      <h4 className="font-bold text-text-primary">
                        {apt.doctor?.user?.name ? `Dr. ${apt.doctor.user.name}` : apt.doctor?.department ?? 'Doctor'}
                      </h4>
                      <PillTag
                        variant={
                          apt.status === 'CONFIRMED' ? 'emerald' :
                          apt.status === 'PENDING' ? 'warning' :
                          apt.status === 'COMPLETED' ? 'accent' : 'error'
                        }
                        size="sm"
                      >
                        {apt.status}
                      </PillTag>
                    </div>
                    {apt.doctor?.department && (
                      <p className="text-text-muted">{apt.doctor.department}</p>
                    )}
                    <div className="flex items-center gap-2 font-mono text-[11px] text-accent font-semibold">
                      <Clock className="w-3.5 h-3.5" />
                      <span>{new Date(apt.appointmentDate).toLocaleString()}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </FrostedGlassCard>

          {/* Billing & Online Payment */}
          <FrostedGlassCard variant="elevated" padding="lg" className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-emerald-400" />
                <h3 className="text-base font-bold text-text-primary">Billing &amp; Invoices</h3>
              </div>
              <button onClick={() => void refetchBilling()} className="text-[11px] text-accent hover:underline flex items-center gap-1">
                <RefreshCw className="w-3 h-3" />
              </button>
            </div>

            {billingLoading && <SkeletonCard rows={2} />}
            {billingError && (
              <ApiErrorBanner
                title="Could not load invoices"
                message={(billingErrorObj as Error)?.message}
                onRetry={() => void refetchBilling()}
              />
            )}

            {!billingLoading && !billingError && (
              <div className="space-y-3">
                {invoices?.length === 0 && (
                  <div className="text-center text-xs text-text-muted py-6 border border-dashed border-white/10 rounded-xl">
                    No billing records found.
                  </div>
                )}
                {invoices?.map((inv: BillingInvoice) => (
                  <div
                    key={inv.id}
                    className="p-3.5 rounded-xl bg-white/5 border border-white/10 space-y-2 text-xs"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="font-bold text-text-primary">Invoice #{inv.id.slice(-6).toUpperCase()}</h4>
                        <span className="text-[10px] text-text-muted font-mono">
                          {new Date(inv.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <span className="font-mono text-sm font-extrabold text-text-primary">
                        ${inv.totalAmount.toFixed(2)}
                      </span>
                    </div>

                    <div className="flex items-center justify-between pt-1">
                      <PillTag
                        variant={
                          inv.status === 'PAID'
                            ? 'emerald'
                            : inv.status === 'PENDING'
                              ? 'warning'
                              : 'error'
                        }
                        size="sm"
                      >
                        {inv.status}
                      </PillTag>

                    </div>
                  </div>
                ))}
              </div>
            )}
          </FrostedGlassCard>
        </div>
      </div>

      {/* Book Appointment Modal */}
      {showBookApptModal && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="max-w-md w-full">
            <FrostedGlassCard variant="glow" padding="xl" className="space-y-5">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-text-primary">Book Doctor Consultation</h3>
                <button onClick={() => setShowBookApptModal(false)} className="text-text-muted hover:text-text-primary">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleBookAppt} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-text-muted uppercase mb-1">Doctor</label>
                  <select
                    required
                    value={selectedDoctorId}
                    onChange={(e) => setSelectedDoctorId(e.target.value)}
                    disabled={doctorsLoading}
                    className="w-full px-3 py-2 rounded-xl bg-canvas border border-white/10 text-xs text-text-primary"
                  >
                    <option value="">Select a doctor</option>
                    {doctors?.map((doctor) => (
                      <option key={doctor.id} value={doctor.id}>
                        {doctor.user?.name ?? doctor.specialization} — {doctor.specialization} · {doctor.department}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-text-muted uppercase mb-1">Preferred Date</label>
                  <input
                    type="datetime-local"
                    required
                    value={appointmentDate}
                    onChange={(e) => setAppointmentDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-xs text-text-primary"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-text-muted uppercase mb-1">Symptoms / Reason</label>
                  <textarea
                    rows={3}
                    placeholder="Describe your symptoms..."
                    value={appointmentSymptoms}
                    onChange={(e) => setAppointmentSymptoms(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-xs text-text-primary resize-none focus:outline-none focus:border-accent"
                  />
                </div>
                <div className="flex items-center justify-end gap-3 pt-2">
                  <PillButton variant="ghost" size="sm" type="button" onClick={() => setShowBookApptModal(false)}>
                    Cancel
                  </PillButton>
                  <PillButton
                    variant="accent"
                    size="sm"
                    type="submit"
                    disabled={createAppointment.isPending || !doctors?.length}
                  >
                    {createAppointment.isPending ? 'Submitting...' : 'Submit Request'}
                  </PillButton>
                </div>
              </form>
            </FrostedGlassCard>
          </div>
        </div>
      )}
    </div>
  );
}
