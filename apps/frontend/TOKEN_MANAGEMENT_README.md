# Token Management Implementation

This document describes the implementation of secure token management using cookies and automatic request interceptors.

## Overview

The application now uses a secure cookie-based token management system with automatic request interceptors to handle authentication tokens.

## Key Components

### 1. Cookie Utility (`lib/cookie-utils.ts`)

Manages authentication tokens in secure HTTP-only cookies:

```typescript
import { cookieUtils } from '@/lib/cookie-utils';

// Set token in secure cookie
cookieUtils.setAuthToken(token);

// Get token from cookie
const token = cookieUtils.getAuthToken();

// Remove token
cookieUtils.removeAuthToken();

// Check authentication status
const isAuth = cookieUtils.isAuthenticated();
```

**Security Features:**

- Secure cookies in production
- SameSite strict policy
- 15-day expiration
- HTTP-only cookies (set by backend)

### 2. API Client with Middleware (`lib/api-client.ts`)

Uses the SDK's middleware system to automatically:

- Add Authorization headers to requests
- Handle 401 errors and logout
- Clear cookies on authentication failures

```typescript
// All API calls automatically include auth token
const response = await usersApi.usersControllerGetUserProfile();

// No need to manually add headers - middleware handles it
```

### 3. Authentication Hook (`hooks/use-auth.ts`)

Updated to use cookie-based token management:

```typescript
const { login, verifyOtp, logout, isAuthenticated } = useAuth();

// Login automatically stores token in cookies
const result = await login(loginData);

// Logout clears cookies and auth state
await logout();
```

## Backend Integration

The backend already supports cookie-based authentication:

- Sets `sid` cookie on login/OTP verification
- Middleware automatically extracts token from cookies
- Handles token validation and user authentication

## Flow

1. **Login**: User submits credentials → Backend returns token → Frontend stores in secure cookie
2. **API Requests**: Middleware automatically adds `Authorization: Bearer <token>` header
3. **Token Expiry**: 401 response triggers automatic logout and redirect to login
4. **Logout**: Clears cookies and auth state

## Security Benefits

- **XSS Protection**: HTTP-only cookies prevent JavaScript access
- **CSRF Protection**: SameSite strict policy
- **Automatic Cleanup**: Failed auth attempts clear tokens
- **Secure Transport**: HTTPS-only in production

## Usage Examples

### Login Flow

```typescript
const { login } = useAuth();

const handleLogin = async (credentials) => {
  const result = await login(credentials);
  if (result.success) {
    // Token automatically stored in cookie
    // Redirect to dashboard
  }
};
```

### Protected API Calls

```typescript
// Token automatically included via middleware
const profile = await usersApi.usersControllerGetUserProfile();
const courses = await staticDataApi.staticDataControllerGetCourses();
```

### Logout

```typescript
const { logout } = useAuth();

const handleLogout = async () => {
  await logout(); // Clears cookies and auth state
  // Redirect to login
};
```

## Testing

Use the browser console to test cookie utilities:

```javascript
// Test cookie functions
window.testCookieUtils();
```

## Migration Notes

- Removed localStorage token storage
- Updated all auth functions to use cookies
- Backward compatibility maintained for existing API calls
- Server actions updated to use new cookie names

## Troubleshooting

1. **Token not being sent**: Check if cookie is set correctly
2. **401 errors**: Verify token expiration and backend validation
3. **CORS issues**: Ensure credentials are included in requests
4. **Cookie not persisting**: Check domain and path settings
