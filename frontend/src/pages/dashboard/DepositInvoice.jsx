import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Receipt, Search, Download } from 'lucide-react';

export default function DepositInvoice() {
  const [invoices, setInvoices] = useState([
    { id: 'INV-1092', amount: 500, currency: 'USDT (TRC20)', status: 'COMPLETED', date: '2024-03-14T10:30:00Z' },
    { id: 'INV-1093', amount: 1500, currency: 'BTC', status: 'PENDING', date: '2024-03-15T14:20:00Z' },
  ]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-blue-500/20 rounded-xl text-blue-400"><Receipt className="w-6 h-6" /></div>
          <h2 className="text-2xl font-bold text-white">Deposit Invoices</h2>
        </div>
        <button className="px-4 py-2 bg-white/5 hover:bg-white/10 rounded-lg flex items-center gap-2 text-sm transition-colors text-white">
          <Download className="w-4 h-4" /> Export CSV
        </button>
      </div>

      <motion.div className="glass-card p-6 rounded-2xl min-h-[500px]">
        <div className="flex justify-between items-center mb-6">
          <h3 className="font-semibold text-white">Recent Deposits</h3>
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
            <input 
              type="text" 
              placeholder="Search invoices..." 
              className="bg-black/40 border border-white/10 rounded-lg pl-9 pr-4 py-2 text-sm text-white focus:outline-none focus:border-blue-500"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-300">
            <thead className="bg-white/5 text-gray-400 uppercase">
              <tr>
                <th className="px-4 py-4 rounded-tl-lg">Date</th>
                <th className="px-4 py-4">Invoice ID</th>
                <th className="px-4 py-4">Currency</th>
                <th className="px-4 py-4">Amount</th>
                <th className="px-4 py-4 rounded-tr-lg">Status</th>
              </tr>
            </thead>
            <tbody>
              {invoices.map((inv) => (
                <tr key={inv.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                  <td className="px-4 py-4">{new Date(inv.date).toLocaleString()}</td>
                  <td className="px-4 py-4 font-mono text-xs">{inv.id}</td>
                  <td className="px-4 py-4">{inv.currency}</td>
                  <td className="px-4 py-4 font-bold text-white">${inv.amount.toFixed(2)}</td>
                  <td className="px-4 py-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                      inv.status === 'COMPLETED' ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'
                    }`}>
                      {inv.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
}
