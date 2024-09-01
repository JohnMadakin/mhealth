import { FastifyInstance, FastifyPluginCallback } from 'fastify';
import { fetchAllDisease, newSymptom } from '../modules/diseases/disease.controller';
import { userAuth, verifyToken } from '../plugins';

export const diseaseRoutes: FastifyPluginCallback = (fastify: FastifyInstance, options: any, done: () => void) => {
  fastify.get('/diseases', 
    { 
      preHandler: [verifyToken, userAuth] 
    }, 
    fetchAllDisease);
  fastify.post('/diseases/symptom', 
    { 
      preHandler: [verifyToken, userAuth] 
    }, 
    newSymptom);
  done();
};

export default diseaseRoutes;
