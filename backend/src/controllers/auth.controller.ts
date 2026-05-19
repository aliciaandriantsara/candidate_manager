import { Request, Response, NextFunction } from 'express';
import { AuthService } from '../services/auth.service';

export class AuthController {
  constructor(private readonly authService: AuthService) {}

  login = (req: Request, res: Response, next: NextFunction): void => {
    try {
      const result = this.authService.login(req.body);
      res.json(result);
    } catch (error) {
      next(error);
    }
  };
}
