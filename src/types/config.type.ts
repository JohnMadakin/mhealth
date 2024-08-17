export type Environment = 'development' | 'test' | 'production';

// Define your app configuration type
export interface AppConfig {
  port: number;
  queueUrl: string;
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