import mongoose, { Document, Schema } from 'mongoose';

export interface ITrade extends Document {
  userId: mongoose.Types.ObjectId;
  symbol: string;
  type: 'buy' | 'sell';
  amount: number;
  price: number;
  total: number;
  createdAt: Date;
}

const TradeSchema: Schema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    symbol: {
      type: String,
      required: [true, 'Please provide a symbol'],
      uppercase: true,
    },
    type: {
      type: String,
      enum: ['buy', 'sell'],
      required: true,
    },
    amount: {
      type: Number,
      required: [true, 'Please provide an amount'],
      min: 0,
    },
    price: {
      type: Number,
      required: [true, 'Please provide a price'],
      min: 0,
    },
    total: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<ITrade>('Trade', TradeSchema);
