'use client';
import { useRouter, useSearchParams } from 'next/navigation';
import React, { useEffect, Suspense } from 'react';

function SocialAuthContent() {
  const searchParams = useSearchParams();
  const nextUrl = searchParams.get('next_url');
  console.log(nextUrl, 'nextUrl');
  const router = useRouter();

  useEffect(() => {
    if (nextUrl) {
      router.push(nextUrl);
    }
  }, [nextUrl, router]);

  return <div>SocialAuthPage</div>;
}

export default function SocialAuthPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SocialAuthContent />
    </Suspense>
  );
}
