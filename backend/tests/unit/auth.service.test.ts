import { AuthService } from '../../src/services/auth.service';
import { UnauthorizedError } from '../../src/utils/errors';

describe('AuthService', () => {
  const service = new AuthService(
    'test-jwt-secret-for-integration-tests!!',
    '1h',
    'admin@example.com',
    'Admin123!',
  );

  it('returns a token for valid credentials', () => {
    const result = service.login({
      email: 'admin@example.com',
      password: 'Admin123!',
    });
    expect(result.token).toBeDefined();
    expect(typeof result.token).toBe('string');
  });

  it('throws for invalid credentials', () => {
    expect(() =>
      service.login({ email: 'wrong@example.com', password: 'wrong' }),
    ).toThrow(UnauthorizedError);
  });

  it('verifies a valid token', () => {
    const { token } = service.login({
      email: 'admin@example.com',
      password: 'Admin123!',
    });
    const payload = service.verifyToken(token);
    expect(payload.email).toBe('admin@example.com');
    expect(payload.sub).toBe('admin');
  });

  it('throws for invalid token', () => {
    expect(() => service.verifyToken('invalid.token.here')).toThrow(
      UnauthorizedError,
    );
  });
});
