import { encrypt } from '../src/utils/helpers';
import { appConfig } from '../src/config/app.config';

describe('encrypt function', () => {
  const payload = 'testPayload';
  const iv = '1234567890abcdef1234567890abcdef';
  it('should encrypt the payload correctly with AES-256-CBC', () => {
    const result = encrypt(payload, iv);
    expect(typeof result).toBe('string');
    expect(result).not.toEqual(payload);
  });

  it('should throw an error if the secret key is not set', () => {
    // Temporarily unset the secret key
    const originalSecretKey = appConfig.secretKey;
    appConfig.secretKey = '';

    expect(() => encrypt(payload, iv)).toThrow('You need to set app secretKey.');
    appConfig.secretKey = originalSecretKey;
  });

  it('should throw an error if IV is not in hexadecimal format', () => {
    const invalidIv = 'invalidIVstring';
    expect(() => encrypt(payload, invalidIv)).toThrow(); 
  });
});
