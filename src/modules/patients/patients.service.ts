import { ErrorResponse } from '../../utils';
import patients, { Patient } from './models/patients';
import { CustomError, NewPatient } from 'types';

export const createNewPatientData = async (authId: string, data: NewPatient): Promise<Patient> => {
  try {
    const newPatient = await patients.create({
      authId,
      ...data,
    });
    //TODO: send email
  
    return newPatient;
  } catch (error) {
    const e = error as CustomError;
    throw new ErrorResponse(e.message, 400);
  }
};

export const updatePatientData = async (authId: number, data: NewPatient): Promise<Patient> => {
  try {
    const [_, affectedPatients] = await patients.update({
      ...data
    }, { where: { authId }, returning: true });
  
    return affectedPatients[0];
  } catch (error) {
    const e = error as CustomError;
    throw new ErrorResponse(e.message, 400);
  }
};

