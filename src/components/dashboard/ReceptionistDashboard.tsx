'use client';

import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { api } from '@/services/api';
import { useAuthStore } from '@/store/auth-store';
import { FrostedGlassCard } from '@/components/ui/FrostedGlassCard';
import { PillButton } from '@/components/ui/PillButton';
import { PillTag } from '@/components/ui/PillTag';
import { toast } from '@/store/toast-store';
import { formatCurrency, formatDateTime } from '@/lib/status';
import type { CreatePatientDto } from '@/types';

type Receipt = { id: string; patient: string; amount: number; hospital: string; createdAt: string };
const emptyForm = { name: '', age: '', gender: '' as '' | 'MALE' | 'FEMALE' | 'OTHER', phone: '', doctorId: '', appointmentDate: '', symptoms: '', fee: '85' };

function downloadReceipt(receipt: Receipt) {
  const escape = (value: string) => value.replace(/[^\x20-\x7E]/g, ' ').replace(/[\\()]/g, (character) => `\\${character}`);
  const lines = [receipt.hospital, 'PAYMENT RECEIPT', `Invoice: ${receipt.id}`, `Patient: ${receipt.patient}`, `Amount paid: ${formatCurrency(receipt.amount)}`, `Date: ${new Date(receipt.createdAt).toLocaleString()}`, 'Thank you. Please retain this receipt for your records.'];
  const commands = lines.map((line, index) => `BT /F1 ${index === 0 ? 18 : 12} Tf 50 ${760 - index * 42} Td (${escape(line)}) Tj ET`).join('\n');
  const objects = [
    '<< /Type /Catalog /Pages 2 0 R >>',
    '<< /Type /Pages /Kids [3 0 R] /Count 1 >>',
    '<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Resources << /Font << /F1 5 0 R >> >> /Contents 4 0 R >>',
    `<< /Length ${new TextEncoder().encode(commands).length} >>\nstream\n${commands}\nendstream`,
    '<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>',
  ];
  let pdf = '%PDF-1.4\n';
  const offsets = [0];
  objects.forEach((object, index) => { offsets.push(new TextEncoder().encode(pdf).length); pdf += `${index + 1} 0 obj\n${object}\nendobj\n`; });
  const xref = new TextEncoder().encode(pdf).length;
  pdf += `xref\n0 ${objects.length + 1}\n0000000000 65535 f \n${offsets.slice(1).map((offset) => `${String(offset).padStart(10, '0')} 00000 n \n`).join('')}trailer\n<< /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${xref}\n%%EOF`;
  const url = URL.createObjectURL(new Blob([pdf], { type: 'application/pdf' }));
  const link = document.createElement('a'); link.href = url; link.download = `docnode-receipt-${receipt.id}.pdf`; link.click(); URL.revokeObjectURL(url);
}

export function ReceptionistDashboard() {
  const queryClient = useQueryClient();
  const hospitalName = useAuthStore((state) => state.user?.hospitalName ?? 'Hospital workspace');
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [receipt, setReceipt] = useState<Receipt | null>(null);
  const { data: doctors = [] } = useQuery({ queryKey: ['doctors', 'availability'], queryFn: async () => (await api.doctors.getBookable()).data });
  const { data: appointments = [] } = useQuery({ queryKey: ['appointments'], queryFn: async () => (await api.appointments.getAll()).data, refetchInterval: 15000 });
  const { data: invoices = [] } = useQuery({ queryKey: ['billing'], queryFn: async () => (await api.billing.getAll()).data, refetchInterval: 30000 });
  const today = new Date().toDateString();
  const todaysVisits = appointments.filter((appointment) => new Date(appointment.appointmentDate).toDateString() === today);
  const waiting = appointments.filter((appointment) => appointment.status === 'IN_QUEUE' || appointment.status === 'PENDING');
  const collected = invoices.filter((invoice) => invoice.status === 'PAID' && new Date(invoice.createdAt).toDateString() === today).reduce((sum, invoice) => sum + invoice.paidAmount, 0);
  const set = (field: keyof typeof emptyForm, value: string) => setForm((current) => ({ ...current, [field]: value }));

  async function registerQueueAndBill(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault(); setSaving(true); setReceipt(null);
    try {
      const patientDto: CreatePatientDto = { name: form.name.trim(), age: Number(form.age), gender: form.gender as CreatePatientDto['gender'], phone: form.phone.trim() };
      const patient = (await api.patients.create(patientDto)).data;
      await api.appointments.create({ patientId: patient.id, doctorId: form.doctorId, appointmentDate: new Date(form.appointmentDate).toISOString(), symptoms: form.symptoms.trim() || undefined });
      const fee = Number(form.fee);
      const invoice = (await api.billing.createInvoice({ patientId: patient.id, paidAmount: fee, items: [{ description: 'Consultation fee', quantity: 1, unitPrice: fee }] })).data;
      const paidReceipt = { id: invoice.id, patient: patient.name, amount: invoice.paidAmount, hospital: hospitalName, createdAt: invoice.createdAt };
      setReceipt(paidReceipt); downloadReceipt(paidReceipt); setForm(emptyForm);
      await Promise.all([queryClient.invalidateQueries({ queryKey: ['appointments'] }), queryClient.invalidateQueries({ queryKey: ['billing'] }), queryClient.invalidateQueries({ queryKey: ['patients'] })]);
      toast.success('Patient checked in and paid', 'The doctor queue was updated and the PDF receipt downloaded.');
    } catch (error) {
      const message = (error as { response?: { data?: { message?: string } } }).response?.data?.message;
      toast.error('Could not finish registration', message ?? 'Check the patient, doctor, appointment and payment details.');
    } finally { setSaving(false); }
  }

  return <div className="space-y-6">
    <header><PillTag variant="accent" size="sm">FRONT DESK · {hospitalName}</PillTag><h1 className="mt-3 text-3xl font-bold text-text-primary">Patient check-in &amp; billing</h1><p className="mt-1 text-sm text-text-secondary">Register walk-ins, assign a doctor, collect the fee and issue a receipt.</p></header>
    <div className="grid gap-4 sm:grid-cols-3">{[[todaysVisits.length, 'Appointments today'], [waiting.length, 'Patients in queue'], [formatCurrency(collected), 'Collected today']].map(([value, label]) => <FrostedGlassCard key={String(label)} variant="elevated" padding="md"><strong className="block text-2xl font-bold text-text-primary">{value}</strong><span className="mt-1 block text-xs text-text-secondary">{label}</span></FrostedGlassCard>)}</div>
    <div className="grid gap-6 xl:grid-cols-2">
      <FrostedGlassCard variant="elevated" padding="lg"><h2 className="text-lg font-bold text-text-primary">Walk-in registration</h2><form onSubmit={registerQueueAndBill} className="mt-5 grid gap-4 sm:grid-cols-2">
        <label className="grid gap-1 text-xs font-semibold text-text-secondary">Patient name<input required value={form.name} onChange={(event) => set('name', event.target.value)} className="rounded-xl border border-border-input bg-surface-low px-3 py-2.5 text-sm text-text-primary"/></label>
        <label className="grid gap-1 text-xs font-semibold text-text-secondary">Phone<input required value={form.phone} onChange={(event) => set('phone', event.target.value)} className="rounded-xl border border-border-input bg-surface-low px-3 py-2.5 text-sm text-text-primary"/></label>
        <label className="grid gap-1 text-xs font-semibold text-text-secondary">Age<input required type="number" min="0" max="130" value={form.age} onChange={(event) => set('age', event.target.value)} className="rounded-xl border border-border-input bg-surface-low px-3 py-2.5 text-sm text-text-primary"/></label>
        <label className="grid gap-1 text-xs font-semibold text-text-secondary">Gender<select required value={form.gender} onChange={(event) => set('gender', event.target.value)} className="rounded-xl border border-border-input bg-surface-low px-3 py-2.5 text-sm text-text-primary"><option value="">Select</option><option value="FEMALE">Female</option><option value="MALE">Male</option><option value="OTHER">Other</option></select></label>
        <label className="grid gap-1 text-xs font-semibold text-text-secondary sm:col-span-2">Assign doctor<select required value={form.doctorId} onChange={(event) => set('doctorId', event.target.value)} className="rounded-xl border border-border-input bg-surface-low px-3 py-2.5 text-sm text-text-primary"><option value="">Choose an active doctor</option>{doctors.map((doctor) => <option key={doctor.id} value={doctor.id}>{doctor.user?.name ?? doctor.id} · {doctor.department}</option>)}</select></label>
        <label className="grid gap-1 text-xs font-semibold text-text-secondary">Appointment slot<input required type="datetime-local" value={form.appointmentDate} onChange={(event) => set('appointmentDate', event.target.value)} className="rounded-xl border border-border-input bg-surface-low px-3 py-2.5 text-sm text-text-primary"/></label>
        <label className="grid gap-1 text-xs font-semibold text-text-secondary">Consultation fee<input required type="number" min="0" step="0.01" value={form.fee} onChange={(event) => set('fee', event.target.value)} className="rounded-xl border border-border-input bg-surface-low px-3 py-2.5 text-sm text-text-primary"/></label>
        <label className="grid gap-1 text-xs font-semibold text-text-secondary sm:col-span-2">Chief complaint<input value={form.symptoms} onChange={(event) => set('symptoms', event.target.value)} className="rounded-xl border border-border-input bg-surface-low px-3 py-2.5 text-sm text-text-primary"/></label>
        <div className="sm:col-span-2"><PillButton variant="accent" fullWidth disabled={saving || doctors.length === 0}>{saving ? 'Saving patient and payment…' : 'Register, queue & collect payment'}</PillButton></div>
      </form>
      {receipt && <div className="mt-4 flex items-center justify-between rounded-xl border border-emerald-500/30 bg-emerald-500/5 p-4 text-sm"><span className="text-text-primary">Receipt ready · {receipt.patient} · {formatCurrency(receipt.amount)}</span><button onClick={() => downloadReceipt(receipt)} className="font-semibold text-accent">Download PDF again</button></div>}</FrostedGlassCard>
      <FrostedGlassCard variant="elevated" padding="lg"><h2 className="text-lg font-bold text-text-primary">Live doctor queue</h2><div className="mt-4 space-y-2">{waiting.length === 0 && <p className="py-8 text-center text-sm text-text-muted">No patients are currently waiting.</p>}{waiting.map((appointment) => <div key={appointment.id} className="flex items-center justify-between gap-4 rounded-xl border border-border-input bg-surface-low p-3"><div><strong className="text-sm text-text-primary">{appointment.patient?.name ?? 'Patient'}</strong><p className="mt-1 text-xs text-text-muted">{appointment.doctor?.user?.name ?? ''} · {formatDateTime(appointment.appointmentDate)}</p></div><PillTag variant="warning" size="sm">{appointment.status === 'IN_QUEUE' ? 'In queue' : 'Pending'}</PillTag></div>)}</div></FrostedGlassCard>
    </div>
  </div>;
}
