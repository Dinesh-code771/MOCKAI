'use server';

import { z } from 'zod';
import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import { removeAuthToken, staticDataApi, usersApi } from '@/lib/api-client';

const cookieStore = cookies();
// Validation schemas
const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

const googleLoginSchema = z.object({
  provider: z.literal('google'),
});

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
  const session = cookieStore.get('token');
  const isLoggedIn = session?.value ? true : false;
  return { session, isLoggedIn };
}

export async function getToken() {
  const token = cookieStore.get('token')?.value;
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

export async function logoutAction() {
  console.log('logoutAction');
  // Delete cookies first
  cookieStore.delete('auth_token');
  cookieStore.delete('token');
  cookieStore.delete('user');
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
