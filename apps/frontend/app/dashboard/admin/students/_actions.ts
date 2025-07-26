'use server';

import { revalidatePath } from 'next/cache';
import { getAuthenticatedUsersApi } from '@/lib/api-client';

export async function addStudentsAction(emails: string[]) {
  try {
    const authenticatedApi = getAuthenticatedUsersApi();
    const response = await authenticatedApi.usersControllerAddUsers({
      addUsersDto: {
        emails,
      },
    });

    // Revalidate the students page
    revalidatePath('/dashboard/admin/students');

    return { success: true, data: response.data };
  } catch (error: any) {
    return {
      success: false,
      error:
        error.response?.data?.message ||
        error.message ||
        'Failed to add students',
    };
  }
}

export async function toggleStudentStatusAction(
  userId: string,
  isActive: boolean,
) {
  try {
    const authenticatedApi = getAuthenticatedUsersApi();
    const response = await authenticatedApi.usersControllerDisableUser({
      disableUserDto: {
        user_id: userId,
        is_active: isActive,
      },
    });

    // Revalidate the students page
    revalidatePath('/dashboard/admin/students');

    return { success: true, data: response.data };
  } catch (error: any) {
    return {
      success: false,
      error:
        error.response?.data?.message ||
        error.message ||
        'Failed to update student status',
    };
  }
}

export async function deleteStudentAction(userId: string) {
  try {
    const authenticatedApi = getAuthenticatedUsersApi();
    const response = await authenticatedApi.usersControllerDeleteUser({
      userId,
    });

    // Revalidate the students page
    revalidatePath('/dashboard/admin/students');

    return { success: true, data: response.data };
  } catch (error: any) {
    return {
      success: false,
      error:
        error.response?.data?.message ||
        error.message ||
        'Failed to delete student',
    };
  }
}

export async function getStudentsListAction(
  page: number = 1,
  limit: number = 50,
  search?: string,
  isActive?: boolean,
) {
  try {
    const authenticatedApi = getAuthenticatedUsersApi();
    const response = await authenticatedApi.usersControllerGetUsersList({
      page,
      limit,
    });

    return { success: true, data: response.data };
  } catch (error: any) {
    return {
      success: false,
      error:
        error.response?.data?.message ||
        error.message ||
        'Failed to fetch students',
    };
  }
}
