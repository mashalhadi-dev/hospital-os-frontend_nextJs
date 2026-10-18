// Appointment types - aligned with Prisma Appointment model
export type AppointmentStatus = 'PENDING' | 'IN_QUEUE' | 'CONFIRMED' | 'COMPLETED' | 'CANCELLED';

export interface Appointment {
  id: string;
  patientId: string;
  doctorId: string;
  appointmentDate: string;
  status: AppointmentStatus;
  symptoms?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
  patient?: { id: string; name: string };
  doctor?: {
    id: string;
    specialization: string;
    department: string;
    user: { id: string; name: string };
  };
}

export interface CreateAppointmentDto {
  patientId: string;
  doctorId: string;
  appointmentDate: string;
  symptoms?: string;
  notes?: string;
}
