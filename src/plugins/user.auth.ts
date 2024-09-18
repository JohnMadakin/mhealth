import { 
  // FastifyInstance, FastifyPluginCallback,
  FastifyRequest, FastifyReply  
} from 'fastify';
// import fastifyPlugin from 'fastify-plugin';
import { ErrorResponse } from '../utils/response';
import { verifySession, verifyUser } from '../modules/auth/auth.service';


export const userAuth = async function(request: FastifyRequest, reply: FastifyReply) {
  try {
    const session = request.session;
    if(!session) return reply.status(403).send(new ErrorResponse('No session found.', 401));

    const validSession = await verifySession(session?.sessionId);
    if (!validSession) {
      return reply.status(403).send(new ErrorResponse('session expired.', 403));
    }

    const validUser = await verifyUser(session.id);
    if (!validUser) {
      return reply.status(403).send(new ErrorResponse('User not found.', 403));
    }

    // Attach the decoded token to the request object
    request.user = validUser;
  } catch (err) {
    console.log('🔥=> ', err);

    return reply.status(401).send({ error: 'Invalid token' });
  }
}

// export const userAuthPlugin = fastifyPlugin(userAuth);
