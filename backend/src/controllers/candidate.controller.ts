import { Response, NextFunction } from 'express';
import { CandidateService } from '../services/candidate.service';
import { AuthenticatedRequest } from '../middlewares/auth.middleware';

export class CandidateController {
  constructor(private readonly candidateService: CandidateService) {}

  create = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const candidate = await this.candidateService.create(req.body);
      res.status(201).json(candidate);
    } catch (error) {
      next(error);
    }
  };

  list = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const result = await this.candidateService.list(req.query as never);
      res.json(result);
    } catch (error) {
      next(error);
    }
  };

  getById = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const candidate = await this.candidateService.findById(req.params.id as string);
      res.json(candidate);
    } catch (error) {
      next(error);
    }
  };

  update = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const candidate = await this.candidateService.update(
        req.params.id as string,
        req.body,
      );
      res.json(candidate);
    } catch (error) {
      next(error);
    }
  };

  remove = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const candidate = await this.candidateService.softDelete(req.params.id as string);
      res.json(candidate);
    } catch (error) {
      next(error);
    }
  };

  validate = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const candidate = await this.candidateService.validateAsync(req.params.id as string);
      res.json(candidate);
    } catch (error) {
      next(error);
    }
  };
}
