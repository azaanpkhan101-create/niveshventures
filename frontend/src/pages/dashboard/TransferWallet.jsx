import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowRightLeft, ArrowDownCircle, ArrowUpCircle, AlertCircle } from 'lucide-react';
import axios from 'axios';

export default function TransferWallet({ target }) {
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const [balance, setBalance] = useState(null);
  const [success, setSuccess] = useState(false);

  const isCapital = target === 'transfer_capital';
  const targetName = isCapital ? 'Capital Wallet' : 'Node Wallet';
  const targetWallet = isCapital ? 'capitalBalance' : 'nodeBalance';

  useEffect(() => {
    const fetchBalance = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get('/wallet/balance', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setBalance(res.data);
      } catch (err) {
        console.error('Balance fetch error:', err);
      }
    };
    fetchBalance();
  }, [success]);

  const handleTransfer = async (e) => {
    e.preventDefault();
    if (!amount || Number(amount) <= 0) return;

    const numAmount = Number(amount);
    if (balance && numAmount > balance.mineBalance) {
      alert(`Insufficient Mine Wallet balance. Available: $${balance.mineBalance.toFixed(2)}`);
      return;
    }

    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      await axios.post(
        '/wallet/transfer',
        { amount: numAmount, targetWallet },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setSuccess(true);
      setAmount('');
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      alert(err.response?.data?.message || 'Transfer failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6 pt-4">
      {/* Header */}
      <div>
        <h2 className="text-xl font-bold text-white mb-1">Transfer to {targetName}</h2>
        <p className="text-sm text-gray-400">Home / Transfer / {targetName}</p>
      </div>

      {success && (
        <div className="bg-green-500/10 border border-green-500/20 text-green-400 p-4 rounded-xl flex items-center gap-3 text-sm">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          Transfer completed successfully! Balances have been updated.
        </div>
      )}

      <div className="bg-[#111111] border border-white/10 rounded-xl overflow-hidden">
        {/* Wallet Flow Diagram */}
        <div className="flex items-center justify-between p-6 bg-[#0a0a0a] border-b border-white/10">
          <div className="flex flex-col items-center gap-2">
            <div className="w-12 h-12 rounded-full bg-orange-500/20 flex items-center justify-center">
              <ArrowUpCircle className="w-6 h-6 text-orange-400" />
            </div>
            <span className="font-bold text-white text-sm">Mine Wallet</span>
            <span className="text-orange-400 text-xs font-mono">
              {balance ? `$${balance.mineBalance.toFixed(2)}` : '...'}
            </span>
          </div>
          <div className="flex-1 flex flex-col items-center gap-1 text-gray-600">
            <ArrowRightLeft className="w-5 h-5" />
            <span className="text-xs">Transfer</span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <div className={`w-12 h-12 rounded-full ${isCapital ? 'bg-teal-500/20' : 'bg-blue-500/20'} flex items-center justify-center`}>
              <ArrowDownCircle className={`w-6 h-6 ${isCapital ? 'text-teal-400' : 'text-blue-400'}`} />
            </div>
            <span className="font-bold text-white text-sm">{targetName}</span>
            <span className={`${isCapital ? 'text-teal-400' : 'text-blue-400'} text-xs font-mono`}>
              {balance ? `$${(isCapital ? balance.capitalBalance : balance.nodeBalance).toFixed(2)}` : '...'}
            </span>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleTransfer} className="p-6 space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">
              Amount (USDT) — Available: <span className="text-white">${balance?.mineBalance?.toFixed(2) ?? '0.00'}</span>
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-bold">$</span>
              <input
                type="number"
                required
                min="1"
                step="0.01"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full bg-black/40 border border-white/10 rounded-xl py-3 pl-8 pr-4 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="0.00"
              />
            </div>
          </div>

          {amount && Number(amount) > 0 && (
            <div className="bg-white/5 rounded-xl p-4 space-y-2 text-sm">
              <div className="flex justify-between text-gray-400">
                <span>Transfer Amount:</span>
                <span className="text-white font-medium">${Number(amount).toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-gray-400">
                <span>Destination:</span>
                <span className="text-white font-medium">{targetName}</span>
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={loading || !amount}
            className={`w-full py-4 bg-gradient-to-r ${isCapital ? 'from-teal-600 to-green-600 hover:from-teal-500 hover:to-green-500 shadow-teal-500/25' : 'from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 shadow-indigo-500/25'} text-white rounded-xl font-bold transition-all shadow-lg flex items-center justify-center disabled:opacity-50`}
          >
            {loading ? (
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Processing Transfer...
              </div>
            ) : (
              'Confirm Transfer'
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
