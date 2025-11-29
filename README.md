# MediTrade - Professional Trading Platform

A full-stack cryptocurrency trading simulation platform built with React, TypeScript, Node.js, Express, and MongoDB. Practice trading with virtual money and learn the markets risk-free.

![MediTrade](https://img.shields.io/badge/Status-Active-success)
![License](https://img.shields.io/badge/License-MIT-blue)

## Features

### Frontend
- **Modern UI/UX**: Clean, responsive design with dark/light mode
- **Real-time Price Updates**: Mock cryptocurrency prices updated every 5 seconds
- **Professional Charts**: TradingView widget integration with candlestick charts
- **Portfolio Management**: Track your holdings and performance
- **Trading Simulator**: Buy and sell cryptocurrencies with virtual balance
- **Wallet System**: Deposit and withdraw virtual funds
- **Admin Panel**: Manage users and view platform statistics
- **Smooth Animations**: Framer Motion for fluid user experience

### Backend
- **RESTful API**: Complete API with Express.js
- **MongoDB Database**: Secure data storage with Mongoose
- **JWT Authentication**: Secure user authentication and authorization
- **Role-Based Access**: User and Admin roles
- **Password Encryption**: bcrypt for secure password hashing
- **Error Handling**: Comprehensive error handling middleware
- **API Endpoints**:
  - Authentication (register, login, get user)
  - Trading (buy, sell, price updates, history)
  - Wallet (balance, deposit, withdraw)
  - Admin (user management, statistics)

## Tech Stack

### Frontend
- React 18
- TypeScript
- Vite
- Tailwind CSS
- Zustand (State Management)
- React Router
- Axios
- Framer Motion
- TradingView Widget
- Lucide Icons

### Backend
- Node.js
- Express.js
- TypeScript
- MongoDB
- Mongoose
- JWT
- bcrypt
- dotenv
- CORS

## Prerequisites

Before you begin, ensure you have the following installed:
- **Node.js** (v18 or higher)
- **npm** or **yarn**
- **MongoDB** (local or Atlas cloud)

## Installation

### 1. Clone the Repository

```bash
git clone <your-repo-url>
cd MediTrade
```

### 2. Backend Setup

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Create .env file (copy from .env.example)
cp .env.example .env

# Edit .env with your MongoDB URI
# PORT=5000
# MONGODB_URI=mongodb://localhost:27017/meditrade
# JWT_SECRET=your-secret-key
# JWT_EXPIRE=7d
# NODE_ENV=development

# Start the backend server
npm run dev
```

The backend server will start on `http://localhost:5000`

### 3. Frontend Setup

```bash
# Open a new terminal and navigate to frontend directory
cd frontend

# Install dependencies
npm install

# The .env file is already configured with:
# VITE_API_URL=http://localhost:5000/api

# Start the frontend development server
npm run dev
```

The frontend will start on `http://localhost:5173`

## Usage

### For Regular Users

1. **Register**: Create a new account at `/register`
2. **Login**: Sign in to your account at `/login`
3. **Explore Prices**: View live cryptocurrency prices at `/prices`
4. **Trade**: Navigate to `/trade` to buy/sell cryptocurrencies
5. **Dashboard**: View your portfolio and trading history at `/dashboard`
6. **Wallet**: Manage your virtual funds at `/wallet`

### For Admin Users

To create an admin user, you need to manually update the database:

```javascript
// In MongoDB, update a user's role to 'admin'
db.users.updateOne(
  { email: "admin@example.com" },
  { $set: { role: "admin" } }
)
```

Admin features:
- View platform statistics
- Manage all users
- Delete users
- Access admin panel at `/admin`

## Project Structure

```
MediTrade/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   └── database.ts
│   │   ├── controllers/
│   │   │   ├── authController.ts
│   │   │   ├── tradeController.ts
│   │   │   ├── walletController.ts
│   │   │   └── adminController.ts
│   │   ├── middleware/
│   │   │   ├── auth.ts
│   │   │   └── errorHandler.ts
│   │   ├── models/
│   │   │   ├── User.ts
│   │   │   ├── Trade.ts
│   │   │   └── Transaction.ts
│   │   ├── routes/
│   │   │   ├── authRoutes.ts
│   │   │   ├── tradeRoutes.ts
│   │   │   ├── walletRoutes.ts
│   │   │   └── adminRoutes.ts
│   │   ├── utils/
│   │   │   └── jwt.ts
│   │   └── server.ts
│   ├── package.json
│   ├── tsconfig.json
│   └── .env
│
└── frontend/
    ├── src/
    │   ├── api/
    │   │   └── client.ts
    │   ├── components/
    │   │   ├── layout/
    │   │   │   ├── Navbar.tsx
    │   │   │   └── Footer.tsx
    │   │   └── ui/
    │   │       ├── Button.tsx
    │   │       ├── Card.tsx
    │   │       ├── Input.tsx
    │   │       └── Modal.tsx
    │   ├── pages/
    │   │   ├── Home.tsx
    │   │   ├── Login.tsx
    │   │   ├── Register.tsx
    │   │   ├── Prices.tsx
    │   │   ├── Trade.tsx
    │   │   ├── Dashboard.tsx
    │   │   ├── Wallet.tsx
    │   │   └── Admin.tsx
    │   ├── store/
    │   │   ├── authStore.ts
    │   │   ├── themeStore.ts
    │   │   └── priceStore.ts
    │   ├── App.tsx
    │   ├── main.tsx
    │   └── index.css
    ├── package.json
    ├── tailwind.config.js
    ├── tsconfig.json
    └── .env
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (protected)

### Trading
- `GET /api/trades/prices` - Get all cryptocurrency prices
- `POST /api/trades/buy` - Buy cryptocurrency (protected)
- `POST /api/trades/sell` - Sell cryptocurrency (protected)
- `GET /api/trades/history` - Get trade history (protected)

### Wallet
- `GET /api/wallet` - Get wallet info (protected)
- `POST /api/wallet/deposit` - Deposit funds (protected)
- `POST /api/wallet/withdraw` - Withdraw funds (protected)

### Admin
- `GET /api/admin/users` - Get all users (admin only)
- `DELETE /api/admin/user/:id` - Delete user (admin only)
- `GET /api/admin/stats` - Get platform statistics (admin only)

## Default Configuration

- **Starting Balance**: $100,000 (virtual)
- **Price Update Interval**: 5 seconds
- **Supported Cryptocurrencies**: BTC, ETH, BNB, SOL, XRP, ADA, DOGE, MATIC, DOT, AVAX

## Development

### Backend Development

```bash
cd backend
npm run dev  # Runs with nodemon and ts-node
npm run build  # Compiles TypeScript to JavaScript
npm start  # Runs compiled code
```

### Frontend Development

```bash
cd frontend
npm run dev  # Starts Vite dev server
npm run build  # Creates production build
npm run preview  # Preview production build
```

## Building for Production

### Backend

```bash
cd backend
npm run build
npm start
```

### Frontend

```bash
cd frontend
npm run build
# The build output will be in the 'dist' folder
```

## Environment Variables

### Backend (.env)
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/meditrade
JWT_SECRET=your-super-secret-jwt-key
JWT_EXPIRE=7d
NODE_ENV=development
```

### Frontend (.env)
```env
VITE_API_URL=http://localhost:5000/api
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License.

## Disclaimer

This is a simulation platform for educational purposes only. No real money is involved. All trades are virtual and do not represent actual cryptocurrency transactions.

## Support

For issues, questions, or suggestions, please open an issue on GitHub.

---

**Built with ❤️ using React, TypeScript, Node.js, and MongoDB**
