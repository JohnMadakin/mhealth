export type Environment = 'development' | 'test' | 'production';

// Define your app configuration type
export interface AppConfig {
  port: number;
  queueUrl: string;
  secretKey: string | undefined;
  isWorker: string | null;
  usetwilioVerification: string | undefined;
  twiloAccount: string;
  twiloAuthToken: string;
  twiloPhoneNo: string;
  twiloVerificationId: string;
  googleClientSecret: string;
  googleClientId: string;
  jwtSecret: string;
  jwtVerifyOtpSecret: string;
  jwtRefreshSecret: string;
  jwtVerifyOtpExpiry: string;
  jwtTokenExpiry: string;
  jwtRefreshExpiry: string;
  fitbitAuthorizationURL: string;
  redisQueueUrl: string;
  jobRemovalTime: string;
  fitbitClientId: string;
  fitbitClientSecret: string;
  fitbitRedirectUrl: string;
  fitbitAPIUrl: string;
  environment: Environment;
  development: {
    dbUser: string;
    dbPass: string;
    dbName: string;
    dbHost: string;
  };
  test: {
    dbUser: string;
    dbPass: string;
    dbName: string;
    dbHost: string;
  };
  production: {
    dbUser: string;
    dbPass: string;
    dbName: string;
    dbHost: string;
  };
}