import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/User';
import Trade from '../models/Trade';
import Transaction from '../models/Transaction';

dotenv.config();

const seedData = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || '', {
      dbName: 'mediatrade'
    });
    console.log('✅ Connected to MongoDB');

    // Clear existing data
    await User.deleteMany({});
    await Trade.deleteMany({});
    await Transaction.deleteMany({});
    console.log('🗑️  Cleared existing data');

    // Create Users
    const users = [
      {
        name: 'Admin User',
        email: 'admin@mediatrade.com',
        password: 'admin123',
        role: 'admin',
        balance: 500000,
      },
      {
        name: 'John Smith',
        email: 'john@example.com',
        password: 'password123',
        role: 'user',
        balance: 150000,
      },
      {
        name: 'Sarah Johnson',
        email: 'sarah@example.com',
        password: 'password123',
        role: 'user',
        balance: 250000,
      },
      {
        name: 'Michael Brown',
        email: 'michael@example.com',
        password: 'password123',
        role: 'user',
        balance: 180000,
      },
      {
        name: 'Emily Davis',
        email: 'emily@example.com',
        password: 'password123',
        role: 'user',
        balance: 320000,
      },
      {
        name: 'David Wilson',
        email: 'david@example.com',
        password: 'password123',
        role: 'user',
        balance: 95000,
      },
      {
        name: 'Lisa Anderson',
        email: 'lisa@example.com',
        password: 'password123',
        role: 'user',
        balance: 210000,
      },
      {
        name: 'James Martinez',
        email: 'james@example.com',
        password: 'password123',
        role: 'user',
        balance: 165000,
      },
      {
        name: 'Jennifer Taylor',
        email: 'jennifer@example.com',
        password: 'password123',
        role: 'user',
        balance: 280000,
      },
      {
        name: 'Robert Thomas',
        email: 'robert@example.com',
        password: 'password123',
        role: 'user',
        balance: 135000,
      },
    ];

    const createdUsers = await User.create(users);
    console.log(`👥 Created ${createdUsers.length} users`);

    // Create Trades
    const symbols = ['BTC', 'ETH', 'USDT', 'BNB', 'XRP', 'ADA', 'SOL', 'DOGE'];
    const trades = [];

    // Generate trades for the last 30 days
    const now = new Date();
    for (let i = 0; i < 50; i++) {
      const randomUser = createdUsers[Math.floor(Math.random() * createdUsers.length)];
      const randomSymbol = symbols[Math.floor(Math.random() * symbols.length)];
      const type = Math.random() > 0.5 ? 'buy' : 'sell';
      const amount = Math.floor(Math.random() * 10) + 1;
      const price = Math.floor(Math.random() * 50000) + 1000;
      const total = amount * price;

      // Random date within last 30 days
      const daysAgo = Math.floor(Math.random() * 30);
      const createdAt = new Date(now);
      createdAt.setDate(createdAt.getDate() - daysAgo);

      trades.push({
        userId: randomUser._id,
        symbol: randomSymbol,
        type,
        amount,
        price,
        total,
        createdAt,
      });
    }

    const createdTrades = await Trade.create(trades);
    console.log(`💰 Created ${createdTrades.length} trades`);

    // Create Transactions
    const transactions = [];
    const transactionTypes = ['deposit', 'withdraw'];
    const statuses = ['completed', 'pending', 'failed'];

    // Generate transactions for the last 30 days
    for (let i = 0; i < 40; i++) {
      const randomUser = createdUsers[Math.floor(Math.random() * createdUsers.length)];
      const type = transactionTypes[Math.floor(Math.random() * transactionTypes.length)];
      const amount = Math.floor(Math.random() * 50000) + 1000;
      const status = statuses[Math.floor(Math.random() * statuses.length)];

      // Random date within last 30 days
      const daysAgo = Math.floor(Math.random() * 30);
      const createdAt = new Date(now);
      createdAt.setDate(createdAt.getDate() - daysAgo);

      const descriptions = [
        'Bank transfer',
        'Credit card deposit',
        'Wire transfer',
        'Withdrawal to bank account',
        'Crypto withdrawal',
        'Account funding',
      ];

      transactions.push({
        userId: randomUser._id,
        type,
        amount,
        status,
        description: descriptions[Math.floor(Math.random() * descriptions.length)],
        createdAt,
      });
    }

    const createdTransactions = await Transaction.create(transactions);
    console.log(`📊 Created ${createdTransactions.length} transactions`);

    // Update user portfolios with some holdings
    for (const user of createdUsers) {
      if (user.role !== 'admin') {
        const numHoldings = Math.floor(Math.random() * 4) + 1;
        const portfolio = [];

        for (let i = 0; i < numHoldings; i++) {
          const symbol = symbols[Math.floor(Math.random() * symbols.length)];
          // Avoid duplicates
          if (!portfolio.find(p => p.symbol === symbol)) {
            portfolio.push({
              symbol,
              amount: Math.floor(Math.random() * 10) + 1,
              averagePrice: Math.floor(Math.random() * 50000) + 1000,
            });
          }
        }

        user.portfolio = portfolio;
        await user.save();
      }
    }
    console.log('📈 Updated user portfolios');

    console.log('\n✨ Seed data created successfully!');
    console.log('\n📊 Summary:');
    console.log(`   Users: ${createdUsers.length}`);
    console.log(`   Trades: ${createdTrades.length}`);
    console.log(`   Transactions: ${createdTransactions.length}`);
    console.log('\n👤 Admin Account:');
    console.log('   Email: admin@mediatrade.com');
    console.log('   Password: admin123');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding data:', error);
    process.exit(1);
  }
};

seedData();
