import request from 'supertest';
import createApp from '../src/app';
import { FastifyInstance } from "fastify";
import sequelize from '../src/database/sequelize';

describe('Diseases', () => {
  let app: FastifyInstance;
  let id: string;
  let token: string;

  // populate required token
  beforeAll(async () => {
    await sequelize.sync({ force: true });

    app = await createApp();
    await app.ready();

    let response = await request(app.server)
        .post('/auth/register-phone') 
        .set('Content-Type', 'application/json')
        .send({
          phoneNo: '+447572760333',
    });
    id = response.body?.data?.id;
    response = await request(app.server)
        .post('/auth/verify-phone')
        .set('testmode', '1')
        .set('Content-Type', 'application/json')
        .send({
          otp: '123456',
          id: id, 
    });
    token = response.body.data?.token;
    response = await request(app.server)
        .post('/auth/set-pin')
        .set('testmode', '1')
        .set('Content-Type', 'application/json') 
        .set('Authorization', `Bearer ${token}`)
        .send({
          pin: '723456', 
        });
    token = response.body.data?.token;

  });
  
  afterAll(async () => {
    app.close();
    sequelize.drop();
  });

  describe('POST /diseases/1/symptom', () => {
    it('should create a new symptom for the disease', async () => {
      const response = await request(app.server)
        .post('/diseases/1/symptom')
        .set('Authorization', `Bearer ${token}`)
        .set('Content-Type', 'application/json')
        .send({
          description: 'new symptom 1',
        });
  
      expect(response.status).toBe(200); 
      expect(response.body).toHaveProperty('description', 'new symptom 1');
    });
  
    it('should return 401 if no token is provided', async () => {
      const response = await request(app.server)
        .post('/diseases/1/symptom')
        .set('Content-Type', 'application/json')
        .send({
          description: 'new symptom 1',
        });
  
      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty('error', 'Invalid token');
    });
  });
  
})
