'use client';

import React from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { AdminDashboard } from '@/components/dashboard/AdminDashboard';

export default function AdminPage() {
  return (
    <DashboardLayout allowedRoles={['ADMIN']} activeRoleTitle="ADMIN WORKSPACE">
      <AdminDashboard />
    </DashboardLayout>
  );
}
