import mongoose, { Schema, Document } from 'mongoose';

export interface IIngredient extends Document {
  name: string;
  category: string;
  quantity: number;
  unit: string;
  minimumStockLevel: number;
  purchasePrice: number;
  supplierId?: mongoose.Types.ObjectId;
  purchaseDate?: Date;
  expiryDate: Date;
  restaurantId: mongoose.Types.ObjectId;
  averageDailyUsage: number; // dynamically updated by usage/waste/purchases
  createdAt: Date;
  updatedAt: Date;
}

const IngredientSchema: Schema = new Schema(
  {
    name: { type: String, required: true },
    category: { type: String, required: true },
    quantity: { type: Number, required: true, min: 0 },
    unit: { type: String, required: true },
    minimumStockLevel: { type: Number, required: true, min: 0 },
    purchasePrice: { type: Number, required: true, min: 0 },
    supplierId: { type: Schema.Types.ObjectId, ref: 'Supplier' }, // Assuming we'll have a Supplier model
    purchaseDate: { type: Date },
    expiryDate: { type: Date, required: true },
    restaurantId: { type: Schema.Types.ObjectId, ref: 'Restaurant', required: true, index: true },
    averageDailyUsage: { type: Number, default: 0 },
  },
  { timestamps: true }
);

// Indexes for fast querying (by expiry date and category)
IngredientSchema.index({ expiryDate: 1 });
IngredientSchema.index({ category: 1 });

export default mongoose.model<IIngredient>('Ingredient', IngredientSchema);
