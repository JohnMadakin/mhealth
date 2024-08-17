import { ErrorResponse } from '../../utils';
import Activity, { ActivityAttributes } from './models/activities';
import { CustomError } from 'types/error.type';

export const fetchActivities = async (): Promise<ActivityAttributes[]> => {
  try {
    const precautions = await Activity.findAll();
    
    if(!precautions.length) throw new Error('No activities found.');
  
    return precautions;
  } catch (error) {
    const e = error as CustomError;
    throw new ErrorResponse(e.message, 400);
  }
};
