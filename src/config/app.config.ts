import dotenv from 'dotenv';
import { AppConfig, Environment } from 'types/config.type';
dotenv.config();

function getEnvironment(): Environment {
  const env = process.env.NODE_ENV || 'development';
  return env as Environment;
}

export const appConfig: AppConfig = {
  port: Number(process.env.PORT) || 8000,
  environment: getEnvironment(),
  isWorker: process.env.IS_WORKER || null,
  usetwilioVerification: process.env.TWILIO_VERIFICATION,
  twiloAccount: process.env.TWILIO_ACCOUNT_ID || '',
  twiloVerificationId: process.env.TWILIO_VERIFICATION_ID || '',
  twiloAuthToken: process.env.TWILIO_AUTH_TOKEN || '',
  twiloPhoneNo: process.env.TWILIO_PHONE_NO || '+447572760334',
  redisQueueUrl: process.env.REDIS_QUEUE_URL || 'redis://localhost:6379',
  jobRemovalTime: process.env.QUEUE_JOB_REMOVAL_TIME || '1',
  fitbitClientId: process.env.FITBIT_CLIENT_ID || '',
  fitbitClientSecret: process.env.FITBIT_CLIENT_SECRET || '',
  fitbitAuthorizationURL: process.env.FITBIT_AUTHORIZE_URL || 'https://www.fitbit.com/oauth2/authorize',
  fitbitAPIUrl: process.env.FITBIT_API_URL || 'https://api.fitbit.com',
  fitbitRedirectUrl: process.env.FITBIT_REDIRECT_URI || 'http://localhost',
  development: {
    dbUser: process.env.DB_USER || 'default_user',
    dbPass: process.env.DB_PASSWORD || 'default_password',
    dbName: process.env.DB_NAME || 'default_database',
    dbHost: process.env.DB_HOST || '127.0.0.1',
  },
  test: {
    dbUser: process.env.DB_USER || 'default_user',
    dbPass: process.env.DB_PASSWORD || 'default_password',
    dbName: process.env.DB_NAME || 'default_database',
    dbHost: process.env.DB_HOST || '127.0.0.1',
  },
  production: {
    dbUser: process.env.DB_USER || 'default_user',
    dbPass: process.env.DB_PASSWORD || 'default_password',
    dbName: process.env.DB_NAME || 'default_database',
    dbHost: process.env.DB_HOST || '127.0.0.1',
  },
  queueUrl: process.env.REDIS_QUEUE_URL || '127.0.0.1/6379',
  googleClientId: process.env.GOOGLE_CLIENT_ID || '2weesew43w',
  googleClientSecret: process.env.GOOGLE_CLIENT_SECRET || 'jbjfsdhre',
  jwtSecret: process.env.JWT_SECRET || '23Vb!2Vd%',
  jwtVerifyOtpSecret: process.env.JWT_VERIFY_OTP_SECRET || '^p#23x+b!2Vd%',
  jwtTokenExpiry: process.env.JWT_SECRET_EXPIRY || '5h',
  jwtVerifyOtpExpiry: process.env.JWT_OTP_SECRET_EXPIRY || '0.3h',
  jwtRefreshSecret: process.env.JWT_REFRESH_SECRET || '179Vb!2Vd%',
  jwtRefreshExpiry: process.env.JWT_REFRESH_SECRET_EXPIRY || '5h',
  secretKey: process.env.SECRET_KEY,
};