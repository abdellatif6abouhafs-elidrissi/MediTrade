import express, { Request, Response } from 'express';
import News from '../models/News';

const router = express.Router();

// Sample news data for seeding
const sampleNews = [
  {
    title: 'Bitcoin Surges Past $100K as Institutional Adoption Grows',
    description: 'Bitcoin has broken through the $100,000 barrier as major financial institutions continue to embrace cryptocurrency.',
    content: 'In a historic move, Bitcoin has surpassed the $100,000 mark for the first time, driven by increasing institutional adoption and growing mainstream acceptance. Major banks and hedge funds have been accumulating BTC, signaling a shift in traditional finance attitudes toward digital assets.',
    source: 'CryptoNews',
    url: '#',
    imageUrl: 'https://images.unsplash.com/photo-1518546305927-5a555bb7020d?w=800',
    category: 'bitcoin',
    tags: ['bitcoin', 'btc', 'institutional', 'milestone'],
    isBreaking: true,
  },
  {
    title: 'Ethereum 2.0 Staking Rewards Hit All-Time High',
    description: 'ETH stakers are seeing record returns as network activity surges.',
    content: 'Ethereum validators are experiencing unprecedented staking rewards as the network processes more transactions than ever. The shift to proof-of-stake has proven successful, with over 30 million ETH now staked across the network.',
    source: 'ETH Daily',
    url: '#',
    imageUrl: 'https://images.unsplash.com/photo-1621761191319-c6fb62004040?w=800',
    category: 'ethereum',
    tags: ['ethereum', 'eth', 'staking', 'rewards'],
    isBreaking: false,
  },
  {
    title: 'Solana DeFi Ecosystem Reaches $50B TVL',
    description: 'The Solana blockchain continues its meteoric rise in decentralized finance.',
    content: 'Solana\'s DeFi ecosystem has reached a major milestone with $50 billion in total value locked. The high-speed, low-cost blockchain has attracted numerous DeFi protocols and users seeking alternatives to Ethereum.',
    source: 'DeFi Pulse',
    url: '#',
    imageUrl: 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=800',
    category: 'defi',
    tags: ['solana', 'sol', 'defi', 'tvl'],
    isBreaking: false,
  },
  {
    title: 'SEC Approves Multiple Spot Crypto ETFs',
    description: 'Regulatory clarity brings new wave of investment products to market.',
    content: 'The Securities and Exchange Commission has approved several spot cryptocurrency ETFs, marking a significant step toward mainstream crypto adoption. The decision opens the door for traditional investors to gain crypto exposure through regulated investment vehicles.',
    source: 'Regulatory Watch',
    url: '#',
    imageUrl: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=800',
    category: 'regulation',
    tags: ['sec', 'etf', 'regulation', 'bitcoin'],
    isBreaking: true,
  },
  {
    title: 'NFT Market Shows Signs of Recovery',
    description: 'Blue-chip NFT collections lead the resurgence in digital collectibles.',
    content: 'After months of declining sales, the NFT market is showing signs of recovery. Blue-chip collections like Bored Ape Yacht Club and CryptoPunks have seen increased trading volume, suggesting renewed interest in digital collectibles.',
    source: 'NFT Insider',
    url: '#',
    imageUrl: 'https://images.unsplash.com/photo-1646463535817-6e449bdc3f9d?w=800',
    category: 'nft',
    tags: ['nft', 'bayc', 'cryptopunks', 'digital art'],
    isBreaking: false,
  },
  {
    title: 'XRP Wins Major Legal Victory Against SEC',
    description: 'Court ruling provides clarity for cryptocurrency classification.',
    content: 'Ripple Labs has secured a significant legal victory in its ongoing case with the SEC. The court ruled that XRP sales on exchanges do not constitute securities, providing much-needed clarity for the cryptocurrency industry.',
    source: 'Legal Crypto',
    url: '#',
    imageUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800',
    category: 'regulation',
    tags: ['xrp', 'ripple', 'sec', 'legal'],
    isBreaking: false,
  },
  {
    title: 'Cardano Smart Contracts Hit 10,000 DApps',
    description: 'ADA ecosystem growth accelerates with developer activity.',
    content: 'The Cardano blockchain has reached a significant milestone with over 10,000 decentralized applications deployed. The ecosystem continues to attract developers with its focus on security and peer-reviewed development.',
    source: 'Cardano Times',
    url: '#',
    imageUrl: 'https://images.unsplash.com/photo-1622630998477-20aa696ecb05?w=800',
    category: 'altcoins',
    tags: ['cardano', 'ada', 'dapps', 'smart contracts'],
    isBreaking: false,
  },
  {
    title: 'Global Crypto Trading Volume Hits $10 Trillion Daily',
    description: 'Market activity reaches unprecedented levels across all exchanges.',
    content: 'Global cryptocurrency trading volume has reached an all-time high of $10 trillion in daily trading activity. The surge is attributed to increased retail and institutional participation, as well as the launch of new trading products.',
    source: 'Market Watch',
    url: '#',
    imageUrl: 'https://images.unsplash.com/photo-1642790106117-e829e14a795f?w=800',
    category: 'market',
    tags: ['trading', 'volume', 'market', 'exchanges'],
    isBreaking: true,
  },
  {
    title: 'Layer 2 Solutions Process More Transactions Than Ethereum Mainnet',
    description: 'Scaling solutions prove their worth with record throughput.',
    content: 'Layer 2 scaling solutions on Ethereum are now processing more transactions than the mainnet itself. Solutions like Arbitrum, Optimism, and Base have collectively handled millions of transactions at a fraction of the cost.',
    source: 'L2 Beat',
    url: '#',
    imageUrl: 'https://images.unsplash.com/photo-1639322537228-f710d846310a?w=800',
    category: 'ethereum',
    tags: ['layer2', 'arbitrum', 'optimism', 'scaling'],
    isBreaking: false,
  },
  {
    title: 'Dogecoin Integration by Major Payment Processor',
    description: 'Meme coin gains legitimacy with mainstream payment adoption.',
    content: 'A major payment processor has announced integration of Dogecoin for merchant payments. The move brings the popular meme cryptocurrency closer to mainstream adoption and everyday use cases.',
    source: 'Doge Daily',
    url: '#',
    imageUrl: 'https://images.unsplash.com/photo-1620321023374-d1a68fbc720d?w=800',
    category: 'altcoins',
    tags: ['dogecoin', 'doge', 'payments', 'adoption'],
    isBreaking: false,
  },
  {
    title: 'Bitcoin Mining Difficulty Reaches New All-Time High',
    description: 'Network security strengthens as more miners join.',
    content: 'Bitcoin\'s mining difficulty has reached a new all-time high, reflecting the growing number of miners securing the network. The increase demonstrates continued confidence in Bitcoin\'s long-term value proposition.',
    source: 'Mining Report',
    url: '#',
    imageUrl: 'https://images.unsplash.com/photo-1516245834210-c4c142787335?w=800',
    category: 'bitcoin',
    tags: ['bitcoin', 'mining', 'difficulty', 'hashrate'],
    isBreaking: false,
  },
  {
    title: 'Central Banks Explore Crypto Reserve Assets',
    description: 'Multiple countries consider adding Bitcoin to reserves.',
    content: 'Several central banks are reportedly exploring the addition of cryptocurrency assets to their reserves. This marks a significant shift in monetary policy thinking and could have major implications for crypto adoption.',
    source: 'Central Bank Watch',
    url: '#',
    imageUrl: 'https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?w=800',
    category: 'regulation',
    tags: ['central banks', 'reserves', 'adoption', 'bitcoin'],
    isBreaking: true,
  },
];

// @route   GET /api/news
// @desc    Get all news with optional filtering
// @access  Public
router.get('/', async (req: Request, res: Response) => {
  try {
    const { category, limit = 20, page = 1 } = req.query;

    // Check if we have news in DB, if not seed it
    const newsCount = await News.countDocuments();
    if (newsCount === 0) {
      // Seed with sample news
      const newsToInsert = sampleNews.map((news, index) => ({
        ...news,
        publishedAt: new Date(Date.now() - index * 3600000), // Stagger by 1 hour each
      }));
      await News.insertMany(newsToInsert);
    }

    const query: any = {};
    if (category && category !== 'all') {
      query.category = category;
    }

    const skip = (Number(page) - 1) * Number(limit);

    const news = await News.find(query)
      .sort({ publishedAt: -1 })
      .skip(skip)
      .limit(Number(limit));

    const total = await News.countDocuments(query);

    res.status(200).json({
      success: true,
      data: news,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / Number(limit)),
      },
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Error fetching news',
      error: error.message,
    });
  }
});

// @route   GET /api/news/breaking
// @desc    Get breaking news
// @access  Public
router.get('/breaking', async (req: Request, res: Response) => {
  try {
    const news = await News.find({ isBreaking: true })
      .sort({ publishedAt: -1 })
      .limit(5);

    res.status(200).json({
      success: true,
      data: news,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Error fetching breaking news',
      error: error.message,
    });
  }
});

// @route   GET /api/news/:id
// @desc    Get single news article
// @access  Public
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const news = await News.findById(req.params.id);

    if (!news) {
      return res.status(404).json({
        success: false,
        message: 'News article not found',
      });
    }

    // Increment views
    news.views += 1;
    await news.save();

    res.status(200).json({
      success: true,
      data: news,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Error fetching news article',
      error: error.message,
    });
  }
});

// @route   GET /api/news/category/:category
// @desc    Get news by category
// @access  Public
router.get('/category/:category', async (req: Request, res: Response) => {
  try {
    const { limit = 10 } = req.query;

    const news = await News.find({ category: req.params.category })
      .sort({ publishedAt: -1 })
      .limit(Number(limit));

    res.status(200).json({
      success: true,
      data: news,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Error fetching news by category',
      error: error.message,
    });
  }
});

export default router;
