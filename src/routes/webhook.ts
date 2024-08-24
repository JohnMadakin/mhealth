import { FastifyInstance, FastifyPluginCallback } from 'fastify';
import { socialSignup } from '../modules/auth/auth.controller';

export const webhookRoutes: FastifyPluginCallback = (fastify: FastifyInstance, options: any, done: () => void) => {
  fastify.post('/auth/google/callback', socialSignup);
  done();
};

export default webhookRoutes;
