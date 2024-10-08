import 'fastify';
import { Logger } from 'winston';

declare module 'fastify' {
  interface FastifyInstance {
    logger: Logger;
    authenticate: any;
    verifyuser: any;
  }
  interface FastifyRequest {
    user?: any;
    session?: {
      id: string,
      sessionId: string;
    }; // or use a specific type instead of `any`, e.g., `user?: UserType`
  }
}
