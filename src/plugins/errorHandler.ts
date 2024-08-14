import { FastifyInstance, FastifyPluginCallback } from 'fastify';
import { ErrorResponse } from '../utils/response';


export const errorHandler: FastifyPluginCallback = (fastify: FastifyInstance, options: any, done: () => void) => {
  fastify.setErrorHandler((error, _, reply) => {
    const errorResponse = new ErrorResponse(error.message || 'Internal Server Error', error.statusCode || 500);  // Send the custom error response
    reply.status(error.statusCode || 500).send(errorResponse);
  });

  done();
};
