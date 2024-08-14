import { FastifyInstance, FastifyPluginOptions } from 'fastify';
import fp from 'fastify-plugin';
import logger from '../utils/logger';

async function loggerFn(fastify: FastifyInstance, options: FastifyPluginOptions) {
  fastify.decorate('logger', logger);

  fastify.addHook('onRequest', async (request, _) => {
    fastify.logger.info(`Incoming request: ${request.method} ${request.url}`);
  });

  fastify.addHook('onResponse', async (request, reply) => {
    fastify.logger.info(`Response sent for request: ${request.method} ${request.url} - ${reply.statusCode}`);
  });
}

export const loggerPlugin = fp(loggerFn);
