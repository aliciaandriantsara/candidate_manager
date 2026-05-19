import { renderHook, act } from '@testing-library/react';
import { describe, expect, it, beforeEach } from 'vitest';
import { useAuth } from '../../hooks/useAuth';
import { clearToken, getToken } from '../../utils/api';

describe('useAuth', () => {
  beforeEach(() => {
    clearToken();
  });

  it('logs in and stores token', async () => {
    const { result } = renderHook(() => useAuth());

    await act(async () => {
      await result.current.login('admin@example.com', 'Admin123!');
    });

    expect(getToken()).toBe('mock-token');
  });

  it('logs out', async () => {
    const { result } = renderHook(() => useAuth());
    await act(async () => {
      await result.current.login('admin@example.com', 'Admin123!');
    });

    act(() => {
      result.current.logout();
    });

    expect(getToken()).toBeNull();
  });
});
