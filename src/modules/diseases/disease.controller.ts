import { FastifyRequest, FastifyReply, RouteHandlerMethod } from 'fastify';
import { CustomError } from '../../types/error.type';
import { fetchDiseases, createSymptom } from './disease.service';
import { ErrorResponse, SuccessResponse } from '../../utils/response';

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
