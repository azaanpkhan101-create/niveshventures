import { motion } from 'framer-motion';
import { Download, TrendingUp, BarChart3, PieChart } from 'lucide-react';
import { useState, useEffect } from 'react';
import axios from 'axios';

export default function Reports() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const res = await axios.get('/admin/reports');
        setStats(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchReports();
  }, []);

  if (!stats) return <div className="text-gray-400 py-10">Loading reports...</div>;
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Financial Reports</h2>
        <button className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-sm font-medium transition-colors">
          <Download className="w-4 h-4" /> Export CSV
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <motion.div className="glass-card p-6 rounded-2xl flex flex-col items-center justify-center h-64 text-center">
          <BarChart3 className="w-12 h-12 text-blue-400 mb-4 opacity-50" />
          <h3 className="font-bold text-lg mb-2">Monthly Volume</h3>
          <p className="text-gray-400 text-sm">Visual charts will be rendered here.</p>
        </motion.div>

        <motion.div className="glass-card p-6 rounded-2xl flex flex-col items-center justify-center h-64 text-center">
          <PieChart className="w-12 h-12 text-purple-400 mb-4 opacity-50" />
          <h3 className="font-bold text-lg mb-2">Asset Distribution</h3>
          <p className="text-gray-400 text-sm">Visual charts will be rendered here.</p>
        </motion.div>
      </div>

      <motion.div className="glass-card p-6 rounded-2xl">
        <h3 className="font-semibold mb-4 flex items-center gap-2"><TrendingUp className="w-5 h-5 text-green-400" /> Platform Growth</h3>
        <p className="text-sm text-gray-400 mb-4">A high-level summary of the platform's user acquisition and trading volume over the last 30 days.</p>
        
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-white/5 p-4 rounded-xl">
            <div className="text-sm text-gray-400 mb-1">New Users (30d)</div>
            <div className="text-2xl font-bold text-white">+{stats.newUsers}</div>
            <div className="text-xs text-green-400 mt-1">↑ {stats.newUsersGrowth}% vs last month</div>
          </div>
          <div className="bg-white/5 p-4 rounded-xl">
            <div className="text-sm text-gray-400 mb-1">Total Volume (30d)</div>
            <div className="text-2xl font-bold text-white">${stats.totalVolume.toFixed(2)}</div>
            <div className="text-xs text-green-400 mt-1">↑ {stats.totalVolumeGrowth}% vs last month</div>
          </div>
          <div className="bg-white/5 p-4 rounded-xl">
            <div className="text-sm text-gray-400 mb-1">Active Wallets</div>
            <div className="text-2xl font-bold text-white">{stats.activeWallets}</div>
            <div className="text-xs text-blue-400 mt-1">Stable</div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
