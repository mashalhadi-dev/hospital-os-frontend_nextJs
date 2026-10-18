// Nurse types - aligned with Prisma Nurse model
export interface Nurse {
  id: string;
  userId: string;
  department: string;
  shift?: string;
  createdAt: string;
  updatedAt: string;
  user?: { id: string; name: string };
}

export interface CreateNurseDto {
  userId: string;
  department: string;
  shift?: string;
}

export interface VitalSign {
  id: string;
  patientId: string;
  nurseUserId: string;
  systolicBloodPressure: number;
  diastolicBloodPressure: number;
  oxygenSaturation: number;
  heartRate: number;
  temperatureCelsius: number;
  bloodGlucoseMgDl: number;
  recordedAt: string;
  patient: { id: string; name: string };
  nurse: { id: string; name: string };
}

export interface CreateVitalSignDto {
  patientId: string;
  systolicBloodPressure: number;
  diastolicBloodPressure: number;
  oxygenSaturation: number;
  heartRate: number;
  temperatureCelsius: number;
  bloodGlucoseMgDl: number;
}

export interface CreateMedicationAdministrationDto {
  prescriptionItemId: string;
  notes?: string;
}