import request from 'supertest';
import createApp from '../src/app';
import { FastifyInstance } from "fastify";

describe('GET /', () => {
  let app: FastifyInstance;
  beforeAll(async () => {
    app = await createApp();
    await app.ready();
  });

  afterAll(() => app.close());

  it('should respond with a 200', async () => {
    const response = await request(app.server).get('/');
    expect(response.status).toEqual(200);
  });

  describe('Invalid Route', () => {
    it('should respond with a 404', async () => {
      const response = await request(app.server).get('/invalid-endpoint');
      expect(response.status).toEqual(404);
    });
  });
});

