import joi from 'joi';
import ms from 'ms';
import crypto from 'crypto';
import { OAuth2Client } from 'google-auth-library';
import jwt from 'jsonwebtoken';
import { 
  NewUser, AuthGoogleLoginDto, NullableType,
  SocialInterface, CustomError, Authuser, 
  JWTUser
} from 'types';
import { ErrorResponse, ageValidator, validateSpec, randomStr } from '../../utils';
import authentication, { AuthAttributes } from './models/auth';
import { createNewPatientData } from '../patients/patients.service';
import { appConfig } from '../../config/app.config';
import sessionModel, { SessionAttributes } from './models/session';
import Patient from 'modules/patients/models/patients';

const spec = joi.object({
  firstname: joi.string().max(120).min(2).required(),
  lastname: joi.string().max(120).min(2).required(),
  email: joi.string().email().required(),
  password: joi.string().max(120).min(6).required(),
  sex: joi.string().valid('male', 'female').required(),
  dob: joi.date().max('now').custom(ageValidator).messages({
    'date.base': 'Date of birth must be a valid date',
    'date.max': 'Date of birth cannot be in the future',
    'any.required': 'Date of birth is required',
  }).required(),
});

export const patientSignUp = async (data: NewUser): Promise<null> => {
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

export async function verifySession(sessionId: number) {
  return sessionModel.findByPk(sessionId);
}

export async function verifyUser(authId: number) {
  return authentication.findByPk(authId, { include: Patient });
}

export const validateSocialLogin = async (socialData: SocialInterface): Promise<JWTUser> => {
  const socialEmail = socialData.email?.toLowerCase();
  const userByEmail: NullableType<AuthAttributes> = 
    await authentication.findOne({ where: { email: socialEmail, authType: 'google' }});

  if (!userByEmail) {
    throw new ErrorResponse('Kindly signup to continue.', 422);
  }


  const hash = crypto
    .createHash('sha256')
    .update(randomStr())
    .digest('hex');

  const session = await sessionModel.create({
    authId: userByEmail.id,
    hash,
  });

  const {
    token: jwtToken,
    refreshToken,
    tokenExpires,
  } = await getTokensData({
    id: session.authId,
    sessionId: session.id,
    hash,
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
  hash: SessionAttributes['hash'];
}) => {
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
        hash: data.hash,
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