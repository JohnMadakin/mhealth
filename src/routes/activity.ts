import { FastifyInstance, FastifyPluginCallback } from 'fastify';
import { fetchAllActivities } from '../modules/activities/activity.controller';

export const activityRoutes: FastifyPluginCallback = (fastify: FastifyInstance, options: any, done: () => void) => {
  fastify.post('/activities', fetchAllActivities);
  done();
};

export default activityRoutes;
