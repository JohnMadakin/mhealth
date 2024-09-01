import joi from 'joi';
import { ErrorResponse } from '../../utils';
import Disease, { DiseaseAttributes } from './models/disease';
import { CustomError } from 'types/error.type';
import { validateSpec } from '../../utils';
import Symptom, { SymptomAttributes } from './models/symptoms';
import { Includeable } from 'sequelize';

const spec = joi.object({
  include_symptoms: joi.string(),
});
export const fetchDiseases = async (data: any): Promise<DiseaseAttributes[]> => {
  try {
    const params = validateSpec<{ include_symptoms: string; }>(spec, data);
    const options: { include?: Includeable } = {};
    if(params.include_symptoms) {
      options.include = Symptom;
    }
    const diseases = await Disease.findAll(options);
    
    if(!diseases.length) throw new Error('No diseases found.');
  
    return diseases;
  } catch (error) {
    const e = error as CustomError;
    throw new ErrorResponse(e.message, 400);
  }
};

const syptomSpec = joi.object({
  description: joi.string().lowercase().required(),
  diseaseId: joi.number(),
});
export const createSymptom = async (data: any): Promise<SymptomAttributes> => {
  try {
    const params = validateSpec<{ description: string; diseaseId: number; }>(syptomSpec, data);
    const description = params.description.split(' ').join('_');
    const disease = await Disease.findOne({
      where: { id: params.diseaseId }
    });
    if(!disease) throw new Error('Invalid diseasId passed.');

    const foundSymptom = await Symptom.findOne({
      where: { description }
    });

    if(foundSymptom) throw new Error('symptom description already exists.');
    const symptom = await Symptom.create({ description, weight: 1 });
    // @ts-ignore
    await disease.addSymptoms(symptom);

    return symptom;
  } catch (error) {
    const e = error as CustomError;
    throw new ErrorResponse(e.message, 400);
  }
};
