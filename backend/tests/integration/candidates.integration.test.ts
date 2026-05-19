import request from 'supertest';
import { createApp } from '../../src/app';

describe('Candidates API', () => {
  const app = createApp();
  let token: string;

  beforeEach(async () => {
    const login = await request(app)
      .post('/api/auth/login')
      .send({ email: 'admin@example.com', password: 'Admin123!' });
    token = login.body.token;
  });

  const auth = () => ({ Authorization: `Bearer ${token}` });

  it('POST /api/candidates creates a candidate', async () => {
    const res = await request(app)
      .post('/api/candidates')
      .set(auth())
      .send({
        firstName: 'Alice',
        lastName: 'Martin',
        email: 'alice@example.com',
        phone: '+33611111111',
      });

    expect(res.status).toBe(201);
    expect(res.body.firstName).toBe('Alice');
    expect(res.body.status).toBe('pending');
  });

  it('GET /api/candidates lists with pagination', async () => {
    await request(app)
      .post('/api/candidates')
      .set(auth())
      .send({
        firstName: 'Bob',
        lastName: 'Durand',
        email: 'bob@example.com',
        phone: '+33622222222',
      });

    const res = await request(app)
      .get('/api/candidates?page=1&limit=10')
      .set(auth());

    expect(res.status).toBe(200);
    expect(res.body.data).toBeDefined();
    expect(res.body.total).toBeGreaterThanOrEqual(1);
  });

  it('GET /api/candidates/:id returns candidate', async () => {
    const created = await request(app)
      .post('/api/candidates')
      .set(auth())
      .send({
        firstName: 'Claire',
        lastName: 'Bernard',
        email: 'claire@example.com',
        phone: '+33633333333',
      });

    const res = await request(app)
      .get(`/api/candidates/${created.body._id}`)
      .set(auth());

    expect(res.status).toBe(200);
    expect(res.body.email).toBe('claire@example.com');
  });

  it('PUT /api/candidates/:id updates partially', async () => {
    const created = await request(app)
      .post('/api/candidates')
      .set(auth())
      .send({
        firstName: 'David',
        lastName: 'Petit',
        email: 'david@example.com',
        phone: '+33644444444',
      });

    const res = await request(app)
      .put(`/api/candidates/${created.body._id}`)
      .set(auth())
      .send({ firstName: 'Dave' });

    expect(res.status).toBe(200);
    expect(res.body.firstName).toBe('Dave');
  });

  it('DELETE /api/candidates/:id soft deletes', async () => {
    const created = await request(app)
      .post('/api/candidates')
      .set(auth())
      .send({
        firstName: 'Eve',
        lastName: 'Roux',
        email: 'eve@example.com',
        phone: '+33655555555',
      });

    const deleted = await request(app)
      .delete(`/api/candidates/${created.body._id}`)
      .set(auth());

    expect(deleted.status).toBe(200);
    expect(deleted.body.deletedAt).not.toBeNull();

    const getRes = await request(app)
      .get(`/api/candidates/${created.body._id}`)
      .set(auth());
    expect(getRes.status).toBe(404);
  });

  it('POST /api/candidates/:id/validate validates async', async () => {
    const created = await request(app)
      .post('/api/candidates')
      .set(auth())
      .send({
        firstName: 'Frank',
        lastName: 'Moreau',
        email: 'frank@example.com',
        phone: '+33666666666',
      });

    const res = await request(app)
      .post(`/api/candidates/${created.body._id}/validate`)
      .set(auth());

    expect(res.status).toBe(200);
    expect(res.body.status).toBe('validated');
  });

  it('rejects unauthenticated requests', async () => {
    const res = await request(app).get('/api/candidates');
    expect(res.status).toBe(401);
  });

  it('rejects NoSQL injection in body', async () => {
    const res = await request(app)
      .post('/api/candidates')
      .set(auth())
      .send({
        firstName: { $gt: '' },
        lastName: 'Hack',
        email: 'hack@example.com',
        phone: '+33677777777',
      });

    expect(res.status).toBe(400);
  });

  it('rejects NoSQL injection operators in strict body', async () => {
    const res = await request(app)
      .post('/api/candidates')
      .set(auth())
      .send({
        firstName: 'Test',
        lastName: 'User',
        email: 'nosql2@example.com',
        phone: '+33688888888',
        $where: '1==1',
      });

    expect(res.status).toBe(400);
  });
});
