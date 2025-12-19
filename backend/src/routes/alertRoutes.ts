import express, { Request, Response } from 'express';
import PriceAlert from '../models/PriceAlert';
import { protect } from '../middleware/auth';

const router = express.Router();

// @route   GET /api/alerts
// @desc    Get user's price alerts
// @access  Private
router.get('/', protect, async (req: Request, res: Response) => {
  try {
    const alerts = await PriceAlert.find({ user: (req as any).user._id })
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: alerts.length,
      data: alerts,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Error fetching alerts',
      error: error.message,
    });
  }
});

// @route   POST /api/alerts
// @desc    Create a new price alert
// @access  Private
router.post('/', protect, async (req: Request, res: Response) => {
  try {
    const { symbol, targetPrice, condition, currentPrice } = req.body;

    // Validate
    if (!symbol || !targetPrice || !condition || !currentPrice) {
      return res.status(400).json({
        success: false,
        message: 'Please provide symbol, targetPrice, condition, and currentPrice',
      });
    }

    // Check if user already has an alert for this symbol with same condition
    const existingAlert = await PriceAlert.findOne({
      user: (req as any).user._id,
      symbol: symbol.toUpperCase(),
      condition,
      isTriggered: false,
    });

    if (existingAlert) {
      return res.status(400).json({
        success: false,
        message: `You already have a ${condition} alert for ${symbol}`,
      });
    }

    // Limit alerts per user
    const alertCount = await PriceAlert.countDocuments({
      user: (req as any).user._id,
      isTriggered: false,
    });

    if (alertCount >= 10) {
      return res.status(400).json({
        success: false,
        message: 'Maximum 10 active alerts allowed. Delete some to add more.',
      });
    }

    const alert = await PriceAlert.create({
      user: (req as any).user._id,
      symbol: symbol.toUpperCase(),
      targetPrice,
      condition,
      currentPriceAtCreation: currentPrice,
    });

    res.status(201).json({
      success: true,
      data: alert,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Error creating alert',
      error: error.message,
    });
  }
});

// @route   DELETE /api/alerts/:id
// @desc    Delete a price alert
// @access  Private
router.delete('/:id', protect, async (req: Request, res: Response) => {
  try {
    const alert = await PriceAlert.findById(req.params.id);

    if (!alert) {
      return res.status(404).json({
        success: false,
        message: 'Alert not found',
      });
    }

    // Check ownership
    if (alert.user.toString() !== (req as any).user._id.toString()) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized to delete this alert',
      });
    }

    await alert.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Alert deleted',
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Error deleting alert',
      error: error.message,
    });
  }
});

// @route   POST /api/alerts/check
// @desc    Check and trigger alerts based on current prices
// @access  Public (called by frontend periodically)
router.post('/check', async (req: Request, res: Response) => {
  try {
    const { prices } = req.body; // Array of { symbol, price }

    if (!prices || !Array.isArray(prices)) {
      return res.status(400).json({
        success: false,
        message: 'Please provide prices array',
      });
    }

    const triggeredAlerts: any[] = [];

    for (const priceData of prices) {
      const { symbol, price } = priceData;

      // Find alerts that should be triggered
      const alertsToTrigger = await PriceAlert.find({
        symbol: symbol.toUpperCase(),
        isTriggered: false,
        $or: [
          { condition: 'above', targetPrice: { $lte: price } },
          { condition: 'below', targetPrice: { $gte: price } },
        ],
      }).populate('user', 'name email');

      for (const alert of alertsToTrigger) {
        alert.isTriggered = true;
        alert.triggeredAt = new Date();
        await alert.save();
        triggeredAlerts.push({
          ...alert.toObject(),
          currentPrice: price,
        });
      }
    }

    res.status(200).json({
      success: true,
      triggeredCount: triggeredAlerts.length,
      data: triggeredAlerts,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Error checking alerts',
      error: error.message,
    });
  }
});

// @route   GET /api/alerts/triggered
// @desc    Get user's triggered alerts (unread)
// @access  Private
router.get('/triggered', protect, async (req: Request, res: Response) => {
  try {
    const alerts = await PriceAlert.find({
      user: (req as any).user._id,
      isTriggered: true,
    }).sort({ triggeredAt: -1 });

    res.status(200).json({
      success: true,
      count: alerts.length,
      data: alerts,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Error fetching triggered alerts',
      error: error.message,
    });
  }
});

export default router;
