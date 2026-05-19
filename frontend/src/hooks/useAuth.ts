import { useCallback, useState } from 'react';
import { apiRequest, clearToken, setToken } from '../utils/api';

interface LoginResponse {
  token: string;
}

export function useAuth() {
  const [loading, setLoading] = useState(false);

  const login = useCallback(async (email: string, password: string) => {
    setLoading(true);
    try {
      const result = await apiRequest<LoginResponse>('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      });
      setToken(result.token);
      return result;
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    clearToken();
  }, []);

  const isAuthenticated = useCallback(() => {
    return Boolean(localStorage.getItem('token'));
  }, []);

  return { login, logout, isAuthenticated, loading };
}
