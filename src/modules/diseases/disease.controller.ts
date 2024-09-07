import { FastifyRequest, FastifyReply, RouteHandlerMethod } from 'fastify';
import { CustomError } from '../../types/error.type';
import { fetchDiseases, createSymptom, getTrackingRecommendation } from './disease.service';
import { ErrorResponse, SuccessResponse } from '../../utils/response';

export const fetchRecommendation: RouteHandlerMethod = async (req: FastifyRequest, reply: FastifyReply) => {
  try {  
    if(!req.user?.Patient?.id) throw new Error('Invalid user token passed.');

    const recommendations = await getTrackingRecommendation(req.user.Patient?.id);
    return reply.send(new SuccessResponse('tracking recommendation fetched.', recommendations));
  } catch (error) {
    const e = error as CustomError;
    return reply.status(e.errorCode).send(new ErrorResponse(e.message, e.errorCode));
  }
};

export const fetchAllDisease: RouteHandlerMethod = async (req: FastifyRequest, reply: FastifyReply) => {
  try {
    const data = req.query as { include_symptoms: string; };
  
    const allDiseases = await fetchDiseases(data);
    return reply.send(new SuccessResponse('Fetched diseases.', allDiseases));
  } catch (error) {
    const e = error as CustomError;
    return reply.status(e.errorCode).send(new ErrorResponse(e.message, e.errorCode));
  }
};

export const newSymptom: RouteHandlerMethod = async (req: FastifyRequest, reply: FastifyReply) => {
  try {
    const data = req.body as { description: string; };

    const symptom = await createSymptom(data);
    return reply.send(new SuccessResponse('Symptom created.', symptom));
  } catch (error) {
    const e = error as CustomError;
    return reply.status(e.errorCode).send(new ErrorResponse(e.message, e.errorCode));
  }
};
