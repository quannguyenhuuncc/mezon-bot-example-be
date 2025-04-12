import { registerAs } from '@nestjs/config';

export default registerAs('app', () => ({
  nodeEnv: process.env.NODE_ENV || 'development',
  port: parseInt(process.env.PORT || '3000', 10),
  apiPrefix: process.env.API_PREFIX || 'api',
  fallbackLanguage: process.env.FALLBACK_LANGUAGE || 'en',
  jwtSecret: process.env.JWT_SECRET || 'secret',
  jwtExpirationTime: parseInt(process.env.JWT_EXPIRATION_TIME || '3600', 10),
  throttleLimit: parseInt(process.env.THROTTLE_LIMIT || '100', 10),
  throttleTtl: parseInt(process.env.THROTTLE_TTL || '60', 10),
}));
