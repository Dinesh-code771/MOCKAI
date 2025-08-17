# Google OAuth Integration Setup Guide

This guide explains how to set up Google OAuth authentication for the MockAI application.

## Overview

The MockAI application supports Google OAuth authentication alongside traditional email/password login. The integration is built using:

- **Backend**: NestJS with Passport.js and Google OAuth 2.0 strategy
- **Frontend**: Next.js with custom OAuth flow handling
- **Database**: User social accounts are stored in the database

## Backend Setup

### 1. Environment Variables

Add the following environment variables to your backend `.env` file:

```env
# Google OAuth Configuration
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_CALLBACK_URL=http://localhost:3001/v1/auth/google/redirect

# Frontend URL for redirects
FRONTEND_URL=http://localhost:3000
```

### 2. Google Cloud Console Setup

1. Go to the [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the Google+ API
4. Go to "Credentials" → "Create Credentials" → "OAuth 2.0 Client IDs"
5. Configure the OAuth consent screen
6. Set up the OAuth 2.0 client:
   - **Application type**: Web application
   - **Authorized redirect URIs**:
     - `http://localhost:3001/v1/auth/google/redirect` (for development)
     - `https://yourdomain.com/v1/auth/google/redirect` (for production)
7. Copy the Client ID and Client Secret to your environment variables

### 3. Backend Implementation

The backend implementation is already complete and includes:

- **Google Strategy** (`src/api/auth/strategies/social-auth/google/google.strategy.ts`)
- **Google Guard** (`src/api/auth/strategies/social-auth/google/google.guard.ts`)
- **Auth Controller** with Google OAuth endpoints
- **Database integration** for storing social accounts

#### Key Endpoints:

- `GET /v1/auth/google` - Initiates Google OAuth flow
- `GET /v1/auth/google/redirect` - Google OAuth callback handler

## Frontend Setup

### 1. Environment Variables

Add the following environment variable to your frontend `.env.local` file:

```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:3001
```

### 2. Frontend Implementation

The frontend implementation includes:

- **LoginClient Component** (`components/Login/LoginClient.tsx`) - Updated with Google OAuth button
- **Social Auth Pages**:
  - `/auth/social-auth` - Success page
  - `/auth/social-auth-failed` - Failure page
- **API Utilities** (`lib/api-utils.ts`) - Google OAuth initiation function

### 3. OAuth Flow

1. User clicks "Continue with Google" button
2. Frontend redirects to backend OAuth endpoint
3. Backend redirects to Google OAuth consent screen
4. User authorizes the application
5. Google redirects back to backend callback URL
6. Backend processes the OAuth response and creates/updates user
7. Backend redirects to frontend success/failure page
8. Frontend redirects user to appropriate dashboard

## Database Schema

The application stores social account information in the `user_social_accounts` table:

```sql
CREATE TABLE user_social_accounts (
  id SERIAL PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  provider_name VARCHAR(50) NOT NULL,
  provider_id VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id, provider_name)
);
```

## User Flow

### New User (First-time Google Login)

1. User clicks "Continue with Google"
2. Google OAuth flow completes
3. If user doesn't exist, they are redirected to `/auth/social-auth-failed`
4. User needs to register with email first, then link Google account

### Existing User (Google Login)

1. User clicks "Continue with Google"
2. Google OAuth flow completes
3. If user exists and has linked Google account, they are logged in
4. User is redirected to appropriate dashboard based on role

## Testing

### 1. Test Google OAuth Flow

1. Start the backend server: `npm run start:dev`
2. Start the frontend server: `npm run dev`
3. Navigate to `http://localhost:3000/auth/login`
4. Click the "Google" tab
5. Click "Continue with Google"
6. Complete the Google OAuth flow

### 2. Test with Demo User

You can also test the email login with demo credentials:

- Email: `student@example.com`
- Password: `password123`

## Troubleshooting

### Common Issues

1. **"Invalid redirect URI" error**

   - Ensure the redirect URI in Google Cloud Console matches your backend callback URL
   - Check that the `GOOGLE_CALLBACK_URL` environment variable is correct

2. **"Client ID not found" error**

   - Verify that `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET` are set correctly
   - Ensure the Google Cloud Console project is active

3. **"User not found" after OAuth**

   - The user must be registered in the system before linking Google account
   - Check the database for user existence

4. **CORS errors**
   - Ensure `FRONTEND_URL` is set correctly in backend environment
   - Check that CORS origins are configured properly

### Debug Mode

Enable debug logging by setting the log level in your backend:

```env
LOG_LEVEL=debug
```

## Security Considerations

1. **HTTPS in Production**: Always use HTTPS in production for OAuth flows
2. **State Parameter**: The implementation includes state parameter validation
3. **Token Storage**: JWT tokens are stored securely in HTTP-only cookies
4. **User Validation**: Users must exist in the system before OAuth linking

## Production Deployment

1. Update environment variables with production URLs
2. Configure Google Cloud Console with production redirect URIs
3. Ensure HTTPS is enabled
4. Set up proper CORS configuration
5. Configure database with production credentials

## API Reference

### Google OAuth Endpoints

- `GET /v1/auth/google` - Initiate Google OAuth
- `GET /v1/auth/google/redirect` - Google OAuth callback

### Frontend Routes

- `/auth/login` - Login page with Google OAuth option
- `/auth/social-auth` - OAuth success page
- `/auth/social-auth-failed` - OAuth failure page

## Support

For issues or questions about the Google OAuth integration, please refer to:

- Google OAuth 2.0 documentation
- NestJS Passport documentation
- Next.js authentication patterns
