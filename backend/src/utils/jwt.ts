import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';

export const generateToken = (id: string | mongoose.Types.ObjectId): string => {
  return jwt.sign(
    { id: id.toString() },
    process.env.JWT_SECRET || 'fallback-secret',
    { expiresIn: '7d' } as any
  );
};
