import Fastify, { FastifyRequest, FastifyReply } from 'fastify';
import helmet from '@fastify/helmet';

import { ErrorResponse, SuccessResponse } from './utils/response';
import { errorHandler, loggerPlugin } from './plugins';
import { registerRoutes } from './routes';

async function createApp() {
  const app = Fastify({
    bodyLimit: 50 * 1024 * 1024, //50mb
  });
  
  app.register(helmet, { global: true });
  
  app.register(loggerPlugin);
  app.register(errorHandler);
  await registerRoutes(app);
  
  
  app.get('/', (_: FastifyRequest, reply: FastifyReply) => reply.send(new SuccessResponse('Health tracking api.', null)));
  app.all('*', (req: FastifyRequest, reply: FastifyReply): void => {
    reply.status(404).send(new ErrorResponse(`Unimplemented ${req.method} ${req.url} route access` , 404));
  });
  return app;
}


export default createApp;