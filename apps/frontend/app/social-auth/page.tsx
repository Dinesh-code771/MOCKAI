'use client';
import { useRouter, useSearchParams } from 'next/navigation';
import React, { useEffect } from 'react';

export default function SocialAuthPage() {
  const searchParams = useSearchParams();
  const nextUrl = searchParams.get('next_url');
  console.log(nextUrl, 'nextUrl');
  const router = useRouter();
  useEffect(() => {
    if (nextUrl) {
      router.push(nextUrl);
    }
  }, [nextUrl]);
  return <div>SocialAuthPage</div>;
}
