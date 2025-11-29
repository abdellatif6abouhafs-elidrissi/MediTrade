import { Response } from 'express';
import User from '../models/User';
import Transaction from '../models/Transaction';
import { AuthRequest } from '../middleware/auth';

// @desc    Get wallet info
// @route   GET /api/wallet
export const getWallet = async (req: AuthRequest, res: Response) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const transactions = await Transaction.find({ userId: req.user.id })
      .sort({ createdAt: -1 })
      .limit(10);

    res.status(200).json({
      success: true,
      data: {
        balance: user.balance,
        portfolio: user.portfolio,
        recentTransactions: transactions,
      },
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Deposit funds
// @route   POST /api/wallet/deposit
export const deposit = async (req: AuthRequest, res: Response) => {
  try {
    const { amount } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({ success: false, message: 'Please provide a valid amount' });
    }

    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    // Update balance
    user.balance += amount;
    await user.save();

    // Create transaction record
    const transaction = await Transaction.create({
      userId: req.user.id,
      type: 'deposit',
      amount,
      status: 'completed',
      description: 'Virtual wallet deposit',
    });

    res.status(201).json({
      success: true,
      data: transaction,
      balance: user.balance,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Withdraw funds
// @route   POST /api/wallet/withdraw
export const withdraw = async (req: AuthRequest, res: Response) => {
  try {
    const { amount } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({ success: false, message: 'Please provide a valid amount' });
    }

    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    // Check if user has enough balance
    if (user.balance < amount) {
      return res.status(400).json({ success: false, message: 'Insufficient balance' });
    }

    // Update balance
    user.balance -= amount;
    await user.save();

    // Create transaction record
    const transaction = await Transaction.create({
      userId: req.user.id,
      type: 'withdraw',
      amount,
      status: 'completed',
      description: 'Virtual wallet withdrawal',
    });

    res.status(201).json({
      success: true,
      data: transaction,
      balance: user.balance,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};
