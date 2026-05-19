import rateLimit from 'express-rate-limit';

export function createRateLimiter() {
  const windowMs = Number(process.env.RATE_LIMIT_WINDOW_MS ?? 900000);
  const max = Number(process.env.RATE_LIMIT_MAX ?? 100);

  return rateLimit({
    windowMs,
    max,
    standardHeaders: true,
    legacyHeaders: false,
    message: {
      error: 'Trop de requêtes, veuillez réessayer plus tard',
    },
    skip: () => process.env.NODE_ENV === 'test',
  });
}

export function createLoginRateLimiter() {
  const max = Number(
    process.env.LOGIN_RATE_LIMIT_MAX ?? (process.env.NODE_ENV === 'test' ? 5 : 5),
  );
  return rateLimit({
    windowMs: 15 * 60 * 1000,
    max,
    standardHeaders: true,
    legacyHeaders: false,
    message: {
      error: 'Trop de tentatives de connexion, veuillez réessayer plus tard',
    },
    skipSuccessfulRequests: true,
  });
}
