import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useCandidates, type CreateCandidateInput } from '../hooks/useCandidates';
import { ApiError } from '../utils/api';

export function CandidateNewPage() {
  const { create, loading } = useCandidates();
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateCandidateInput>();

  const onSubmit = handleSubmit(async (data) => {
    try {
      const candidate = await create(data);
      toast.success('Candidat créé');
      navigate(`/candidates/${candidate._id}`);
    } catch (error) {
      toast.error(error instanceof ApiError ? error.message : 'Erreur de création');
    }
  });

  return (
    <div className="card">
      <h1>Nouveau candidat</h1>
      <form onSubmit={onSubmit}>
        <div className="form-group">
          <label htmlFor="firstName">Prénom</label>
          <input id="firstName" {...register('firstName', { required: true })} />
          {errors.firstName && <p className="error-text">Prénom requis</p>}
        </div>
        <div className="form-group">
          <label htmlFor="lastName">Nom</label>
          <input id="lastName" {...register('lastName', { required: true })} />
          {errors.lastName && <p className="error-text">Nom requis</p>}
        </div>
        <div className="form-group">
          <label htmlFor="email">E-mail</label>
          <input id="email" type="email" {...register('email', { required: true })} />
          {errors.email && <p className="error-text">E-mail requis</p>}
        </div>
        <div className="form-group">
          <label htmlFor="phone">Téléphone</label>
          <input id="phone" {...register('phone', { required: true, minLength: 6 })} />
          {errors.phone && <p className="error-text">Téléphone invalide</p>}
        </div>
        <button type="submit" disabled={loading}>
          {loading ? 'Création...' : 'Créer'}
        </button>
      </form>
    </div>
  );
}
