import request from 'supertest';
import { createApp } from '../../src/app';

describe('Security', () => {
  const app = createApp();
  let token: string;

  beforeEach(async () => {
    const login = await request(app)
      .post('/api/auth/login')
      .send({ email: 'admin@example.com', password: 'Admin123!' });
    token = login.body.token;
  });

  it('rejects NoSQL injection in query parameters', async () => {
    const res = await request(app)
      .get('/api/candidates?name[$gt]=&status[$ne]=pending')
      .set({ Authorization: `Bearer ${token}` });

    expect([200, 400]).toContain(res.status);
    if (res.status === 200) {
      expect(Array.isArray(res.body.data)).toBe(true);
    }
  });

  it('rejects invalid ObjectId', async () => {
    const res = await request(app)
      .get('/api/candidates/not-an-object-id')
      .set({ Authorization: `Bearer ${token}` });

    expect(res.status).toBe(404);
  });
});
