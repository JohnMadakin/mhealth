import joiBase from 'joi';
import JoiDate from '@joi/date';
import ms from 'ms';
import { OAuth2Client } from 'google-auth-library';
import jwt from 'jsonwebtoken';
import { 
  NewUser, AuthGoogleLoginDto, NullableType,
  SocialInterface, CustomError, Authuser, 
  JWTUser, CreatePin, TokenData,
  PhoneLogin
} from 'types';
import { 
  ErrorResponse, ageValidator, validateSpec, 
  validatePhoneNumber, compareHash, generateOtp,
  sendOtp, sendTwiloOtp, formatDateToYearMonthDay
} from '../../utils';
import authentication, { AuthAttributes } from './models/auth';
import otpCredModel from './models/otp';
import { createNewPatientData } from '../patients/patients.service';
import { appConfig } from '../../config/app.config';
import sessionModel, { SessionAttributes } from './models/session';
import Patient from '../patients/models/patients';

const joi = joiBase.extend(JoiDate);
const spec = joi.object({
  firstname: joi.string().max(120).min(2).required(),
  lastname: joi.string().max(120).min(2).required(),
  healthProvider: joi.string(),
  height: joi.string(),
  weight: joi.string(),
  bloodGroup: joi.string(),
  priorSurgeries: joi.array().items(joi.string()),
  allergies: joi.array().items(joi.string()),
  emergencyContact: joi.object({
    name: joi.string(),
    phoneNo: joi.string(),
    address: joi.string(),
  }),
  sex: joi.string().valid('male', 'female', 'prefer not to say').required(),
  authId: joi.string().uuid().required(),
  dob: joi.date().format('DD/MM/YYYY').max('now').custom(ageValidator).messages({
    'date.base': 'Date of birth must be a valid date',
    'date.max': 'Date of birth cannot be in the future',
    'any.required': 'Date of birth is required',
  }).required(),
});

export const patientSignUp = async (data: NewUser): Promise<Patient> => {
  try {
    const { authId, ...params } = validateSpec<NewUser>(spec, data);

    let patient = await Patient.findOne({
      where: {
        authId,
      }
    });
    if(!authId) throw new Error('AuthId is required.');
    if(patient) throw new Error('User already registered.');
    let alergies = '';
    let priorSurgeries = '';

    if(params.allergies?.length) {
      alergies = params.allergies.join(',');
    }

    if(params.priorSurgeries?.length) {
      priorSurgeries = params.priorSurgeries.join(',');
    }

    const result = await createNewPatientData(authId, {
      ...params,
      alergies,
      priorSurgeries,
    });
    //TODO: send email
  
    return result;
  } catch (error) {
    const e = error as CustomError;
    throw new ErrorResponse(e.message, 400);
  }
};

const specPhone = joi.object({
  phoneNo: joi.string().custom(validatePhoneNumber).messages({
    'any.invalid': 'Invalid phone number format or country code.' 
  }).required(),
});

export const patientSignUpByPhone = async (data: { phoneNo: string }): Promise<{ id: string; }> => {
  try {
    const EXPIRY = 30;
    const params = validateSpec<{ phoneNo: string }>(specPhone, data);
    let auth = await authentication.findOne({
      where: {
        phone: params.phoneNo,
      }
    });

    if(auth?.isVerified) {
      throw new Error('Phone number already exists.');
    }

    if(!auth ) {
      try {
        auth = await authentication.create({
          phone: params.phoneNo,
          authType: 'pin',
        }, { raw: true });
      } catch (error) {
        throw new Error('conflicts: Phone number already exists.');
      }
    }
   
    if(appConfig.usetwilioVerification) {
      sendTwiloOtp(params.phoneNo);
    }else{
      const generatedOtp = generateOtp();
      //TODO: send text
      sendOtp(params.phoneNo, generatedOtp);
      await otpCredModel.create({
        authId: auth.id,
        otp: generatedOtp,
        expiry: Date.now() + EXPIRY * 60 * 1000,
      })
    }
   

    const session = await createSession(auth.id)

    return { id: session.sessionId };
  } catch (error) {
    const e = error as CustomError;
    throw new ErrorResponse(e.message, 400);
  }
};
const otpSpec = joi.object({
  otp: joi.string().length(6).required(),
  id: joi.string().uuid().required(),
  testmode: joi.string(),
});

export const verifyOtp = async (data: { otp: string; id: string; testmode?: string; }): Promise<{ token: string; tokenExpires: number; }> => {
  try {
    const MAX_VERIFY_LIMIT = 3;
    const params = validateSpec<{ otp: string; id: string; testmode: string;  }>(otpSpec, data);
   
    const session = await sessionModel.findOne({ where: { id: params.id }});
    if(!session) throw new Error('invalid session.');
    const otpcred = await otpCredModel.findOne({ where: { authId: session.authId }});
    if(!otpcred) throw new Error('Otp not available.');
    if(Date.now() > otpcred.expiry) throw new Error('otp expired.');

    let isValidOtp = false;
    if(appConfig.environment !== 'production' && params.testmode) {
      if(params.otp === '123456') isValidOtp = true;
    } else {
       isValidOtp = compareHash(params.otp, otpcred.otp);
    }

    if(!isValidOtp) {
      const affectedRow = await otpcred.increment('failedCount');
      if(affectedRow.failedCount >= MAX_VERIFY_LIMIT) {
        await session.destroy();
        await otpcred.destroy();
        throw new Error('failed otp count exceeded.');
      }
      throw new Error('Invalid otp entered.');
      // check if the count is more than the max and delete
    }
    
    await authentication.update({ isVerified: true }, { where: { id: session.authId }})
    const newSession = await sessionModel.create({ authId: session.authId });
    const tokens = await getTokensDataForOtpVerification({
      id: newSession.authId,
      sessionId: newSession.id,
    });
    // await session.destroy();
    //TODO: send text
  
    return tokens;
  } catch (error) {
    const e = error as CustomError;
    throw new ErrorResponse(e.message, 400);
  }
};

const pinSpec = joi.object({
  pin: joi.string().length(6).required(),
  authId: joi.string().required(),
});

export const createPin = async (data: CreatePin): Promise<null> => {
  try {
    const params = validateSpec<CreatePin>(pinSpec, data);
    const auth = await authentication.findByPk(params.authId);
    
    if(!auth) throw new Error('User does not exists.');
  
    const updatedAuth = await auth.update({
      pin: params.pin,
    });
    // const session = await createSession(updatedAuth.id);
    // const tokens = getTokensData({
    //   id: updatedAuth.id,
    //   sessionId: session.sessionId,
    // })
  
    return null;
  } catch (error) {
    const e = error as CustomError;
    throw new ErrorResponse(e.message, 400);
  }
};
const loginSpec = joi.object({
  pin: joi.string().length(6).required(),
  phoneNo: joi.string().custom(validatePhoneNumber).messages({
    'any.invalid': 'Invalid phone number format or country code.' 
  }).required(),
});

export const phoneLogin = async (data: PhoneLogin): Promise<TokenData> => {
  try {
    const params = validateSpec<PhoneLogin>(loginSpec, data);
    const auth = await authentication.findOne({ where: { phone: params.phoneNo }});
    
    if(!auth) throw new Error('User does not exists.');

    const isValidPin = await auth.validatePin(params.pin);
    if(!isValidPin) throw new Error('invalid pin entered');

    const session = await createSession(auth.id);
    const tokens = getTokensData({
      id: auth.id,
      sessionId: session.sessionId,
    })
  
    return tokens;
  } catch (error) {
    const e = error as CustomError;
    throw new ErrorResponse(e.message, 400);
  }
};

const createSession = async (authId: string): Promise<{ sessionId: string; }> => {
  const session = await sessionModel.create({
    authId,
  });
  return { sessionId: session.id };
}
export const socialLogin = async (data: NewUser): Promise<null> => {
  try {
    const params = validateSpec<NewUser>(spec, data);
    let auth = await authentication.findOne({
      where: {
        email: params.email,
      }
    });
    
    if(auth) throw new Error('Email already exists.');
  
    try {
      auth = await authentication.create({
        ...params,
        authType: 'password',
      });
    } catch (error) {
      throw new Error('Email already exists.');
    }
    await createNewPatientData(auth.id, {
      firstname: params.firstname,
      lastname: params.lastname,
      dob: params.dob.toString(),
      sex: params.sex,
    });
    //TODO: send email
  
    return null;
  } catch (error) {
    const e = error as CustomError;
    throw new ErrorResponse(e.message, 400);
  }
};

const socialloginSpec = joi.object({
  idToken: joi.string().required(),
});
export async function getProfileByToken(data: AuthGoogleLoginDto): Promise<JWTUser> {
  try {
    const params = validateSpec<AuthGoogleLoginDto>(socialloginSpec, data);
    const oauth = new OAuth2Client(
      appConfig.googleClientId,
      appConfig.googleClientSecret,
    );

    const ticket = await oauth.verifyIdToken({
      idToken: params.idToken,
      audience: [
        appConfig.googleClientId,
      ],
    });
  
    const payload = ticket.getPayload();
  
    if (!payload) throw new ErrorResponse('Invalid token.', 403);
  
    return await validateSocialLogin({
      id: payload.sub,
      email: payload.email,
      firstName: payload.given_name,
      lastName: payload.family_name,
    });
  } catch (error) {
    const e = error as CustomError;
    throw new ErrorResponse(e.message, e.errorCode || 400);
  }
}

export async function verifySession(sessionId: string) {
  return sessionModel.findByPk(sessionId, { raw: true });
}

export async function verifyUser(authId: string) {
  return authentication.findByPk(authId, { include: Patient, raw: true, nest: true });
}

export const validateSocialLogin = async (socialData: SocialInterface): Promise<JWTUser> => {
  const socialEmail = socialData.email?.toLowerCase();
  const userByEmail: NullableType<AuthAttributes> = 
    await authentication.findOne({ where: { email: socialEmail, authType: 'google' }});

  if (!userByEmail) {
    throw new ErrorResponse('Kindly signup to continue.', 422);
  }


  const session = await createSession(userByEmail.id)

  const {
    token: jwtToken,
    refreshToken,
    tokenExpires,
  } = await getTokensData({
    id: userByEmail.id,
    sessionId: session.sessionId,
  });

  return {
    refreshToken,
    token: jwtToken,
    tokenExpires,
  };
}

export const getTokensData = async (data: {
  id: AuthAttributes['id'];
  sessionId: SessionAttributes['id'];
}): Promise<TokenData> => {
  const tokenExpires =  Date.now() + ms(appConfig.jwtTokenExpiry);
  const [token, refreshToken] = await Promise.all([
     jwt.sign(
      {
        id: data.id,
        sessionId: data.sessionId,
      },
      appConfig.jwtSecret,
      {
        expiresIn:tokenExpires,
      },
    ),
     jwt.sign(
      {
        sessionId: data.sessionId,
      },
      appConfig.jwtRefreshSecret,
      {
        expiresIn: Date.now() + ms(appConfig.jwtRefreshExpiry),
      },
    ),
  ]);

  return {
    token,
    refreshToken,
    tokenExpires,
  };
}

export const getTokensDataForOtpVerification = async (data: {
  id: AuthAttributes['id'];
  sessionId: SessionAttributes['id'];
}): Promise<{ token: string, tokenExpires: number; }> => {
  const tokenExpires =  Date.now() + ms(appConfig.jwtVerifyOtpExpiry);
  const token = await
     jwt.sign(
      {
        id: data.id,
        sessionId: data.sessionId,
      },
      appConfig.jwtVerifyOtpSecret,
      {
        expiresIn: tokenExpires,
      },
    );

  return {
    token,
    tokenExpires,
  };
}