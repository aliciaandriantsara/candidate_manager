import { beforeEach, describe, expect, it, vi } from 'vitest';
import { apiRequest, clearToken, getToken, setToken, ApiError } from '../../utils/api';

describe('api utils', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.restoreAllMocks();
  });

  it('stores and retrieves token', () => {
    setToken('abc');
    expect(getToken()).toBe('abc');
    clearToken();
    expect(getToken()).toBeNull();
  });

  it('throws ApiError on failed request', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: false,
        status: 400,
        json: async () => ({ error: 'Bad request' }),
      }),
    );

    await expect(apiRequest('/test')).rejects.toBeInstanceOf(ApiError);
  });

  it('returns json on success', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: true,
        status: 200,
        json: async () => ({ ok: true }),
      }),
    );

    const result = await apiRequest<{ ok: boolean }>('/test');
    expect(result.ok).toBe(true);
  });
});
