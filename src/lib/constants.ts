/**
 * Application-wide constants and configuration
 * All values pulled from environment variables to avoid hardcoding
 */

// ✅ Get Admin Dashboard URL from .env
export const ADMIN_DASHBOARD_URL = 
  import.meta.env.VITE_ADMIN_DASHBOARD_URL || 'http://localhost:5173/admin'

// ✅ Get Saleor API URL
export const SALEOR_API_URL = 
  import.meta.env.VITE_SALEOR_API_URL || 'http://localhost:8000/graphql/'

// ✅ Get Saleor Dashboard URL
export const SALEOR_DASHBOARD_URL = 
  import.meta.env.VITE_SALEOR_DASHBOARD_URL || 'http://localhost:3001'

/**
 * Admin Permission Codes (from Saleor)
 * Add more as needed based on your Saleor setup
 */
export const ADMIN_PERMISSIONS = {
  MANAGE_PRODUCTS: 'manage_products',
  MANAGE_PAGES: 'manage_pages',
  MANAGE_STAFF: 'manage_staff',
  MANAGE_SETTINGS: 'manage_settings',
  MANAGE_DISCOUNTS: 'manage_discounts',
  MANAGE_ORDERS: 'manage_orders',
  MANAGE_APPS: 'manage_apps',
} as const

/**
 * Admin features that can be toggled per user role
 */
export const ADMIN_FEATURES = {
  CAROUSEL_EDITOR: 'carousel_editor',
  BEST_PRODUCTS_EDITOR: 'best_products_editor',
  PARTNERS_EDITOR: 'partners_editor',
  SITE_SETTINGS: 'site_settings',
  BLOG_MANAGEMENT: 'blog_management',
} as const

/**
 * API Endpoints (relative paths)
 */
export const API_ENDPOINTS = {
  LOGIN: '/auth/login',
  LOGOUT: '/auth/logout',
  REFRESH_TOKEN: '/auth/refresh',
  PRODUCTS: '/products',
  CATEGORIES: '/categories',
  ORDERS: '/orders',
} as const

/**
 * UI Configuration
 */
export const UI_CONFIG = {
  TOAST_DURATION: 3000,
  DEBOUNCE_DELAY: 300,
  CACHE_DURATION: 5 * 60 * 1000, // 5 minutes
} as const

/**
 * Local Storage Keys
 */
export const STORAGE_KEYS = {
  AUTH_TOKEN: 'saleor_token',
  REFRESH_TOKEN: 'saleor_refresh_token',
  USER_DATA: 'saleor_user',
  CAROUSEL_SETTINGS: 'carousel_settings',
  BEST_PRODUCTS: 'best_products',
  PARTNERS_DATA: 'partners_data',
} as const
