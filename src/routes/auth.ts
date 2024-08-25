import { FastifyInstance, FastifyPluginCallback } from 'fastify';
import { 
  signup, socialSignup, signupPhone, 
  verifySignupPhone, setPin, loginPhone
} from '../modules/auth/auth.controller';
import { verifyOTPToken, userAuth } from '../plugins';

export const authRoutes: FastifyPluginCallback =  (fastify: FastifyInstance, options: any, done: () => void) => {
  fastify.post('/auth/register-email', signup);
  fastify.post('/auth/register-phone', signupPhone);
  fastify.post('/auth/verify-phone', verifySignupPhone);
  fastify.post('/auth/login-phone', loginPhone);
  fastify.post('/auth/set-pin', {
    preHandler: [verifyOTPToken, userAuth],
  }, setPin);
  fastify.post('/social-signin', socialSignup);
  done();
};

export default authRoutes;
