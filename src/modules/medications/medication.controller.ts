import { FastifyRequest, FastifyReply, RouteHandlerMethod } from 'fastify';
import { ErrorResponse, SuccessResponse } from '../../utils/response';
import { fetchMedications, addMedications } from './medication.service';
import { PatientSicknessSymptomsData, CustomError, NewMedication } from 'types';

export const getPatietMedication: RouteHandlerMethod = async (req: FastifyRequest, reply: FastifyReply) => {
  try {
    if(!req.session) throw new Error('No session available.');
    const result = await fetchMedications(req.session.id);
    return reply.send(new SuccessResponse('Your medication info fetched.', result));
  } catch (error) {
    const e = error as CustomError;
    return reply.status(e.errorCode).send(new ErrorResponse(e.message, e.errorCode));
  }
};

export const createPatietMedication: RouteHandlerMethod = async (req: FastifyRequest, reply: FastifyReply) => {
  try {
    if(!req.session) throw new Error('No session available.');
    const data = req.body as NewMedication;
    data.authId = req.session.id;

    const result = await addMedications(data);
    return reply.send(new SuccessResponse('Your medication info fetched.', result));
  } catch (error) {
    const e = error as CustomError;
    return reply.status(e.errorCode).send(new ErrorResponse(e.message, e.errorCode));
  }
};