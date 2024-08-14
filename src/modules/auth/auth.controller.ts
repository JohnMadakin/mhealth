import { FastifyRequest, FastifyReply, RouteHandlerMethod } from 'fastify';
import { CustomError } from '../../types/error.type';
import { NewUser } from '../../types/user.type';
import { patientSignUp } from './auth.service';
import { ErrorResponse, SuccessResponse } from '../../utils/response';

export const signup: RouteHandlerMethod = async (req: FastifyRequest, reply: FastifyReply) => {
  try {
    const newUser = await patientSignUp(req.body as NewUser);
    return reply.send(new SuccessResponse('Verify email to complete registration.', newUser));
  } catch (error) {
    const e = error as CustomError;
    return reply.status(e.errorCode).send(new ErrorResponse(e.message, e.errorCode));
  }
};
