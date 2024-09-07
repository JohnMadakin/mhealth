import axios from 'axios';
import crypto from 'crypto';
import joi from 'joi';
import { appConfig } from '../../config/app.config';
import { ErrorResponse } from '../../utils';
import { CustomError } from 'types';
import Patient from '../../modules/patients/models/patients';
import FitnessTrackerAuth from './models/fitnessTrackerAuth';
import { validateSpec } from '../../utils';


const spec = joi.object({
  verificationCode: joi.string().required(),
  authorizationCode: joi.string().required(),
  authId: joi.string().required(),
});
export async function getFitbitAccessToken(data: any): Promise<null> {
  try {
    const params = validateSpec<{ 
      verificationCode: string; 
      authorizationCode: string; 
      authId: string; 
    }>(spec, data);
    const patient = await Patient.findOne({
      where: {
        authId: params.authId,
      },
      attributes: ['id'],
    });

    if(!patient) throw new Error('Invalid auth.');
    const auth = await FitnessTrackerAuth.findOne({
      where: {
        patientId: patient.id,
        verificationCode: params.verificationCode,
      }
    });

    if(!auth) throw new Error('Invalid verification code.');

    const response = await axios.post(`${appConfig.fitbitAPIUrl}/oauth2/token`, null, {
      params: {
        client_id: appConfig.fitbitClientId,
        grant_type: 'authorization_code',
        redirect_uri: appConfig.fitbitRedirectUrl,
        code: params.verificationCode,
      },
      headers: {
        Authorization: `Basic ${Buffer.from(
          `${appConfig.fitbitClientId}:${appConfig.fitbitClientSecret}`
        ).toString('base64')}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });
    
    auth.token = response.data.access_token;
    auth.refreshToken = response.data.refresh_token;
    auth.expiry = Date.now() + response.data.expires_in;
    await auth.save();
    return null;
  } catch (error) {
    const e = error as CustomError;
    throw new ErrorResponse(e.message, 400);
  }
} 

export async function getFitbitAuthorizationPage(authId: string): 
  Promise<{ authorizationUrl: string }> {
  try {
    const patient = await Patient.findOne({ where: { authId }});
    if(!patient) throw new Error('No patient data found.');
    const code = crypto.randomBytes(16).toString('hex') + "-v3k"
    const trackerAuth = await FitnessTrackerAuth.findOrCreate({ 
      where: { patientId: patient.id },
      defaults: { patientId: patient.id, verificationCode: code }
    });
 
    return {
      authorizationUrl: `${appConfig.fitbitAPIUrl}/oauth2/authorize?response_type=code&client_id=${appConfig.fitbitClientId}&scope=activity+cardio_fitness+electrocardiogram+heartrate+irregular_rhythm_notifications+location+nutrition+oxygen_saturation+profile+respiratory_rate+settings+sleep+social+temperature+weight&state=${trackerAuth[0].verificationCode}&redirect_uri=${appConfig.fitbitRedirectUrl}`,
    };
  } catch (error) {
    const e = error as CustomError;
    throw new ErrorResponse(e.message, 400);
  }
} 