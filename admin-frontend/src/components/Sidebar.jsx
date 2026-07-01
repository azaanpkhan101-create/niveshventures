import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LayoutDashboard, Users, FileCheck, BarChart2, LogOut, ChevronDown, ChevronRight
} from 'lucide-react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function Sidebar({ activeView, setActiveView, isMobile = false }) {
  const navigate = useNavigate();
  const [openMenus, setOpenMenus] = useState({});

  const toggleMenu = (menu) => {
    setOpenMenus(prev => ({ ...prev, [menu]: !prev[menu] }));
  };

  const handleLogout = async () => {
    try {
      await axios.post('/auth/logout');
    } catch(e) {}
    navigate('/login');
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

  return (
    <aside className={`w-64 min-h-screen bg-[#0f0f11] border-r border-white/5 flex flex-col sticky top-0 overflow-y-auto custom-scrollbar ${isMobile ? 'flex' : 'hidden md:flex'}`}>
      {/* Logo */}
      <div className="p-6 border-b border-white/5 bg-[#111111]/50">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-xs tracking-[0.3em] text-red-500 font-semibold uppercase">Admin Panel</span>
        </div>
        <div className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-orange-500 flex items-center gap-1">
          CRYPT<span className="text-yellow-500 text-xl flex items-center justify-center w-6 h-6 rounded-full bg-yellow-500/20 border border-yellow-500/50">₿</span>S
        </div>
        <div className="h-0.5 w-full bg-gradient-to-r from-red-500 to-orange-500 mt-2"></div>
      </div>

      <div className="flex-1 px-3 py-6 space-y-6">
        
        {/* Core Administration */}
        <div className="space-y-1">
          <h3 className="text-xs font-semibold text-gray-500 uppercase px-4 mb-3">Core Administration</h3>
          <NavItem icon={LayoutDashboard} label="Overview" highlight={activeView === 'overview'} onClick={() => setActiveView('overview')} />
          <NavItem icon={Users} label="Manage Investors" highlight={activeView === 'investors'} onClick={() => setActiveView('investors')} />
          <NavItem icon={FileCheck} label="KYC Approvals" highlight={activeView === 'kyc'} onClick={() => setActiveView('kyc')} />
          <NavItem icon={BarChart2} label="Platform Reports" highlight={activeView === 'reports'} onClick={() => setActiveView('reports')} />
        </div>

        <div className="w-full h-px bg-white/5"></div>

        {/* Account */}
        <div className="space-y-1">
          <h3 className="text-xs font-semibold text-gray-500 uppercase px-4 mb-3">System</h3>
          <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-3 text-sm text-red-400 hover:text-red-300 transition-all rounded-xl hover:bg-red-500/10 mt-2">
            <LogOut className="w-4 h-4" />
            Secure Logout
          </button>
        </div>
      </div>
      
      {/* Admin Badge */}
      <div className="p-4 m-3 mt-auto bg-gradient-to-br from-red-500/10 to-orange-500/10 border border-red-500/20 rounded-xl flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-red-500 flex items-center justify-center text-white font-bold shadow-lg shadow-red-500/20">
          A
        </div>
        <div>
          <h4 className="text-white text-sm font-bold">Master Admin</h4>
          <p className="text-gray-400 text-xs">Level 1 Access</p>
        </div>
      </div>
    </aside>
  );
}
