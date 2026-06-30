import { useState } from 'react';
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
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">KYC Applications</h2>
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
          <input type="text" placeholder="Search applications..." className="bg-white/5 border border-white/10 rounded-lg pl-10 pr-4 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-purple-500" />
        </div>
      </div>

      <div className="grid gap-4">
        {applications.length === 0 ? (
          <div className="text-center py-10 text-gray-500">No pending KYC applications.</div>
        ) : (
          applications.map(app => (
            <motion.div key={app.id} className="glass-card p-5 rounded-xl flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-blue-500/20 rounded-lg text-blue-400">
                  <FileText className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-bold text-white">{app.name}</h4>
                  <p className="text-sm text-gray-400">{app.documentType} • Submitted {app.submittedAt}</p>
                </div>
              </div>
              <div className="flex gap-2">
                <button className="px-4 py-2 bg-green-500/20 text-green-400 hover:bg-green-500/30 rounded-lg text-sm font-medium transition-colors flex items-center gap-2">
                  <Check className="w-4 h-4" /> Approve
                </button>
                <button className="px-4 py-2 bg-red-500/20 text-red-400 hover:bg-red-500/30 rounded-lg text-sm font-medium transition-colors flex items-center gap-2">
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
