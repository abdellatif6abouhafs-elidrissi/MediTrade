import mongoose, { Document, Schema } from 'mongoose';

export interface IPriceAlert extends Document {
  user: mongoose.Types.ObjectId;
  symbol: string;
  targetPrice: number;
  condition: 'above' | 'below';
  currentPriceAtCreation: number;
  isTriggered: boolean;
  triggeredAt?: Date;
  createdAt: Date;
}

const PriceAlertSchema: Schema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  symbol: {
    type: String,
    required: [true, 'Please add a symbol'],
    uppercase: true,
  },
  targetPrice: {
    type: Number,
    required: [true, 'Please add a target price'],
  },
  condition: {
    type: String,
    enum: ['above', 'below'],
    required: [true, 'Please specify condition (above/below)'],
  },
  currentPriceAtCreation: {
    type: Number,
    required: true,
  },
  isTriggered: {
    type: Boolean,
    default: false,
  },
  triggeredAt: {
    type: Date,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Index for faster queries
PriceAlertSchema.index({ user: 1, isTriggered: 1 });
PriceAlertSchema.index({ symbol: 1, isTriggered: 1 });

export default mongoose.model<IPriceAlert>('PriceAlert', PriceAlertSchema);
