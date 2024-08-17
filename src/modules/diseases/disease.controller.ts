import { FastifyRequest, FastifyReply, RouteHandlerMethod } from 'fastify';
import { CustomError } from '../../types/error.type';
import { fetchDiseases } from './disease.service';
import { ErrorResponse, SuccessResponse } from '../../utils/response';

export const fetchAllDisease: RouteHandlerMethod = async (req: FastifyRequest, reply: FastifyReply) => {
  try {
    const allDiseases = await fetchDiseases();
    return reply.send(new SuccessResponse('Fetched diseases.', allDiseases));
  } catch (error) {
    const e = error as CustomError;
    return reply.status(e.errorCode).send(new ErrorResponse(e.message, e.errorCode));
  }
};
