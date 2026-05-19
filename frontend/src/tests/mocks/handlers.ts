import { http, HttpResponse } from 'msw';

const API = 'http://localhost:3000/api';

const candidates = [
  {
    _id: '1',
    firstName: 'Jean',
    lastName: 'Dupont',
    email: 'jean@example.com',
    phone: '+33600000000',
    status: 'pending' as const,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    deletedAt: null,
  },
];

export const handlers = [
  http.post(`${API}/auth/login`, async () => {
    return HttpResponse.json({ token: 'mock-token' });
  }),
  http.get(`${API}/candidates`, () => {
    return HttpResponse.json({
      data: candidates,
      total: 1,
      page: 1,
      limit: 10,
      totalPages: 1,
    });
  }),
  http.get(`${API}/candidates/:id`, ({ params }) => {
    const candidate = candidates.find((c) => c._id === params.id);
    if (!candidate) {
      return HttpResponse.json({ error: 'Introuvable' }, { status: 404 });
    }
    return HttpResponse.json(candidate);
  }),
  http.post(`${API}/candidates`, async ({ request }) => {
    const body = (await request.json()) as Record<string, string>;
    const created = {
      _id: '2',
      ...body,
      status: 'pending' as const,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      deletedAt: null,
    };
    return HttpResponse.json(created, { status: 201 });
  }),
  http.post(`${API}/candidates/:id/validate`, ({ params }) => {
    const candidate = candidates.find((c) => c._id === params.id) ?? candidates[0];
    return HttpResponse.json({ ...candidate, status: 'validated' });
  }),
  http.delete(`${API}/candidates/:id`, ({ params }) => {
    const candidate = candidates.find((c) => c._id === params.id) ?? candidates[0];
    return HttpResponse.json({ ...candidate, deletedAt: new Date().toISOString() });
  }),
];
