import mongoose, { Document, Schema } from 'mongoose';

export interface IWatchlist extends Document {
  user: mongoose.Types.ObjectId;
  symbols: string[];
  updatedAt: Date;
}

const WatchlistSchema: Schema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true,
  },
  symbols: [{
    type: String,
    uppercase: true,
  }],
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Update timestamp on save
WatchlistSchema.pre('save', function(next: () => void) {
  this.updatedAt = new Date();
  next();
});

export default mongoose.model<IWatchlist>('Watchlist', WatchlistSchema);
