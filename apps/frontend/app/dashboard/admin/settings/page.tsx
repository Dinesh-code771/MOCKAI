import React from 'react';
import { redirect } from 'next/navigation';
import { verifySession } from '@/app/auth/actions';
import SettingsClient from '@/components/Settings/SettingsClient';

export default async function AdminSettingsPage() {
  const { isLoggedIn } = await verifySession();

  if (!isLoggedIn) {
    redirect('/auth/login');
  }

  return <SettingsClient />;
}
