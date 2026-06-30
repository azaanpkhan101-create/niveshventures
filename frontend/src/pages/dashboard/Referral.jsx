import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Users, Gift, Copy, Check } from 'lucide-react';
import axios from 'axios';

export default function Referral() {
  const [stats, setStats] = useState(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get('/referral/stats', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setStats(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchStats();
  }, []);

  const handleCopy = () => {
    if (stats?.referralCode) {
      navigator.clipboard.writeText(stats.referralCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (!stats) return <div className="text-white">Loading...</div>;

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-white">Referral Program</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Referral Stats */}
        <motion.div className="glass-card p-6 rounded-2xl flex flex-col justify-between">
          <div>
            <h3 className="text-gray-400 mb-4 font-semibold">Your Referral Link</h3>
            <div className="flex items-center gap-2 bg-black/40 border border-white/10 rounded-xl p-3 mb-8">
              <span className="text-purple-400 font-mono flex-1 px-2">{stats.referralCode}</span>
              <button 
                onClick={handleCopy}
                className="bg-white/10 hover:bg-white/20 p-2 rounded-lg transition-all text-white"
              >
                {copied ? <Check className="w-5 h-5 text-green-400" /> : <Copy className="w-5 h-5" />}
              </button>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white/5 border border-white/5 rounded-xl p-4 flex flex-col items-center justify-center">
              <Users className="w-6 h-6 text-blue-400 mb-2" />
              <div className="text-2xl font-bold text-white">{stats.totalReferred}</div>
              <div className="text-xs text-gray-500 uppercase tracking-wider">Total Friends</div>
            </div>
            <div className="bg-white/5 border border-white/5 rounded-xl p-4 flex flex-col items-center justify-center">
              <Gift className="w-6 h-6 text-purple-400 mb-2" />
              <div className="text-2xl font-bold text-white">${stats.totalBonus.toFixed(2)}</div>
              <div className="text-xs text-gray-500 uppercase tracking-wider">Total Earned</div>
            </div>
          </div>
        </motion.div>

        {/* Referred Users List */}
        <motion.div className="glass-card p-6 rounded-2xl h-96 flex flex-col">
          <h3 className="text-gray-400 mb-4 font-semibold">Your Network</h3>
          <div className="flex-1 overflow-y-auto space-y-3 pr-2">
            {stats.referredUsers.length === 0 ? (
              <p className="text-gray-500 text-sm text-center mt-10">No referrals yet. Share your code!</p>
            ) : stats.referredUsers.map((user, idx) => (
              <div key={idx} className="flex justify-between items-center p-3 rounded-xl bg-white/5 border border-white/5">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-purple-600 to-blue-600 flex items-center justify-center text-white font-bold">
                    {user.name.charAt(0)}
                  </div>
                  <div>
                    <p className="text-white text-sm font-medium">{user.name}</p>
                    <p className="text-gray-500 text-xs">{new Date(user.createdAt).toLocaleDateString()}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

      </div>
    </div>
  );
}
