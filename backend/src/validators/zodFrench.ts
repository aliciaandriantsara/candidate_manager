import { z } from 'zod';

const frenchMessages: z.ZodErrorMap = (issue, ctx) => {
  switch (issue.code) {
    case z.ZodIssueCode.invalid_type:
      if (issue.expected === 'string') {
        return { message: 'Ce champ doit être une chaîne de caractères' };
      }
      return { message: `Type invalide (attendu: ${issue.expected})` };
    case z.ZodIssueCode.too_small:
      if (issue.type === 'string') {
        return {
          message: `Ce champ doit contenir au moins ${issue.minimum} caractère(s)`,
        };
      }
      return { message: 'Valeur trop petite' };
    case z.ZodIssueCode.invalid_string:
      if (issue.validation === 'email') {
        return { message: 'Adresse e-mail invalide' };
      }
      return { message: ctx.defaultError };
    default:
      return { message: ctx.defaultError };
  }
};

z.setErrorMap(frenchMessages);

export { z };
