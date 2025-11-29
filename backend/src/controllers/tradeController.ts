import { Response } from 'express';
import Trade from '../models/Trade';
import User from '../models/User';
import { AuthRequest } from '../middleware/auth';

// Mock cryptocurrency prices
const mockPrices: { [key: string]: number } = {
  BTC: 43250.75,
  ETH: 2280.50,
  BNB: 315.20,
  SOL: 98.45,
  XRP: 0.62,
  ADA: 0.58,
  DOGE: 0.085,
  MATIC: 0.92,
  DOT: 7.35,
  AVAX: 36.80,
};

// @desc    Get cryptocurrency prices
// @route   GET /api/prices
export const getPrices = async (req: AuthRequest, res: Response) => {
  try {
    // Simulate real-time price changes
    const prices = Object.entries(mockPrices).map(([symbol, basePrice]) => {
      const change = (Math.random() - 0.5) * 5; // Random change between -2.5% to +2.5%
      const price = basePrice * (1 + change / 100);
      const change24h = (Math.random() - 0.5) * 10; // Random 24h change

      return {
        symbol,
        name: getFullName(symbol),
        price: parseFloat(price.toFixed(2)),
        change24h: parseFloat(change24h.toFixed(2)),
        volume24h: Math.floor(Math.random() * 1000000000),
        marketCap: Math.floor(Math.random() * 100000000000),
      };
    });

    res.status(200).json({
      success: true,
      data: prices,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Buy cryptocurrency
// @route   POST /api/trades/buy
export const buyTrade = async (req: AuthRequest, res: Response) => {
  try {
    const { symbol, amount, price } = req.body;
    const total = amount * price;

    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    // Check if user has enough balance
    if (user.balance < total) {
      return res.status(400).json({ success: false, message: 'Insufficient balance' });
    }

    // Update user balance
    user.balance -= total;

    // Update portfolio
    const existingPosition = user.portfolio.find((p) => p.symbol === symbol);
    if (existingPosition) {
      const totalAmount = existingPosition.amount + amount;
      const totalCost = existingPosition.amount * existingPosition.averagePrice + total;
      existingPosition.amount = totalAmount;
      existingPosition.averagePrice = totalCost / totalAmount;
    } else {
      user.portfolio.push({
        symbol,
        amount,
        averagePrice: price,
      });
    }

    await user.save();

    // Create trade record
    const trade = await Trade.create({
      userId: req.user.id,
      symbol,
      type: 'buy',
      amount,
      price,
      total,
    });

    res.status(201).json({
      success: true,
      data: trade,
      balance: user.balance,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Sell cryptocurrency
// @route   POST /api/trades/sell
export const sellTrade = async (req: AuthRequest, res: Response) => {
  try {
    const { symbol, amount, price } = req.body;
    const total = amount * price;

    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    // Check if user has enough of the asset
    const existingPosition = user.portfolio.find((p) => p.symbol === symbol);
    if (!existingPosition || existingPosition.amount < amount) {
      return res.status(400).json({ success: false, message: 'Insufficient assets' });
    }

    // Update user balance
    user.balance += total;

    // Update portfolio
    existingPosition.amount -= amount;
    if (existingPosition.amount === 0) {
      user.portfolio = user.portfolio.filter((p) => p.symbol !== symbol);
    }

    await user.save();

    // Create trade record
    const trade = await Trade.create({
      userId: req.user.id,
      symbol,
      type: 'sell',
      amount,
      price,
      total,
    });

    res.status(201).json({
      success: true,
      data: trade,
      balance: user.balance,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get trade history
// @route   GET /api/trades/history
export const getTradeHistory = async (req: AuthRequest, res: Response) => {
  try {
    const trades = await Trade.find({ userId: req.user.id }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: trades.length,
      data: trades,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Helper function to get full cryptocurrency names
function getFullName(symbol: string): string {
  const names: { [key: string]: string } = {
    BTC: 'Bitcoin',
    ETH: 'Ethereum',
    BNB: 'Binance Coin',
    SOL: 'Solana',
    XRP: 'Ripple',
    ADA: 'Cardano',
    DOGE: 'Dogecoin',
    MATIC: 'Polygon',
    DOT: 'Polkadot',
    AVAX: 'Avalanche',
  };
  return names[symbol] || symbol;
}
