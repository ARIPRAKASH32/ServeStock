import request from 'supertest';
import app from '../app';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import User from '../models/User';

let mongoServer: MongoMemoryServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  await mongoose.connect(uri);
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

describe('API Integration Tests', () => {
  let token: string;

  it('should register a new user and return a token', async () => {
    const res = await request(app).post('/api/auth/register').send({
      name: 'Test Admin',
      email: 'admin@test.com',
      password: 'password123',
      role: 'ADMIN',
    });

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data?.token).toBeDefined();
    token = res.body.data.token;
  });

  it('should access protected health endpoint', async () => {
    const res = await request(app)
      .get('/api/health')
      .set('Authorization', `Bearer ${token}`);
    
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('ok');
  });

  it('should fail accessing protected routes without a token', async () => {
    const res = await request(app).get('/api/inventory');
    expect(res.status).toBe(401);
  });
});

