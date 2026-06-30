import { useState, useEffect } from 'react';
import { Copy, FileText, Layers, PieChart, Activity, Gift, RefreshCcw, Cpu, ShieldCheck } from 'lucide-react';
import axios from 'axios';

export default function MainDashboardView({ user, setActiveView }) {
  const [wallet, setWallet] = useState({ mineBalance: 0, nodeBalance: 0, capitalBalance: 0 });

  useEffect(() => {
    const fetchWallet = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get('/wallet/balance', {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (res.data) {
          setWallet({
            mineBalance: res.data.mineBalance || 0,
            nodeBalance: res.data.nodeBalance || 0,
            capitalBalance: res.data.capitalBalance || 0
          });
        }
      } catch (err) {
        console.error(err);
      }
    };
    fetchWallet();
  }, []);

  const totalCredit = wallet.mineBalance + wallet.nodeBalance + wallet.capitalBalance;
  
  // Wait for user to be passed down
  const userName = user?.name || 'User';
  const referralCode = user?.referralCode || 'NODE12862091';
  const affiliateUrl = `https://secure.niveshventures.com/auth/signup?referral=${referralCode}`;

  return (
    <div className="space-y-6">
      
      {/* Welcome Banner */}
      <div className="bg-[#111111] border border-white/5 rounded-xl p-5 flex items-center gap-2 shadow-lg">
        <span className="text-xl">👋</span>
        <span className="text-white font-medium tracking-wide">
          Hi {userName}, <span className="text-gray-400 font-normal">welcome to niveshventures user panel.</span>
        </span>
      </div>

      {/* Affiliate Link Section */}
      <div className="bg-[#111111] border border-white/5 rounded-xl p-5 shadow-lg relative overflow-hidden">
        {/* Red ribbon corner */}
        <div className="absolute top-0 right-0 w-16 h-16 bg-red-600 transform rotate-45 translate-x-8 -translate-y-8 flex items-end justify-center pb-2">
           <Layers className="w-3 h-3 text-white transform -rotate-45" />
        </div>
        
        <div className="mb-2">
          <p className="text-gray-300 text-sm font-medium">Affiliate Link</p>
        </div>
        <div className="flex items-center gap-3 text-sm text-gray-400">
          <span className="truncate">{affiliateUrl}</span>
          <button className="hover:text-white transition-colors flex items-center justify-center p-1.5 rounded-md hover:bg-white/10">
             <Copy className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Top 4 Main Wallets */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-[#ff9f43] p-6 rounded-xl text-white shadow-lg flex flex-col justify-between">
          <div className="flex items-center gap-3 mb-2">
            <div className="bg-white/30 p-2 rounded-lg"><FileText className="w-5 h-5 text-white" /></div>
            <p className="text-sm font-medium">Mine Wallet</p>
          </div>
          <h3 className="text-3xl font-bold mt-2">${wallet.mineBalance.toFixed(0)}</h3>
        </div>

        <div className="bg-[#1e293b] p-6 rounded-xl text-white shadow-lg flex flex-col justify-between">
          <div className="flex items-center gap-3 mb-2">
            <div className="bg-white/10 p-2 rounded-lg"><RefreshCcw className="w-5 h-5 text-gray-300" /></div>
            <p className="text-sm font-medium text-gray-300">Node Wallet</p>
          </div>
          <h3 className="text-3xl font-bold mt-2">${wallet.nodeBalance.toFixed(0)}</h3>
        </div>

        <div className="bg-[#2dd4bf] p-6 rounded-xl text-white shadow-lg flex flex-col justify-between">
          <div className="flex items-center gap-3 mb-2">
            <div className="bg-white/30 p-2 rounded-lg"><Gift className="w-5 h-5 text-white" /></div>
            <p className="text-sm font-medium">Capital Wallet</p>
          </div>
          <h3 className="text-3xl font-bold mt-2">${wallet.capitalBalance.toFixed(0)}</h3>
        </div>

        <div className="bg-[#3b82f6] p-6 rounded-xl text-white shadow-lg flex flex-col justify-between">
          <div className="flex items-center gap-3 mb-2">
            <div className="bg-white/30 p-2 rounded-lg"><ShieldCheck className="w-5 h-5 text-white" /></div>
            <p className="text-sm font-medium">Total Credit/Debit</p>
          </div>
          <h3 className="text-2xl font-bold mt-2">${totalCredit.toFixed(4)} / $1951</h3>
        </div>
      </div>

      {/* Income Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        <IncomeCard title="Service Generation Income" amount={0} color="bg-cyan-400" onClick={() => setActiveView('income_service')} />
        <IncomeCard title="Matching Income" amount={0} color="bg-green-400" onClick={() => setActiveView('income_matching')} />
        <IncomeCard title="Club Income" amount={0} color="bg-orange-300" onClick={() => setActiveView('income_club')} />
        <IncomeCard title="Reward Income" amount={0} color="bg-[#d8b4fe]" onClick={() => setActiveView('income_reward')} />
        
        <IncomeCard title="Fast Track Bonus" amount={0} color="bg-[#c084fc]" onClick={() => setActiveView('income_fast')} />
        <IncomeCard title="Mining Profit Sharing" amount={171.1381} color="bg-[#c084fc]" onClick={() => setActiveView('income_mining')} />
        <IncomeCard title="Mining Generation Income" amount={0} color="bg-[#c084fc]" onClick={() => setActiveView('income_mining_generation')} />
        <IncomeCard title="Node Business Sharing" amount={0} color="bg-[#c084fc]" onClick={() => setActiveView('income_node_business')} />
      </div>

      {/* Bottom 2 Panels */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 pb-8">
         {/* Profile Panel */}
         <div className="bg-[#111111] border border-white/5 rounded-xl p-6 shadow-lg flex flex-col justify-between h-full">
            <div className="flex items-center gap-4 mb-6">
               <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold text-xl overflow-hidden relative shadow-lg">
                  <div className="absolute inset-0 bg-blue-400 opacity-50 transform -translate-x-2"></div>
                  <span className="relative z-10">{userName.charAt(0)}</span>
               </div>
               <div>
                 <h4 className="text-white font-medium text-lg leading-tight">{userName}</h4>
                 <div className="flex items-center gap-2">
                    <span className="text-blue-400 text-sm">{referralCode}</span>
                    <div className="w-1.5 h-1.5 bg-orange-500 rounded-full"></div>
                 </div>
               </div>
            </div>

            <div className="space-y-2 mb-6 text-sm">
               <div className="flex justify-between border-b border-white/5 pb-2">
                 <span className="text-gray-400">Affiliate ID</span>
                 <span className="text-white">XM90700663</span>
               </div>
               <div className="flex justify-between border-b border-white/5 pb-2">
                 <span className="text-gray-400">Service</span>
                 <span className="text-white">Active</span>
               </div>
               <div className="flex justify-between border-b border-white/5 pb-2">
                 <span className="text-gray-400">Mining Investment</span>
                 <span className="text-white">0.0000</span>
               </div>
               <div className="flex justify-between border-b border-white/5 pb-2">
                 <span className="text-gray-400">Rank</span>
                 <span className="text-white">NA</span>
               </div>
               <div className="flex justify-between border-b border-white/5 pb-2">
                 <span className="text-gray-400">Date of Registration</span>
                 <span className="text-white">8/25/2025 1:09:16 AM</span>
               </div>
               <div className="flex justify-between border-b border-white/5 pb-2">
                 <span className="text-gray-400">Date of Activation</span>
                 <span className="text-white">8/25/2025 1:12:23 AM</span>
               </div>
               <div className="flex justify-end pt-1">
                 <button className="text-red-500 text-sm hover:underline">Edit profile</button>
               </div>
            </div>

            <button className="w-full py-3 bg-[#1d4ed8] hover:bg-blue-600 text-white font-medium rounded-md transition-colors text-sm">
              Click to View Closing Report
            </button>
         </div>

         {/* Business Details Panel */}
         <div className="bg-[#111111] border border-white/5 rounded-xl p-6 shadow-lg flex flex-col justify-between h-full">
            <div className="flex items-center gap-3 mb-6">
              <FileText className="w-5 h-5 text-orange-200" />
              <h4 className="text-white font-medium text-lg">Business Details</h4>
            </div>

            <div className="space-y-3 text-sm flex-1">
               <div className="flex justify-between border-b border-white/5 pb-2">
                 <span className="text-gray-400">Direct Team</span>
                 <span className="text-white font-mono">0</span>
               </div>
               <div className="flex justify-between border-b border-white/5 pb-2">
                 <span className="text-gray-400">Total Team</span>
                 <span className="text-white font-mono">0</span>
               </div>
               <div className="flex justify-between border-b border-white/5 pb-2">
                 <span className="text-gray-400">Team Business</span>
                 <span className="text-white font-mono">0</span>
               </div>
               <div className="flex justify-between border-b border-white/5 pb-2">
                 <span className="text-gray-400">Total Active Team(Left/Right)</span>
                 <span className="text-white font-mono">0/0</span>
               </div>
               <div className="flex justify-between border-b border-white/5 pb-2">
                 <span className="text-gray-400">Strong/Weaker Leg Team</span>
                 <span className="text-white font-mono">0/0</span>
               </div>
               <div className="flex justify-between border-b border-white/5 pb-2">
                 <span className="text-gray-400">Team CarryForward(Left/Right)</span>
                 <span className="text-white font-mono">0/0</span>
               </div>
               <div className="flex justify-between border-b border-white/5 pb-2">
                 <span className="text-gray-400">Current Mining Business(Left/Right)</span>
                 <span className="text-white font-mono">0/0</span>
               </div>
               <div className="flex justify-between">
                 <span className="text-gray-400">Total Mining Business(Left/Right)</span>
                 <span className="text-white font-mono">0/0</span>
               </div>
            </div>
         </div>
      </div>

    </div>
  );
}

function IncomeCard({ title, amount, color, onClick }) {
  return (
    <div className="bg-[#111111] border border-white/5 p-5 rounded-xl flex flex-col justify-between h-[140px] hover:bg-[#1a1a1a] transition-colors shadow-lg">
      <div className="flex justify-between items-start">
        <div>
          <h4 className="text-xl font-bold text-white mb-1">${amount === 0 ? '0' : amount.toFixed(4)}</h4>
          <p className="text-[13px] text-gray-400 pr-2">{title}</p>
        </div>
        <div className={`w-8 h-8 rounded-md flex flex-shrink-0 items-center justify-center ${color} bg-opacity-10 mt-1`}>
          <div className={`w-3 h-3 border-2 border-current rounded-sm ${color.replace('bg-', 'text-')} opacity-80`}></div>
        </div>
      </div>
      <div className="pt-4 border-t border-white/5 mt-auto">
        <button onClick={onClick} className="text-xs text-gray-400 hover:text-white transition-colors border-b border-gray-600 hover:border-white inline-block pb-0.5">
          View All
        </button>
      </div>
    </div>
  );
}
