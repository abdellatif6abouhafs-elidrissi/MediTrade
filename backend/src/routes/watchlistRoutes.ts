import express, { Request, Response } from 'express';
import Watchlist from '../models/Watchlist';
import { protect } from '../middleware/auth';

const router = express.Router();

// @route   GET /api/watchlist
// @desc    Get user's watchlist
// @access  Private
router.get('/', protect, async (req: Request, res: Response) => {
  try {
    let watchlist = await Watchlist.findOne({ user: (req as any).user._id });

    if (!watchlist) {
      // Create empty watchlist if doesn't exist
      watchlist = await Watchlist.create({
        user: (req as any).user._id,
        symbols: [],
      });
    }

    res.status(200).json({
      success: true,
      data: watchlist.symbols,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Error fetching watchlist',
      error: error.message,
    });
  }
});

// @route   POST /api/watchlist/add
// @desc    Add symbol to watchlist
// @access  Private
router.post('/add', protect, async (req: Request, res: Response) => {
  try {
    const { symbol } = req.body;

    if (!symbol) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a symbol',
      });
    }

    const upperSymbol = symbol.toUpperCase();

    let watchlist = await Watchlist.findOne({ user: (req as any).user._id });

    if (!watchlist) {
      watchlist = await Watchlist.create({
        user: (req as any).user._id,
        symbols: [upperSymbol],
      });
    } else {
      // Check if already in watchlist
      if (watchlist.symbols.includes(upperSymbol)) {
        return res.status(400).json({
          success: false,
          message: `${upperSymbol} is already in your watchlist`,
        });
      }

      // Limit watchlist to 20 items
      if (watchlist.symbols.length >= 20) {
        return res.status(400).json({
          success: false,
          message: 'Watchlist limit reached (20 items). Remove some to add more.',
        });
      }

      watchlist.symbols.push(upperSymbol);
      await watchlist.save();
    }

    res.status(200).json({
      success: true,
      message: `${upperSymbol} added to watchlist`,
      data: watchlist.symbols,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Error adding to watchlist',
      error: error.message,
    });
  }
});

// @route   POST /api/watchlist/remove
// @desc    Remove symbol from watchlist
// @access  Private
router.post('/remove', protect, async (req: Request, res: Response) => {
  try {
    const { symbol } = req.body;

    if (!symbol) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a symbol',
      });
    }

    const upperSymbol = symbol.toUpperCase();

    const watchlist = await Watchlist.findOne({ user: (req as any).user._id });

    if (!watchlist) {
      return res.status(404).json({
        success: false,
        message: 'Watchlist not found',
      });
    }

    const index = watchlist.symbols.indexOf(upperSymbol);
    if (index === -1) {
      return res.status(400).json({
        success: false,
        message: `${upperSymbol} is not in your watchlist`,
      });
    }

    watchlist.symbols.splice(index, 1);
    await watchlist.save();

    res.status(200).json({
      success: true,
      message: `${upperSymbol} removed from watchlist`,
      data: watchlist.symbols,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Error removing from watchlist',
      error: error.message,
    });
  }
});

// @route   POST /api/watchlist/toggle
// @desc    Toggle symbol in watchlist (add if not exists, remove if exists)
// @access  Private
router.post('/toggle', protect, async (req: Request, res: Response) => {
  try {
    const { symbol } = req.body;

    if (!symbol) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a symbol',
      });
    }

    const upperSymbol = symbol.toUpperCase();

    let watchlist = await Watchlist.findOne({ user: (req as any).user._id });

    if (!watchlist) {
      watchlist = await Watchlist.create({
        user: (req as any).user._id,
        symbols: [upperSymbol],
      });

      return res.status(200).json({
        success: true,
        action: 'added',
        message: `${upperSymbol} added to watchlist`,
        data: watchlist.symbols,
      });
    }

    const index = watchlist.symbols.indexOf(upperSymbol);

    if (index === -1) {
      // Add to watchlist
      if (watchlist.symbols.length >= 20) {
        return res.status(400).json({
          success: false,
          message: 'Watchlist limit reached (20 items)',
        });
      }

      watchlist.symbols.push(upperSymbol);
      await watchlist.save();

      return res.status(200).json({
        success: true,
        action: 'added',
        message: `${upperSymbol} added to watchlist`,
        data: watchlist.symbols,
      });
    } else {
      // Remove from watchlist
      watchlist.symbols.splice(index, 1);
      await watchlist.save();

      return res.status(200).json({
        success: true,
        action: 'removed',
        message: `${upperSymbol} removed from watchlist`,
        data: watchlist.symbols,
      });
    }
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Error toggling watchlist',
      error: error.message,
    });
  }
});

// @route   PUT /api/watchlist/reorder
// @desc    Reorder watchlist
// @access  Private
router.put('/reorder', protect, async (req: Request, res: Response) => {
  try {
    const { symbols } = req.body;

    if (!symbols || !Array.isArray(symbols)) {
      return res.status(400).json({
        success: false,
        message: 'Please provide symbols array',
      });
    }

    const watchlist = await Watchlist.findOne({ user: (req as any).user._id });

    if (!watchlist) {
      return res.status(404).json({
        success: false,
        message: 'Watchlist not found',
      });
    }

    watchlist.symbols = symbols.map((s: string) => s.toUpperCase());
    await watchlist.save();

    res.status(200).json({
      success: true,
      message: 'Watchlist reordered',
      data: watchlist.symbols,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Error reordering watchlist',
      error: error.message,
    });
  }
});

export default router;
