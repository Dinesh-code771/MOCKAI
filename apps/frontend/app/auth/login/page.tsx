import LoginClient from '@/components/Login/LoginClient';
import React from 'react';
import { verifySession } from '../actions';
import { redirect } from 'next/navigation';

export default async function LoginPage() {
  const { isLoggedIn } = await verifySession();

  if (isLoggedIn) {
    redirect('/dashboard/student');
  }
  return <LoginClient />;
}
