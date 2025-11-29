import { Response } from 'express';
import User from '../models/User';
import Trade from '../models/Trade';
import Transaction from '../models/Transaction';
import { AuthRequest } from '../middleware/auth';

// @desc    Get all users
// @route   GET /api/admin/users
export const getAllUsers = async (req: AuthRequest, res: Response) => {
  try {
    const users = await User.find().select('-password');

    res.status(200).json({
      success: true,
      count: users.length,
      data: users,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete user
// @route   DELETE /api/admin/user/:id
export const deleteUser = async (req: AuthRequest, res: Response) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    // Delete user's trades and transactions
    await Trade.deleteMany({ userId: req.params.id });
    await Transaction.deleteMany({ userId: req.params.id });

    await user.deleteOne();

    res.status(200).json({
      success: true,
      message: 'User deleted successfully',
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get platform stats
// @route   GET /api/admin/stats
export const getStats = async (req: AuthRequest, res: Response) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalTrades = await Trade.countDocuments();
    const totalTransactions = await Transaction.countDocuments();

    const recentTrades = await Trade.find()
      .populate('userId', 'name email')
      .sort({ createdAt: -1 })
      .limit(10);

    res.status(200).json({
      success: true,
      data: {
        totalUsers,
        totalTrades,
        totalTransactions,
        recentTrades,
      },
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};
