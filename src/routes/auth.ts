import { FastifyInstance, FastifyPluginCallback } from 'fastify';
import { signup, socialSignup } from '../modules/auth/auth.controller';

export const authRoutes: FastifyPluginCallback = (fastify: FastifyInstance, options: any, done: () => void) => {
  fastify.post('/register', signup);
  fastify.post('/social-signin', socialSignup);
  done();
};

export default authRoutes;
