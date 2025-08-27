import { getAuthenticatedUsersApi } from '@/lib/api-client';

const getUserAssessments = async () => {
  const usersApi = getAuthenticatedUsersApi();
  const response = await usersApi.usersControllerGetUserAnalytics();
  return response;
};

export default getUserAssessments;
