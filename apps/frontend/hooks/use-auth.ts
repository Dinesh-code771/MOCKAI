import { useState, useEffect } from 'react';
import {
  authApi,
  getAuthenticatedAuthApi,
  setAuthToken,
  removeAuthToken,
  getAuthToken,
} from '@/lib/api-client';
import {
  LoginDto,
  OtpDto,
  UserResponseDto,
  LoginResponseDto,
  UserResponseApiResponse,
} from '@mockai/sdk';
import { z } from 'zod';

interface AuthState {
  user: UserResponseDto | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

const loginSchema = z.object({
  email: z.string().email(),
  password: z
    .string()
    .min(8)
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
    )
    .refine(
      (val) => {
        return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(
          val,
        );
      },
      {
        message:
          'Password must contain at least 8 characters, one uppercase letter, one lowercase letter, one number, and one special character',
      },
    ),
});

const otpSchema = z.object({
  otp: z.string().min(6).max(6),
});

export const useAuth = () => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: true,
    error: null,
  });

  // Check if user is authenticated on mount
  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const token = getAuthToken();
      if (!token) {
        setAuthState((prev) => ({
          ...prev,
          isLoading: false,
          isAuthenticated: false,
        }));
        return;
      }

      const authenticatedApi = getAuthenticatedAuthApi();
      const response = await authenticatedApi.authControllerGetLoggedInUser();
      if (response && response.data) {
        setAuthState({
          user: response.data,
          isAuthenticated: true,
          isLoading: false,
          error: null,
        });
      } else {
        setAuthState({
          user: null,
          isAuthenticated: false,
          isLoading: false,
          error: null,
        });
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      setAuthState({
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: 'Authentication check failed',
      });
      removeAuthToken();
    }
  };

  const login = async (loginData: LoginDto) => {
    //zod validation
    const validatedData: any = loginSchema.safeParse(loginData);
    if (!validatedData.success) {
      setAuthState((prev) => ({
        ...prev,
        isLoading: false,
        error: JSON.parse(validatedData.error.message)[2].message,
      }));
      return { success: false, error: validatedData.error.message };
    }

    setAuthState((prev) => ({ ...prev, isLoading: true, error: null }));

    try {
      const response = await authApi.authControllerLogin({
        loginDto: loginData,
      });

      if (response && response.data?.token) {
        setAuthToken(response.data.token);
        document.cookie = `token=${response.data.token} ; path=/ ; max-age=3600 ; secure`;
        console.log(response.data.token, 'response.data.token');
        setAuthState((prev) => ({
          ...prev,
          isLoading: false,
          isAuthenticated: true,
          user: response?.data?.user || null,
        }));
        return { success: true, data: response.data };
      } else {
        throw new Error('No access token received');
      }
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || error.message || 'Login failed';
      setAuthState((prev) => ({
        ...prev,
        isLoading: false,
        error: errorMessage,
      }));
      return { success: false, error: errorMessage };
    }
  };

  const verifyOtp = async (otpData: OtpDto) => {
    setAuthState((prev) => ({ ...prev, isLoading: true, error: null }));

    try {
      const response = await authApi.authControllerVerifyOtp({
        otpDto: otpData,
      });

      if (response && response.data?.token) {
        setAuthToken(response.data.token);
        setAuthState((prev) => ({
          ...prev,
          isLoading: false,
          isAuthenticated: true,
          user: response?.data?.user || null,
        }));
        return { success: true, data: response.data };
      } else {
        throw new Error('No access token received');
      }
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        'OTP verification failed';
      setAuthState((prev) => ({
        ...prev,
        isLoading: false,
        error: errorMessage,
      }));
      return { success: false, error: errorMessage };
    }
  };

  const logout = async () => {
    try {
      const authenticatedApi = getAuthenticatedAuthApi();
      await authenticatedApi.authControllerLogout();
    } catch (error) {
      console.error('Logout API call failed:', error);
    } finally {
      removeAuthToken();
      setAuthState({
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,
      });
    }
  };

  const resendOtp = async () => {
    try {
      await authApi.authControllerResendOtp();
      return { success: true };
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        'Failed to resend OTP';
      return { success: false, error: errorMessage };
    }
  };

  const clearError = () => {
    setAuthState((prev) => ({ ...prev, error: null }));
  };

  return {
    ...authState,
    login,
    verifyOtp,
    logout,
    resendOtp,
    clearError,
    checkAuthStatus,
  };
};
