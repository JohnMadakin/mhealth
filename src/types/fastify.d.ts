import 'fastify';
import { Logger } from 'winston';

declare module 'fastify' {
  interface FastifyInstance {
    logger: Logger;
  }
}
