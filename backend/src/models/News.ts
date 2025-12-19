import mongoose, { Document, Schema } from 'mongoose';

export interface INews extends Document {
  title: string;
  description: string;
  content: string;
  source: string;
  url: string;
  imageUrl?: string;
  category: 'market' | 'bitcoin' | 'ethereum' | 'altcoins' | 'defi' | 'nft' | 'regulation' | 'general';
  tags: string[];
  publishedAt: Date;
  isBreaking: boolean;
  views: number;
  createdAt: Date;
}

const NewsSchema: Schema = new Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  source: {
    type: String,
    required: true,
  },
  url: {
    type: String,
    required: true,
  },
  imageUrl: {
    type: String,
  },
  category: {
    type: String,
    enum: ['market', 'bitcoin', 'ethereum', 'altcoins', 'defi', 'nft', 'regulation', 'general'],
    default: 'general',
  },
  tags: [{
    type: String,
  }],
  publishedAt: {
    type: Date,
    default: Date.now,
  },
  isBreaking: {
    type: Boolean,
    default: false,
  },
  views: {
    type: Number,
    default: 0,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Index for faster queries
NewsSchema.index({ publishedAt: -1 });
NewsSchema.index({ category: 1, publishedAt: -1 });

export default mongoose.model<INews>('News', NewsSchema);
