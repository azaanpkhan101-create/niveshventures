import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowUpRight, ArrowDownRight, Clock, CheckCircle, XCircle } from 'lucide-react';
import axios from 'axios';

export default function TransactionsList() {
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get('/wallet/transactions', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setTransactions(res.data || []);
      } catch (err) {
        console.error(err);
      }
    };
    fetchTransactions();
  }, []);

  const getStatusIcon = (status) => {
    switch(status) {
      case 'SUCCESS': return <CheckCircle className="w-4 h-4 text-green-400" />;
      case 'FAILED': return <XCircle className="w-4 h-4 text-red-400" />;
      default: return <Clock className="w-4 h-4 text-yellow-400" />;
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-white">Transaction History</h2>
      
      <motion.div className="glass-card p-6 rounded-2xl min-h-[500px]">
        {transactions.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-gray-500 py-20">
            <Clock className="w-12 h-12 mb-4 opacity-50" />
            <p>No transactions found.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-gray-300">
              <thead className="bg-white/5 text-gray-400 uppercase">
                <tr>
                  <th className="px-4 py-4 rounded-tl-lg">Type</th>
                  <th className="px-4 py-4">Amount</th>
                  <th className="px-4 py-4">Status</th>
                  <th className="px-4 py-4">Date</th>
                  <th className="px-4 py-4 rounded-tr-lg">ID</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((tx) => (
                  <tr key={tx.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                    <td className="px-4 py-4 font-medium text-white flex items-center gap-2">
                      <div className={`p-2 rounded-lg ${tx.type === 'DEPOSIT' || tx.type === 'BONUS' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                        {tx.type === 'DEPOSIT' || tx.type === 'BONUS' ? <ArrowDownRight className="w-4 h-4" /> : <ArrowUpRight className="w-4 h-4" />}
                      </div>
                      {tx.type}
                    </td>
                    <td className={`px-4 py-4 font-bold ${tx.type === 'DEPOSIT' || tx.type === 'BONUS' ? 'text-green-400' : 'text-white'}`}>
                      {tx.type === 'DEPOSIT' || tx.type === 'BONUS' ? '+' : '-'}${tx.amount.toFixed(2)}
                    </td>
                    <td className="px-4 py-4 flex items-center gap-2">
                      {getStatusIcon(tx.status)}
                      <span className="text-xs uppercase font-semibold">{tx.status}</span>
                    </td>
                    <td className="px-4 py-4 text-gray-400">
                      {new Date(tx.createdAt).toLocaleString()}
                    </td>
                    <td className="px-4 py-4 text-gray-500 font-mono text-xs">
                      {tx.id.split('-')[0]}...
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </motion.div>
    </div>
  );
}
