import { FastifyInstance, FastifyPluginCallback } from 'fastify';
import { fetchAllDisease } from '../modules/diseases/disease.controller';
import { userAuth, verifyToken } from '../plugins';

export const diseaseRoutes: FastifyPluginCallback = (fastify: FastifyInstance, options: any, done: () => void) => {
  console.log('fastify.authenticate', fastify.authenticate)
  fastify.post('/diseases', 
    { 
      preHandler: [verifyToken, userAuth] 
    }, 
    fetchAllDisease);
  done();
};

export default diseaseRoutes;
