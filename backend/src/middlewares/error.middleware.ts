import { Request, Response, NextFunction } from 'express';
import { AppError } from '../utils/errors';
import { logger } from '../utils/logger';

export function errorHandler(
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction,
): void {
  if (err instanceof AppError) {
    logger.warn('Application error', {
      statusCode: err.statusCode,
      message: err.message,
      details: err.details,
    });
    res.status(err.statusCode).json({
      error: err.message,
      details: err.details,
    });
    return;
  }

  logger.error('Unhandled error', { message: err.message, stack: err.stack });
  res.status(500).json({ error: 'Erreur interne du serveur' });
}
