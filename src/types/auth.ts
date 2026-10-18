// Authentication types aligned with backend RegisterDto
import type { UserRole } from './user';

export interface LoginDto {
  email: string;
  password: string;
}

export interface RegisterDto {
  name: string;
  email: string;
  password: string;
  role: UserRole;
  phone?: string;
  registrationSecret?: string;
  // Role-specific fields
  specialization?: string;  // DOCTOR
  department?: string;        // DOCTOR, NURSE, RECEPTIONIST
  shift?: string;             // NURSE
  age?: number;               // PATIENT
  gender?: 'MALE' | 'FEMALE' | 'OTHER';  // PATIENT
  deskNumber?: string;        // RECEPTIONIST
  address?: string;           // PATIENT
  medicalHistory?: string;    // PATIENT
}