// API Configuration
// In production, these would be environment variables

export const API_CONFIG = {
  POST_SERVICE: process.env.VITE_POST_SERVICE_URL || 'http://localhost:3001',
  COMMENT_SERVICE: process.env.VITE_COMMENT_SERVICE_URL || 'http://localhost:3002',
  USER_SERVICE: process.env.VITE_USER_SERVICE_URL || 'http://localhost:3003'
}

