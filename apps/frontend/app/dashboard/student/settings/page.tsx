import React from 'react';
import { redirect } from 'next/navigation';
import { getUserProfile, verifySession } from '@/app/auth/actions';
import SettingsClient from '@/components/Settings/SettingsClient';

export default async function SettingsPage() {
  const { isLoggedIn } = await verifySession();
  const { data, error } = await getUserProfile();
  console.log(data, 'data');
  if (!isLoggedIn) {
    redirect('/auth/login');
  }

  return <SettingsClient userProfile={data?.profile} />;
}
