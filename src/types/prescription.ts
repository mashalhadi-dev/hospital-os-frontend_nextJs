// Prescription types - aligned with Prisma Prescription model
export interface Prescription {
  id: string;
  patientId: string;
  doctorId: string;
  diagnosis: string;
  instructions?: string;
  createdAt: string;
  items?: Array<{
    id: string;
    medicineId: string;
    dosage: string;
    quantity: number;
    medicine?: { id: string; name: string };
    administrations?: MedicationAdministration[];
  }>;
  patient?: { id: string; name: string };
  doctor?: { id: string; user?: { name: string } };
}

export interface CreatePrescriptionDto {
  patientId: string;
  diagnosis: string;
  instructions?: string;
  items: Array<{
    medicineId: string;
    dosage: string;
    quantity: number;
  }>;
}

export interface MedicationAdministration {
  id: string;
  prescriptionItemId: string;
  nurseUserId?: string;
  notes?: string | null;
  administeredAt: string;
  nurse?: { name: string };
}