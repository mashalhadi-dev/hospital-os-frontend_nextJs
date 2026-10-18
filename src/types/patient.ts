// Patient types - aligned with Prisma Patient model
export interface Patient {
  id: string;
  userId?: string;
  name: string;
  age: number;
  gender: 'MALE' | 'FEMALE' | 'OTHER';
  phone: string;
  address?: string;
  medicalHistory?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreatePatientDto {
  name: string;
  phone: string;
  age: number;
  gender: 'MALE' | 'FEMALE' | 'OTHER';
  address?: string;
  medicalHistory?: string;
}
