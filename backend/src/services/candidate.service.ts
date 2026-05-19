import mongoose from 'mongoose';
import { Candidate, type ICandidate } from '../models/Candidate';
import { NotFoundError, ValidationError } from '../utils/errors';

function assertValidId(id: string): void {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new NotFoundError('Candidat introuvable');
  }
}
import type {
  CreateCandidateInput,
  UpdateCandidateInput,
} from '../validators/candidate.validator';

export interface ListCandidatesOptions {
  page: number;
  limit: number;
  status?: 'pending' | 'validated' | 'rejected';
  name?: string;
}

export interface PaginatedResult<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export class CandidateService {
  constructor(private readonly validationDelayMs: number) {}

  async create(data: CreateCandidateInput): Promise<ICandidate> {
    try {
      const candidate = await Candidate.create({
        ...data,
        status: 'pending',
        deletedAt: null,
      });
      return candidate;
    } catch (error: unknown) {
      if (
        error &&
        typeof error === 'object' &&
        'code' in error &&
        (error as { code: number }).code === 11000
      ) {
        throw new ValidationError('Un candidat avec cet e-mail existe déjà');
      }
      throw error;
    }
  }

  async findById(id: string): Promise<ICandidate> {
    assertValidId(id);
    const candidate = await Candidate.findOne({
      _id: id,
      deletedAt: null,
    });
    if (!candidate) {
      throw new NotFoundError('Candidat introuvable');
    }
    return candidate;
  }

  async list(options: ListCandidatesOptions): Promise<PaginatedResult<ICandidate>> {
    const filter: Record<string, unknown> = { deletedAt: null };

    if (options.status) {
      filter.status = options.status;
    }

    if (options.name) {
      const regex = new RegExp(options.name, 'i');
      filter.$or = [{ firstName: regex }, { lastName: regex }];
    }

    const skip = (options.page - 1) * options.limit;

    const [data, total] = await Promise.all([
      Candidate.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(options.limit),
      Candidate.countDocuments(filter),
    ]);

    return {
      data,
      total,
      page: options.page,
      limit: options.limit,
      totalPages: Math.ceil(total / options.limit) || 1,
    };
  }

  async update(id: string, data: UpdateCandidateInput): Promise<ICandidate> {
    assertValidId(id);
    const candidate = await Candidate.findOneAndUpdate(
      { _id: id, deletedAt: null },
      { $set: data },
      { new: true, runValidators: true },
    );

    if (!candidate) {
      throw new NotFoundError('Candidat introuvable');
    }

    return candidate;
  }

  async softDelete(id: string): Promise<ICandidate> {
    assertValidId(id);
    const candidate = await Candidate.findOneAndUpdate(
      { _id: id, deletedAt: null },
      { $set: { deletedAt: new Date() } },
      { new: true },
    );

    if (!candidate) {
      throw new NotFoundError('Candidat introuvable');
    }

    return candidate;
  }

  async validateAsync(id: string): Promise<ICandidate> {
    const candidate = await this.findById(id);

    if (candidate.status === 'validated') {
      return candidate;
    }

    await this.delay(this.validationDelayMs);

    const updated = await Candidate.findOneAndUpdate(
      { _id: id, deletedAt: null },
      { $set: { status: 'validated' } },
      { new: true },
    );

    if (!updated) {
      throw new NotFoundError('Candidat introuvable');
    }

    return updated;
  }

  private delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}

export function createCandidateService(): CandidateService {
  const delay = Number(process.env.VALIDATION_DELAY_MS ?? 2000);
  return new CandidateService(delay);
}
