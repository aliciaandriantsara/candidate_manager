import { Candidate } from '../../src/models/Candidate';

describe('Candidate model', () => {
  it('creates a document with defaults', async () => {
    const doc = await Candidate.create({
      firstName: 'Test',
      lastName: 'User',
      email: 'model@example.com',
      phone: '+33600000000',
    });

    expect(doc.status).toBe('pending');
    expect(doc.deletedAt).toBeNull();
    expect(doc.createdAt).toBeInstanceOf(Date);
    expect(doc.updatedAt).toBeInstanceOf(Date);
  });

  it('enforces unique email', async () => {
    await Candidate.create({
      firstName: 'A',
      lastName: 'B',
      email: 'unique@example.com',
      phone: '+33600000001',
    });

    await expect(
      Candidate.create({
        firstName: 'C',
        lastName: 'D',
        email: 'unique@example.com',
        phone: '+33600000002',
      }),
    ).rejects.toThrow();
  });
});
