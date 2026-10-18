import axios from 'axios';
import type { AxiosResponse } from 'axios';
import type {
  User,
  Patient,
  CreatePatientDto,
  Doctor,
  Appointment,
  AppointmentStatus,
  Prescription,
  BillingInvoice,
  CreateAppointmentDto,
  CreateBillingDto,
  CreatePrescriptionDto,
  Medicine,
  VitalSign,
  CreateVitalSignDto,
  CreateMedicationAdministrationDto,
} from '@/types';
import type { ReceptionistAiTask } from '@/types/ai';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;
if (!API_BASE_URL) {
  throw new Error('NEXT_PUBLIC_API_URL must be set to the NestJS API origin');
}

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

// Request Interceptor: Automatically attach Bearer token from localStorage
axiosInstance.interceptors.request.use(
  (config) => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('accessToken');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response Interceptor: Handle 401 Unauthorized safely
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (typeof window !== 'undefined' && error.response?.status === 401) {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('docnode_user');
      if (!window.location.pathname.startsWith('/login') && !window.location.pathname.startsWith('/register')) {
        window.location.replace('/login');
      }
    }
    return Promise.reject(error);
  }
);

// ─── Auth ────────────────────────────────────────────────────────────────────

export interface AuthLoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
  hospitalId: string;
  role?: 'ADMIN' | 'DOCTOR' | 'NURSE' | 'RECEPTIONIST' | 'PATIENT';
  phone?: string;
  registrationSecret?: string;
  // Role-specific
  specialization?: string;
  department?: string;
  shift?: string;
  age?: number;
  gender?: 'MALE' | 'FEMALE' | 'OTHER';
  deskNumber?: string;
  address?: string;
  medicalHistory?: string;
}

export interface AuthResponse {
  accessToken: string;
  tokenType: 'Bearer';
  expiresIn: number;
  user: {
    id: string;
    email: string;
    name: string;
    role: User['role'];
    phone: string | null;
    createdAt: string;
    hospitalId: string;
    hospital: { name: string; slug: string };
    doctorProfile: { id: string } | null;
    nurseProfile: { id: string } | null;
    receptionistProfile: { id: string } | null;
    patientProfile: { id: string } | null;
  };
}

export type BackendUser = AuthResponse['user'];

export interface HospitalWorkspace { id: string; name: string; slug: string }

// ─── Typed API Methods ────────────────────────────────────────────────────────

export const api = {
  hospitals: {
    list: (): Promise<AxiosResponse<HospitalWorkspace[]>> => axiosInstance.get('/hospitals'),
    register: (data: { name: string; slug: string; address?: string; phone?: string; ownerName: string; email: string; password: string }) =>
      axiosInstance.post('/hospitals/register', data),
  },
  auth: {
    login: (data: AuthLoginPayload): Promise<AxiosResponse<AuthResponse>> =>
      axiosInstance.post('/auth/login', data),
    register: (data: RegisterPayload): Promise<AxiosResponse<AuthResponse>> =>
      axiosInstance.post('/auth/register', data),
    createStaff: (data: RegisterPayload): Promise<AxiosResponse<AuthResponse>> =>
      axiosInstance.post('/auth/staff', data),
    current: (): Promise<AxiosResponse<BackendUser>> =>
      axiosInstance.get('/auth/me'),
  },

  admin: {
    getUsers: (): Promise<AxiosResponse<BackendUser[]>> =>
      axiosInstance.get('/auth/users'),
  },

  patients: {
    getAll: (): Promise<AxiosResponse<Patient[]>> => axiosInstance.get('/patients'),
    getOne: (id: string): Promise<AxiosResponse<Patient>> => axiosInstance.get(`/patients/${id}`),
    create: (data: CreatePatientDto): Promise<AxiosResponse<Patient>> =>
      axiosInstance.post('/patients', data),
    update: (
      id: string,
      data: Partial<Omit<Patient, 'id' | 'createdAt' | 'updatedAt'>>
    ): Promise<AxiosResponse<Patient>> => axiosInstance.patch(`/patients/${id}`, data),
    delete: (id: string): Promise<AxiosResponse<void>> => axiosInstance.delete(`/patients/${id}`),
  },

  doctors: {
    getAll: (): Promise<AxiosResponse<Doctor[]>> => axiosInstance.get('/doctors'),
    getBookable: (): Promise<AxiosResponse<Doctor[]>> =>
      axiosInstance.get('/doctors/availability'),
    getOne: (id: string): Promise<AxiosResponse<Doctor>> => axiosInstance.get(`/doctors/${id}`),
    create: (
      data: Omit<Doctor, 'id' | 'userId' | 'createdAt' | 'updatedAt'>
    ): Promise<AxiosResponse<Doctor>> => axiosInstance.post('/doctors', data),
    update: (
      id: string,
      data: Partial<Omit<Doctor, 'id' | 'userId' | 'createdAt' | 'updatedAt'>>
    ): Promise<AxiosResponse<Doctor>> => axiosInstance.patch(`/doctors/${id}`, data),
    delete: (id: string): Promise<AxiosResponse<void>> => axiosInstance.delete(`/doctors/${id}`),
  },

  appointments: {
    getAll: (): Promise<AxiosResponse<Appointment[]>> => axiosInstance.get('/appointments'),
    getOne: (id: string): Promise<AxiosResponse<Appointment>> =>
      axiosInstance.get(`/appointments/${id}`),
    create: (
      data: CreateAppointmentDto
    ): Promise<AxiosResponse<Appointment>> => axiosInstance.post('/appointments', data),
    updateStatus: (
      id: string,
      status: AppointmentStatus
    ): Promise<AxiosResponse<Appointment>> =>
      axiosInstance.patch(`/appointments/${id}/status`, { status }),
  },

  prescriptions: {
    getAll: (): Promise<AxiosResponse<Prescription[]>> => axiosInstance.get('/prescriptions'),
    getOne: (id: string): Promise<AxiosResponse<Prescription>> =>
      axiosInstance.get(`/prescriptions/${id}`),
    create: (
      data: CreatePrescriptionDto
    ): Promise<AxiosResponse<Prescription>> => axiosInstance.post('/prescriptions', data),
  },

  medicines: {
    getAll: (): Promise<AxiosResponse<Medicine[]>> => axiosInstance.get('/medicines'),
  },

  nurses: {
    update: (id: string, data: { department?: string; shift?: string }): Promise<AxiosResponse<unknown>> => axiosInstance.patch(`/nurses/${id}`, data),
    delete: (id: string): Promise<AxiosResponse<void>> => axiosInstance.delete(`/nurses/${id}`),
    getVitals: (patientId?: string): Promise<AxiosResponse<VitalSign[]>> =>
      axiosInstance.get('/nurses/vitals', {
        params: patientId ? { patientId } : undefined,
      }),
    createVitalSign: (data: CreateVitalSignDto): Promise<AxiosResponse<VitalSign>> =>
      axiosInstance.post('/nurses/vitals', data),
    getMedicationOrders: (patientId?: string): Promise<AxiosResponse<Prescription[]>> =>
      axiosInstance.get('/nurses/medication-orders', {
        params: patientId ? { patientId } : undefined,
      }),
    recordMedicationAdministration: (
      data: CreateMedicationAdministrationDto
    ): Promise<AxiosResponse<{ id: string; prescriptionItemId: string; administeredAt: string }>> =>
      axiosInstance.post('/nurses/medication-administrations', data),
  },

  billing: {
    getAll: (): Promise<AxiosResponse<BillingInvoice[]>> => axiosInstance.get('/billing'),
    getOne: (id: string): Promise<AxiosResponse<BillingInvoice>> =>
      axiosInstance.get(`/billing/${id}`),
    createInvoice: (
      data: CreateBillingDto
    ): Promise<AxiosResponse<BillingInvoice>> => axiosInstance.post('/billing', data),
  },

  receptionists: {
    update: (id: string, data: { deskNumber?: string }): Promise<AxiosResponse<unknown>> => axiosInstance.patch(`/receptionists/${id}`, data),
    delete: (id: string): Promise<AxiosResponse<void>> => axiosInstance.delete(`/receptionists/${id}`),
  },

  ai: {
    summarize: (
      patientId: string,
      prompt?: string
    ): Promise<AxiosResponse<{ patientId: string; summary: string }>> =>
      axiosInstance.post('/ai/summarize', { patientId, prompt }),
    draftClinicalNote: (
      patientId: string,
      prompt?: string
    ): Promise<AxiosResponse<{ patientId: string; draft: string }>> =>
      axiosInstance.post('/ai/clinical-draft', { patientId, prompt }),
    copilot: (
      patientId: string,
      prompt: string
    ): Promise<AxiosResponse<{ patientId: string; response: string }>> =>
      axiosInstance.post('/ai/copilot', { patientId, prompt }),
    nurseCopilot: (
      patientId: string,
      prompt: string
    ): Promise<AxiosResponse<{ patientId: string; response: string }>> =>
      axiosInstance.post('/ai/nurse-copilot', { patientId, prompt }),
    receptionistCopilot: (
      task: ReceptionistAiTask
    ): Promise<AxiosResponse<{ task: ReceptionistAiTask; response: string }>> =>
      axiosInstance.post('/ai/receptionist-copilot', { task }),
  },
};

export default api;
