import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Menu, X, Maximize, User, LogOut } from 'lucide-react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

import Sidebar from '../../components/Sidebar';
import Overview from './Overview';
import KYC from './KYC';
import Reports from './Reports';
import ManageUsers from './ManageUsers';
import UserDetail from './UserDetail';

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [activeView, setActiveView] = useState('overview');
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const navigate = useNavigate();

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
    const fetchAdminData = async () => {
      try {
        const [statRes, userRes] = await Promise.all([
          axios.get('/admin/stats'),
          axios.get('/admin/users')
        ]);
        
        setStats(statRes.data);
        setUsers(userRes.data);
      } catch (err) {
        console.error(err);
        alert('Unauthorized or missing permissions');
        navigate('/login');
      }
    };
    fetchAdminData();
  }, [navigate]);

  if (!stats) return <div className="min-h-screen bg-black text-white flex justify-center items-center">Loading Admin...</div>;

  const renderContent = () => {
    switch (activeView) {
      case 'overview': 
        return <Overview stats={stats} users={users} />;
      case 'investors':
        return selectedUserId ? (
          <UserDetail userId={selectedUserId} onBack={() => setSelectedUserId(null)} />
        ) : (
          <ManageUsers onSelectUser={(id) => setSelectedUserId(id)} />
        );
      case 'kyc': return <KYC />;
      case 'reports': return <Reports />;
      default: return <Overview stats={stats} users={users} />;
    }
  };

  return (
    <div className="min-h-screen bg-[#0f0f11] text-white flex">
      <Sidebar activeView={activeView} setActiveView={(view) => { setActiveView(view); setMobileMenuOpen(false); setSelectedUserId(null); }} />

      {/* Main Content */}
      <div className="flex-1 flex flex-col h-screen overflow-y-auto custom-scrollbar relative">
        
        {/* Mobile Header */}
        <div className="md:hidden flex items-center justify-between p-4 border-b border-white/5 bg-[#0f0f11]/80 backdrop-blur-md sticky top-0 z-40">
          <div className="font-bold text-xl text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-orange-500">
            AdminPanel
          </div>
          <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="p-2 bg-white/5 rounded-lg">
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {/* Top Bar matching main frontend aesthetic, but red themed */}
        <header className="w-full bg-gradient-to-r from-[#2b1010] via-[#451313] to-[#791616] p-4 hidden md:flex items-center justify-between shadow-md">
          <div className="flex items-center">
            <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="w-8 h-8 rounded-full bg-red-500 flex items-center justify-center hover:bg-red-600 transition-colors shadow-lg shadow-red-500/20">
              <Menu className="w-4 h-4 text-white" />
            </button>
          </div>
          <div className="flex items-center gap-3">
             <button onClick={toggleFullscreen} className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center hover:bg-white/20 transition-colors">
               <Maximize className="w-5 h-5 text-red-200" />
             </button>
             
             {/* Profile Dropdown */}
             <div className="relative">
               <button 
                 onClick={() => setProfileOpen(!profileOpen)}
                 className="w-10 h-10 bg-red-500 rounded-lg flex items-center justify-center shadow-lg hover:bg-red-600 transition-colors overflow-hidden font-bold"
               >
                 A
               </button>

               {profileOpen && (
                 <>
                   <div className="fixed inset-0 z-40" onClick={() => setProfileOpen(false)}></div>
                   <div className="absolute right-0 mt-3 w-64 bg-[#111111] border border-white/10 rounded-xl shadow-2xl z-50 overflow-hidden flex flex-col">
                     {/* User Info Header */}
                     <div className="p-4 border-b border-white/5 flex items-center gap-3">
                       <div className="w-10 h-10 rounded-full bg-red-500 flex items-center justify-center font-bold flex-shrink-0">
                         A
                       </div>
                       <div className="overflow-hidden">
                         <h4 className="text-white text-sm font-semibold truncate">Master Admin</h4>
                         <p className="text-gray-400 text-xs truncate">System Controller</p>
                       </div>
                     </div>
                     
                     {/* Menu Items */}
                     <div className="p-2 border-t border-white/5">
                       <button onClick={handleLogout} className="w-full flex items-center gap-3 px-3 py-2.5 text-sm text-red-500 hover:bg-red-500/10 rounded-lg transition-colors font-medium">
                         <LogOut className="w-4 h-4" />
                         Secure Logout
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
            key={activeView + (selectedUserId || '')}
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
            <Sidebar isMobile activeView={activeView} setActiveView={(view) => { setActiveView(view); setMobileMenuOpen(false); setSelectedUserId(null); }} />
          </div>
        </div>
      )}
    </div>
  );
}
