import mongoose, { Schema, Document } from 'mongoose';

export interface IExperimentEvent extends Document {
  experimentId: string;
  userId?: string;
  variant: string;
  event: 'VIEW' | 'CLICK' | 'ACTION_COMPLETED';
  metadata?: any;
  createdAt: Date;
}

const ExperimentEventSchema: Schema = new Schema(
  {
    experimentId: { type: String, required: true, index: true },
    userId: { type: String, index: true },
    variant: { type: String, required: true },
    event: { type: String, enum: ['VIEW', 'CLICK', 'ACTION_COMPLETED'], required: true },
    metadata: { type: Schema.Types.Mixed },
  },
  { timestamps: true }
);

export default mongoose.model<IExperimentEvent>('ExperimentEvent', ExperimentEventSchema);
