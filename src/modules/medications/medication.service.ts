import joi from 'joi';
import moment from 'moment';
import { ErrorResponse } from '../../utils';
import patients, { Patient } from '../patients/models/patients';
import { CustomError } from 'types';
import { validateSpec } from '../../utils';
import Medication from './model/medications';
import { NewMedication } from '../../types/';
import { addJobsToQueue } from '../queue/queue.service';


export const fetchMedications = async (authId: string): Promise<Patient> => {
  try {
    const patient = await patients.findOne({
      where: { authId, },
      attributes: [['id', 'patientId']],
      include: [{
        model: Medication,
        as: 'meds',
        attributes: ['name', 'dosage', 'frequency', 'nextDose'],
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
  patientId: joi.string().uuid().required(),
  name: joi.string().min(2).max(120).required(),
  dosage: joi.string().required(),
  frequency: joi.number().min(1).max(24), //need to set min as 1 to prevent infinite loop
  startTime: joi.date().default(new Date()),
});
export const addMedications = async (data: any): Promise<Patient> => {
  try {
    const params = validateSpec<NewMedication>(medicationSpec, data);

    const patient = await patients.findOne({
      where: { id: params.patientId, },
      attributes: ['id'],
    });
    if(!patient) throw new Error('Patient details unavalable.');

    const nextDose = moment(params.startTime).add(params.frequency, 'hours').toDate();
    //@ts-ignore
    const added = await patient.createMed({
      patientId: params.patientId,
      name: params.name,
      dosage: params.dosage,
      frequency: params.frequency,
      startTime: params.startTime,
      nextDose,
    });

    await addJobsToQueue({
      worker: 'medicationReminder',
      delay: params.frequency * 60 * 60 * 1000,
      data: { medicationId: added.id }
    });
    //TODO: add to queue
  
    return patient;
  } catch (error) {
    const e = error as CustomError;
    throw new ErrorResponse(e.message, 400);
  }
}
