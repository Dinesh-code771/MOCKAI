# Google OAuth "Invalid Request" Error - Troubleshooting Guide

## Quick Fix Checklist

### 1. Check Environment Variables

First, verify that all required environment variables are set correctly in your backend `.env` file:

```env
# Required Google OAuth Variables
GOOGLE_CLIENT_ID=your_actual_client_id_here
GOOGLE_CLIENT_SECRET=your_actual_client_secret_here
GOOGLE_CALLBACK_URL=http://localhost:3001/v1/auth/google/redirect

# Required Frontend URL
FRONTEND_URL=http://localhost:3000

# Required Backend URL
BACKEND_URL=http://localhost:3001
```

### 2. Verify Google Cloud Console Configuration

1. **Go to Google Cloud Console**: https://console.cloud.google.com/
2. **Select your project**
3. **Navigate to**: APIs & Services → Credentials
4. **Find your OAuth 2.0 Client ID** and click on it
5. **Check the "Authorized redirect URIs"** section

**The redirect URI MUST EXACTLY match**:

```
http://localhost:3001/v1/auth/google/redirect
```

**Common mistakes to avoid**:

- ❌ `http://localhost:3001/v1/auth/google/redirect/` (trailing slash)
- ❌ `http://localhost:3001/v1/auth/google/redirect?` (trailing question mark)
- ❌ `https://localhost:3001/v1/auth/google/redirect` (https instead of http)
- ❌ `http://127.0.0.1:3001/v1/auth/google/redirect` (127.0.0.1 instead of localhost)

### 3. Test the Configuration

Run this command to test if your backend is properly configured:

```bash
# From the backend directory
cd mockAI/apps/backend
npm run start:dev
```

Then test the Google OAuth endpoint:

```bash
curl -I http://localhost:3001/v1/auth/google
```

You should see a redirect response (302 status code).

### 4. Check Backend Logs

When you click "Continue with Google", check your backend console for any error messages. Look for:

- Environment variable errors
- Google OAuth configuration errors
- Database connection issues

### 5. Verify Frontend Configuration

Check your frontend `.env.local` file:

```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:3001
```

### 6. Test the Complete Flow

1. **Start both servers**:

   ```bash
   # Terminal 1 - Backend
   cd mockAI/apps/backend
   npm run start:dev

   # Terminal 2 - Frontend
   cd mockAI/apps/frontend
   npm run dev
   ```

2. **Navigate to**: http://localhost:3000/auth/login
3. **Click the "Google" tab**
4. **Click "Continue with Google"**
5. **Check the URL** - it should redirect to Google's OAuth page

## Common Error Scenarios

### Scenario 1: "Invalid redirect URI" in Google Console

**Solution**: Update the redirect URI in Google Cloud Console to exactly match:

```
http://localhost:3001/v1/auth/google/redirect
```

### Scenario 2: Backend not starting due to missing environment variables

**Solution**: Add all required environment variables to your `.env` file

### Scenario 3: Frontend can't connect to backend

**Solution**: Verify `NEXT_PUBLIC_API_BASE_URL` is set correctly

### Scenario 4: CORS errors

**Solution**: Ensure `FRONTEND_URL` and `CORS_ORIGINS` are configured correctly

## Debug Mode

Enable debug logging in your backend by adding this to your `.env` file:

```env
LOG_LEVEL=debug
NODE_ENV=development
```

## Step-by-Step Verification

### Step 1: Verify Environment Variables

```bash
# Check if backend can read environment variables
cd mockAI/apps/backend
node -e "
console.log('GOOGLE_CLIENT_ID:', process.env.GOOGLE_CLIENT_ID ? 'SET' : 'MISSING');
console.log('GOOGLE_CLIENT_SECRET:', process.env.GOOGLE_CLIENT_SECRET ? 'SET' : 'MISSING');
console.log('GOOGLE_CALLBACK_URL:', process.env.GOOGLE_CALLBACK_URL);
console.log('FRONTEND_URL:', process.env.FRONTEND_URL);
"
```

### Step 2: Test Google OAuth Endpoint

```bash
# Test the Google OAuth initiation endpoint
curl -v http://localhost:3001/v1/auth/google
```

Expected response: 302 redirect to Google OAuth

### Step 3: Check Network Tab

1. Open browser developer tools
2. Go to Network tab
3. Click "Continue with Google"
4. Look for the request to `/v1/auth/google`
5. Check if it returns a 302 redirect

## Production Considerations

When deploying to production, update these URLs:

```env
# Production environment variables
GOOGLE_CALLBACK_URL=https://yourdomain.com/v1/auth/google/redirect
FRONTEND_URL=https://yourdomain.com
BACKEND_URL=https://yourdomain.com
```

And update Google Cloud Console with:

```
https://yourdomain.com/v1/auth/google/redirect
```

## Still Having Issues?

If you're still experiencing the "invalid request" error after following these steps:

1. **Double-check the redirect URI** - it must be exactly correct
2. **Verify your Google Cloud Console project is active**
3. **Ensure the OAuth consent screen is configured**
4. **Check that the Google+ API is enabled**
5. **Try creating a new OAuth 2.0 client ID**

## Support

If you continue to have issues, please provide:

- The exact error message
- Your environment variable configuration (without sensitive values)
- The redirect URI configured in Google Cloud Console
- Backend console logs when the error occurs
