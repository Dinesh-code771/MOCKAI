import React from 'react';
import { verifySession } from '@/app/auth/actions';
import { redirect } from 'next/navigation';
import StudentDashboard from '@/components/Student-Dashboard';

export default async function StudentPage() {
  const { isLoggedIn, role } = await verifySession();

  if (!isLoggedIn) {
    redirect('/auth/login');
  }

  return <StudentDashboard />;
}
