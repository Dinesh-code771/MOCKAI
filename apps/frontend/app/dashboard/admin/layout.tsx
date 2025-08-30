import React from 'react';
import { verifySession } from '@/app/auth/actions';
import { redirect } from 'next/navigation';

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isLoggedIn } = await verifySession();

  if (!isLoggedIn) {
    redirect('/auth/login');
  }

  return <main>{children}</main>;
}
