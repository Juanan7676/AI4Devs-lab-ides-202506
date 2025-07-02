import request from 'supertest';
import app from '../index';
import { Request, Response, NextFunction } from 'express'; // Import the necessary types

describe('App', () => {
  it('should return 200 for health check', async () => {
    const response = await request(app).get('/health');
    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
  });

  it('should return 200 for root endpoint', async () => {
    const response = await request(app).get('/');
    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
  });
});
