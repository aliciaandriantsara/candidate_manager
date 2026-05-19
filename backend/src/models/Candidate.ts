import mongoose, { Document, Schema } from 'mongoose';

export type CandidateStatus = 'pending' | 'validated' | 'rejected';

export interface ICandidate extends Document {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  status: CandidateStatus;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
}

const candidateSchema = new Schema<ICandidate>(
  {
    firstName: { type: String, required: true, trim: true },
    lastName: { type: String, required: true, trim: true },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    phone: { type: String, required: true, trim: true },
    status: {
      type: String,
      enum: ['pending', 'validated', 'rejected'],
      default: 'pending',
    },
    deletedAt: { type: Date, default: null },
  },
  { timestamps: true },
);

candidateSchema.index({ deletedAt: 1 });
candidateSchema.index({ status: 1, lastName: 1, firstName: 1 });

export const Candidate = mongoose.model<ICandidate>('Candidate', candidateSchema);
