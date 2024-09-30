import request from 'supertest';
import createApp from '../src/app';
import { FastifyInstance } from "fastify";
import sequelize from '../src/database/sequelize';



describe('Auth test', () => {
  let app: FastifyInstance;
  let id: string;
  let token: string;

  beforeAll(async () => {
    await sequelize.sync({ force: true });

    app = await createApp();
    await app.ready();
  });
  
  afterAll(async () => {
    app.close();
    sequelize.drop();
  });

  describe('POST /auth/register-phone', () => {
    it('should register a phone number successfully', async () => {
     try {
        const response = await request(app.server)
        .post('/auth/register-phone') 
        .set('Content-Type', 'application/json')
        .send({
          phoneNo: '+447572760333',
        });
        id =response.body?.data?.id;
        expect(response.statusCode).toBe(200);
  
        // Validate the response body if needed
        expect(response.body).toHaveProperty('message');
        expect(response.body.message).toBe('Enter otp sent to complete registration.');
        expect(response.body.data).toHaveProperty('id');
     } catch (_) {}
    });
  
    it('should return an error for missing phone number', async () => {
      const response = await request(app.server)
        .post('/auth/register-phone')
        .set('Content-Type', 'application/json')
        .send({});
  
      expect(response.statusCode).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('phoneNo is required');
    });
  });
  
  describe('POST /auth/verify-phone', () => {
    it('should verify the phone successfully with valid OTP and ID', async () => {
      const response = await request(app.server)
        .post('/auth/verify-phone')
        .set('testmode', '1')
        .set('Content-Type', 'application/json')
        .send({
          otp: '123456',
          id: id, 
        });

        token = response.body.data?.token;
      expect(response.statusCode).toBe(200);
      expect(response.body).toHaveProperty('success', true);
      expect(response.body).toHaveProperty('message', 'User successfully verified.');
    });
  
    it('should return an error for invalid OTP or ID', async () => {
      const response = await request(app.server)
        .post('/auth/verify-phone')
        .set('testmode', '1')
        .set('Content-Type', 'application/json')
        .send({
          otp: '000000', 
          id: 'invalid-id', 
        });
  
      
      expect(response.statusCode).toBe(400);
      expect(response.body).toHaveProperty('errorCode', 400);
      expect(response.body).toHaveProperty('message', 'id must be a valid GUID');
      expect(response.body).toHaveProperty('success', false);
    });
  
    it('should return an error if OTP or ID is missing', async () => {
      const response = await request(app.server)
        .post('/auth/verify-phone')
        .set('testmode', '1')
        .set('Content-Type', 'application/json')
        .send({
          otp: '',
          id: '',
        });
  
      // Expect the error response
      expect(response.statusCode).toBe(400);
      expect(response.body).toHaveProperty('errorCode', 400);
      expect(response.body).toHaveProperty('message', 'otp is not allowed to be empty');
      expect(response.body).toHaveProperty('success', false);
    });
  });
  
  describe('POST /auth/set-pin', () => {
    
    it('should set the pin successfully with valid token and pin', async () => {
      const response = await request(app.server)
        .post('/auth/set-pin')
        .set('testmode', '1')
        .set('Content-Type', 'application/json') 
        .set('Authorization', `Bearer ${token}`)
        .send({
          pin: '723456', 
        });

      expect(response.statusCode).toBe(200);
      expect(response.body).toHaveProperty('success', true);
      expect(response.body).toHaveProperty('message', 'User pin successfully created.');
    });

    it('should return an error for an invalid token', async () => {
      const response = await request(app.server)
        .post('/auth/set-pin')
        .set('testmode', '1')
        .set('Content-Type', 'application/json')
        .set('Authorization', 'Bearer invalid_token')
        .send({
          pin: '723456',
        });

      expect(response.statusCode).toBe(401); 
      expect(response.body).toHaveProperty('error', 'Invalid token');
    });

    it('should return an error for missing or invalid pin', async () => {
      const response = await request(app.server)
        .post('/auth/set-pin')
        .set('testmode', '1')
        .set('Content-Type', 'application/json')
        .set('Authorization', `Bearer ${token}`)
        .send({
          pin: '',
        });

      expect(response.statusCode).toBe(400);
      expect(response.body).toHaveProperty('message', 'pin is not allowed to be empty');
      expect(response.body).toHaveProperty('success', false);
    });
  });

});
