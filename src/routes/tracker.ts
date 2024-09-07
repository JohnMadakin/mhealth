import { FastifyInstance, FastifyPluginCallback } from 'fastify';
import { connectFitbit, finishFitbitConnection, createSymptomLog } from '../modules/tracker/tracker.controller';
import { verifyToken, userAuth } from '../plugins';

export const trackerRoutes: FastifyPluginCallback = (fastify: FastifyInstance, options: any, done: () => void) => {
  fastify.get('/fitbit/connect',{ 
    preHandler: [verifyToken, userAuth] 
  }, connectFitbit);
  fastify.post('/fitbit/complete-connection',
  { 
    preHandler: [verifyToken, userAuth] 
  }, 
  finishFitbitConnection);
  fastify.post('/tracker/add-symptoms',
  { 
    preHandler: [verifyToken, userAuth] 
  }, 
  createSymptomLog);
  done();
};

export default trackerRoutes;
