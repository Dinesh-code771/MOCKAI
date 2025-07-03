import {
  Configuration,
  AuthApi,
  HealthApi,
  MediaApi,
  UsersApi,
  Middleware,
  StaticDataApi,
} from '@mockai/sdk';
import cookieUtils from './cookie-utils';
import { getToken } from '@/app/auth/actions';

// Create middleware for authentication
const authMiddleware: Middleware = {
  pre: async (context) => {
    const token = await getToken();
    console.log('token', token);

    if (token) {
      context.init = {
        ...context.init,
        headers: {
          ...(context.init.headers || {}),
          Authorization: `Bearer ${token}`,
        },
      };
    }

    return context;
  },
  post: async (context) => {
    return context.response;
  },
  onError: async (context) => {
    if (context.response?.status === 401) {
      // Clear auth cookies on 401 error
      cookieUtils.clearAuthCookies();

      // Redirect to login page if we're on the client side
      if (typeof window !== 'undefined') {
        window.location.href = '/auth/login';
      }
    }
    throw context.error;
  },
};

// Create a configuration instance
const createApiConfiguration = (): Configuration => {
  return new Configuration({
    basePath: process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3001',
    credentials: 'include', // Include cookies in requests
    headers: {
      'Content-Type': 'application/json',
    },
    middleware: [authMiddleware],
  });
};

// Create API instances
const config = createApiConfiguration();

export const authApi = new AuthApi(config);
export const healthApi = new HealthApi(config);
export const mediaApi = new MediaApi(config);
export const usersApi = new UsersApi(config);
export const staticDataApi = new StaticDataApi(config);

// Helper function to get auth token from cookies
export const getAuthToken = (): string | null => {
  return getToken();
};

// Helper function to set auth token in cookies
export const setAuthToken = (token: string): void => {
  console.log('setting token', token);
  cookieUtils.setAuthToken(token);
};

// Helper function to remove auth token from cookies
export const removeAuthToken = (): void => {
  cookieUtils.removeAuthToken();
};

// Create authenticated API configuration (for backward compatibility)
export const createAuthenticatedConfig = (): Configuration => {
  return createApiConfiguration();
};

// Export authenticated API instances (for backward compatibility)
export const getAuthenticatedAuthApi = (): AuthApi => {
  return new AuthApi(createAuthenticatedConfig());
};

export const getAuthenticatedHealthApi = (): HealthApi => {
  return new HealthApi(createAuthenticatedConfig());
};

export const getAuthenticatedMediaApi = (): MediaApi => {
  return new MediaApi(createAuthenticatedConfig());
};

export const getAuthenticatedUsersApi = (): UsersApi => {
  return new UsersApi(createAuthenticatedConfig());
};
