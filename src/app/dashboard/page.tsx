'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/auth-store';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { AdminDashboard } from '@/components/dashboard/AdminDashboard';
import { DoctorDashboard } from '@/components/dashboard/DoctorDashboard';
import { NurseDashboard } from '@/components/dashboard/NurseDashboard';
import { ReceptionistDashboard } from '@/components/dashboard/ReceptionistDashboard';
import { PatientDashboard } from '@/components/dashboard/PatientDashboard';

export default function DashboardPage() {
  const router = useRouter();
  const { user, isAuthenticated, hydrated } = useAuthStore();

  useEffect(() => {
    if (hydrated && isAuthenticated && user?.role) {
      const roleRoute = `/${user.role.toLowerCase()}`;
      router.replace(roleRoute);
    }
  }, [hydrated, isAuthenticated, user, router]);

  const currentRole = user?.role || 'DOCTOR';

  return (
    <DashboardLayout allowedRoles={['ADMIN', 'DOCTOR', 'NURSE', 'RECEPTIONIST', 'PATIENT']}>
      {currentRole === 'ADMIN' && <AdminDashboard />}
      {currentRole === 'DOCTOR' && <DoctorDashboard />}
      {currentRole === 'NURSE' && <NurseDashboard />}
      {currentRole === 'RECEPTIONIST' && <ReceptionistDashboard />}
      {currentRole === 'PATIENT' && <PatientDashboard />}
    </DashboardLayout>
  );
}
