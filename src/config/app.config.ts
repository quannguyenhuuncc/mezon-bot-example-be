import { registerAs } from '@nestjs/config';

export default registerAs('app', () => ({
  nodeEnv: process.env.NODE_ENV || 'development',
  port: parseInt(process.env.PORT || '3000', 10),
  apiPrefix: process.env.API_PREFIX || 'api',
  fallbackLanguage: process.env.FALLBACK_LANGUAGE || 'en',

  // JWT Configuration
  jwtSecret: process.env.JWT_SECRET || 'secret-key-change-in-production',
  jwtExpirationTime: parseInt(process.env.JWT_EXPIRATION_TIME || '3600', 10), // 1 hour in seconds
  jwtRefreshSecret:
    process.env.JWT_REFRESH_SECRET || 'refresh-secret-key-change-in-production',
  jwtRefreshExpirationTime: parseInt(
    process.env.JWT_REFRESH_EXPIRATION_TIME || '604800',
    10,
  ), // 7 days in seconds

  // Rate limiting
  throttleLimit: parseInt(process.env.THROTTLE_LIMIT || '100', 10),
  throttleTtl: parseInt(process.env.THROTTLE_TTL || '60', 10),

  // mezon
  mezonToken: process.env.MEZON_TOKEN || 'your-mezon-token',
}));
