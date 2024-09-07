import { FastifyRequest, FastifyReply, RouteHandlerMethod } from 'fastify';
import { CustomError } from '../../types/error.type';
import { fetchActivities, getRecommendedActivities } from './activity.service';
import { ErrorResponse, SuccessResponse } from '../../utils/response';

export const fetchAllActivities: RouteHandlerMethod = async (req: FastifyRequest, reply: FastifyReply) => {
  try {
    const allActivities = await fetchActivities();
    return reply.send(new SuccessResponse('Fetched activities.', allActivities));
  } catch (error) {
    const e = error as CustomError;
    return reply.status(e.errorCode).send(new ErrorResponse(e.message, e.errorCode));
  }
};

export const fetchRecommendedActivities: RouteHandlerMethod = async (req: FastifyRequest, reply: FastifyReply) => {
  try {
    if(!req.session) throw new Error('No session available.');

    const result = await getRecommendedActivities(req.session.id);
    console.log('🍎', result)
    return reply.send(new SuccessResponse('Fetched recommended activities.', result));
  } catch (error) {
    const e = error as CustomError;
    return reply.status(e.errorCode).send(new ErrorResponse(e.message, e.errorCode));
  }
};
