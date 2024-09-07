import { FastifyInstance, FastifyPluginCallback } from 'fastify';
import { fetchAllActivities, fetchRecommendedActivities } from '../modules/activities/activity.controller';
import { verifyToken, userAuth } from '../plugins';

export const activityRoutes: FastifyPluginCallback = (fastify: FastifyInstance, options: any, done: () => void) => {
  fastify.post('/activities',{ 
    preHandler: [verifyToken, userAuth] 
  }, fetchAllActivities);
  fastify.get('/activities/recommendation',
  { 
    preHandler: [verifyToken, userAuth] 
  }, 
   fetchRecommendedActivities);
  done();
};

export default activityRoutes;
