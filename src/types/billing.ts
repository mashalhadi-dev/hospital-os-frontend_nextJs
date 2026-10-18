// Billing types - aligned with Prisma Billing model
export type BillingStatus = 'PENDING' | 'PAID' | 'CANCELLED';

export interface BillingInvoice {
  id: string;
  patientId: string;
  totalAmount: number;
  paidAmount: number;
  status: BillingStatus;
  createdAt: string;
  updatedAt: string;
  patient?: { id: string; name: string };
  items?: Array<{
    id: string;
    medicineId?: string;
    description: string;
    quantity: number;
    unitPrice: number;
    totalPrice: number;
  }>;
}

export interface CreateBillingDto {
  patientId: string;
  paidAmount?: number;
  status?: BillingStatus;
  items: Array<{
    medicineId?: string;
    description?: string;
    quantity: number;
    unitPrice?: number;
  }>;
}