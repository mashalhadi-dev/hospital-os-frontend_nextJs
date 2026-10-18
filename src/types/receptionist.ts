// Receptionist types - aligned with Prisma Receptionist model
export interface Receptionist {
  id: string;
  userId: string;
  deskNumber?: string;
  createdAt: string;
  updatedAt: string;
  user?: { id: string; name: string };
}

export interface CreateReceptionistDto {
  userId: string;
  deskNumber?: string;
}