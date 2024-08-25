import { parsePhoneNumberFromString, PhoneNumber } from 'libphonenumber-js';
import { CustomHelpers } from 'joi';
import crypto from 'crypto';
import moment from 'moment';
import { Twilio } from 'twilio';
import { appConfig } from '../config/app.config';

if(!appConfig.secretKey) throw new Error('You need to set app secretKey.');

process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
// Initialize Twilio client
const twilioClient = new Twilio(appConfig.twiloAccount, appConfig.twiloAuthToken);


export const ageValidator = (value: string, helpers: CustomHelpers) => {
  const today = moment();
  const dob = moment(value);
  const age = today.diff(dob, 'years');

  if (age < 18) {
    return helpers.message({ error: 'You must be at least 18 years old' });
  }

  return value;
}

export const randomStr = (l=15) => crypto.randomBytes(l).toString('hex');


/**
 * Validates a phone number with country code.
 * @param phoneNumber - The phone number to validate.
 * @returns A boolean indicating whether the phone number is valid or not.
 */
export const validatePhoneNumber = (phoneNumber: string, helpers: CustomHelpers) => {
  const parsedPhoneNumber: PhoneNumber | undefined = parsePhoneNumberFromString(phoneNumber);
  if (parsedPhoneNumber && parsedPhoneNumber.isValid() && parsedPhoneNumber.country) {
    return phoneNumber;
  } else {
    return helpers.error('any.invalid');
  }
}


/**
 * Hashes a string using SHA-256.
 * @param input - The string to hash.
 * @returns The SHA-256 hash of the input string in hexadecimal format.
 */
export function hashString(input: string): string {
  return crypto.createHash('sha256').update(input).digest('hex');
}

/**
 * Compares a plain string with a SHA-256 hash.
 * @param plainText - The plain string to compare.
 * @param hash - The SHA-256 hash to compare against.
 * @returns A boolean indicating if the plain string matches the hash.
 */
export function compareHash(plainText: string, hash: string): boolean {
  const hashedString = hashString(plainText);
  return hashedString === hash;
}

export const  generateOtp = () => (parseInt(crypto.randomBytes(6).toString('hex'), 16) + '').substring(0, 6);

export const sendTwiloOtp = async (phoneNO: string) => {
  twilioClient.verify.v2.services(appConfig.twiloVerificationId)
      .verifications
      .create({to: phoneNO, channel: 'sms'})
      .then(verification => console.log(verification.sid));
}
export const sendOtp = async (phoneNo: string, otp: string): Promise<null> => {  
  try {
    const message = await twilioClient.messages.create({
      body: `Your OTP is: ${otp}`,
      from: appConfig.twiloPhoneNo,
      to: phoneNo,
    });

    console.log(`OTP sent successfully: ${message.sid}`);
  } catch (error) {
    console.error('Failed to send OTP:', error);
  }
  return null;
}


/**
 * Encrypts a payload using AES-256-CBC.
 * @param payload - The payload to encrypt (can be a string).
 * @returns An object containing the IV and encrypted data in hexadecimal format.
 */
export function encrypt(payload: string, iv: string): string {
  const secretKey = appConfig.secretKey;
  if(!secretKey)  throw new Error('You need to set app secretKey.');

  const parseIv = iv.replace(/-/g, '');
  const ivHex = Buffer.from(parseIv, 'hex');
  const cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(secretKey, 'hex'), ivHex);
  let encrypted = cipher.update(payload, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  return encrypted;
}

/**
 * Decrypts an encrypted payload using AES-256-CBC.
 * @param encryptedData - The encrypted data in hexadecimal format.
 * @param iv - The initialization vector in hexadecimal format.
 * @param secretKey - A 32-byte (256-bit) secret key.
 * @returns The decrypted payload as a string.
 */
export function decrypt(encryptedData: string, iv: string): string {
  const secretKey = appConfig.secretKey;
  if(!secretKey)  throw new Error('You need to set app secretKey.');

  const parseIv = iv.replace(/-/g, '');
  const ivHex = Buffer.from(parseIv, 'hex');
  const decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(secretKey, 'hex'), ivHex);

  let decrypted = decipher.update(encryptedData, 'hex', 'utf8');
  decrypted += decipher.final('utf8');

  return decrypted;
}