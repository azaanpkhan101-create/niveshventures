import { useState, useEffect } from 'react';
import { FileText, Search, Download, RefreshCw } from 'lucide-react';
import axios from 'axios';

export default function TransferReports({ type }) {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  const isReceive = type === 'receive_report';
  const title = isReceive ? 'Receive Report' : 'Transfer Report';

  useEffect(() => {
    const fetchReports = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get('/wallet/transactions?type=TRANSFER', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setReports(res.data || []);
      } catch (err) {
        console.error('Transfer reports fetch error:', err);
        setReports([]);
      } finally {
        setLoading(false);
      }
    };
    fetchReports();
  }, [type]);

  const filtered = reports.filter((r) =>
    r.id.toLowerCase().includes(search.toLowerCase()) ||
    (r.note || '').toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-indigo-500/20 rounded-xl text-indigo-400">
            <FileText className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white">{title}</h2>
            <p className="text-gray-400 text-sm mt-0.5">Home / Transfer / {title}</p>
          </div>
        </div>
        <button className="px-4 py-2 bg-white/5 hover:bg-white/10 rounded-lg flex items-center gap-2 text-sm transition-colors text-white">
          <Download className="w-4 h-4" /> Export CSV
        </button>
      </div>

      <div className="bg-[#111111] border border-white/10 rounded-xl overflow-hidden">
        <div className="flex justify-between items-center p-4 border-b border-white/10">
          <h3 className="font-semibold text-white text-sm">Internal Transfer Records</h3>
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search transfers..."
              className="bg-black/40 border border-white/10 rounded-lg pl-9 pr-4 py-2 text-sm text-white focus:outline-none focus:border-indigo-500 w-48"
            />
          </div>
        </div>

        {loading ? (
          <div className="h-48 flex items-center justify-center">
            <div className="flex flex-col items-center gap-3 text-gray-500">
              <RefreshCw className="w-8 h-8 animate-spin opacity-50" />
              <p className="text-sm">Loading records...</p>
            </div>
          </div>
        ) : filtered.length === 0 ? (
          <div className="h-48 flex flex-col items-center justify-center text-gray-500">
            <FileText className="w-10 h-10 mb-3 opacity-30" />
            <p className="font-medium">No transfer records found.</p>
            <p className="text-sm mt-1 text-gray-600">Transfers will appear here after you move funds.</p>
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
                  <th className="px-5 py-4">Status</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((r, idx) => (
                  <tr key={r.id} className="border-t border-white/5 hover:bg-white/5 transition-colors text-gray-300">
                    <td className="px-5 py-4 text-gray-500">{idx + 1}</td>
                    <td className="px-5 py-4">{new Date(r.createdAt).toLocaleString()}</td>
                    <td className="px-5 py-4 text-gray-400">{r.note || 'Internal transfer'}</td>
                    <td className="px-5 py-4 font-bold text-white">${r.amount.toFixed(2)}</td>
                    <td className="px-5 py-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${r.status === 'SUCCESS' ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'}`}>
                        {r.status}
                      </span>
                    </td>
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
