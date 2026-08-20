import mongoose, { Schema, Document } from 'mongoose';

export interface IPurchase extends Document {
  ingredientName: string;
  categoryId: string; // Storing as string for simplicity, or could ref a Category model
  supplierId?: mongoose.Types.ObjectId;
  restaurantId: mongoose.Types.ObjectId;
  quantity: number;
  unit: string;
  unitPrice: number;
  totalPrice: number;
  purchaseDate: Date;
  expiryDate: Date;
  createdAt: Date;
  updatedAt: Date;
}

const PurchaseSchema: Schema = new Schema(
  {
    ingredientName: { type: String, required: true },
    categoryId: { type: String, required: true },
    supplierId: { type: Schema.Types.ObjectId, ref: 'Supplier' },
    restaurantId: { type: Schema.Types.ObjectId, ref: 'Restaurant', required: true, index: true },
    quantity: { type: Number, required: true, min: 0.01 },
    unit: { type: String, required: true },
    unitPrice: { type: Number, required: true, min: 0 },
    totalPrice: { type: Number, required: true, min: 0 },
    purchaseDate: { type: Date, required: true },
    expiryDate: { type: Date, required: true },
  },
  { timestamps: true }
);

export default mongoose.model<IPurchase>('Purchase', PurchaseSchema);
