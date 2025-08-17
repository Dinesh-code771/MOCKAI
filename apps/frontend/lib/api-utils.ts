import {
  getAuthenticatedAuthApi,
  getAuthenticatedUsersApi,
} from './api-client';
import { UserListItemDto } from '@mockai/sdk';
import { revalidatePath } from 'next/cache';

// Health check utilities
export const checkApiHealth = async () => {
  try {
    // Simple health check using fetch
    const response = await fetch(
      `${
        process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3001'
      }/v1/health`,
    );
    const data = await response.json();
    return { success: true, data };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
};

// User profile utilities
export const getCurrentUser = async () => {
  try {
    const authenticatedApi = getAuthenticatedAuthApi();
    const response = await authenticatedApi.authControllerGetLoggedInUser();
    return { success: true, data: response.data };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
};

// Media upload utilities - TODO: Implement when media API is ready
export const uploadMedia = async (file: File, type?: string) => {
  return { success: false, error: 'Media upload not implemented yet' };
};

export const getMediaList = async (page?: number, limit?: number) => {
  return { success: false, error: 'Media list not implemented yet' };
};

export const deleteMedia = async (mediaId: string) => {
  return { success: false, error: 'Media delete not implemented yet' };
};

// Authentication utilities
export const logoutUser = async () => {
  try {
    const authenticatedApi = getAuthenticatedAuthApi();
    const response = await authenticatedApi.authControllerLogout();
    return { success: true, data: response.data };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
};

// Google OAuth utilities
export const initiateGoogleLogin = (nextUrl?: string) => {
  const baseUrl =
    process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000';
  const url = new URL('/v1/auth/google', baseUrl);
  if (nextUrl) {
    url.searchParams.set('next_url', nextUrl);
  }
  window.location.href = url.toString();
  console.log('url', url.toString());
};

// Error handling utility
export const handleApiError = (error: any) => {
  if (error.response?.data?.message) {
    return error.response.data.message;
  }
  if (error.message) {
    return error.message;
  }
  return 'An unexpected error occurred';
};

export const getStudentsList = async () => {
  const authenticatedApi = getAuthenticatedUsersApi();
  const response = await authenticatedApi.usersControllerGetUsersList({
    page: 1,
    limit: 10,
  });
  return response.data?.users;
};

export const addStudents = async (students: string[]) => {
  const authenticatedApi = getAuthenticatedUsersApi();
  const response = await authenticatedApi.usersControllerAddUsers({
    addUsersDto: {
      emails: students,
    },
  });
  return response.data;
};
