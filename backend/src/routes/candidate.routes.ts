import { Router } from 'express';
import { CandidateController } from '../controllers/candidate.controller';
import { validate } from '../middlewares/validate.middleware';
import {
  createCandidateSchema,
  updateCandidateSchema,
  listCandidatesQuerySchema,
} from '../validators/candidate.validator';
import { createAuthMiddleware } from '../middlewares/auth.middleware';
import { AuthService } from '../services/auth.service';

export function createCandidateRoutes(
  candidateController: CandidateController,
  authService: AuthService,
): Router {
  const router = Router();
  const auth = createAuthMiddleware(authService);

  router.use(auth);

  router.get('/', validate(listCandidatesQuerySchema, 'query'), candidateController.list);
  router.post('/', validate(createCandidateSchema), candidateController.create);
  router.get('/:id', candidateController.getById);
  router.put('/:id', validate(updateCandidateSchema), candidateController.update);
  router.delete('/:id', candidateController.remove);
  router.post('/:id/validate', candidateController.validate);

  return router;
}
