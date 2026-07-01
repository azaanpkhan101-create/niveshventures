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
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h2 className="text-2xl font-bold text-white mb-1">Platform Reports</h2>
          <p className="text-gray-400 text-sm">Financial metrics and growth analytics.</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-[#111111] border border-white/10 hover:bg-white/5 rounded-lg text-sm font-medium transition-colors w-full sm:w-auto justify-center">
          <Download className="w-4 h-4" /> Export CSV
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <motion.div className="bg-[#111111] border border-white/5 shadow-lg p-6 rounded-2xl flex flex-col items-center justify-center h-64 text-center">
          <BarChart3 className="w-12 h-12 text-blue-400 mb-4 opacity-50" />
          <h3 className="font-bold text-lg mb-2 text-white">Monthly Volume</h3>
          <p className="text-gray-400 text-sm">Visual charts will be rendered here.</p>
        </motion.div>

        <motion.div className="bg-[#111111] border border-white/5 shadow-lg p-6 rounded-2xl flex flex-col items-center justify-center h-64 text-center">
          <PieChart className="w-12 h-12 text-purple-400 mb-4 opacity-50" />
          <h3 className="font-bold text-lg mb-2 text-white">Asset Distribution</h3>
          <p className="text-gray-400 text-sm">Visual charts will be rendered here.</p>
        </motion.div>
      </div>

      <motion.div className="bg-[#111111] border border-white/5 shadow-lg p-6 rounded-2xl">
        <h3 className="font-semibold mb-4 flex items-center gap-2 text-white"><TrendingUp className="w-5 h-5 text-green-400" /> Platform Growth</h3>
        <p className="text-sm text-gray-400 mb-6">A high-level summary of the platform's user acquisition and trading volume over the last 30 days.</p>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          <div className="bg-[#1a1a1a] border border-white/5 p-5 rounded-xl">
            <div className="text-sm text-gray-400 mb-2">New Users (30d)</div>
            <div className="text-3xl font-bold text-white">+{stats.newUsers}</div>
            <div className="text-xs text-green-400 mt-2 font-medium">↑ {stats.newUsersGrowth}% vs last month</div>
          </div>
          <div className="bg-[#1a1a1a] border border-white/5 p-5 rounded-xl">
            <div className="text-sm text-gray-400 mb-2">Total Volume (30d)</div>
            <div className="text-3xl font-bold text-white">${stats.totalVolume.toFixed(2)}</div>
            <div className="text-xs text-green-400 mt-2 font-medium">↑ {stats.totalVolumeGrowth}% vs last month</div>
          </div>
          <div className="bg-[#1a1a1a] border border-white/5 p-5 rounded-xl">
            <div className="text-sm text-gray-400 mb-2">Active Wallets</div>
            <div className="text-3xl font-bold text-white">{stats.activeWallets}</div>
            <div className="text-xs text-blue-400 mt-2 font-medium">Stable</div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
