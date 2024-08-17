import { FastifyInstance, FastifyPluginCallback } from 'fastify';
import { fetchAllDisease } from '../modules/diseases/disease.controller';

export const diseaseRoutes: FastifyPluginCallback = (fastify: FastifyInstance, options: any, done: () => void) => {
  fastify.post('/diseases', fetchAllDisease);
  done();
};

export default diseaseRoutes;
