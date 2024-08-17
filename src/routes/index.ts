import { FastifyInstance } from 'fastify';
import fs from 'fs';
import path from 'path';

export async function registerRoutes(app: FastifyInstance) {
  const routesPath = path.join(__dirname, '');
  const files = fs.readdirSync(routesPath);

  for (const file of files) {
    if (file === 'index.ts' || file === 'index.js') {
      continue;
    }
    const route = await import(path.join(routesPath, file));
    app.register(route.default || route);
  }
}
