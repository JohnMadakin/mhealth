import { FastifyInstance, FastifyPluginCallback } from 'fastify';
import { getPatient, setPatientSymptoms, getPatientSymptoms } from '../modules/patients/patients.controller';
import { userAuth, verifyToken } from '../plugins';

export const diseaseRoutes: FastifyPluginCallback = (fastify: FastifyInstance, options: any, done: () => void) => {
  fastify.get('/patients/me', 
    { 
      preHandler: [verifyToken, userAuth] 
    }, 
    getPatient);
  fastify.get('/patients/symptoms', 
    { 
      preHandler: [verifyToken, userAuth] 
    }, 
    getPatientSymptoms);
  fastify.post('/patients/:patientId/health-history', 
    { 
      preHandler: [verifyToken, userAuth] 
    }, 
    setPatientSymptoms);
  done();
};

export default diseaseRoutes;
