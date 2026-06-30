import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Users, Activity, DollarSign, LayoutDashboard, FileCheck, BarChart2, LogOut } from 'lucide-react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import KYC from './KYC';
import Reports from './Reports';
import ManageUsers from './ManageUsers';
import UserDetail from './UserDetail';

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedUserId, setSelectedUserId] = useState(null);
  const navigate = useNavigate();

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
        navigate('/dashboard');
      }
    };
    fetchAdminData();
  }, [navigate]);

  if (!stats) return <div className="min-h-screen bg-black text-white flex justify-center items-center">Loading Admin...</div>;

  return (
    <div className="min-h-screen bg-black text-white p-4 sm:p-8 flex flex-col md:flex-row gap-8">
      
      {/* Sidebar Navigation */}
      <aside className="w-full md:w-64 glass-card p-6 rounded-[2rem] flex flex-col gap-2 h-fit md:sticky md:top-8">
        <div className="flex items-center gap-2 mb-8 px-2">
          <div className="w-8 h-8 rounded-lg bg-red-500 flex items-center justify-center font-bold">A</div>
          <span className="font-bold text-xl tracking-tight text-red-400">AdminPanel</span>
        </div>

        <button onClick={() => { setActiveTab('overview'); setSelectedUserId(null); }} className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === 'overview' ? 'bg-red-500/20 text-red-400' : 'hover:bg-white/5 text-gray-400 hover:text-white'}`}>
          <LayoutDashboard className="w-5 h-5" /> Overview
        </button>
        <button onClick={() => { setActiveTab('investors'); setSelectedUserId(null); }} className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === 'investors' ? 'bg-red-500/20 text-red-400' : 'hover:bg-white/5 text-gray-400 hover:text-white'}`}>
          <Users className="w-5 h-5" /> Manage Investors
        </button>
        <button onClick={() => { setActiveTab('kyc'); setSelectedUserId(null); }} className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === 'kyc' ? 'bg-red-500/20 text-red-400' : 'hover:bg-white/5 text-gray-400 hover:text-white'}`}>
          <FileCheck className="w-5 h-5" /> KYC Approvals
        </button>
        <button onClick={() => { setActiveTab('reports'); setSelectedUserId(null); }} className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === 'reports' ? 'bg-red-500/20 text-red-400' : 'hover:bg-white/5 text-gray-400 hover:text-white'}`}>
          <BarChart2 className="w-5 h-5" /> Reports
        </button>

        <div className="mt-8 border-t border-white/10 pt-8 px-2">
          <Link to="/login" onClick={async () => await axios.post('/auth/logout')} className="flex items-center gap-3 text-gray-400 hover:text-white transition-colors">
            <LogOut className="w-5 h-5" /> Exit Admin
          </Link>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 max-w-5xl">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
        >
          {activeTab === 'overview' && (
            <div className="space-y-8">
              <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-orange-400 mb-8">
                Platform Overview
              </h1>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <motion.div className="glass-card p-6 rounded-2xl flex flex-col items-center justify-center border-t-4 border-t-blue-500">
                  <Users className="w-8 h-8 text-blue-400 mb-2" />
                  <div className="text-3xl font-bold">{stats.totalUsers}</div>
                  <div className="text-gray-400 text-sm">Total Users</div>
                </motion.div>

                <motion.div className="glass-card p-6 rounded-2xl flex flex-col items-center justify-center border-t-4 border-t-purple-500">
                  <Activity className="w-8 h-8 text-purple-400 mb-2" />
                  <div className="text-3xl font-bold">{stats.totalTransactions}</div>
                  <div className="text-gray-400 text-sm">Total Transactions</div>
                </motion.div>

                <motion.div className="glass-card p-6 rounded-2xl flex flex-col items-center justify-center border-t-4 border-t-green-500">
                  <DollarSign className="w-8 h-8 text-green-400 mb-2" />
                  <div className="text-3xl font-bold">${stats.totalDeposits.toFixed(2)}</div>
                  <div className="text-gray-400 text-sm">Total Deposits</div>
                </motion.div>
              </div>

              <motion.div className="glass-card p-6 rounded-2xl">
                <h2 className="text-xl font-semibold mb-4">Recent Users</h2>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm text-gray-300">
                    <thead className="bg-white/5 text-gray-400 uppercase">
                      <tr>
                        <th className="px-4 py-3 rounded-tl-lg">Name</th>
                        <th className="px-4 py-3">Email</th>
                        <th className="px-4 py-3">Role</th>
                        <th className="px-4 py-3">Balance</th>
                        <th className="px-4 py-3 rounded-tr-lg">Joined</th>
                      </tr>
                    </thead>
                    <tbody>
                      {users.map((user) => (
                        <tr key={user.id} className="border-b border-white/5 hover:bg-white/5">
                          <td className="px-4 py-3 font-medium text-white">{user.name}</td>
                          <td className="px-4 py-3">{user.email}</td>
                          <td className="px-4 py-3">
                            <span className={`px-2 py-1 rounded-full text-xs ${user.role === 'ADMIN' ? 'bg-red-500/20 text-red-400' : 'bg-blue-500/20 text-blue-400'}`}>
                              {user.role}
                            </span>
                          </td>
                          <td className="px-4 py-3">${user.wallet?.balance?.toFixed(2) || '0.00'}</td>
                          <td className="px-4 py-3">{new Date(user.createdAt).toLocaleDateString()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </motion.div>
            </div>
          )}

          {activeTab === 'investors' && (
            selectedUserId ? (
              <UserDetail userId={selectedUserId} onBack={() => setSelectedUserId(null)} />
            ) : (
              <ManageUsers onSelectUser={(id) => setSelectedUserId(id)} />
            )
          )}
          {activeTab === 'kyc' && <KYC />}
          {activeTab === 'reports' && <Reports />}
        </motion.div>
      </main>
    </div>
  );
}
