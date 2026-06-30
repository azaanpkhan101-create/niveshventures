import { motion } from 'framer-motion';
import { Star, Trophy, Target, Shield, Check } from 'lucide-react';

export default function RankReward() {
  const currentRank = "Silver Node";
  const nextRank = "Gold Node";
  const progress = 65; // percentage

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-8">
        <div className="p-3 bg-yellow-500/20 rounded-xl text-yellow-400"><Star className="w-6 h-6" /></div>
        <h2 className="text-2xl font-bold text-white">Rank & Reward</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <motion.div className="glass-card p-8 rounded-[2rem] flex flex-col items-center text-center relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-yellow-500/10 rounded-full blur-2xl"></div>
          
          <div className="w-24 h-24 bg-gradient-to-br from-gray-300 to-gray-500 rounded-full flex items-center justify-center shadow-lg shadow-gray-500/20 mb-6">
            <Shield className="w-12 h-12 text-white" />
          </div>
          
          <h3 className="text-gray-400 uppercase tracking-widest text-sm font-bold mb-2">Current Rank</h3>
          <div className="text-4xl font-black text-white mb-8">{currentRank}</div>

          <div className="w-full space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Progress to {nextRank}</span>
              <span className="text-yellow-400 font-bold">{progress}%</span>
            </div>
            <div className="w-full h-3 bg-black/50 rounded-full overflow-hidden border border-white/5">
              <div className="h-full bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full" style={{ width: `${progress}%` }}></div>
            </div>
            <p className="text-xs text-gray-500 pt-2 text-left">Requires $10,000 Team Volume</p>
          </div>
        </motion.div>

        <motion.div className="glass-card p-8 rounded-[2rem]">
          <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2"><Trophy className="w-5 h-5 text-yellow-400" /> Rank Benefits</h3>
          
          <div className="space-y-4">
            <BenefitItem title="Direct Referral Bonus" value="8%" active={true} />
            <BenefitItem title="Matching Bonus" value="5%" active={true} />
            <BenefitItem title="Global Pool Share" value="1 Share" active={true} />
            <BenefitItem title="Luxury Car Fund" value="Locked" active={false} icon={Target} />
          </div>
        </motion.div>
      </div>
    </div>
  );
}

function BenefitItem({ title, value, active, icon: Icon = Check }) {
  return (
    <div className={`p-4 rounded-xl border flex items-center justify-between ${active ? 'bg-white/5 border-white/10' : 'bg-black/20 border-white/5 opacity-50'}`}>
      <div className="flex items-center gap-3">
        <div className={`p-1.5 rounded-lg ${active ? 'bg-green-500/20 text-green-400' : 'bg-gray-500/20 text-gray-400'}`}>
          <Icon className="w-4 h-4" />
        </div>
        <span className="font-medium text-white">{title}</span>
      </div>
      <span className={`font-bold ${active ? 'text-yellow-400' : 'text-gray-500'}`}>{value}</span>
    </div>
  );
}
