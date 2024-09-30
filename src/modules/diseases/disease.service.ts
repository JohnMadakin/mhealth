import joi from 'joi';
import { ErrorResponse } from '../../utils';
import Disease, { DiseaseAttributes } from './models/disease';
import { CustomError } from 'types/error.type';
import { validateSpec } from '../../utils';
import Symptom, { SymptomAttributes } from './models/symptoms';
import { Includeable } from 'sequelize';
import TrackingData from './models/tracking.data';
import DiseaseTrackingData from './models/disease.trackingdata';
import PatientHistory from '../../modules/patients/models/patient.history';
import DiseaseSymptom from './models/disease.symptom';
import Patient from '../../modules/patients/models/patients';


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

export const getTrackingRecommendation = async (patientId: string): Promise<string[]> => {
  try {
    // const patientData = await Patient.findAll({
    //   // where: { id: patientId, },
    //   // raw: true,
    //   include: [{
    //     model: DiseaseSymptom,
    //     through: {
    //       attributes: []
    //     },
    //   }]
    // });

    // if(!patientData) throw new Error('No recommendation for this patient. Kindly add your health history.');
    // const pd = patientData?.toJSON();
    // //@ts-ignore
    // const symptomHistory = pd.diseaseSymptoms;
    // //@ts-ignore
    // const patientIllness = symptomHistory.map(p => p.diseaseId);

    // if(!patientIllness.length) throw new Error('No patient history found.');
    // const uniqueSet = [...new Set(patientIllness)];
    const recommendation = await DiseaseTrackingData.findAll({
      // where: {
      //   diseaseId: uniqueSet,
      // },
      raw: true,
      nest: true,
      include: [{
        model: TrackingData,
        attributes: ['id', 'trackingItem']
      }]
    });

    //@ts-ignore
    const recomList = recommendation.map(r => r['TrackingDatum']);
    //@ts-ignore
    return recommendation;
  } catch (error) {
    const e = error as CustomError;
    throw new ErrorResponse(e.message, 400);
  }
};


export const getTrackingRecommendations = async (patientId: string): Promise<string[]> => {
  try {
    const patientData = await Patient.findOne({
      where: { id: patientId, },
      // raw: true,
      include: [{
        model: DiseaseSymptom,
        through: {
          attributes: []
        },
      }]
    });

    if(!patientData) throw new Error('No recommendation for this patient. Kindly add your health history.');
    const pd = patientData?.toJSON();
    //@ts-ignore
    const symptomHistory = pd.diseaseSymptoms;
    //@ts-ignore
    const patientIllness = symptomHistory.map(p => p.diseaseId);

    if(!patientIllness.length) throw new Error('No patient history found.');
    const uniqueSet = [...new Set(patientIllness)];
    const recommendation = await DiseaseTrackingData.findAll({
      where: {
        diseaseId: uniqueSet,
      },
      raw: true,
      nest: true,
      include: [{
        model: TrackingData,
        attributes: ['id', 'trackingItem']
      }]
    });

    //@ts-ignore
    const recomList = recommendation.map(r => r['TrackingDatum']);

    return recomList;
  } catch (error) {
    const e = error as CustomError;
    throw new ErrorResponse(e.message, 400);
  }
};

