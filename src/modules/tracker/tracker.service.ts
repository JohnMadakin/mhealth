import joi from 'joi';
import { ErrorResponse } from '../../utils';
import { CustomError } from 'types/error.type';
import { validateSpec } from '../../utils';
import Symptom from '../diseases/models/symptoms';
import SymptomLog, { SymptomLogAttributes } from './models/symptom.logs';
import Patient from '../../modules/patients/models/patients';
import { NewSymptomLog } from 'types';

const spec = joi.object({
  symptomId: joi.number(),
  description: joi.string().max(120),
  severity: joi.number().min(1).max(10),
  authId: joi.string().uuid(),
});
export const addSymptomLogs = async (data: any): Promise<SymptomLogAttributes> => {
  try {
    const params = validateSpec<NewSymptomLog>(spec, data);
    const [patient, symptom] = await Promise.all([
      Patient.findOne({ where: { authId: params.authId }}),
      Symptom.findByPk(params.symptomId),
    ])
    if(!patient) throw new Error('No patient found.');
    if(!symptom) throw new Error('invalid symptom id.');
  
    const symptomslog = await SymptomLog.create({
      symptomId: params.symptomId,
      description: params.description,
      patientId: patient.id,
      severity: params.severity,
      loggedAt: new Date(),
    });
    return symptomslog;
  } catch (error) {
    const e = error as CustomError;
    throw new ErrorResponse(e.message, 400);
  }
};
