import { Schema, Document } from 'mongoose';

export const OrdersSchema = new Schema({
  productId: String,
  productName: String,
  productSku: String,
  productType: String,
  userId: String,
  qty: Number,
});

export interface Orders extends Document {
  readonly productId: String,
  readonly productName: String,
  readonly productSku: String,
  readonly productType: String,
  readonly userId: String,
  readonly qty: number,
}