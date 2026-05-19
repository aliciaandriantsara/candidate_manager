import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useCandidates } from '../hooks/useCandidates';
import type { Candidate } from '../utils/candidate';
import { ApiError } from '../utils/api';

export function CandidateDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { getById, validate, remove, loading } = useCandidates();
  const [candidate, setCandidate] = useState<Candidate | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!id) return;
    void (async () => {
      try {
        const data = await getById(id);
        setCandidate(data);
      } catch (error) {
        toast.error(error instanceof ApiError ? error.message : 'Candidat introuvable');
        navigate('/candidates');
      }
    })();
  }, [id, getById, navigate]);

  const handleValidate = async () => {
    if (!id) return;
    try {
      const updated = await validate(id);
      setCandidate(updated);
      toast.success('Candidat validé');
    } catch (error) {
      toast.error(error instanceof ApiError ? error.message : 'Erreur de validation');
    }
  };

  const handleDelete = async () => {
    if (!id) return;
    try {
      await remove(id);
      toast.success('Candidat supprimé');
      navigate('/candidates');
    } catch (error) {
      toast.error(error instanceof ApiError ? error.message : 'Erreur de suppression');
    }
  };

  if (!candidate) {
    return <p>{loading ? 'Chargement...' : 'Candidat introuvable'}</p>;
  }

  return (
    <div className="card">
      <h1>
        {candidate.firstName} {candidate.lastName}
      </h1>
      <p>
        <strong>E-mail :</strong> {candidate.email}
      </p>
      <p>
        <strong>Téléphone :</strong> {candidate.phone}
      </p>
      <p>
        <strong>Statut :</strong> {candidate.status}
      </p>
      <div className="actions">
        <button
          type="button"
          onClick={() => void handleValidate()}
          disabled={loading || candidate.status === 'validated'}
        >
          {loading ? 'Validation...' : 'Valider'}
        </button>
        <button
          type="button"
          className="danger"
          onClick={() => void handleDelete()}
          disabled={loading}
        >
          {loading ? 'Suppression...' : 'Supprimer'}
        </button>
      </div>
    </div>
  );
}
