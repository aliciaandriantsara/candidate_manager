import { useCallback, useState } from 'react';
import { apiRequest } from '../utils/api';
import {
  buildCandidatesQuery,
  type Candidate,
  type CandidateFilters,
  type PaginatedCandidates,
} from '../utils/candidate';

export interface CreateCandidateInput {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
}

export function useCandidates() {
  const [loading, setLoading] = useState(false);

  const list = useCallback(async (filters: CandidateFilters = {}) => {
    setLoading(true);
    try {
      return await apiRequest<PaginatedCandidates>(
        `/candidates${buildCandidatesQuery(filters)}`,
      );
    } finally {
      setLoading(false);
    }
  }, []);

  const getById = useCallback(async (id: string) => {
    setLoading(true);
    try {
      return await apiRequest<Candidate>(`/candidates/${id}`);
    } finally {
      setLoading(false);
    }
  }, []);

  const create = useCallback(async (data: CreateCandidateInput) => {
    setLoading(true);
    try {
      return await apiRequest<Candidate>('/candidates', {
        method: 'POST',
        body: JSON.stringify(data),
      });
    } finally {
      setLoading(false);
    }
  }, []);

  const validate = useCallback(async (id: string) => {
    setLoading(true);
    try {
      return await apiRequest<Candidate>(`/candidates/${id}/validate`, {
        method: 'POST',
      });
    } finally {
      setLoading(false);
    }
  }, []);

  const remove = useCallback(async (id: string) => {
    setLoading(true);
    try {
      return await apiRequest<Candidate>(`/candidates/${id}`, {
        method: 'DELETE',
      });
    } finally {
      setLoading(false);
    }
  }, []);

  return { list, getById, create, validate, remove, loading };
}
