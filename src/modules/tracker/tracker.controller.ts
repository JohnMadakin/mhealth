import { FastifyRequest, FastifyReply, RouteHandlerMethod } from 'fastify';
import { ErrorResponse, SuccessResponse } from '../../utils/response';
import { getFitbitAccessToken, getFitbitAuthorizationPage } from './fitbit.service';
import { addSymptomLogs } from './tracker.service';
import { CustomError, NewSymptomLog } from '../../types';


export const connectFitbit: RouteHandlerMethod = async (req: FastifyRequest, reply: FastifyReply) => {
  try {
    if(!req.session) throw new Error('No session available.');
    const auth = await getFitbitAuthorizationPage(req.session.id);

    return reply.send(new SuccessResponse('FitBit authorization fetched.', auth));
  } catch (error) {
    const e = error as CustomError;
    return reply.status(e.errorCode).send(new ErrorResponse(e.message, e.errorCode));
  }
};

export const finishFitbitConnection: RouteHandlerMethod = async (req: FastifyRequest, reply: FastifyReply) => {
  try {
    if(!req.session) throw new Error('No session available.');
    const query = req.query as { code: string };
    await getFitbitAccessToken(query.code);

    return reply.send(new SuccessResponse('FitBit connected.', null));
  } catch (error) {
    const e = error as CustomError;
    return reply.status(e.errorCode).send(new ErrorResponse(e.message, e.errorCode));
  }
};

export const createSymptomLog: RouteHandlerMethod = async (req: FastifyRequest, reply: FastifyReply) => {
  try {
    if(!req.session) throw new Error('No session available.');
    const data = req.body as NewSymptomLog;

    const result = await addSymptomLogs({...data, authId: req.session.id });
    let message = 'Symptom logged.';
    return reply.send(new SuccessResponse(message, result || null));
  } catch (error) {
    const e = error as CustomError;
    return reply.status(e.errorCode).send(new ErrorResponse(e.message, e.errorCode));
  }
};
