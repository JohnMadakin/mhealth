// import joi from 'joi';
import { ErrorResponse, validateSpec } from '../../utils';
import patients, { Patient } from './models/patients';
import { CustomError } from 'types/error.type';
import { NewPatient } from 'types/patient.type';

export const createNewPatientData = async (data: NewPatient): Promise<Patient> => {
  try {
    const newPatient = await patients.create({
      ...data,
      authType: 'password',
    });
    //TODO: send email
  
    return newPatient;
  } catch (error) {
    const e = error as CustomError;
    throw new ErrorResponse(e.message, 400);
  }
};