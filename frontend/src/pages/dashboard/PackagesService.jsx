import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Box, Check } from 'lucide-react';
import axios from 'axios';

export default function PackagesService() {
  const [packages, setPackages] = useState([
    { id: '1', name: 'Starter Node', price: 100, dailyReturn: 1.5, duration: 200 },
    { id: '2', name: 'Pro Node', price: 500, dailyReturn: 1.8, duration: 200 },
    { id: '3', name: 'Elite Node', price: 1000, dailyReturn: 2.0, duration: 200 },
  ]);
  const [loading, setLoading] = useState(false);

  const handlePurchase = async (pkgId) => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      await axios.post(`/packages/purchase/${pkgId}`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert('Package purchased successfully!');
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to purchase package. Insufficient balance?');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-8">
        <div className="p-3 bg-purple-500/20 rounded-xl text-purple-400"><Box className="w-6 h-6" /></div>
        <h2 className="text-2xl font-bold text-white">Service Packages</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {packages.map((pkg, idx) => (
          <motion.div 
            key={pkg.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="glass-card p-6 rounded-2xl flex flex-col items-center text-center relative overflow-hidden group hover:border-purple-500/50 transition-colors"
          >
            <div className="w-full h-1 bg-gradient-to-r from-purple-500 to-blue-500 absolute top-0 left-0"></div>
            
            <h3 className="text-xl font-bold text-white mt-4 mb-2">{pkg.name}</h3>
            <div className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400 mb-6">
              ${pkg.price}
            </div>

            <div className="w-full space-y-3 mb-8 text-sm text-gray-300">
              <div className="flex justify-between border-b border-white/5 pb-2">
                <span>Daily Return</span>
                <span className="font-bold text-green-400">{pkg.dailyReturn}%</span>
              </div>
              <div className="flex justify-between border-b border-white/5 pb-2">
                <span>Duration</span>
                <span className="font-bold">{pkg.duration} Days</span>
              </div>
              <div className="flex justify-between border-b border-white/5 pb-2">
                <span>Total Return</span>
                <span className="font-bold">{pkg.dailyReturn * pkg.duration}%</span>
              </div>
            </div>

            <button 
              onClick={() => handlePurchase(pkg.id)}
              disabled={loading}
              className="w-full py-3 bg-white/10 hover:bg-purple-600 text-white rounded-xl font-bold transition-all flex items-center justify-center gap-2 group-hover:shadow-lg group-hover:shadow-purple-500/25"
            >
              {loading ? 'Processing...' : 'Purchase Now'}
            </button>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
