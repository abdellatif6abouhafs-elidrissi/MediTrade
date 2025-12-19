import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useEffect } from 'react';
import { useThemeStore } from './store/themeStore';
import { useAuthStore } from './store/authStore';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import PriceTicker from './components/ui/PriceTicker';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Prices from './pages/Prices';
import Trade from './pages/Trade';
import Dashboard from './pages/Dashboard';
import Wallet from './pages/Wallet';
import Admin from './pages/Admin';
import Leaderboard from './pages/Leaderboard';
import Alerts from './pages/Alerts';
import Achievements from './pages/Achievements';
import Analytics from './pages/Analytics';
import Watchlist from './pages/Watchlist';
import News from './pages/News';
import NotFound from './pages/NotFound';

function App() {
  const { isDark, setTheme } = useThemeStore();
  const { isAuthenticated, fetchUser } = useAuthStore();

  useEffect(() => {
    // Initialize theme
    setTheme(isDark);

    // Fetch user data if authenticated
    if (isAuthenticated) {
      fetchUser();
    }
  }, []);

  return (
    <Router>
      <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors duration-300">
        <PriceTicker />
        <Navbar />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/prices" element={<Prices />} />
            <Route path="/trade" element={<Trade />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/wallet" element={<Wallet />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="/leaderboard" element={<Leaderboard />} />
            <Route path="/alerts" element={<Alerts />} />
            <Route path="/achievements" element={<Achievements />} />
            <Route path="/analytics" element={<Analytics />} />
            <Route path="/watchlist" element={<Watchlist />} />
            <Route path="/news" element={<News />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
