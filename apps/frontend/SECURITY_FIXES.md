# Security Fixes for Cookie Management

## Issue

JWT tokens were visible in browser developer tools on production (Railway), which is a security vulnerability.

## Root Cause

1. **Backend Cookie Configuration**: `sameSite: 'none'` in production was problematic
2. **Client-Side Cookie Setting**: Frontend was setting cookies that could override secure backend cookies
3. **Mixed Cookie Management**: Both client and server were trying to manage cookies

## Fixes Applied

### 1. Backend Cookie Service (`mockAI/apps/backend/src/common/services/cookie.service.ts`)

```typescript
// Before
sameSite: this.env === 'development' ? 'strict' : 'none',

// After
sameSite: this.env === 'development' ? 'strict' : 'lax',
```

**Why**: `sameSite: 'none'` requires `secure: true` but can still be problematic. `sameSite: 'lax'` is more secure and works better with modern browsers.

### 2. Removed Client-Side Cookie Setting

- Removed `setAuthToken` from `api-client.ts`
- Removed `setAuthToken` from `cookie-utils.ts`
- Updated `use-auth.ts` to not set cookies client-side

**Why**: Only the backend should set authentication cookies to ensure proper `httpOnly`, `secure`, and `sameSite` attributes.

### 3. Enhanced Server-Side Cookie Deletion

- Improved `logoutAction` with multiple deletion strategies
- Added proper error handling for cookie deletion
- Tries different cookie attributes to ensure deletion

## Security Benefits

1. **XSS Protection**: `httpOnly: true` prevents JavaScript access to tokens
2. **CSRF Protection**: `sameSite: 'lax'` provides CSRF protection
3. **Secure Transport**: `secure: true` ensures HTTPS-only transmission
4. **No Token Exposure**: Tokens are no longer visible in browser dev tools

## Deployment Requirements

### Railway Environment Variables

Ensure these are set in your Railway deployment:

```bash
NODE_ENV=production
DOMAIN=.up.railway.app  # or your custom domain
JWT_TOKEN_SECRET=your-secret-key
JWT_TOKEN_EXPIRY=2592000  # 30 days in seconds
```

### Frontend Environment Variables

```bash
NEXT_PUBLIC_API_BASE_URL=https://your-backend-url.railway.app
```

## Testing

### Verify Cookie Security

1. Login to your application
2. Open browser developer tools → Application → Cookies
3. Check that the `sid` cookie has:
   - ✅ HttpOnly: true
   - ✅ Secure: true (in production)
   - ✅ SameSite: Lax
   - ❌ Value should NOT be visible in the cookie list

### Test Logout

1. Click logout
2. Verify all auth cookies are cleared
3. Verify you're redirected to login page

## Migration Notes

- Existing users will need to re-login after deployment
- All client-side cookie setting has been removed
- Backend now exclusively manages authentication cookies
- Improved error handling for cookie operations

## Troubleshooting

### Cookies Still Visible

1. Clear browser cache and cookies
2. Ensure backend is deployed with new configuration
3. Check that `NODE_ENV=production` is set
4. Verify domain configuration is correct

### Logout Not Working

1. Check server-side cookie deletion in `logoutAction`
2. Verify cookie names match between frontend and backend
3. Check browser console for errors

### CORS Issues

1. Ensure `credentials: 'include'` is set in API client
2. Verify backend CORS configuration allows credentials
3. Check domain settings in cookie configuration
