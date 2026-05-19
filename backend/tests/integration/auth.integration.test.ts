import request from 'supertest';
import { createApp } from '../../src/app';

describe('Auth API', () => {
  const app = createApp();

  it('POST /api/auth/login returns token', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'admin@example.com', password: 'Admin123!' });

    expect(res.status).toBe(200);
    expect(res.body.token).toBeDefined();
  });

  it('POST /api/auth/login rejects invalid credentials', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'admin@example.com', password: 'wrong' });

    expect(res.status).toBe(401);
  });

  it('POST /api/auth/login validates input', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'not-an-email', password: '' });

    expect(res.status).toBe(400);
  });

  it('rate limits brute force on login', async () => {
    const results = [];
    for (let i = 0; i < 8; i++) {
      results.push(
        await request(app)
          .post('/api/auth/login')
          .send({ email: 'admin@example.com', password: 'wrong-password' }),
      );
    }
    const tooMany = results.filter((r) => r.status === 429);
    expect(tooMany.length).toBeGreaterThan(0);
  });
});
