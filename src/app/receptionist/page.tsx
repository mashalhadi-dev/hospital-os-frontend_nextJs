'use client';

import React from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { ReceptionistDashboard } from '@/components/dashboard/ReceptionistDashboard';

export default function ReceptionistPage() {
  return (
    <DashboardLayout allowedRoles={['RECEPTIONIST']} activeRoleTitle="RECEPTIONIST WORKSPACE">
      <ReceptionistDashboard />
    </DashboardLayout>
  );
}
