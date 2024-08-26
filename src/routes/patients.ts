import { FastifyInstance, FastifyPluginCallback } from 'fastify';
import { getPatient } from '../modules/patients/patients.controller';
import { userAuth, verifyToken } from '../plugins';

export const diseaseRoutes: FastifyPluginCallback = (fastify: FastifyInstance, options: any, done: () => void) => {
  fastify.get('/patients/me', 
    { 
      preHandler: [verifyToken, userAuth] 
    }, 
    getPatient);
  done();
};

export default diseaseRoutes;
