export class AppError extends Error {
  constructor(
    public statusCode: number,
    message: string,
    public details?: unknown,
  ) {
    super(message);
    this.name = 'AppError';
  }
}

export class NotFoundError extends AppError {
  constructor(message = 'Ressource introuvable') {
    super(404, message);
    this.name = 'NotFoundError';
  }
}

export class UnauthorizedError extends AppError {
  constructor(message = 'Non autorisé') {
    super(401, message);
    this.name = 'UnauthorizedError';
  }
}

export class ValidationError extends AppError {
  constructor(message = 'Données invalides', details?: unknown) {
    super(400, message, details);
    this.name = 'ValidationError';
  }
}
