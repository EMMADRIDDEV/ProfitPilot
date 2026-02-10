// Type definitions and constants for authentication
// This file can be imported in components for type safety

export interface AuthResponse {
  success: boolean
  message?: string
  error?: string
  code?: string
  email?: string
  userId?: string
  redirectUrl?: string
  requiresVerification?: boolean
  requiresSetup?: boolean
}

export interface User {
  id: string
  email: string
  full_name: string
  email_verified: boolean
  created_at: string
  updated_at?: string
}

export interface Session {
  id: string
  user_id: string
  session_token: string
  expires_at: string
  created_at: string
}

export interface EmailVerificationCode {
  id: string
  user_id: string
  code: string
  expires_at: string
  used_at: string | null
  created_at: string
}

export interface Business {
  id: string
  user_id: string
  business_name: string
  business_email: string
  business_phone: string
  business_address: string
  business_type: string
  created_at: string
  updated_at: string
}

// Auth Constants
export const AUTH_CONSTANTS = {
  PASSWORD_MIN_LENGTH: 8,
  PASSWORD_MAX_LENGTH: 128,
  VERIFICATION_CODE_EXPIRY_HOURS: 24,
  SESSION_DURATION_DAYS: 30,
  MAX_LOGIN_ATTEMPTS: 5,
  LOGIN_ATTEMPT_WINDOW_MINUTES: 15,
  EMAIL_REGEX: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  ROUTES: {
    PUBLIC: ['/', '/login', '/register', '/get-access-code', '/verify-email'],
    PROTECTED: ['/dashboard', '/dashboard/setup'],
    AUTH: ['/login', '/register', '/verify-email'],
  },
}

// Error Messages
export const ERROR_MESSAGES = {
  INVALID_EMAIL: 'Please enter a valid email address',
  PASSWORD_TOO_SHORT: 'Password must be at least 8 characters long',
  PASSWORD_MISMATCH: 'Passwords do not match',
  EMAIL_ALREADY_EXISTS: 'User with this email already exists',
  INVALID_CREDENTIALS: 'Invalid email or password',
  EMAIL_NOT_VERIFIED: 'Please verify your email before logging in',
  INVALID_CODE: 'Invalid verification code',
  CODE_EXPIRED: 'Verification code has expired',
  CODE_ALREADY_USED: 'This verification code has already been used',
  USER_NOT_FOUND: 'User not found',
  SESSION_EXPIRED: 'Your session has expired. Please login again',
  SOMETHING_WENT_WRONG: 'An unexpected error occurred. Please try again.',
}

// Success Messages
export const SUCCESS_MESSAGES = {
  REGISTRATION_SUCCESS: 'Registration successful! Please check your email for verification code.',
  EMAIL_VERIFIED: 'Email verified successfully!',
  LOGIN_SUCCESS: 'Login successful!',
  LOGOUT_SUCCESS: 'You have been logged out.',
  CODE_RESENT: 'Verification code sent to your email!',
}

// Routes
export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  VERIFY_EMAIL: '/verify-email',
  DASHBOARD: '/dashboard',
  DASHBOARD_SETUP: '/dashboard/setup',
  GET_ACCESS_CODE: '/get-access-code',
  LOGOUT: '/api/auth/logout',
}

// Email Configuration
export const EMAIL_CONFIG = {
  SENDER_NAME: 'ProfitPilot',
  SENDER_EMAIL: process.env.EMAIL_FROM || 'noreply@profitpilot.com',
  VERIFICATION_SUBJECT: 'Verify your ProfitPilot email address',
  PASSWORD_RESET_SUBJECT: 'Reset your ProfitPilot password',
}

// Cookie Configuration
export const COOKIE_CONFIG = {
  SESSION_TOKEN: 'session_token',
  USER_ID: 'user_id',
  MAX_AGE: 30 * 24 * 60 * 60, // 30 days in seconds
  SECURE: process.env.NODE_ENV === 'production',
  HTTP_ONLY: true,
  SAME_SITE: 'lax' as const,
}

// API Response Status Codes
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  INTERNAL_SERVER_ERROR: 500,
  SERVICE_UNAVAILABLE: 503,
}

// OAuth Providers
export const OAUTH_PROVIDERS = {
  GOOGLE: 'google',
  GITHUB: 'github',
  DISCORD: 'discord',
}

export type OAuthProvider = typeof OAUTH_PROVIDERS[keyof typeof OAUTH_PROVIDERS]
