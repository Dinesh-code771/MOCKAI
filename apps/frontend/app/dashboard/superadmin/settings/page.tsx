import React from 'react';
import { redirect } from 'next/navigation';
import { getUserProfile, verifySession } from '@/app/auth/actions';
import SettingsClient from '@/components/Settings/SettingsClient';

export default async function SuperAdminSettingsPage() {
  const { isLoggedIn } = await verifySession();
  const { data, error } = await getUserProfile();


  if (!isLoggedIn) {
    redirect('/auth/login');
  }

  return <SettingsClient userProfile={data?.profile} />;
}
