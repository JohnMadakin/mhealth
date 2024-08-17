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
};