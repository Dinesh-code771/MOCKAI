'use server';

import { z } from 'zod';
import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import {
  authApi,
  removeAuthToken,
  staticDataApi,
  usersApi,
} from '@/lib/api-client';
import { jwtVerify } from 'jose';
import { env } from 'process';
// Validation schemas
const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

const googleLoginSchema = z.object({
  provider: z.literal('google'),
});

const secret = new TextEncoder().encode(process.env.NEXT_PUBLIC_JWT_SECRET);

// Types
export type LoginFormState = {
  errors?: {
    email?: string[];
    password?: string[];
    _form?: string[];
  };
  message?: string;
};

export type GoogleLoginFormState = {
  errors?: {
    _form?: string[];
  };
  message?: string;
};

export async function loginAction(
  prevState: LoginFormState,
  formData: FormData,
): Promise<LoginFormState> {
  const validatedFields = loginSchema.safeParse({
    email: formData.get('email'),
    password: formData.get('password'),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Missing Fields. Failed to Login.',
    };
  }

  const { email, password } = validatedFields.data;

  try {
    // This would typically call your API
    // For now, we'll just redirect
    redirect('/auth/otp');
  } catch (error) {
    return {
      message: 'Database Error: Failed to Login.',
    };
  }
}

export async function googleLoginAction(
  prevState: GoogleLoginFormState,
  formData: FormData,
): Promise<GoogleLoginFormState> {
  const validatedFields = googleLoginSchema.safeParse({
    provider: formData.get('provider'),
  });

  if (!validatedFields.success) {
    return {
      errors: {
        _form: ['Invalid provider'],
      },
      message: 'Invalid provider.',
    };
  }

  try {
    // Redirect to Google OAuth
    redirect('/api/auth/google');
  } catch (error) {
    return {
      message: 'Failed to initiate Google login.',
    };
  }
}

export async function verifySession() {
  const cookieStore = cookies();
  const session = cookieStore.get('sid');

  // validate the token and return the role
  let userInfo = null;
  let isLoggedIn = false;
  let role = null;
  console.log(session, 'session');
  if (session?.value) {
    try {
      // Decode JWT token to extract user information
      const token = session.value;
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join(''),
      );

      const payload = JSON.parse(jsonPayload);

      // Check if token is expired
      const currentTime = Math.floor(Date.now() / 1000);
      if (payload.exp && payload.exp < currentTime) {
        // Token is expired, clear it
        cookieStore.delete('sid');
        return { session: null, isLoggedIn: false, userInfo: null, role: null };
      }

      // Extract user information
      userInfo = {
        id: payload.sub,
        full_name: payload.name,
        roles: payload.roles,
        is_disabled: payload.is_disabled,
        type: payload.type,
      };

      // Check if user is disabled
      if (payload.is_disabled) {
        cookieStore.delete('sid');
        return { session: null, isLoggedIn: false, userInfo: null, role: null };
      }

      // Extract role (assuming roles is an array, take the first one)
      if (
        payload.roles &&
        Array.isArray(payload.roles) &&
        payload.roles.length > 0
      ) {
        role = payload.roles[0].name || payload.roles[0];
      }

      isLoggedIn = true;
    } catch (error) {
      console.error('Error validating token:', error);
      // Clear invalid token
      cookieStore.delete('sid');
      return { session: null, isLoggedIn: false, userInfo: null, role: null };
    }
  }

  return { session, isLoggedIn, userInfo, role };
}

export async function getToken() {
  const cookieStore = cookies();
  const token = cookieStore.get('sid')?.value;
  return token;
}

export async function getUserProfile() {
  try {
    const response = await usersApi.usersControllerGetUserProfile();

    return { success: true, data: response.data };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

// Helper function for robust server-side cookie deletion
function deleteServerCookie(cookieStore: any, name: string) {
  // Try multiple approaches to ensure cookie deletion
  const options = [
    {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax' as const,
      path: '/',
      expires: new Date(0),
    },
    {
      httpOnly: false,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax' as const,
      path: '/',
      expires: new Date(0),
    },
    {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict' as const,
      path: '/',
      expires: new Date(0),
    },
    {
      httpOnly: false,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict' as const,
      path: '/',
      expires: new Date(0),
    },
  ];

  // Try each option to ensure cookie is deleted
  options.forEach((option) => {
    try {
      cookieStore.set(name, '', option);
    } catch (error) {
      console.warn(`Failed to delete cookie ${name} with option:`, option);
    }
  });
}
export const getBaseDomain = (subdomain: string) => {
  if (subdomain === '') {
    return undefined;
  }
  const match = subdomain.match(/([a-zA-Z0-9-]+\.[a-zA-Z]+)$/);
  return match ? `.${match[0]}` : undefined; // Extract the base domain
};

export async function logoutAction() {
  // Delete cookies first with proper server-side cookie deletion
  const cookieStore = cookies();
  console.log('Starting logout process...');

  try {
    // Call backend logout API
    const response = fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/v1/auth/logout`,
      {
        method: 'POST',
        credentials: 'include',
      },
    );
    console.log(response, 'response');

    // const domain =
    //   env.NEXT_PUBLIC_NODE_ENV === 'production'
    //     ? getBaseDomain(env.NEXT_PUBLIC_API_BASE_URL || '')
    //     : undefined;

    // const cookieStore = await cookies();
    // cookieStore.delete({
    //   name: 'sid',
    //   domain: domain || undefined,
    // });
  } catch (error) {
    console.error('Backend logout failed:', error);
    // Continue with frontend cookie deletion even if backend fails
  }

  // Delete all possible auth cookies with multiple strategies for Railway
  // const cookieNames = ['auth_token', 'token', 'user', 'sid'];

  // cookieNames.forEach((name) => {
  //   deleteServerCookie(cookieStore, name);
  // });

  // Additional Railway-specific cookie deletion
  // Try deleting with different domain configurations
  // const railwayCookieOptions = [
  //   {
  //     httpOnly: true,
  //     secure: true,
  //     sameSite: 'lax' as const,
  //     path: '/',
  //     domain: '.up.railway.app',
  //     expires: new Date(0),
  //   },
  //   {
  //     httpOnly: true,
  //     secure: true,
  //     sameSite: 'lax' as const,
  //     path: '/',
  //     domain: 'up.railway.app',
  //     expires: new Date(0),
  //   },
  //   {
  //     httpOnly: true,
  //     secure: true,
  //     sameSite: 'lax' as const,
  //     path: '/',
  //     domain: undefined, // Try without domain
  //     expires: new Date(0),
  //   },
  //   {
  //     httpOnly: false,
  //     secure: true,
  //     sameSite: 'lax' as const,
  //     path: '/',
  //     domain: '.up.railway.app',
  //     expires: new Date(0),
  //   },
  //   {
  //     httpOnly: false,
  //     secure: true,
  //     sameSite: 'lax' as const,
  //     path: '/',
  //     domain: undefined,
  //     expires: new Date(0),
  //   },
  // ];

  // // Try each option for each cookie name
  // cookieNames.forEach((name) => {
  //   railwayCookieOptions.forEach((option) => {
  //     try {
  //       cookieStore.set(name, '', option);
  //     } catch (error) {
  //       console.warn(`Failed to delete cookie ${name} with option:`, option);
  //     }
  //   });
  // });

  // Return success response instead of redirecting
  return { success: true, message: 'Logged out successfully' };
}

// Update user profile action
export async function updateUserProfileAction(formData: FormData) {
  try {
    const name = formData.get('full_name') as string;
    const email = formData.get('email') as string;
    const phone = formData.get('phone') as string;
    const course = formData.get('course') as string;
    const gender = formData.get('gender') as string;

    // Validate required fields
    if (!name || !email) {
      return {
        success: false,
        message: 'Name and email are required',
      };
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return {
        success: false,
        message: 'Please enter a valid email address',
      };
    }

    // Simulate API call to update profile
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // In a real app, you would call the API here
    // const result = await usersApi.usersControllerUpdateProfile({
    //   name,
    //   email,
    //   phone,
    //   course,
    //   gender,
    // });

    return {
      success: true,
      message: 'Profile updated successfully',
      data: {
        name,
        email,
        phone,
        course,
        gender,
      },
    };
  } catch (error) {
    console.error('Error updating profile:', error);
    return {
      success: false,
      message: 'Failed to update profile. Please try again.',
    };
  }
}

export async function getCourses() {
  const response = await staticDataApi.staticDataControllerGetActiveCourses();
  return response.data;
}
