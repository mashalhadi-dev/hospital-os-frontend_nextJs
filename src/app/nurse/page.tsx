'use client';

import React from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { NurseDashboard } from '@/components/dashboard/NurseDashboard';

export default function NursePage() {
  return (
    <DashboardLayout allowedRoles={['NURSE']} activeRoleTitle="NURSE WORKSPACE">
      <NurseDashboard />
    </DashboardLayout>
  );
}
