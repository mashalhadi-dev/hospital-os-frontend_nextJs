'use client';

import { useMemo, useState } from 'react';
import { FrostedGlassCard } from '@/components/ui/FrostedGlassCard';
import { PillButton } from '@/components/ui/PillButton';
import { PillTag } from '@/components/ui/PillTag';
import { ApiErrorBanner, SkeletonCard } from '@/components/ui/Skeleton';
import { useAppointments, useCreatePrescription, useMedicines, useUpdateAppointmentStatus } from '@/hooks/useApi';
import { toast } from '@/store/toast-store';
import { APPOINTMENT_STATUS_META, formatDateTime } from '@/lib/status';
import type { AppointmentStatus } from '@/types';

export function DoctorDashboard() {
  const { data: appointments, isLoading, isError, error, refetch } = useAppointments();
  const { data: medicines } = useMedicines();
  const updateStatus = useUpdateAppointmentStatus();
  const savePrescription = useCreatePrescription();
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [diagnosis, setDiagnosis] = useState('');
  const [medicineId, setMedicineId] = useState('');
  const [dosage, setDosage] = useState('');
  const [quantity, setQuantity] = useState('1');
  const selected = appointments?.find((appointment) => appointment.id === selectedId) ?? appointments?.find((appointment) => ['PENDING', 'IN_QUEUE', 'CONFIRMED'].includes(appointment.status)) ?? null;
  const queue = useMemo(() => (appointments ?? []).filter((appointment) => ['PENDING', 'IN_QUEUE', 'CONFIRMED'].includes(appointment.status)), [appointments]);
  const completeConsultation = async () => {
    if (!selected) return;
    if (!diagnosis.trim() || !medicineId || !dosage.trim()) {
      toast.error('Consultation incomplete', 'Enter a diagnosis and a medication with dosage before completing.');
      return;
    }
    try {
      if (selected.status !== 'CONFIRMED') await updateStatus.mutateAsync({ id: selected.id, status: 'CONFIRMED' as AppointmentStatus });
      await savePrescription.mutateAsync({ patientId: selected.patientId, diagnosis: diagnosis.trim(), items: [{ medicineId, dosage: dosage.trim(), quantity: Math.max(1, Number(quantity) || 1) }] });
      await updateStatus.mutateAsync({ id: selected.id, status: 'COMPLETED' as AppointmentStatus });
      toast.success('Consultation completed', 'Prescription saved and the patient visit was marked complete.');
      setDiagnosis(''); setDosage(''); setQuantity('1'); setSelectedId(null);
    } catch (caught) {
      const message = (caught as { response?: { data?: { message?: string } } }).response?.data?.message;
      toast.error('Could not complete consultation', message ?? 'Review the patient record and try again.');
    }
  };
  return <div className="space-y-6">
    <header><p className="text-xs font-semibold uppercase tracking-wider text-accent">Clinical workspace</p><h1 className="mt-2 text-3xl font-bold text-text-primary">Doctor OPD queue</h1><p className="mt-1 text-sm text-text-secondary">Review arrivals, document the visit, prescribe and complete the consultation.</p></header>
    {isLoading && <div className="grid gap-4 lg:grid-cols-2"><SkeletonCard rows={4}/><SkeletonCard rows={5}/></div>}
    {isError && <ApiErrorBanner title="Could not load the OPD queue" message={(error as Error)?.message} onRetry={() => void refetch()}/>}
    {!isLoading && !isError && <div className="grid gap-6 lg:grid-cols-[minmax(280px,0.8fr)_minmax(0,1.2fr)]">
      <FrostedGlassCard variant="elevated" padding="lg" className="space-y-3"><div className="flex items-center justify-between"><h2 className="font-semibold text-text-primary">Waiting patients</h2><PillTag variant="accent" size="sm">{queue.length} active</PillTag></div>
        {queue.length === 0 && <p className="py-8 text-center text-sm text-text-muted">No patients are waiting.</p>}
        {queue.map((appointment) => <button key={appointment.id} type="button" onClick={() => setSelectedId(appointment.id)} className={`w-full rounded-xl border p-4 text-left transition ${selected?.id === appointment.id ? 'border-accent bg-accent/10' : 'border-border-input bg-surface-low hover:border-accent/50'}`}><div className="flex items-center justify-between gap-2"><strong className="text-sm text-text-primary">{appointment.patient?.name ?? 'Patient'}</strong><PillTag variant={APPOINTMENT_STATUS_META[appointment.status].variant} size="sm">{APPOINTMENT_STATUS_META[appointment.status].label}</PillTag></div><p className="mt-1 text-xs text-text-secondary">{formatDateTime(appointment.appointmentDate)}</p>{appointment.symptoms && <p className="mt-2 text-xs text-text-muted">{appointment.symptoms}</p>}</button>)}
      </FrostedGlassCard>
      <FrostedGlassCard variant="elevated" padding="lg" className="space-y-5">{selected ? <>
        <div><p className="text-xs uppercase tracking-wider text-text-muted">Patient consultation</p><h2 className="mt-1 text-xl font-bold text-text-primary">{selected.patient?.name ?? 'Patient'}</h2><p className="mt-1 text-sm text-text-secondary">{selected.patientId} · {formatDateTime(selected.appointmentDate)}</p></div>
        <label className="grid gap-1.5 text-xs font-semibold text-text-secondary">Diagnosis<textarea required rows={3} value={diagnosis} onChange={(event) => setDiagnosis(event.target.value)} className="rounded-xl border border-border-input bg-surface-low px-3 py-2.5 text-sm text-text-primary" placeholder="Enter clinical diagnosis"/></label>
        <div className="grid gap-3 sm:grid-cols-2"><label className="grid gap-1.5 text-xs font-semibold text-text-secondary">Medication<select value={medicineId} onChange={(event) => setMedicineId(event.target.value)} className="rounded-xl border border-border-input bg-surface-low px-3 py-2.5 text-sm text-text-primary"><option value="">Choose medication</option>{medicines?.map((medicine) => <option key={medicine.id} value={medicine.id}>{medicine.name}</option>)}</select></label><label className="grid gap-1.5 text-xs font-semibold text-text-secondary">Dosage and directions<input value={dosage} onChange={(event) => setDosage(event.target.value)} className="rounded-xl border border-border-input bg-surface-low px-3 py-2.5 text-sm text-text-primary" placeholder="e.g. 500 mg twice daily for 5 days"/></label></div>
        <label className="grid max-w-40 gap-1.5 text-xs font-semibold text-text-secondary">Quantity<input type="number" min="1" value={quantity} onChange={(event) => setQuantity(event.target.value)} className="rounded-xl border border-border-input bg-surface-low px-3 py-2.5 text-sm text-text-primary"/></label>
        <div className="flex justify-end border-t border-border-subtle pt-4"><PillButton variant="accent" disabled={savePrescription.isPending || updateStatus.isPending} onClick={() => void completeConsultation()}>{savePrescription.isPending || updateStatus.isPending ? 'Saving consultation…' : 'Complete Consultation'}</PillButton></div>
      </> : <p className="py-12 text-center text-sm text-text-muted">Select a patient in the queue to open their consultation.</p>}</FrostedGlassCard>
    </div>}
  </div>;
}
