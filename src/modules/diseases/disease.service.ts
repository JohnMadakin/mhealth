import { ErrorResponse } from '../../utils';
import Disease, { DiseaseAttributes } from './models/disease';
import { CustomError } from 'types/error.type';

export const fetchDiseases = async (): Promise<DiseaseAttributes[]> => {
  try {
    const diseases = await Disease.findAll();
    
    if(!diseases.length) throw new Error('No diseases found.');
  
    return diseases;
  } catch (error) {
    const e = error as CustomError;
    throw new ErrorResponse(e.message, 400);
  }
};
