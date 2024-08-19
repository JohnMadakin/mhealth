import { FastifyInstance, FastifyPluginCallback } from 'fastify';
import { googleCallback } from '../modules/auth/auth.controller';

export const webhookRoutes: FastifyPluginCallback = (fastify: FastifyInstance, options: any, done: () => void) => {
  fastify.post('/auth/google/callback', googleCallback);
  done();
};

export default webhookRoutes;
