import joi from 'joi';
import { NewUser } from 'types/user.type';
import { ErrorResponse, ageValidator, validateSpec } from '../../utils';
import authentication from './models/auth';
import { CustomError } from 'types/error.type';
import { createNewPatientData } from '../patients/patients.service';

const spec = joi.object({
  firstname: joi.string().max(120).min(2).required(),
  lastname: joi.string().max(120).min(2).required(),
  email: joi.string().email().required(),
  password: joi.string().max(120).min(6).required(),
  dob: joi.date().max('now').custom(ageValidator).messages({
    'date.base': 'Date of birth must be a valid date',
    'date.max': 'Date of birth cannot be in the future',
    'any.required': 'Date of birth is required',
  }).required(),
});

export const patientSignUp = async (data: NewUser): Promise<null> => {
  try {
    const params = validateSpec<NewUser>(spec, data);
    const auth = await authentication.findOne({
      where: {
        email: params.email,
      }
    });
    
    if(auth) throw new Error('Email already exists.');
  
    try {
      await authentication.create({
        ...params,
        authType: 'password',
      });
    } catch (error) {
      throw new Error('Email already exists.');
    }
    await createNewPatientData({
      firstname: params.firstname,
      lastname: params.lastname,
      dob: params.dob.toString(),
    });
    //TODO: send email
  
    return null;
  } catch (error) {
    const e = error as CustomError;
    throw new ErrorResponse(e.message, 400);
  }
};