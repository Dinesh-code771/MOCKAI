# Client SDK Integration Guide

This guide explains how to use the MockAI client SDK in your frontend application.

## Overview

The client SDK provides type-safe API calls to your backend services. It's automatically generated from your OpenAPI specification and includes:

- **AuthApi**: Authentication and user management
- **HealthApi**: Health checks and system status
- **MediaApi**: File upload and media management

## Setup

The SDK is already configured in your project. The main configuration files are:

- `lib/api-client.ts` - SDK configuration and instances
- `hooks/use-auth.ts` - Authentication hook
- `lib/api-utils.ts` - Utility functions for common operations

## Basic Usage

### 1. Authentication

Use the `useAuth` hook for authentication operations:

```tsx
import { useAuth } from '@/hooks/use-auth';

function LoginComponent() {
  const { login, verifyOtp, logout, isLoading, error, user } = useAuth();

  const handleLogin = async () => {
    const result = await login({
      email: 'user@example.com',
      password: 'password123'
    });

    if (result.success) {
      // Redirect to dashboard
      router.push('/dashboard');
    }
  };

  return (
    // Your login form
  );
}
```

### 2. Making API Calls

Use the utility functions for common operations:

```tsx
import { getCurrentUser, uploadMedia, checkApiHealth } from '@/lib/api-utils';

// Get current user
const userResult = await getCurrentUser();
if (userResult.success) {
  console.log('User:', userResult.data);
}

// Upload a file
const file = new File(['content'], 'test.txt', { type: 'text/plain' });
const uploadResult = await uploadMedia(file, 'document');
if (uploadResult.success) {
  console.log('Uploaded:', uploadResult.data);
}

// Check API health
const healthResult = await checkApiHealth();
if (healthResult.success) {
  console.log('API is healthy:', healthResult.data);
}
```

### 3. Direct SDK Usage

You can also use the SDK directly:

```tsx
import { authApi, getAuthenticatedAuthApi } from '@/lib/api-client';

// Public API call (no authentication required)
const healthCheck = await authApi.healthControllerCheck();

// Authenticated API call
const authenticatedApi = getAuthenticatedAuthApi();
const userProfile = await authenticatedApi.authControllerGetLoggedInUser();
```

## Available APIs

### AuthApi

- `authControllerLogin(loginDto)` - User login
- `authControllerVerifyOtp(otpDto)` - Verify OTP
- `authControllerResendOtp()` - Resend OTP
- `authControllerLogout()` - User logout
- `authControllerGetLoggedInUser()` - Get current user
- `authControllerAuthenticateWithGoogle()` - Google OAuth
- `authControllerGoogleAuthRedirect(state)` - Google OAuth redirect

### HealthApi

- `healthControllerCheck()` - Check API health

### MediaApi

- `mediaUploadControllerUploadMedia(file)` - Upload media
- `mediaUploadControllerListMedia(page, limit)` - List media
- `mediaUploadControllerGetMedia(id)` - Get specific media
- `mediaUploadControllerDeleteMedia(id)` - Delete media

## Error Handling

The SDK provides consistent error handling:

```tsx
try {
  const result = await someApiCall();
  // Handle success
} catch (error) {
  const errorMessage = handleApiError(error);
  console.error('API Error:', errorMessage);
}
```

## Environment Variables

Make sure to set the following environment variables:

```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:3001
```

## Authentication Flow

1. **Login**: User enters credentials → OTP sent to email
2. **OTP Verification**: User enters OTP → Access token received
3. **Token Storage**: Token stored in localStorage
4. **Authenticated Requests**: Token automatically included in headers

## Google OAuth

For Google OAuth, use the utility function:

```tsx
import { initiateGoogleLogin } from '@/lib/api-utils';

const handleGoogleLogin = () => {
  initiateGoogleLogin('/dashboard'); // Optional redirect URL
};
```

## TypeScript Support

The SDK includes full TypeScript support with generated types for all API responses and requests. This provides:

- Autocomplete for API methods
- Type checking for request/response data
- IntelliSense for all properties

## Examples

### Complete Login Flow

```tsx
import { useAuth } from '@/hooks/use-auth';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const { login, isLoading, error } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const result = await login({
      email: formData.email,
      password: formData.password,
    });

    if (result.success) {
      router.push('/dashboard');
    }
  };

  return (
    // Your login form
  );
}
```

### Protected Route Component

```tsx
import { useAuth } from '@/hooks/use-auth';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function ProtectedRoute({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/auth/login');
    }
  }, [isAuthenticated, isLoading, router]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!isAuthenticated) {
    return null;
  }

  return <>{children}</>;
}
```

## Troubleshooting

### Common Issues

1. **CORS Errors**: Ensure your backend allows requests from your frontend domain
2. **Authentication Errors**: Check that tokens are being stored and sent correctly
3. **Type Errors**: Make sure you're using the correct types from the SDK

### Debug Mode

Enable debug logging by setting:

```tsx
// In your component
console.log('Auth state:', { isAuthenticated, user, error });
```

## Migration from Manual API Calls

If you're migrating from manual fetch calls, replace:

```tsx
// Old way
const response = await fetch('/api/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ email, password }),
});

// New way
const result = await login({ email, password });
```

The SDK handles all the HTTP details, authentication headers, and response parsing automatically.
