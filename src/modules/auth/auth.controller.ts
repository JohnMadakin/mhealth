import { FastifyRequest, FastifyReply, RouteHandlerMethod } from 'fastify';
import { CustomError } from '../../types/error.type';
import { NewUser } from '../../types/user.type';
import { 
  patientSignUp, getProfileByToken, 
  patientSignUpByPhone, createPin, verifyOtp,
  phoneLogin
 } from './auth.service';
import { ErrorResponse, SuccessResponse } from '../../utils/response';

export const signup: RouteHandlerMethod = async (req: FastifyRequest, reply: FastifyReply) => {
  try {
    if(!req.session) throw new Error('No session available.');
    const data = req.body as NewUser;

    const newUser = await patientSignUp({ ...data, authId: req.session.id });
    return reply.send(new SuccessResponse('User created.', newUser));
  } catch (error) {
    const e = error as CustomError;
    return reply.status(e.errorCode).send(new ErrorResponse(e.message, e.errorCode));
  }
};

export const signupPhone: RouteHandlerMethod = async (req: FastifyRequest, reply: FastifyReply) => {
  try {
    const result = await patientSignUpByPhone(req.body as { phoneNo: string });
    return reply.send(new SuccessResponse('Enter otp sent to complete registration.', result));
  } catch (error) {
    const e = error as CustomError;
    return reply.status(e.errorCode).send(new ErrorResponse(e.message, e.errorCode));
  }
};

export const loginPhone: RouteHandlerMethod = async (req: FastifyRequest, reply: FastifyReply) => {
  try {
    const result = await phoneLogin(req.body as { phoneNo: string; pin: string; });

    return reply.send(new SuccessResponse('Login successful.', result));
  } catch (error) {
    const e = error as CustomError;
    return reply.status(e.errorCode).send(new ErrorResponse(e.message, e.errorCode));
  }
};

export const verifySignupPhone: RouteHandlerMethod = async (req: FastifyRequest, reply: FastifyReply) => {
  try {
    const { otp, id } = req.body as { otp: string; id: string; };
    const testmode = req.headers.testmode as string;
    const result = await verifyOtp({ otp, id, testmode });
    return reply.send(new SuccessResponse('User successfully verified.', result));
  } catch (error) {
    const e = error as CustomError;
    return reply.status(e.errorCode).send(new ErrorResponse(e.message, e.errorCode));
  }
};

export const setPin: RouteHandlerMethod = async (req: FastifyRequest, reply: FastifyReply) => {
  try {
    if(!req.session) throw new Error('No session available.');
    const { pin } = req.body as { pin: string };
    await createPin({ pin, authId: req.session.id });
    return reply.send(new SuccessResponse('User pin successfully created.', null));
  } catch (error) {
    const e = error as CustomError;
    return reply.status(e.errorCode).send(new ErrorResponse(e.message, e.errorCode));
  }
};

export const socialSignup: RouteHandlerMethod = async (req: FastifyRequest, reply: FastifyReply) => {
  try {
    const newUser = await getProfileByToken(req.body as { idToken: string });
    return reply.send(new SuccessResponse('Login successful.', newUser));
  } catch (error) {
    const e = error as CustomError;
    return reply.status(e.errorCode).send(new ErrorResponse(e.message, e.errorCode));
  }
};
// export const googleCallback: RouteHandlerMethod = async (req: FastifyRequest, reply: FastifyReply) => {
//   try {
//     const newUser = await patientSignUp(req.body as NewUser);
//     return reply.send(new SuccessResponse('Verify email to complete registration.', newUser));
//   } catch (error) {
//     const e = error as CustomError;
//     return reply.status(e.errorCode).send(new ErrorResponse(e.message, e.errorCode));
//   }
// };
