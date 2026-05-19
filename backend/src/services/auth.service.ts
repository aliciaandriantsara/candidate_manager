import jwt from 'jsonwebtoken';
import { UnauthorizedError } from '../utils/errors';
import type { LoginInput } from '../validators/auth.validator';

export interface AuthTokenPayload {
  sub: string;
  email: string;
}

export class AuthService {
  constructor(
    private readonly jwtSecret: string,
    private readonly jwtExpiresIn: string,
    private readonly adminEmail: string,
    private readonly adminPassword: string,
  ) {}

  login(credentials: LoginInput): { token: string } {
    if (
      credentials.email !== this.adminEmail ||
      credentials.password !== this.adminPassword
    ) {
      throw new UnauthorizedError('Identifiants invalides');
    }

    const payload: AuthTokenPayload = {
      sub: 'admin',
      email: credentials.email,
    };

    const token = jwt.sign(payload, this.jwtSecret, {
      expiresIn: this.jwtExpiresIn,
    } as jwt.SignOptions);

    return { token };
  }

  verifyToken(token: string): AuthTokenPayload {
    try {
      return jwt.verify(token, this.jwtSecret) as AuthTokenPayload;
    } catch {
      throw new UnauthorizedError('Token invalide ou expiré');
    }
  }
}

export function createAuthService(): AuthService {
  const jwtSecret = process.env.JWT_SECRET;
  if (!jwtSecret || jwtSecret.length < 32) {
    throw new Error('JWT_SECRET must be at least 32 characters');
  }

  return new AuthService(
    jwtSecret,
    process.env.JWT_EXPIRES_IN ?? '1d',
    process.env.AUTH_EMAIL ?? 'admin@example.com',
    process.env.AUTH_PASSWORD ?? 'Admin123!',
  );
}
