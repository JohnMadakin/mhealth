import joi from 'joi';
import moment from 'moment';
import { ErrorResponse } from '../../utils';
import patients, { Patient } from '../patients/models/patients';
import { CustomError, NewPatient, PatientSicknessSymptomsData, PatientSicknessSymptomsDatum } from 'types';
import { validateSpec } from '../../utils';
import DiseaseSymptom from '../diseases/models/disease.symptom';
import Disease from '../diseases/models/disease';
import Symptom from '../diseases/models/symptoms';
import Medication from './model/medications';
import { NewMedication } from '../../types/';
import { addJobsToQueue } from '../queue/queue.service';


export const fetchMedications = async (authId: string): Promise<Patient> => {
  try {
    const patient = await patients.findOne({
      where: { authId, },
      attributes: [['id', 'patientId']],
      include: [{
        model: Medication
      }]
    });
    if(!patient) throw new Error('Patient details unavalable.');
    //TODO: send email
  
    return patient;
  } catch (error) {
    const e = error as CustomError;
    throw new ErrorResponse(e.message, 400);
  }
}

const medicationSpec = joi.object({
  description: joi.string().lowercase().required(),
  authId: joi.string().uuid().required(),
  name: joi.string().min(2).max(120).required(),
  dosage: joi.string().required(),
  frequency: joi.number().min(1).max(24),
  startTime: joi.date().required(),
});
export const addMedications = async (data: any): Promise<Patient> => {
  try {
    const params = validateSpec<NewMedication>(medicationSpec, data);

    const patient = await patients.findOne({
      where: { authId: params.authId, },
      attributes: ['id'],
    });
    if(!patient) throw new Error('Patient details unavalable.');

    const nextDose = moment(params.startTime).add(params.frequency, 'hours').toDate();

    //@ts-ignore
    const added = await patient.addMedication({
      ...params,
      nextDose,
    });

    await addJobsToQueue({
      worker: 'medicationReminder',
      delay: params.frequency * 60 * 60 * 1000,
      data: { medicationId: added.medications.id }
    });
    //TODO: add to queue
  
    return patient;
  } catch (error) {
    const e = error as CustomError;
    throw new ErrorResponse(e.message, 400);
  }
}
