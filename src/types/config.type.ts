export type Environment = 'development' | 'test' | 'production';

// Define your app configuration type
export interface AppConfig {
  port: number;
  queueUrl: string;
  secretKey: string | undefined;
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