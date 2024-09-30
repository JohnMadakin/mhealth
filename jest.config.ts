import type { Config } from 'jest';

export default async (): Promise<Config> => {
  return {
    moduleFileExtensions: ['js', 'json', 'ts'],
    testRegex: '.*\\.spec\\.ts$',
    transform: {
      '^.+\\.(t|j)s$': 'ts-jest',
    },
    globalSetup: './jestGlobalSetup.ts',
    globalTeardown: './jestGlobalTeardown.ts',
    testTimeout: 10000,
    collectCoverageFrom: [
      'src/**/*.ts',
      '!src/**/*.spec.ts',
      '!src/server.ts',
      '!src/config/*.ts',
    ],
    testEnvironment: 'node',
  };
};
