
import { FastifyInstance, FastifyPluginCallback } from 'fastify';
import { logReminders, fetchReminders } from '../modules/reminder/reminder.controller';
import { verifyToken, userAuth } from '../plugins';

export const trackerRoutes: FastifyPluginCallback = (fastify: FastifyInstance, options: any, done: () => void) => {
  fastify.post('/reminders',{ 
    preHandler: [verifyToken, userAuth] 
  }, logReminders);
  fastify.get('/reminders',
  { 
    preHandler: [verifyToken, userAuth] 
  }, 
  fetchReminders);
  done();
};

export default trackerRoutes;
