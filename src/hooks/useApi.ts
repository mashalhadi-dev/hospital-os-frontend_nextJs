'use client';

/**
 * Shared React Query hooks for Hospital OS API data fetching.
 * All hooks leverage @tanstack/react-query for caching, refetching, and error handling.
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/services/api';
import type {
  Appointment,
  AppointmentStatus,
  CreateAppointmentDto,
  BillingInvoice,
  CreateBillingDto,
  CreatePatientDto,
  CreateVitalSignDto,
  CreateMedicationAdministrationDto,
  Patient,
  Doctor,
  Prescription,
  VitalSign,
  Medicine,
} from '@/types';

// ─── Query Keys ───────────────────────────────────────────────────────────────

export const QueryKeys = {
  appointments: ['appointments'] as const,
  appointment: (id: string) => ['appointments', id] as const,
  patients: ['patients'] as const,
  patient: (id: string) => ['patients', id] as const,
  doctors: ['doctors'] as const,
  bookableDoctors: ['doctors', 'availability'] as const,
  billing: ['billing'] as const,
  billingOne: (id: string) => ['billing', id] as const,
  prescriptions: ['prescriptions'] as const,
  medicines: ['medicines'] as const,
  vitals: ['vitals'] as const,
  vitalSigns: (patientId: string) => ['vitals', patientId] as const,
  medicationOrders: ['medication-orders'] as const,
} as const;

// ─── Appointments ─────────────────────────────────────────────────────────────

export function useAppointments() {
  return useQuery<Appointment[]>({
    queryKey: QueryKeys.appointments,
    queryFn: async () => {
      const res = await api.appointments.getAll();
      return res.data;
    },
    staleTime: 30_000,
    refetchInterval: 15_000,
    retry: 2,
  });
}

export function useUpdateAppointmentStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: AppointmentStatus }) =>
      api.appointments.updateStatus(id, status),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: QueryKeys.appointments });
    },
  });
}

export function useCreateAppointment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateAppointmentDto) =>
      api.appointments.create(data),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: QueryKeys.appointments });
    },
  });
}

export function useCreatePrescription() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Parameters<typeof api.prescriptions.create>[0]) =>
      api.prescriptions.create(data),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: QueryKeys.prescriptions });
    },
  });
}

export function useMedicines() {
  return useQuery<Medicine[]>({
    queryKey: QueryKeys.medicines,
    queryFn: async () => (await api.medicines.getAll()).data,
    staleTime: 120_000,
  });
}

export function useNurseVitals(patientId: string) {
  return useQuery<VitalSign[]>({
    queryKey: QueryKeys.vitalSigns(patientId),
    queryFn: async () => (await api.nurses.getVitals(patientId)).data,
    enabled: Boolean(patientId),
    staleTime: 10_000,
  });
}

export function useCreateVitalSign() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateVitalSignDto) => api.nurses.createVitalSign(data),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: QueryKeys.vitals });
    },
  });
}

export function useNurseMedicationOrders(patientId?: string) {
  return useQuery<Prescription[]>({
    queryKey: [...QueryKeys.medicationOrders, patientId],
    queryFn: async () => (await api.nurses.getMedicationOrders(patientId)).data,
    enabled: Boolean(patientId),
    staleTime: 15_000,
  });
}

export function useRecordMedicationAdministration() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateMedicationAdministrationDto) =>
      api.nurses.recordMedicationAdministration(data),
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: QueryKeys.medicationOrders,
      });
    },
  });
}

// ─── Patients ─────────────────────────────────────────────────────────────────

export function usePatients() {
  return useQuery<Patient[]>({
    queryKey: QueryKeys.patients,
    queryFn: async () => {
      const res = await api.patients.getAll();
      return res.data;
    },
    staleTime: 60_000,
    retry: 2,
  });
}

export function useCreatePatient() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreatePatientDto) => api.patients.create(data),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: QueryKeys.patients });
    },
  });
}

// ─── Doctors ─────────────────────────────────────────────────────────────────

export function useDoctors() {
  return useQuery<Doctor[]>({
    queryKey: QueryKeys.doctors,
    queryFn: async () => {
      const res = await api.doctors.getAll();
      return res.data;
    },
    staleTime: 120_000,
    retry: 2,
  });
}

export function useBookableDoctors() {
  return useQuery<Doctor[]>({
    queryKey: QueryKeys.bookableDoctors,
    queryFn: async () => (await api.doctors.getBookable()).data,
    staleTime: 120_000,
  });
}

export function usePrescriptions() {
  return useQuery<Prescription[]>({
    queryKey: QueryKeys.prescriptions,
    queryFn: async () => (await api.prescriptions.getAll()).data,
    staleTime: 30_000,
  });
}

// ─── Billing ─────────────────────────────────────────────────────────────────

export function useBilling() {
  return useQuery<BillingInvoice[]>({
    queryKey: QueryKeys.billing,
    queryFn: async () => {
      const res = await api.billing.getAll();
      return res.data;
    },
    staleTime: 30_000,
    refetchInterval: 30_000,
    retry: 2,
  });
}

export function useCreateInvoice() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateBillingDto) =>
      api.billing.createInvoice(data),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: QueryKeys.billing });
    },
  });
}
