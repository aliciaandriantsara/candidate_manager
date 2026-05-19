import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuth } from '../hooks/useAuth';
import { ApiError } from '../utils/api';

interface LoginForm {
  email: string;
  password: string;
}

export function LoginPage() {
  const { login, loading } = useAuth();
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>({
    defaultValues: { email: 'admin@example.com', password: 'Admin123!' },
  });

  const onSubmit = handleSubmit(async (data) => {
    try {
      await login(data.email, data.password);
      toast.success('Connexion réussie');
      navigate('/candidates');
    } catch (error) {
      const message =
        error instanceof ApiError ? error.message : 'Échec de la connexion';
      toast.error(message);
    }
  });

  return (
    <div className="container">
      <div className="card" style={{ maxWidth: 420, margin: '4rem auto' }}>
        <h1>Connexion</h1>
        <form onSubmit={onSubmit}>
          <div className="form-group">
            <label htmlFor="email">E-mail</label>
            <input id="email" type="email" {...register('email', { required: true })} />
            {errors.email && <p className="error-text">E-mail requis</p>}
          </div>
          <div className="form-group">
            <label htmlFor="password">Mot de passe</label>
            <input
              id="password"
              type="password"
              {...register('password', { required: true })}
            />
            {errors.password && <p className="error-text">Mot de passe requis</p>}
          </div>
          <button type="submit" disabled={loading}>
            {loading ? 'Connexion...' : 'Se connecter'}
          </button>
        </form>
      </div>
    </div>
  );
}
