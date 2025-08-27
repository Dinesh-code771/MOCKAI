import { getAuthenticatedUsersApi } from '@/lib/api-client';

export default async function getLeaderboardData() {
  const usersApi = getAuthenticatedUsersApi();
  const response = await usersApi.usersControllerGetUserRanking();
  return response;
}
