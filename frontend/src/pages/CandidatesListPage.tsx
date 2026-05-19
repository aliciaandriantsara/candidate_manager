import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useCandidates } from '../hooks/useCandidates';
import type { Candidate, CandidateStatus } from '../utils/candidate';
import { ApiError } from '../utils/api';

export function CandidatesListPage() {
  const { list, loading } = useCandidates();
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [status, setStatus] = useState<CandidateStatus | ''>('');
  const [name, setName] = useState('');

  const fetchCandidates = async () => {
    try {
      const result = await list({
        page,
        limit: 10,
        status: status || undefined,
        name: name || undefined,
      });
      setCandidates(result.data);
      setTotalPages(result.totalPages);
    } catch (error) {
      toast.error(error instanceof ApiError ? error.message : 'Erreur de chargement');
    }
  };

  useEffect(() => {
    void fetchCandidates();
  }, [page, status, name]);

  return (
    <div className="card">
      <h1>Candidats</h1>
      <div className="filters">
        <div className="form-group">
          <label htmlFor="status">Statut</label>
          <select
            id="status"
            value={status}
            onChange={(e) => {
              setPage(1);
              setStatus(e.target.value as CandidateStatus | '');
            }}
          >
            <option value="">Tous</option>
            <option value="pending">En attente</option>
            <option value="validated">Validé</option>
            <option value="rejected">Rejeté</option>
          </select>
        </div>
        <div className="form-group">
          <label htmlFor="name">Nom</label>
          <input
            id="name"
            value={name}
            onChange={(e) => {
              setPage(1);
              setName(e.target.value);
            }}
            placeholder="Rechercher par nom"
          />
        </div>
        <button type="button" onClick={() => void fetchCandidates()} disabled={loading}>
          {loading ? 'Chargement...' : 'Filtrer'}
        </button>
      </div>
      {loading && candidates.length === 0 ? (
        <p>Chargement...</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Nom</th>
              <th>E-mail</th>
              <th>Statut</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {candidates.map((c) => (
              <tr key={c._id}>
                <td>
                  {c.firstName} {c.lastName}
                </td>
                <td>{c.email}</td>
                <td>{c.status}</td>
                <td>
                  <Link to={`/candidates/${c._id}`}>Voir</Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      <div className="pagination">
        <button
          type="button"
          disabled={page <= 1 || loading}
          onClick={() => setPage((p) => p - 1)}
        >
          Précédent
        </button>
        <span>
          Page {page} / {totalPages}
        </span>
        <button
          type="button"
          disabled={page >= totalPages || loading}
          onClick={() => setPage((p) => p + 1)}
        >
          Suivant
        </button>
      </div>
    </div>
  );
}
