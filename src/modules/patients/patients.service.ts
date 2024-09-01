import joi from 'joi';
import { ErrorResponse } from '../../utils';
import patients, { Patient } from './models/patients';
import { CustomError, NewPatient, PatientSicknessSymptomsData, PatientSicknessSymptomsDatum } from 'types';
import { validateSpec } from '../../utils';
import DiseaseSymptom from '../diseases/models/disease.symptom';
import Disease from '../diseases/models/disease';
import Symptom from '../diseases/models/symptoms';


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

export const updatePatientData = async (authId: string, data: NewPatient): Promise<Patient> => {
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

export const getPatientData = async (authId: string): Promise<Patient | null> => {
  try {
    return await patients.findOne({ where: { authId } });
    } catch (error) {
    const e = error as CustomError;
    throw new ErrorResponse(e.message, 400);
  }
};

export const getPatientSymptomsData = async (authId: string): Promise<Patient | null> => {
  try {
    const patientData = await patients.findOne({ 
      where: { authId },
      attributes: [['id', 'patientId']],
      include: [
        {
          model: DiseaseSymptom,
          through: {
            attributes: []
          },
          include: [
            {
              model: Disease,
              attributes: ['id', 'name'] // Include specific attributes from Disease
            },
            {
              model: Symptom,
              attributes: ['id', 'description'] // Include specific attributes from Symptom
            }
          ],
        }
      ]
    });
    if(!patientData) {
      throw new Error('Patient not found.'); 
    }
    //@ts-ignore
    return patientData.toJSON();
  } catch (error) {
    const e = error as CustomError;
    throw new ErrorResponse(e.message, 400);
  }
};

const spec = joi.object({
  authId: joi.string().uuid().required(),
  patientId: joi.string().uuid().required(),
  diseasesAndSymptoms: joi.array().items(joi.string()).unique().min(1).max(50).required(),
});
export const createPatientIllnessData = async (data: any): Promise<Patient> => {
  try {
      const params = validateSpec<PatientSicknessSymptomsData>(spec, data);
      const [patient, diseaseSymptoms] =  await Promise.all([
        patients.findOne({ 
          where: { 
          authId: params.authId, id: params.patientId } 
        }),
        DiseaseSymptom.findAll({
          where: {
            id: params.diseasesAndSymptoms,
          }
        }),
      ]);

      if(!patient) throw new Error('Invalid patientId entered.');
      if(!diseaseSymptoms.length) throw new Error('No valid disease symptoms id passed');
      if(diseaseSymptoms.length !== params.diseasesAndSymptoms.length) {
        const diseaseSymptomsMap: Map<string, boolean> = convertArrayToMap(diseaseSymptoms);
        params.diseasesAndSymptoms.forEach((item: string) => {
          if(!diseaseSymptomsMap.has(item)) {
            throw new Error(`${item} cannot be found.`);
          }
        });
      }

      
      console.log('🍐',diseaseSymptoms);
      // @ts-ignore
      const result = await patient.addDiseaseSymptoms(diseaseSymptoms);
      return result;
    } catch (error) {
    const e = error as CustomError;
    throw new ErrorResponse(e.message, 400);
  }
};

function convertArrayToMap(arr: DiseaseSymptom[]): Map<string, boolean> {
  const result = new Map();
  arr.forEach((item: DiseaseSymptom) => {
    result.set(item.id, true);
  });
  return result;
}
