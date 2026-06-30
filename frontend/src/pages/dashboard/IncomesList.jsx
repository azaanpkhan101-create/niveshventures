import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Clock, Building2, Search, Download } from 'lucide-react';
import axios from 'axios';

const INCOME_TITLE_MAP = {
  income_service: 'Service Generation Income',
  income_matching: 'Matching Income',
  income_club: 'Club Income',
  income_reward: 'Reward Income',
  income_fast: 'Fast Track Bonus',
  income_mining: 'Mining Profit Sharing',
  income_mining_generation: 'Mining Generation Income',
  income_node_business: 'Node Business Sharing',
};

export default function IncomesList({ type }) {
  const [incomes, setIncomes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  const title = INCOME_TITLE_MAP[type] || 'Income History';

  useEffect(() => {
    const fetchIncomes = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get(`/wallet/incomes?type=${type}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setIncomes(res.data || []);
      } catch (err) {
        console.error('Income fetch error:', err);
        setIncomes([]);
      } finally {
        setLoading(false);
      }
    };
    fetchIncomes();
  }, [type]);

  const filtered = incomes.filter((inc) =>
    inc.id.toLowerCase().includes(search.toLowerCase()) ||
    (inc.description || '').toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-green-500/20 rounded-xl text-green-400">
            <Building2 className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white">{title}</h2>
            <p className="text-gray-400 text-sm mt-0.5">Home / Incomes / {title}</p>
          </div>
        </div>
        <button className="px-4 py-2 bg-white/5 hover:bg-white/10 rounded-lg flex items-center gap-2 text-sm transition-colors text-white">
          <Download className="w-4 h-4" /> Export CSV
        </button>
      </div>

      <div className="bg-[#111111] border border-white/10 rounded-xl overflow-hidden">
        {/* Table header with search */}
        <div className="flex justify-between items-center p-4 border-b border-white/10">
          <h3 className="font-semibold text-white text-sm">Income Ledger</h3>
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search records..."
              className="bg-black/40 border border-white/10 rounded-lg pl-9 pr-4 py-2 text-sm text-white focus:outline-none focus:border-green-500 w-48"
            />
          </div>
        </div>

        {loading ? (
          <div className="h-48 flex items-center justify-center text-gray-500">
            <div className="flex flex-col items-center gap-3">
              <div className="w-8 h-8 border-2 border-green-500 border-t-transparent rounded-full animate-spin"></div>
              <p className="text-sm">Loading records...</p>
            </div>
          </div>
        ) : filtered.length === 0 ? (
          <div className="h-64 flex flex-col items-center justify-center text-gray-500">
            <Clock className="w-12 h-12 mb-4 opacity-30" />
            <p className="font-medium">No {title.toLowerCase()} records yet.</p>
            <p className="text-sm mt-1 text-gray-600">Incomes will appear here once generated.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-[#1a1a1c] text-gray-400 uppercase text-xs tracking-wider">
                <tr>
                  <th className="px-5 py-4">#</th>
                  <th className="px-5 py-4">Date</th>
                  <th className="px-5 py-4">Description</th>
                  <th className="px-5 py-4">Amount</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((inc, idx) => (
                  <tr key={inc.id} className="border-t border-white/5 hover:bg-white/5 transition-colors text-gray-300">
                    <td className="px-5 py-4 text-gray-500">{idx + 1}</td>
                    <td className="px-5 py-4">{new Date(inc.createdAt).toLocaleString()}</td>
                    <td className="px-5 py-4 text-gray-400">{inc.description || 'Income credit'}</td>
                    <td className="px-5 py-4 font-bold text-green-400">+${inc.amount.toFixed(4)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
