
import { usersApi } from '../api-client';

export default async function studentsAnalaticForAdmin() {
  const response = await usersApi.usersControllerAdminDashboardAnalytics();
  return response;
}
