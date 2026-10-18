// User types - aligned with backend AuthUser interface
export type UserRole = 'ADMIN' | 'DOCTOR' | 'NURSE' | 'RECEPTIONIST' | 'PATIENT';

export interface User {
  id: string;
  email: string;
  fullName: string;
  name?: string;
  role: UserRole;
  hospitalId?: string;
  hospitalName?: string;
  avatarUrl?: string;
  department?: string;
  phone?: string;
  address?: string;
  createdAt?: string;
  doctorProfileId?: string;
  nurseProfileId?: string;
  receptionistProfileId?: string;
  patientProfileId?: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  hydrated: boolean;
}

export interface AuthResponse {
  accessToken: string;
  tokenType: 'Bearer';
  expiresIn: number;
  user: {
    id: string;
    email: string;
    name: string;
    role: UserRole;
    phone: string | null;
    createdAt: string;
  };
}
