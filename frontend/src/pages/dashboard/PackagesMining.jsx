import { useState } from 'react';
import { motion } from 'framer-motion';
import { Layers } from 'lucide-react';
import axios from 'axios';

export default function PackagesMining() {
  const [packages] = useState([
    { id: 'm1', name: 'Cloud Miner V1', price: 200, hashRate: '10 TH/s', duration: 365 },
    { id: 'm2', name: 'Cloud Miner V2', price: 1000, hashRate: '55 TH/s', duration: 365 },
    { id: 'm3', name: 'Cloud Miner Max', price: 5000, hashRate: '300 TH/s', duration: 365 },
  ]);
  const [loading, setLoading] = useState(false);

  const handlePurchase = async (pkgId) => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      await axios.post(`/packages/purchase/${pkgId}`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert('Mining contract activated successfully!');
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to purchase contract. Insufficient balance?');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-8">
        <div className="p-3 bg-blue-500/20 rounded-xl text-blue-400"><Layers className="w-6 h-6" /></div>
        <h2 className="text-2xl font-bold text-white">Mining Packages</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {packages.map((pkg, idx) => (
          <motion.div 
            key={pkg.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="glass-card p-6 rounded-2xl flex flex-col items-center text-center relative overflow-hidden group hover:border-blue-500/50 transition-colors"
          >
            <div className="w-full h-1 bg-gradient-to-r from-blue-500 to-cyan-500 absolute top-0 left-0"></div>
            
            <h3 className="text-xl font-bold text-white mt-4 mb-2">{pkg.name}</h3>
            <div className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400 mb-6">
              ${pkg.price}
            </div>

            <div className="w-full space-y-3 mb-8 text-sm text-gray-300">
              <div className="flex justify-between border-b border-white/5 pb-2">
                <span>Hash Rate</span>
                <span className="font-bold text-cyan-400">{pkg.hashRate}</span>
              </div>
              <div className="flex justify-between border-b border-white/5 pb-2">
                <span>Duration</span>
                <span className="font-bold">{pkg.duration} Days</span>
              </div>
              <div className="flex justify-between border-b border-white/5 pb-2">
                <span>Maintenance Fee</span>
                <span className="font-bold text-red-400">5% / day</span>
              </div>
            </div>

            <button 
              onClick={() => handlePurchase(pkg.id)}
              disabled={loading}
              className="w-full py-3 bg-white/10 hover:bg-blue-600 text-white rounded-xl font-bold transition-all flex items-center justify-center gap-2 group-hover:shadow-lg group-hover:shadow-blue-500/25"
            >
              {loading ? 'Processing...' : 'Buy Contract'}
            </button>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
