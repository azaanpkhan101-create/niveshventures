import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Check, X, Search, FileText } from 'lucide-react';
import axios from 'axios';

export default function KYC() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchKyc = async () => {
      try {
        const res = await axios.get('/admin/kyc');
        setApplications(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchKyc();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h2 className="text-2xl font-bold text-white mb-1">KYC Approvals</h2>
          <p className="text-gray-400 text-sm">Review and manage user identity verifications.</p>
        </div>
        <div className="relative w-full sm:w-64">
          <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
          <input type="text" placeholder="Search applications..." className="w-full bg-[#111111] border border-white/10 rounded-xl py-2 pl-10 pr-4 text-sm text-white focus:outline-none focus:border-red-500 transition-colors" />
        </div>
      </div>

      <div className="grid gap-4">
        {loading ? (
          <div className="text-center py-10 text-gray-500">Loading applications...</div>
        ) : applications.length === 0 ? (
          <div className="text-center py-16 bg-[#111111] rounded-2xl border border-white/5">
            <FileText className="w-12 h-12 text-gray-600 mx-auto mb-3" />
            <div className="text-gray-400 font-medium">No pending KYC applications.</div>
            <div className="text-gray-500 text-sm mt-1">All caught up!</div>
          </div>
        ) : (
          applications.map(app => (
            <motion.div key={app.id} className="bg-[#111111] border border-white/5 p-5 rounded-xl flex flex-col sm:flex-row items-start sm:items-center justify-between shadow-lg gap-4">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-blue-500/10 rounded-lg text-blue-400 border border-blue-500/20">
                  <FileText className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-bold text-white text-lg">{app.name}</h4>
                  <p className="text-sm text-gray-400">{app.documentType} • Submitted {app.submittedAt}</p>
                </div>
              </div>
              <div className="flex gap-3 w-full sm:w-auto">
                <button className="flex-1 sm:flex-none justify-center px-4 py-2 bg-green-500/10 text-green-400 hover:bg-green-500/20 border border-green-500/20 rounded-lg text-sm font-bold uppercase tracking-wider transition-colors flex items-center gap-2">
                  <Check className="w-4 h-4" /> Approve
                </button>
                <button className="flex-1 sm:flex-none justify-center px-4 py-2 bg-red-500/10 text-red-400 hover:bg-red-500/20 border border-red-500/20 rounded-lg text-sm font-bold uppercase tracking-wider transition-colors flex items-center gap-2">
                  <X className="w-4 h-4" /> Reject
                </button>
              </div>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
}
