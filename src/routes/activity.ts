import { FastifyInstance, FastifyPluginCallback } from 'fastify';
import { fetchAllActivities, recommendedActivities } from '../modules/activities/activity.controller';

export const activityRoutes: FastifyPluginCallback = (fastify: FastifyInstance, options: any, done: () => void) => {
  fastify.post('/activities', fetchAllActivities);
  fastify.post('/activities/recommendation', fetchAllActivities);
  done();
};

export default activityRoutes;
