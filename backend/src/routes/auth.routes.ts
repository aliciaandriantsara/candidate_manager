import { Router } from 'express';
import { AuthController } from '../controllers/auth.controller';
import { validate } from '../middlewares/validate.middleware';
import { loginSchema } from '../validators/auth.validator';
import { createLoginRateLimiter } from '../middlewares/rateLimit.middleware';

export function createAuthRoutes(authController: AuthController): Router {
  const router = Router();
  const loginLimiter = createLoginRateLimiter();

  router.post(
    '/login',
    loginLimiter,
    validate(loginSchema),
    authController.login,
  );

  return router;
}
