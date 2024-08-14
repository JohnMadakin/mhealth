import { FastifyRequest, FastifyReply, RouteHandlerMethod } from 'fastify';
import { CustomError } from '../../types/error.type';
import { ErrorResponse, SuccessResponse } from '../../utils/response';

export const getBrandById: RouteHandlerMethod = (req: FastifyRequest, reply: FastifyReply) => {
  try {
    const params = req.params as { id: string };
    return reply.send(new SuccessResponse('Brand info fetched', null));
  } catch (error) {
    const e = error as CustomError;
    return reply.status(e.errorCode).send(new ErrorResponse(e.message, e.errorCode));
  }
};
