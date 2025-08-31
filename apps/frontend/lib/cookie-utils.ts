const cookieUtils = {
  getAuthToken: () => {
    if (typeof window === 'undefined') {
      // Server-side: return null as we handle this in server actions
      return null;
    }
    // Client-side: check for both possible cookie names
    const tokenCookie = document.cookie
      .split('; ')
      .find((row) => row.startsWith('sid='))
      ?.split('=')[1];

    const legacyTokenCookie = document.cookie
      .split('; ')
      .find((row) => row.startsWith('token='))
      ?.split('=')[1];

    return tokenCookie || legacyTokenCookie;
  },

  setAuthToken: (token: string) => {
    if (typeof window === 'undefined') {
      // Server-side: this should be handled by server actions
      return;
    }
    // Client-side: set cookie with proper attributes
    const isProduction = process.env.NODE_ENV === 'production';
    document.cookie = `sid=${token}; path=/; max-age=3600; ${
      isProduction ? 'secure; ' : ''
    }samesite=lax`;
  },

  removeAuthToken: () => {
    if (typeof window === 'undefined') {
      // Server-side: this should be handled by server actions
      return;
    }
    // Client-side: clear all possible auth cookies
    const isProduction = process.env.NODE_ENV === 'production';
    const cookieAttributes = `path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; ${
      isProduction ? 'secure; ' : ''
    }samesite=lax`;

    document.cookie = `sid=; ${cookieAttributes}`;
    document.cookie = `token=; ${cookieAttributes}`;
    document.cookie = `auth_token=; ${cookieAttributes}`;
    document.cookie = `user=; ${cookieAttributes}`;
  },

  clearAuthCookies: () => {
    if (typeof window === 'undefined') {
      // Server-side: this should be handled by server actions
      return;
    }
    // Client-side: clear all possible auth cookies
    const isProduction = process.env.NODE_ENV === 'production';
    const cookieAttributes = `path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; ${
      isProduction ? 'secure; ' : ''
    }samesite=lax`;

    document.cookie = `sid=; ${cookieAttributes}`;
    document.cookie = `token=; ${cookieAttributes}`;
    document.cookie = `auth_token=; ${cookieAttributes}`;
    document.cookie = `user=; ${cookieAttributes}`;
  },

  isAuthenticated: () => {
    if (typeof window === 'undefined') {
      // Server-side: this should be handled by server actions
      return false;
    }
    return !!cookieUtils.getAuthToken();
  },
};

export default cookieUtils;
