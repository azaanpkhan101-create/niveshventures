import { useState, useEffect } from 'react';
import { PieChart, Download, ArrowUpRight, ArrowDownRight, RefreshCcw, RefreshCw } from 'lucide-react';
import axios from 'axios';

export default function FinancialHistory() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('ALL');

  const filters = ['ALL', 'DEPOSIT', 'WITHDRAW', 'TRANSFER', 'BONUS'];

  useEffect(() => {
    const fetchHistory = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem('token');
        const typeParam = filter !== 'ALL' ? `?type=${filter}` : '';
        const res = await axios.get(`/wallet/transactions${typeParam}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setHistory(res.data || []);
      } catch (err) {
        console.error('Financial history fetch error:', err);
        setHistory([]);
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, [filter]);

  const getTypeStyles = (type) => {
    switch (type) {
      case 'DEPOSIT': return { icon: <ArrowDownRight className="w-4 h-4" />, color: 'text-green-400', bg: 'bg-green-500/20', sign: '+' };
      case 'WITHDRAW': return { icon: <ArrowUpRight className="w-4 h-4" />, color: 'text-red-400', bg: 'bg-red-500/20', sign: '-' };
      case 'TRANSFER': return { icon: <RefreshCcw className="w-4 h-4" />, color: 'text-indigo-400', bg: 'bg-indigo-500/20', sign: '→' };
      case 'BONUS': return { icon: <ArrowDownRight className="w-4 h-4" />, color: 'text-yellow-400', bg: 'bg-yellow-500/20', sign: '+' };
      default: return { icon: <RefreshCw className="w-4 h-4" />, color: 'text-gray-400', bg: 'bg-gray-500/20', sign: '' };
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-fuchsia-500/20 rounded-xl text-fuchsia-400">
            <PieChart className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white">Financial History</h2>
            <p className="text-gray-400 text-sm mt-0.5">Home / Financial / Financial History</p>
          </div>
        </div>
        <button className="px-4 py-2 bg-white/5 hover:bg-white/10 rounded-lg flex items-center gap-2 text-sm transition-colors text-white">
          <Download className="w-4 h-4" /> Export Ledger
        </button>
      </div>

      {/* Filter Pills */}
      <div className="flex gap-2 flex-wrap">
        {filters.map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
              filter === f
                ? 'bg-purple-600 text-white shadow-lg shadow-purple-500/20'
                : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white'
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      <div className="bg-[#111111] border border-white/10 rounded-xl overflow-hidden">
        {loading ? (
          <div className="h-48 flex items-center justify-center">
            <div className="flex flex-col items-center gap-3 text-gray-500">
              <RefreshCw className="w-8 h-8 animate-spin opacity-50" />
              <p className="text-sm">Loading financial records...</p>
            </div>
          </div>
        ) : history.length === 0 ? (
          <div className="h-48 flex flex-col items-center justify-center text-gray-500">
            <PieChart className="w-10 h-10 mb-3 opacity-30" />
            <p className="font-medium">No {filter === 'ALL' ? '' : filter.toLowerCase()} records found.</p>
            <p className="text-sm mt-1 text-gray-600">Transactions will appear here as they occur.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-[#1a1a1c] text-gray-400 uppercase text-xs tracking-wider">
                <tr>
                  <th className="px-5 py-4">#</th>
                  <th className="px-5 py-4">Date</th>
                  <th className="px-5 py-4">Type</th>
                  <th className="px-5 py-4">Wallet</th>
                  <th className="px-5 py-4">Amount</th>
                  <th className="px-5 py-4">Status</th>
                </tr>
              </thead>
              <tbody>
                {history.map((tx, idx) => {
                  const style = getTypeStyles(tx.type);
                  return (
                    <tr key={tx.id} className="border-t border-white/5 hover:bg-white/5 transition-colors text-gray-300">
                      <td className="px-5 py-4 text-gray-500">{idx + 1}</td>
                      <td className="px-5 py-4">{new Date(tx.createdAt).toLocaleString()}</td>
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-2">
                          <div className={`p-1.5 rounded-md ${style.bg} ${style.color}`}>{style.icon}</div>
                          <span className="font-medium text-white">{tx.type}</span>
                        </div>
                      </td>
                      <td className="px-5 py-4 text-gray-400 text-xs">{tx.walletType || 'mineBalance'}</td>
                      <td className={`px-5 py-4 font-bold ${style.color}`}>
                        {style.sign}${tx.amount.toFixed(2)}
                      </td>
                      <td className="px-5 py-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                          tx.status === 'SUCCESS' || tx.status === 'COMPLETED'
                            ? 'bg-green-500/20 text-green-400'
                            : tx.status === 'PENDING'
                            ? 'bg-yellow-500/20 text-yellow-400'
                            : 'bg-red-500/20 text-red-400'
                        }`}>
                          {tx.status}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
