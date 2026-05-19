import { renderHook, act } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { useCandidates } from '../../hooks/useCandidates';

describe('useCandidates', () => {
  it('lists candidates', async () => {
    const { result } = renderHook(() => useCandidates());

    let data: { data: Array<{ email: string; status: string; deletedAt?: string }> } | undefined;
    await act(async () => {
      data = await result.current.list({ page: 1, limit: 10 });
    });

    expect(data?.data.length).toBeGreaterThan(0);
  });

  it('gets candidate by id', async () => {
    const { result } = renderHook(() => useCandidates());

    let candidate: { email: string } | undefined;
    await act(async () => {
      candidate = await result.current.getById('1');
    });

    expect(candidate?.email).toBe('jean@example.com');
  });

  it('creates a candidate', async () => {
    const { result } = renderHook(() => useCandidates());

    let created;
    await act(async () => {
      created = await result.current.create({
        firstName: 'Marie',
        lastName: 'Curie',
        email: 'marie@example.com',
        phone: '+33611111111',
      });
    });

    expect(created?.status).toBe('pending');
  });

  it('validates a candidate', async () => {
    const { result } = renderHook(() => useCandidates());

    let validated;
    await act(async () => {
      validated = await result.current.validate('1');
    });

    expect(validated?.status).toBe('validated');
  });

  it('removes a candidate', async () => {
    const { result } = renderHook(() => useCandidates());

    let removed;
    await act(async () => {
      removed = await result.current.remove('1');
    });

    expect(removed?.deletedAt).not.toBeNull();
  });
});
