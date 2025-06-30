import { Configuration, AuthApi, HealthApi, MediaApi } from '@mockai/sdk';

// Create a configuration instance
const createApiConfiguration = (): Configuration => {
  return new Configuration({
    basePath: process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3001',
    credentials: 'include', // Include cookies in requests
    headers: {
      'Content-Type': 'application/json',
    },
  });
};

// Create API instances
const config = createApiConfiguration();

export const authApi = new AuthApi(config);
export const healthApi = new HealthApi(config);
export const mediaApi = new MediaApi(config);

// Helper function to get auth token from localStorage or cookies
export const getAuthToken = (): string | null => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('token');
  }
  return null;
};

// Helper function to set auth token
export const setAuthToken = (token: string): void => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('authToken', token);
  }
};

// Helper function to remove auth token
export const removeAuthToken = (): void => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('authToken');
  }
};

// Create authenticated API configuration
export const createAuthenticatedConfig = (): Configuration => {
  const token = getAuthToken();

  return new Configuration({
    basePath: process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3001',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
    },
  });
};

// Export authenticated API instances
export const getAuthenticatedAuthApi = (): AuthApi => {
  return new AuthApi(createAuthenticatedConfig());
};

export const getAuthenticatedHealthApi = (): HealthApi => {
  return new HealthApi(createAuthenticatedConfig());
};

export const getAuthenticatedMediaApi = (): MediaApi => {
  return new MediaApi(createAuthenticatedConfig());
};
