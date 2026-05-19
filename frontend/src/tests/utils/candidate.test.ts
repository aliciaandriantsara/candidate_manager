import { describe, expect, it } from 'vitest';
import { buildCandidatesQuery } from '../../utils/candidate';

describe('buildCandidatesQuery', () => {
  it('returns empty string when no filters', () => {
    expect(buildCandidatesQuery({})).toBe('');
  });

  it('builds query with all filters', () => {
    const query = buildCandidatesQuery({
      page: 2,
      limit: 10,
      status: 'pending',
      name: 'Dupont',
    });
    expect(query).toContain('page=2');
    expect(query).toContain('limit=10');
    expect(query).toContain('status=pending');
    expect(query).toContain('name=Dupont');
  });
});
