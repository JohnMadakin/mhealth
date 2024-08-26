import { FastifyRequest, FastifyReply, RouteHandlerMethod } from 'fastify';
import { CustomError } from '../../types/error.type';
import { ErrorResponse, SuccessResponse } from '../../utils/response';
import { getPatientData } from './patients.service';

export const getPatient: RouteHandlerMethod = async (req: FastifyRequest, reply: FastifyReply) => {
  try {
    if(!req.session) throw new Error('No session available.');
    const result = await getPatientData(req.session.id);
    return reply.send(new SuccessResponse('Your patient info fetched.', result));
  } catch (error) {
    const e = error as CustomError;
    return reply.status(e.errorCode).send(new ErrorResponse(e.message, e.errorCode));
  }
};
