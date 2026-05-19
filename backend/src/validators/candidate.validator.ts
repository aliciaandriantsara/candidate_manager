import './zodFrench';
import { z } from 'zod';

export const candidateStatusEnum = z.enum(['pending', 'validated', 'rejected']);

export const createCandidateSchema = z
  .object({
    firstName: z.string().min(1, 'Le prénom est requis'),
    lastName: z.string().min(1, 'Le nom est requis'),
    email: z.string().email('Adresse e-mail invalide'),
    phone: z
      .string()
      .min(6, 'Le téléphone doit contenir au moins 6 caractères')
      .regex(/^[+0-9\s()-]+$/, 'Format de téléphone invalide'),
  })
  .strict();

export const updateCandidateSchema = createCandidateSchema.partial().strict();

export const listCandidatesQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(10),
  status: candidateStatusEnum.optional(),
  name: z.string().optional(),
});

export type CreateCandidateInput = z.infer<typeof createCandidateSchema>;
export type UpdateCandidateInput = z.infer<typeof updateCandidateSchema>;
