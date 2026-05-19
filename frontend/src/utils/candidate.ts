export type CandidateStatus = 'pending' | 'validated' | 'rejected';

export interface Candidate {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  status: CandidateStatus;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}

export interface PaginatedCandidates {
  data: Candidate[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface CandidateFilters {
  page?: number;
  limit?: number;
  status?: CandidateStatus;
  name?: string;
}

export function buildCandidatesQuery(filters: CandidateFilters): string {
  const params = new URLSearchParams();
  if (filters.page) params.set('page', String(filters.page));
  if (filters.limit) params.set('limit', String(filters.limit));
  if (filters.status) params.set('status', filters.status);
  if (filters.name) params.set('name', filters.name);
  const query = params.toString();
  return query ? `?${query}` : '';
}
