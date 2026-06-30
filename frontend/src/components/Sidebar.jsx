import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LayoutDashboard, Settings, User, Wallet, Box, Layers, ArrowDownToLine, 
  Users, UserPlus, FileClock, Building2, Download, Receipt, ArrowRightLeft, 
  PieChart, Star, LifeBuoy, MonitorPlay, LogOut, ChevronDown, ChevronRight
} from 'lucide-react';

export default function Sidebar({ activeView, setActiveView }) {
  const [openMenus, setOpenMenus] = useState({
    settings: false,
    network: false,
    incomes: false,
    deposit: false,
    transfer: false,
    financial: false
  });

  const toggleMenu = (menu) => {
    setOpenMenus(prev => ({ ...prev, [menu]: !prev[menu] }));
  };

  const NavItem = ({ icon: Icon, label, onClick, highlight = false }) => (
    <button 
      onClick={onClick}
      className={`w-full flex items-center gap-3 px-4 py-3 text-sm rounded-xl transition-all ${
        highlight 
          ? 'bg-[#8b3dff] hover:bg-[#7a34e0] text-white font-medium shadow-lg shadow-purple-500/20' 
          : 'text-gray-400 hover:bg-white/5 hover:text-white'
      }`}
    >
      <Icon className={`w-4 h-4 ${highlight ? 'text-white' : ''}`} />
      {label}
    </button>
  );

  const ExpandableMenu = ({ id, icon: Icon, label, children }) => {
    const isOpen = openMenus[id];
    return (
      <div className="w-full">
        <button 
          onClick={() => toggleMenu(id)}
          className={`w-full flex items-center justify-between px-4 py-3 text-sm rounded-xl transition-all ${
            isOpen ? 'bg-white/5 text-white' : 'text-gray-400 hover:bg-white/5 hover:text-white'
          }`}
        >
          <div className="flex items-center gap-3">
            <Icon className="w-4 h-4" />
            {label}
          </div>
          {isOpen ? <ChevronDown className="w-4 h-4 opacity-50" /> : <ChevronRight className="w-4 h-4 opacity-50" />}
        </button>
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden pl-11 pr-4 py-1 space-y-1"
            >
              {children}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  };
  const SubMenuItem = ({ label, onClick, highlight }) => {
    return (
      <button onClick={onClick} className={`w-full flex items-center gap-3 py-2 text-sm transition-colors text-left ${highlight ? 'text-white font-medium' : 'text-gray-400 hover:text-white'}`}>
        <div className={`w-1.5 h-1.5 rounded-full border ${highlight ? 'border-white bg-white' : 'border-gray-500 group-hover:border-white'}`}></div>
        {label}
      </button>
    );
  };

  return (
    <aside className="w-64 min-h-screen bg-[#0f0f11] border-r border-white/5 flex flex-col hidden md:flex sticky top-0 overflow-y-auto custom-scrollbar">
      {/* Logo */}
      <div className="p-6">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-xs tracking-[0.3em] text-purple-400 font-semibold uppercase">Niveshventures</span>
        </div>
        <div className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-blue-500 flex items-center gap-1">
          CRYPT<span className="text-yellow-500 text-xl flex items-center justify-center w-6 h-6 rounded-full bg-yellow-500/20 border border-yellow-500/50">₿</span>S
        </div>
        <div className="h-0.5 w-full bg-gradient-to-r from-purple-500 to-blue-500 mt-2"></div>
      </div>

      <div className="flex-1 px-3 py-4 space-y-8">
        
        {/* Main Section */}
        <div className="space-y-1">
          <h3 className="text-xs font-semibold text-gray-500 uppercase px-4 mb-3">Main</h3>
          
          <NavItem icon={LayoutDashboard} label="Dashboard" highlight={activeView === 'dashboard'} onClick={() => setActiveView('dashboard')} />
          
          <ExpandableMenu id="settings" icon={Settings} label="Settings">
            <SubMenuItem label="Profile" highlight={activeView === 'profile'} onClick={() => setActiveView('profile')} />
            <SubMenuItem label="Wallet" highlight={activeView === 'wallet'} onClick={() => setActiveView('wallet')} />
          </ExpandableMenu>
          
          <NavItem icon={Box} label="Service package" highlight={activeView === 'packages_service'} onClick={() => setActiveView('packages_service')} />
          <NavItem icon={Layers} label="Mining package" highlight={activeView === 'packages_mining'} onClick={() => setActiveView('packages_mining')} />
          <NavItem icon={ArrowDownToLine} label="Withdraw package" highlight={activeView === 'packages_withdraw'} onClick={() => setActiveView('packages_withdraw')} />
          
          <ExpandableMenu id="network" icon={Users} label="Network">
            <SubMenuItem label="Direct Team" highlight={activeView === 'referral'} onClick={() => setActiveView('referral')} />
            <SubMenuItem label="All Team" highlight={activeView === 'referral'} onClick={() => setActiveView('referral')} />
            <SubMenuItem label="Business History" highlight={activeView === 'history'} onClick={() => setActiveView('history')} />
          </ExpandableMenu>
        </div>

        <div className="w-full h-px bg-white/5"></div>

        {/* Components Section */}
        <div className="space-y-1">
          <h3 className="text-xs font-semibold text-gray-500 uppercase px-4 mb-3">Components</h3>
          
          <ExpandableMenu id="incomes" icon={Building2} label="Incomes">
            <SubMenuItem label="Service Generation" highlight={activeView === 'income_service'} onClick={() => setActiveView('income_service')} />
            <SubMenuItem label="Matching Income" highlight={activeView === 'income_matching'} onClick={() => setActiveView('income_matching')} />
            <SubMenuItem label="Club Income" highlight={activeView === 'income_club'} onClick={() => setActiveView('income_club')} />
            <SubMenuItem label="Reward Income" highlight={activeView === 'income_reward'} onClick={() => setActiveView('income_reward')} />
            <SubMenuItem label="Fast Track Bonus" highlight={activeView === 'income_fast'} onClick={() => setActiveView('income_fast')} />
            <SubMenuItem label="Mining Profit Sharing" highlight={activeView === 'income_mining'} onClick={() => setActiveView('income_mining')} />
            <SubMenuItem label="Mining Gen Income" highlight={activeView === 'income_mining_generation'} onClick={() => setActiveView('income_mining_generation')} />
            <SubMenuItem label="Node Business" highlight={activeView === 'income_node_business'} onClick={() => setActiveView('income_node_business')} />
          </ExpandableMenu>

          <ExpandableMenu id="deposit" icon={Download} label="Deposit">
            <SubMenuItem label="Deposit Fund (online)" highlight={activeView === 'deposit_fund'} onClick={() => setActiveView('deposit_fund')} />
            <SubMenuItem label="Deposit Invoice" highlight={activeView === 'deposit_invoice'} onClick={() => setActiveView('deposit_invoice')} />
          </ExpandableMenu>

          <ExpandableMenu id="transfer" icon={ArrowRightLeft} label="Transfer">
            <SubMenuItem label="Transfer to Node Wallet" highlight={activeView === 'transfer_node'} onClick={() => setActiveView('transfer_node')} />
            <SubMenuItem label="Transfer to Capital Wallet" highlight={activeView === 'transfer_capital'} onClick={() => setActiveView('transfer_capital')} />
            <SubMenuItem label="Transfer Report" highlight={activeView === 'transfer_report'} onClick={() => setActiveView('transfer_report')} />
            <SubMenuItem label="Receive Report" highlight={activeView === 'receive_report'} onClick={() => setActiveView('receive_report')} />
          </ExpandableMenu>

          <ExpandableMenu id="financial" icon={PieChart} label="Financial">
            <SubMenuItem label="Financial History" highlight={activeView === 'financial_history'} onClick={() => setActiveView('financial_history')} />
          </ExpandableMenu>

          <NavItem icon={Star} label="Rank & Reward" highlight={activeView === 'rank_reward'} onClick={() => setActiveView('rank_reward')} />
        </div>

        <div className="w-full h-px bg-white/5"></div>

        {/* Others Section */}
        <div className="space-y-1">
          <h3 className="text-xs font-semibold text-gray-500 uppercase px-4 mb-3">Others</h3>
          <NavItem icon={LifeBuoy} label="Support" highlight={activeView === 'support'} onClick={() => setActiveView('support')} />
          <NavItem icon={MonitorPlay} label="Presentation" highlight={activeView === 'presentation'} onClick={() => setActiveView('presentation')} />
          <button onClick={() => { localStorage.removeItem('token'); window.location.href = '/login'; }} className="w-full flex items-center gap-3 px-4 py-3 text-sm text-gray-400 hover:text-white transition-all rounded-xl hover:bg-white/5 mt-2">
            <LogOut className="w-4 h-4" />
            Logout
          </button>
        </div>
      </div>
    </aside>
  );
}
