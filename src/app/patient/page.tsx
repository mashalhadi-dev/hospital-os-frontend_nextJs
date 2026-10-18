'use client';

import React from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { PatientDashboard } from '@/components/dashboard/PatientDashboard';

export default function PatientPage() {
  return (
    <DashboardLayout allowedRoles={['PATIENT']} activeRoleTitle="PATIENT PORTAL">
      <PatientDashboard />
    </DashboardLayout>
  );
}
