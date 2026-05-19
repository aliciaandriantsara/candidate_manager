import { Request, Response, NextFunction } from 'express';
import { AuthService } from '../services/auth.service';
import { UnauthorizedError } from '../utils/errors';

export interface AuthenticatedRequest extends Request {
  user?: { sub: string; email: string };
}

export function createAuthMiddleware(authService: AuthService) {
  return (req: AuthenticatedRequest, _res: Response, next: NextFunction): void => {
    const header = req.headers.authorization;
    if (!header?.startsWith('Bearer ')) {
      next(new UnauthorizedError('Token manquant'));
      return;
    }

    const token = header.slice(7);
    try {
      req.user = authService.verifyToken(token);
      next();
    } catch (error) {
      next(error);
    }
  };
}
