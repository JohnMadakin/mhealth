import { CustomHelpers } from 'joi';
import crypto from 'crypto';
import moment from 'moment';

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
