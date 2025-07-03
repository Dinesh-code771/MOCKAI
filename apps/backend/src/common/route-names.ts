export enum RouteNames {
  // Slug routes
  HEALTH = 'health',
  AUTH = 'auth',
  API_DOCS = 'api',
  QUEUES_UI = 'queues',
  EMAIL = 'email',
  MEDIA_UPLOAD = 'media-upload',
  HEALTH_UI = 'health-ui',
  STATIC_DATA = 'static-data',
  USERS = 'users',
  ASSESSMENTS = 'assessments',

  // Named routes
  // --- AUTH ROUTES ---
  AUTH_LOGIN = 'login',
  AUTH_LOGOUT = 'logout',
  AUTH_VERIFY_OTP = 'verify-otp',
  AUTH_RESEND_OTP = 'resend-otp',
  AUTH_FORGOT_PASSWORD = 'forgot-password',
  AUTH_VERIFY_FORGOT_PASSWORD_OTP = 'verify-forgot-password-otp',
  AUTH_RESET_PASSWORD = 'reset-password',
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

  // --- STATIC DATA ROUTES ---
  STATIC_DATA_COURSES = 'courses',

  // --- USERS ROUTES ---
  USERS_PROFILE = 'profile',

  // --- ASSESSMENTS ROUTES ---
  ASSESSMENTS_LIST = 'list',
  ASSESSMENTS_START = 'start',
  ASSESSMENTS_STORE_USER_ANSWERS = 'user-assessment/:userAssessmentId/question/:questionId',
  ASSESSMENTS_COMPLETE = 'user-assessment/:userAssessmentId/complete',
  ASSESSMENTS_GET_COMPLETE_DATA = 'user-assessment/:userAssessmentId/complete-data',
  ASSESSMENTS_USER_LIST = 'user-assessments',
}
