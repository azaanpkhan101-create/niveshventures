import { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowDownToLine, AlertCircle } from 'lucide-react';
import axios from 'axios';

export default function PackageWithdraw() {
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);

  const handleWithdraw = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      // Reusing the wallet withdraw endpoint for now, targeting 'capitalBalance' as that's where packages pay out
      await axios.post('/wallet/withdraw', { amount: Number(amount), walletType: 'capitalBalance' }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert('Withdrawal request submitted successfully!');
      setAmount('');
    } catch (err) {
      alert(err.response?.data?.message || 'Withdrawal failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6 pt-8">
      <div className="flex flex-col items-center text-center mb-8">
        <div className="w-16 h-16 rounded-2xl bg-red-500/20 text-red-400 flex items-center justify-center mb-4">
          <ArrowDownToLine className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-bold text-white mb-2">Withdraw Package Earnings</h2>
        <p className="text-gray-400">Withdraw your accumulated ROI from Service and Mining packages.</p>
      </div>

      <motion.div className="glass-card p-6 md:p-8 rounded-[2rem]">
        <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-xl flex items-start gap-3 mb-6 text-sm">
          <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
          <p>Withdrawals from packages are processed from your <strong>Capital Wallet</strong>. A 2% processing fee applies. Minimum withdrawal is $50.</p>
        </div>

        <form onSubmit={handleWithdraw} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">Amount (USDT)</label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-bold">$</span>
              <input 
                type="number"
                required
                min="50"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full bg-black/40 border border-white/10 rounded-xl py-3 pl-8 pr-4 text-white focus:outline-none focus:ring-2 focus:ring-red-500"
                placeholder="0.00"
              />
            </div>
          </div>

          <div className="bg-white/5 rounded-xl p-4 space-y-2 text-sm">
            <div className="flex justify-between text-gray-400">
              <span>Withdrawal Amount:</span>
              <span className="text-white">${amount || '0.00'}</span>
            </div>
            <div className="flex justify-between text-gray-400">
              <span>Processing Fee (2%):</span>
              <span className="text-red-400">-${(Number(amount || 0) * 0.02).toFixed(2)}</span>
            </div>
            <div className="flex justify-between font-bold pt-2 border-t border-white/5">
              <span>You will receive:</span>
              <span className="text-green-400">${(Number(amount || 0) * 0.98).toFixed(2)}</span>
            </div>
          </div>

          <button 
            type="submit"
            disabled={loading || !amount}
            className="w-full py-4 bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-500 hover:to-orange-500 text-white rounded-xl font-bold transition-all shadow-lg shadow-red-500/25 flex items-center justify-center disabled:opacity-50"
          >
            {loading ? 'Processing...' : 'Confirm Withdrawal'}
          </button>
        </form>
      </motion.div>
    </div>
  );
}
