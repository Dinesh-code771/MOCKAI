'use client';
import { useRouter, useSearchParams } from 'next/navigation';
import React, { useEffect, Suspense, useState } from 'react';
import { verifySession } from '../auth/actions';

function SocialAuthContent() {
  const searchParams = useSearchParams();
  const nextUrl = searchParams.get('next_url');
  const [isLoading, setIsLoading] = useState(true);

  const router = useRouter();

  useEffect(() => {
    async function toVerifySession() {
      const { isLoggedIn, role } = await verifySession();
      if (isLoggedIn) {
        if (role.toLowerCase() === 'student') {
          router.push('/dashboard/student');
        } else if (role.toLowerCase() === 'admin') {
          router.push('/dashboard/admin');
        }
        return setIsLoading(false);
      } else {
        setIsLoading(false);
      }
    }
    toVerifySession();
  }, [nextUrl, router]);

  if (isLoading) {
    //spinner animation at center of the page
    //border-blue-500 is blue color
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          {/* text-gray-600 is gray color */}
          <p className="mt-4 text-gray-600">Loading social auth...</p>
        </div>
      </div>
    );
  }

  return <div>SocialAuthPage</div>;
}

export default function SocialAuthPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SocialAuthContent />
    </Suspense>
  );
}
