import { FastifyRequest, FastifyReply, RouteHandlerMethod } from 'fastify';
import { ErrorResponse, SuccessResponse } from '../../utils/response';
import { getPatientData, createPatientIllnessData, getPatientSymptomsData } from './patients.service';
import { PatientSicknessSymptomsData, CustomError } from 'types';

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

export const setPatientSymptoms: RouteHandlerMethod = async (req: FastifyRequest, reply: FastifyReply) => {
  try {
    if(!req.session) throw new Error('No session available.');
    const data = req.body as PatientSicknessSymptomsData;
    const params = req.params as { patientId: string; };

    const result = await createPatientIllnessData({...data, authId: req.session.id, patientId: params.patientId });
    let message = 'Your patient illness info created.';
    if(!result) message = 'Symptoms already logged to this patient.'
    return reply.send(new SuccessResponse(message, result || null));
  } catch (error) {
    const e = error as CustomError;
    return reply.status(e.errorCode).send(new ErrorResponse(e.message, e.errorCode));
  }
};

export const getPatientSymptoms: RouteHandlerMethod = async (req: FastifyRequest, reply: FastifyReply) => {
  try {
    if(!req.session) throw new Error('No session available.');

    const result = await getPatientSymptomsData(req.session.id);
    return reply.send(new SuccessResponse('Symptoms fetched.', result || null));
  } catch (error) {
    const e = error as CustomError;
    return reply.status(e.errorCode).send(new ErrorResponse(e.message, e.errorCode));
  }
};
