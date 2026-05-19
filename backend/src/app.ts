import express from 'express';
import cors from 'cors';
import { createAuthRoutes } from './routes/auth.routes';
import { createCandidateRoutes } from './routes/candidate.routes';
import { AuthController } from './controllers/auth.controller';
import { CandidateController } from './controllers/candidate.controller';
import { createAuthService } from './services/auth.service';
import { createCandidateService } from './services/candidate.service';
import { createRateLimiter } from './middlewares/rateLimit.middleware';
import { errorHandler } from './middlewares/error.middleware';

export function createApp() {
  const app = express();

  const corsOrigin = process.env.CORS_ORIGIN ?? 'http://localhost:5173';
  app.use(cors({ origin: corsOrigin }));
  app.use(express.json({ limit: '10kb' }));
  app.use(createRateLimiter());

  const authService = createAuthService();
  const candidateService = createCandidateService();

  const authController = new AuthController(authService);
  const candidateController = new CandidateController(candidateService);

  app.get('/health', (_req, res) => {
    res.json({ status: 'ok' });
  });

  app.use('/api/auth', createAuthRoutes(authController));
  app.use(
    '/api/candidates',
    createCandidateRoutes(candidateController, authService),
  );

  app.use(errorHandler);

  return app;
}
