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

  // Note: setAuthToken removed - cookies should only be set by backend for security
  // This prevents client-side XSS attacks and ensures proper httpOnly, secure settings

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

  // Comprehensive logout function for Railway deployment
  logout: () => {
    if (typeof window === 'undefined') {
      return;
    }

    const isProduction = process.env.NODE_ENV === 'production';
    const cookieNames = ['sid', 'token', 'auth_token', 'user'];

    // Try multiple domain configurations for Railway
    const domainConfigs = [
      '.up.railway.app',
      'up.railway.app',
      undefined, // no domain
    ];

    cookieNames.forEach((name) => {
      domainConfigs.forEach((domain) => {
        // Try with httpOnly: true
        let cookieString = `${name}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; samesite=lax`;
        if (isProduction) {
          cookieString += '; secure';
        }
        if (domain) {
          cookieString += `; domain=${domain}`;
        }
        document.cookie = cookieString;

        // Try with httpOnly: false (in case it was set that way)
        cookieString = `${name}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; samesite=lax`;
        if (isProduction) {
          cookieString += '; secure';
        }
        if (domain) {
          cookieString += `; domain=${domain}`;
        }
        document.cookie = cookieString;
      });
    });

    // Also try the legacy approach
    cookieUtils.clearAuthCookies();
  },

  isAuthenticated: () => {
    if (typeof window === 'undefined') {
      // Server-side: this should be handled by server actions
      return false;
    }
    return !!cookieUtils.getAuthToken();
  },
};

// Add global function for manual testing (only in browser)
if (typeof window !== 'undefined') {
  (window as any).clearAllCookies = () => {
    console.log('Clearing all auth cookies...');
    cookieUtils.logout();
    console.log('Cookies cleared. Please refresh the page.');
  };

  (window as any).checkCookies = () => {
    console.log('Current cookies:', document.cookie);
    console.log('Auth token:', cookieUtils.getAuthToken());
  };
}

export default cookieUtils;
