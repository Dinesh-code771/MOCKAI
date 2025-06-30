'use server';

import { z } from 'zod';
import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';

const cokkieStore = cookies();
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

// Login action
export async function loginAction(
  prevState: LoginFormState,
  formData: FormData,
): Promise<LoginFormState> {
  try {
    // Validate form data
    const validatedFields = loginSchema.safeParse({
      email: formData.get('email'),
      password: formData.get('password'),
    });

    if (!validatedFields.success) {
      return {
        errors: validatedFields.error.flatten().fieldErrors,
        message: 'Invalid form data',
      };
    }

    const { email, password } = validatedFields.data;

    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Mock authentication logic
    // In a real app, you would validate against your backend
    if (email === 'student@example.com' && password === 'password123') {
      // Success - redirect to OTP page
      redirect('/auth/otp');
    } else {
      return {
        errors: {
          _form: ['Invalid email or password'],
        },
        message: 'Authentication failed',
      };
    }
  } catch (error) {
    console.error('Login error:', error);
    return {
      errors: {
        _form: ['An unexpected error occurred. Please try again.'],
      },
      message: 'Login failed',
    };
  }
}

// Google login action
export async function googleLoginAction(
  prevState: GoogleLoginFormState,
  formData: FormData,
): Promise<GoogleLoginFormState> {
  try {
    // Validate form data
    const validatedFields = googleLoginSchema.safeParse({
      provider: formData.get('provider'),
    });

    if (!validatedFields.success) {
      return {
        errors: {
          _form: ['Invalid form data'],
        },
        message: 'Invalid form data',
      };
    }

    // Simulate Google OAuth flow
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Mock successful Google login
    // In a real app, you would handle OAuth flow
    redirect('/auth/otp');
  } catch (error) {
    console.error('Google login error:', error);
    return {
      errors: {
        _form: ['Google login failed. Please try again.'],
      },
      message: 'Google login failed',
    };
  }
}

export async function verifySession() {
  const session = cokkieStore.get('token');
  console.log(session, 'session');
  const isLoggedIn = session?.value ? true : false;
  return { session, isLoggedIn };
}

export async function logoutAction() {
  const cookieStore = await cookies();

  cookieStore.delete('token');
  cookieStore.delete('user');
  redirect('/auth/login');
}
