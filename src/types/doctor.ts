// Doctor types - aligned with Prisma Doctor model
export interface Doctor {
  id: string;
  userId: string;
  specialization: string;
  department: string;
  availability?: string;
  createdAt: string;
  updatedAt: string;
  user?: { id: string; name: string };
}

export interface CreateDoctorDto {
  userId: string;
  specialization: string;
  department: string;
  availability?: string;
}