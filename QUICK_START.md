# MediTrade - Quick Start Guide

## Get Up and Running in 5 Minutes

### Step 1: Install MongoDB (if not already installed)

**Option A: Local MongoDB**
- Download from: https://www.mongodb.com/try/download/community
- Install and start MongoDB service

**Option B: MongoDB Atlas (Cloud)**
- Sign up at: https://www.mongodb.com/cloud/atlas
- Create a free cluster
- Get your connection string

### Step 2: Start the Backend

```bash
cd backend
npm install
npm run dev
```

Backend will run on: http://localhost:5000

### Step 3: Start the Frontend

Open a **new terminal**:

```bash
cd frontend
npm install
npm run dev
```

Frontend will run on: http://localhost:5173

### Step 4: Open in Browser

Visit: http://localhost:5173

## Default Test Credentials

You can create a new account, or use these steps to create a test admin:

1. Register a new account through the UI
2. Connect to MongoDB and run:
```javascript
db.users.updateOne(
  { email: "your@email.com" },
  { $set: { role: "admin" } }
)
```

## Features to Try

1. **Register/Login** - Create your account
2. **View Prices** - See live cryptocurrency prices
3. **Trade** - Buy and sell crypto with $100,000 virtual money
4. **Dashboard** - Track your portfolio performance
5. **Wallet** - Deposit/withdraw virtual funds
6. **Admin Panel** - (Admin only) Manage users and view stats

## Troubleshooting

### Backend won't start
- Make sure MongoDB is running
- Check if port 5000 is available
- Verify .env file exists in backend folder

### Frontend won't start
- Make sure backend is running first
- Check if port 5173 is available
- Clear node_modules and reinstall: `rm -rf node_modules && npm install`

### Can't connect to backend
- Verify backend is running on port 5000
- Check VITE_API_URL in frontend/.env
- Make sure CORS is properly configured

## Project Structure

```
MediTrade/
├── backend/          # Express API server
│   ├── src/
│   └── .env         # Backend configuration
├── frontend/        # React application
│   ├── src/
│   └── .env        # Frontend configuration
└── README.md       # Full documentation
```

## Need Help?

- Check the full README.md for detailed documentation
- Review the API endpoints in the backend/src/routes folder
- Inspect the browser console for frontend errors
- Check backend terminal for API errors

---

**Happy Trading! 🚀**
