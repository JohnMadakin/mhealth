import { 
  FastifyInstance, FastifyPluginCallback, 
  FastifyRequest, FastifyReply  
} from 'fastify';
import fastifyPlugin from 'fastify-plugin';
import jwt from 'jsonwebtoken';
import { ErrorResponse } from '../utils/response';
import { appConfig } from '../config/app.config';


export const verifyToken: FastifyPluginCallback = (fastify: FastifyInstance, options: any, done: () => void) => {
  fastify.decorate('authenticate', async function(request: FastifyRequest, reply: FastifyReply) {
    try {
      const authHeader = request.headers.authorization;

      if (!authHeader) {
        return reply.status(401).send(new ErrorResponse('Authorization header missing', 401));
      }

      const token = authHeader.split(' ')[1];
      if (!token) {
        return reply.status(401).send(new ErrorResponse('Authorization Token missing', 401));
      }

      const decoded = jwt.verify(token, appConfig.jwtSecret);

      // Attach the decoded token to the request object
      request.session = decoded as { id: number; sessionId: number; };
    } catch (err) {
      return reply.status(401).send({ error: 'Invalid token' });
    }
  });
  done();
};

export default fastifyPlugin(verifyToken);