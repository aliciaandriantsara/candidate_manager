import { Candidate } from '../../src/models/Candidate';
import { CandidateService } from '../../src/services/candidate.service';
import { NotFoundError, ValidationError } from '../../src/utils/errors';

describe('CandidateService', () => {
  const service = new CandidateService(10);

  const basePayload = {
    firstName: 'Jean',
    lastName: 'Dupont',
    email: 'jean.dupont@example.com',
    phone: '+33601020304',
  };

  it('creates a candidate', async () => {
    const candidate = await service.create(basePayload);
    expect(candidate.firstName).toBe('Jean');
    expect(candidate.status).toBe('pending');
    expect(candidate.deletedAt).toBeNull();
  });

  it('throws on duplicate email', async () => {
    await service.create(basePayload);
    await expect(
      service.create({ ...basePayload, email: 'jean.dupont@example.com' }),
    ).rejects.toThrow(ValidationError);
  });

  it('finds candidate by id', async () => {
    const created = await service.create({
      ...basePayload,
      email: 'find@example.com',
    });
    const found = await service.findById(String(created._id));
    expect(found.email).toBe('find@example.com');
  });

  it('throws when candidate not found', async () => {
    await expect(
      service.findById('507f1f77bcf86cd799439011'),
    ).rejects.toThrow(NotFoundError);
  });

  it('throws for invalid ObjectId', async () => {
    await expect(service.findById('invalid-id')).rejects.toThrow(NotFoundError);
  });

  it('lists candidates with pagination', async () => {
    await service.create({ ...basePayload, email: 'list1@example.com' });
    await service.create({
      ...basePayload,
      email: 'list2@example.com',
      firstName: 'Marie',
    });

    const result = await service.list({ page: 1, limit: 10 });
    expect(result.data.length).toBeGreaterThanOrEqual(2);
    expect(result.total).toBeGreaterThanOrEqual(2);
  });

  it('filters by status and name', async () => {
    const c = await service.create({
      ...basePayload,
      email: 'filter@example.com',
      firstName: 'UniqueName',
    });
    await Candidate.findByIdAndUpdate(c._id, { status: 'validated' });

    const byStatus = await service.list({
      page: 1,
      limit: 10,
      status: 'validated',
    });
    expect(byStatus.data.some((x) => x.email === 'filter@example.com')).toBe(true);

    const byName = await service.list({
      page: 1,
      limit: 10,
      name: 'UniqueName',
    });
    expect(byName.data.length).toBeGreaterThanOrEqual(1);
  });

  it('updates a candidate', async () => {
    const created = await service.create({
      ...basePayload,
      email: 'update@example.com',
    });
    const updated = await service.update(String(created._id), {
      firstName: 'Paul',
    });
    expect(updated.firstName).toBe('Paul');
  });

  it('soft deletes a candidate', async () => {
    const created = await service.create({
      ...basePayload,
      email: 'delete@example.com',
    });
    const deleted = await service.softDelete(String(created._id));
    expect(deleted.deletedAt).not.toBeNull();
    await expect(service.findById(String(created._id))).rejects.toThrow(
      NotFoundError,
    );
  });

  it('validates a candidate asynchronously', async () => {
    const created = await service.create({
      ...basePayload,
      email: 'validate@example.com',
    });
    const validated = await service.validateAsync(String(created._id));
    expect(validated.status).toBe('validated');
  });

  it('returns already validated candidate without error', async () => {
    const created = await service.create({
      ...basePayload,
      email: 'already@example.com',
    });
    await service.validateAsync(String(created._id));
    const again = await service.validateAsync(String(created._id));
    expect(again.status).toBe('validated');
  });
});
