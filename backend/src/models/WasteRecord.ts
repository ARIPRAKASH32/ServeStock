import mongoose, { Schema, Document } from 'mongoose';

export interface IWasteRecord extends Document {
  ingredientId: mongoose.Types.ObjectId;
  restaurantId: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  quantity: number;
  reason: 'EXPIRED' | 'SPOILED' | 'OVERPRODUCTION' | 'DAMAGED' | 'PREPARATION_WASTE' | 'CUSTOMER_RETURN' | 'OTHER';
  cost: number; // Calculated cost of waste (quantity * purchasePrice)
  date: Date;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const WasteRecordSchema: Schema = new Schema(
  {
    ingredientId: { type: Schema.Types.ObjectId, ref: 'Ingredient', required: true, index: true },
    restaurantId: { type: Schema.Types.ObjectId, ref: 'Restaurant', required: true, index: true },
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    quantity: { type: Number, required: true, min: 0.01 },
    reason: {
      type: String,
      enum: ['EXPIRED', 'SPOILED', 'OVERPRODUCTION', 'DAMAGED', 'PREPARATION_WASTE', 'CUSTOMER_RETURN', 'OTHER'],
      required: true,
    },
    cost: { type: Number, required: true, min: 0 },
    date: { type: Date, default: Date.now, index: true },
    notes: { type: String },
  },
  { timestamps: true }
);

export default mongoose.model<IWasteRecord>('WasteRecord', WasteRecordSchema);
