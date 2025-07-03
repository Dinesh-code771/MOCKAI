import OtpClient from '@/components/Login/OtpClient';
import React from 'react';
import { verifySession } from '../actions';
import { redirect } from 'next/navigation';

export default async function OtpPage() {
  const { isLoggedIn } = await verifySession();

  if (isLoggedIn) {
    redirect('/dashboard/student');
  }

  return <OtpClient />;
}
