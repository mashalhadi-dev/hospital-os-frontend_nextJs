'use client';

import React from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { DoctorDashboard } from '@/components/dashboard/DoctorDashboard';

export default function DoctorPage() {
  return (
    <DashboardLayout allowedRoles={['DOCTOR']} activeRoleTitle="DOCTOR WORKSPACE">
      <DoctorDashboard />
    </DashboardLayout>
  );
}
