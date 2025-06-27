export enum RouteNames {
  // Slug routes
  HEALTH = 'health',
  AUTH = 'auth',
  API_DOCS = 'api',
  QUEUES_UI = 'queues',
  EMAIL = 'email',  
  MEDIA_UPLOAD = 'media-upload',
  HEALTH_UI = 'health-ui',

  // Named routes
  // --- AUTH ROUTES ---
  AUTH_LOGIN = 'login',
  AUTH_LOGOUT = 'logout',
  AUTH_VERIFY_OTP = 'verify-otp',
  AUTH_RESEND_OTP = 'resend-otp',
  AUTH_GOOGLE = 'google',
  AUTH_GOOGLE_REDIRECT = 'google/redirect',
  AUTH_LOGGED_IN_USER = 'logged-in-user',
  

  // --- EMAIL ROUTES ---
  EMAIL_SEND = 'send',

  // --- MEDIA UPLOAD ROUTES ---
  MEDIA_UPLOAD_UPLOAD = 'upload',
  MEDIA_UPLOAD_DELETE = 'delete',
  MEDIA_UPLOAD_LIST = 'list',
  MEDIA_UPLOAD_GET = 'get',
}
