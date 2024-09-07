import Patient from '../patients/models/patients';
import { ErrorResponse } from '../../utils';
import Activity, { ActivityAttributes } from './models/activities';
import { CustomError } from 'types/error.type';
import Disease from '../diseases/models/disease';
import DiseaseSymptoms from '../diseases/models/disease.symptom';
import Symptom from '../diseases/models/symptoms';
// import diseaseSymptomRecommendation from '../patients/models/patients.disease.symptoms';

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

export const getRecommendedActivities = async (authId: string): Promise<Patient> => {
  try {
    console.log('🍅')
    const patient = await Patient.findOne({ 
      where: { authId },
      attributes: [['id', 'patientId']],
      include: [{
        model: DiseaseSymptoms,
        through: {
          attributes: []
        },
        include: [
          {
            model: Symptom,
          },
          {
            model: Disease,
            include: [
              {
                model: Activity
              }
            ]
          }
        ]
      }]
      // attributes: ['id']
    });
    if(!patient) throw new Error('invalid auth.');
    // console.log('🍊',precautions)
    // const precautions = await Activity.findAll();
    
    // if(!precautions.length) throw new Error('No activities found.');
  
    return patient;
  } catch (error) {
    const e = error as CustomError;
    throw new ErrorResponse(e.message, 400);
  }
};
