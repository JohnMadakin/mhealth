import { FastifyInstance, FastifyPluginCallback } from 'fastify';
import { signup } from '../modules/auth/auth.controller';

export const authRoutes: FastifyPluginCallback = (fastify: FastifyInstance, options: any, done: () => void) => {
  fastify.post('/register', signup);
  done();
};

export default authRoutes;
