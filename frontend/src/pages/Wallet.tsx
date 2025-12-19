import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { DollarSign, ArrowDownToLine, ArrowUpFromLine } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Modal from '../components/ui/Modal';
import apiClient from '../api/client';

const Wallet: React.FC = () => {
  const { user, updateBalance, fetchUser } = useAuthStore();
  const [isDepositOpen, setIsDepositOpen] = useState(false);
  const [isWithdrawOpen, setIsWithdrawOpen] = useState(false);
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleDeposit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      const { data } = await apiClient.post('/wallet/deposit', {
        amount: parseFloat(amount),
      });

      setMessage({ type: 'success', text: 'Deposit successful' });
      updateBalance(data.balance);
      setAmount('');
      setTimeout(() => {
        setIsDepositOpen(false);
        setMessage(null);
      }, 2000);
      await fetchUser();
    } catch (error: any) {
      setMessage({
        type: 'error',
        text: error.response?.data?.message || 'Deposit failed'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleWithdraw = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      const { data } = await apiClient.post('/wallet/withdraw', {
        amount: parseFloat(amount),
      });

      setMessage({ type: 'success', text: 'Withdrawal successful' });
      updateBalance(data.balance);
      setAmount('');
      setTimeout(() => {
        setIsWithdrawOpen(false);
        setMessage(null);
      }, 2000);
      await fetchUser();
    } catch (error: any) {
      setMessage({
        type: 'error',
        text: error.response?.data?.message || 'Withdrawal failed'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2">Wallet</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Manage your virtual funds
          </p>
        </motion.div>

        {/* Balance Card */}
        <Card className="mb-6">
          <div className="text-center py-6 sm:py-8">
            <DollarSign className="w-12 h-12 sm:w-16 sm:h-16 mx-auto text-primary-600 mb-3 sm:mb-4" />
            <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mb-1 sm:mb-2">Available Balance</div>
            <div className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6 sm:mb-8">${user?.balance.toLocaleString()}</div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                onClick={() => setIsDepositOpen(true)}
                variant="success"
                size="lg"
                className="flex items-center justify-center space-x-2"
              >
                <ArrowDownToLine className="w-5 h-5" />
                <span>Deposit</span>
              </Button>
              <Button
                onClick={() => setIsWithdrawOpen(true)}
                variant="danger"
                size="lg"
                className="flex items-center justify-center space-x-2"
              >
                <ArrowUpFromLine className="w-5 h-5" />
                <span>Withdraw</span>
              </Button>
            </div>
          </div>
        </Card>

        {/* Info Card */}
        <Card>
          <h2 className="text-lg sm:text-xl font-bold mb-3 sm:mb-4">Important Information</h2>
          <ul className="space-y-2 text-sm sm:text-base text-gray-600 dark:text-gray-400">
            <li className="flex items-start">
              <span className="mr-2">•</span>
              <span>This is a virtual trading platform. All funds are simulated.</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2">•</span>
              <span>Deposits and withdrawals are instant and free.</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2">•</span>
              <span>Use this platform to practice trading strategies risk-free.</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2">•</span>
              <span>Your starting balance is $100,000 in virtual currency.</span>
            </li>
          </ul>
        </Card>

        {/* Deposit Modal */}
        <Modal
          isOpen={isDepositOpen}
          onClose={() => {
            setIsDepositOpen(false);
            setAmount('');
            setMessage(null);
          }}
          title="Deposit Funds"
        >
          <form onSubmit={handleDeposit} className="space-y-4">
            <Input
              type="number"
              label="Amount"
              placeholder="Enter amount to deposit"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              min="0"
              step="0.01"
              required
            />

            {message && (
              <div className={`p-3 rounded-lg text-sm ${
                message.type === 'success'
                  ? 'bg-green-50 dark:bg-green-900/20 text-green-600'
                  : 'bg-red-50 dark:bg-red-900/20 text-red-600'
              }`}>
                {message.text}
              </div>
            )}

            <Button type="submit" variant="success" fullWidth loading={loading}>
              Confirm Deposit
            </Button>
          </form>
        </Modal>

        {/* Withdraw Modal */}
        <Modal
          isOpen={isWithdrawOpen}
          onClose={() => {
            setIsWithdrawOpen(false);
            setAmount('');
            setMessage(null);
          }}
          title="Withdraw Funds"
        >
          <form onSubmit={handleWithdraw} className="space-y-4">
            <Input
              type="number"
              label="Amount"
              placeholder="Enter amount to withdraw"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              min="0"
              step="0.01"
              max={user?.balance}
              required
            />

            <div className="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Available Balance</span>
                <span className="font-semibold">${user?.balance.toLocaleString()}</span>
              </div>
            </div>

            {message && (
              <div className={`p-3 rounded-lg text-sm ${
                message.type === 'success'
                  ? 'bg-green-50 dark:bg-green-900/20 text-green-600'
                  : 'bg-red-50 dark:bg-red-900/20 text-red-600'
              }`}>
                {message.text}
              </div>
            )}

            <Button type="submit" variant="danger" fullWidth loading={loading}>
              Confirm Withdrawal
            </Button>
          </form>
        </Modal>
      </div>
    </div>
  );
};

export default Wallet;
