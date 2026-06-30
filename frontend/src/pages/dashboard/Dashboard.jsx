import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Menu, X, Maximize, User, Wallet as WalletIcon, Settings, LogOut } from 'lucide-react';
import axios from 'axios';
import Sidebar from '../../components/Sidebar';
import MainDashboardView from './MainDashboardView';
import Referral from './Referral';
import Profile from './Profile';
import TransactionsList from './TransactionsList';
import PackagesService from './PackagesService';
import PackagesMining from './PackagesMining';
import PackageWithdraw from './PackageWithdraw';
import IncomesList from './IncomesList';
import DepositFund from './DepositFund';
import DepositInvoice from './DepositInvoice';
import TransferWallet from './TransferWallet';
import TransferReports from './TransferReports';
import FinancialHistory from './FinancialHistory';
import RankReward from './RankReward';
import SupportCenter from './SupportCenter';
import Presentation from './Presentation';
import Wallet from './Wallet';


export default function Dashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [activeView, setActiveView] = useState('dashboard');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch((err) => console.log(err));
    } else {
      if (document.exitFullscreen) document.exitFullscreen();
    }
  };

  const handleLogout = async () => {
    try {
      await axios.post('/auth/logout');
    } catch(e) {}
    navigate('/login');
  };

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get('/auth/profile');
        setUser(res.data);
      } catch (err) {
        navigate('/login');
      }
    };
    fetchUser();
  }, [navigate]);

  if (!user) return <div className="min-h-screen bg-black text-white flex justify-center items-center">Loading Data...</div>;

  const renderContent = () => {
    switch (activeView) {
      case 'dashboard': return <MainDashboardView user={user} setActiveView={setActiveView} />;
      case 'wallet': return <Wallet />;
      case 'profile': return <Profile />;
      case 'referral': return <Referral />;
      case 'history':
      case 'transactions': return <TransactionsList />;
      
      // Packages
      case 'packages_service': return <PackagesService />;
      case 'packages_mining': return <PackagesMining />;
      case 'packages_withdraw': return <PackageWithdraw />;
      
      // Incomes
      case 'income_service':
      case 'income_matching':
      case 'income_club':
      case 'income_reward':
      case 'income_fast':
      case 'income_mining':
      case 'income_mining_generation':
      case 'income_node_business': return <IncomesList type={activeView} />;
      
      // Deposits & Transfers
      case 'deposit_fund': return <DepositFund />;
      case 'deposit_invoice': return <DepositInvoice />;
      case 'transfer_node': 
      case 'transfer_capital': return <TransferWallet target={activeView} />;
      case 'transfer_report':
      case 'receive_report': return <TransferReports type={activeView} />;
      
      // Others
      case 'financial_history': return <FinancialHistory />;
      case 'rank_reward': return <RankReward />;
      case 'support': return <SupportCenter />;
      case 'presentation': return <Presentation />;
      
      default: return <MainDashboardView user={user} setActiveView={setActiveView} />;
    }
  };

  return (
    <div className="min-h-screen bg-[#0f0f11] text-white flex">
      <Sidebar activeView={activeView} setActiveView={(view) => { setActiveView(view); setMobileMenuOpen(false); }} />

      {/* Main Content */}
      <div className="flex-1 flex flex-col h-screen overflow-y-auto custom-scrollbar relative">
        
        {/* Mobile Header */}
        <div className="md:hidden flex items-center justify-between p-4 border-b border-white/5 bg-[#0f0f11]/80 backdrop-blur-md sticky top-0 z-40">
          <div className="font-bold text-xl text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-blue-500">
            Niveshventures
          </div>
          <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="p-2 bg-white/5 rounded-lg">
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {/* Top Bar matching screenshot */}
        <header className="w-full bg-gradient-to-r from-[#20102b] via-[#451325] to-[#792416] p-4 hidden md:flex items-center justify-between shadow-md">
          <div className="flex items-center">
            <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="w-8 h-8 rounded-full bg-orange-400 flex items-center justify-center hover:bg-orange-500 transition-colors shadow-lg shadow-orange-500/20">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="text-white"><path d="m13 17-5-5 5-5"/><path d="m18 17-5-5 5-5"/></svg>
            </button>
          </div>
          <div className="flex items-center gap-3">
             <button onClick={toggleFullscreen} className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center hover:bg-white/20 transition-colors">
               <Maximize className="w-5 h-5 text-orange-200" />
             </button>
             
             {/* Profile Dropdown */}
             <div className="relative">
               <button 
                 onClick={() => setProfileOpen(!profileOpen)}
                 className="w-10 h-10 bg-white rounded-lg flex items-center justify-center shadow-lg hover:bg-gray-100 transition-colors overflow-hidden"
               >
                 <span className="text-xl">⛏️</span>
               </button>

               {profileOpen && (
                 <>
                   <div className="fixed inset-0 z-40" onClick={() => setProfileOpen(false)}></div>
                   <div className="absolute right-0 mt-3 w-64 bg-[#111111] border border-white/10 rounded-xl shadow-2xl z-50 overflow-hidden flex flex-col">
                     {/* User Info Header */}
                     <div className="p-4 border-b border-white/5 flex items-center gap-3">
                       <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-xl flex-shrink-0">
                         ⛏️
                       </div>
                       <div className="overflow-hidden">
                         <h4 className="text-white text-sm font-semibold truncate">{user.name}</h4>
                         <p className="text-gray-400 text-xs truncate">{user.referralCode || user.id}</p>
                       </div>
                     </div>
                     
                     {/* Menu Items */}
                     <div className="p-2 space-y-1">
                       <button onClick={() => { setActiveView('profile'); setProfileOpen(false); }} className="w-full flex items-center gap-3 px-3 py-2.5 text-sm text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors">
                         <User className="w-4 h-4" />
                         MyProfile
                       </button>
                       <button onClick={() => { setActiveView('wallet'); setProfileOpen(false); }} className="w-full flex items-center gap-3 px-3 py-2.5 text-sm text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors">
                         <WalletIcon className="w-4 h-4" />
                         Wallet
                       </button>
                       <button onClick={() => { setActiveView('deposit_fund'); setProfileOpen(false); }} className="w-full flex items-center gap-3 px-3 py-2.5 text-sm text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors">
                         <Settings className="w-4 h-4" />
                         Topup by ePin
                       </button>
                     </div>
                     
                     <div className="p-2 border-t border-white/5">
                       <button onClick={handleLogout} className="w-full flex items-center gap-3 px-3 py-2.5 text-sm text-red-500 hover:bg-red-500/10 rounded-lg transition-colors font-medium">
                         <LogOut className="w-4 h-4" />
                         Logout
                       </button>
                     </div>
                   </div>
                 </>
               )}
             </div>
          </div>
        </header>

        <main className="p-4 sm:p-8 flex-1">
          <motion.div
            key={activeView}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            {renderContent()}
          </motion.div>
        </main>
      </div>

      {/* Mobile Sidebar Overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 flex md:hidden">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setMobileMenuOpen(false)}></div>
          <div className="relative w-64 h-full">
            <Sidebar activeView={activeView} setActiveView={(view) => { setActiveView(view); setMobileMenuOpen(false); }} />
          </div>
        </div>
      )}
    </div>
  );
}
