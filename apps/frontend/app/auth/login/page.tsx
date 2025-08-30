import LoginClient from '@/components/Login/LoginClient';
import React from 'react';
import { verifySession } from '../actions';
import { redirect } from 'next/navigation';

export default async function LoginPage() {
  const { isLoggedIn, role } = await verifySession();
  console.log(isLoggedIn, 'isLoggedIn');
  if (isLoggedIn) {
    if (role === 'student') {
      redirect('/dashboard/student');
    } else if (role === 'admin') {
      redirect('/dashboard/admin');
    } 
  }
  return <LoginClient />;
}
