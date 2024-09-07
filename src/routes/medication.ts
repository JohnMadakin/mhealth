import { FastifyInstance, FastifyPluginCallback } from 'fastify';
import { getPatietMedication, createPatietMedication } from '../modules/medications/medication.controller';
import { verifyToken, userAuth } from '../plugins';

export const medicationRoutes: FastifyPluginCallback = (fastify: FastifyInstance, options: any, done: () => void) => {
  fastify.post('/medications',{ 
    preHandler: [verifyToken, userAuth] 
  }, createPatietMedication);
  fastify.get('/medications',
  { 
    preHandler: [verifyToken, userAuth] 
  }, 
  getPatietMedication);
  done();
};

export default medicationRoutes;
