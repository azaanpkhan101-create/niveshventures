import { motion } from 'framer-motion';
import { Users, Activity, DollarSign } from 'lucide-react';

export default function Overview({ stats, users }) {
  if (!stats) return null;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-orange-400 mb-2">
        Platform Overview
      </h1>
      
      {/* Top 3 Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <motion.div className="bg-[#111111] border border-white/5 p-6 rounded-xl shadow-lg flex flex-col justify-between relative overflow-hidden">
          <div className="absolute top-0 right-0 w-16 h-16 bg-blue-500/10 rounded-bl-full border-b border-l border-blue-500/20"></div>
          <div className="flex items-center gap-3 mb-2">
            <div className="bg-blue-500/20 p-2 rounded-lg border border-blue-500/30">
              <Users className="w-5 h-5 text-blue-400" />
            </div>
            <p className="text-sm font-medium text-gray-400">Total Users</p>
          </div>
          <h3 className="text-3xl font-bold mt-2 text-white">{stats.totalUsers}</h3>
        </motion.div>

        <motion.div className="bg-[#111111] border border-white/5 p-6 rounded-xl shadow-lg flex flex-col justify-between relative overflow-hidden">
          <div className="absolute top-0 right-0 w-16 h-16 bg-purple-500/10 rounded-bl-full border-b border-l border-purple-500/20"></div>
          <div className="flex items-center gap-3 mb-2">
            <div className="bg-purple-500/20 p-2 rounded-lg border border-purple-500/30">
              <Activity className="w-5 h-5 text-purple-400" />
            </div>
            <p className="text-sm font-medium text-gray-400">Total Transactions</p>
          </div>
          <h3 className="text-3xl font-bold mt-2 text-white">{stats.totalTransactions}</h3>
        </motion.div>

        <motion.div className="bg-[#111111] border border-white/5 p-6 rounded-xl shadow-lg flex flex-col justify-between relative overflow-hidden">
          <div className="absolute top-0 right-0 w-16 h-16 bg-green-500/10 rounded-bl-full border-b border-l border-green-500/20"></div>
          <div className="flex items-center gap-3 mb-2">
            <div className="bg-green-500/20 p-2 rounded-lg border border-green-500/30">
              <DollarSign className="w-5 h-5 text-green-400" />
            </div>
            <p className="text-sm font-medium text-gray-400">Total Deposits</p>
          </div>
          <h3 className="text-3xl font-bold mt-2 text-white">${stats.totalDeposits.toFixed(2)}</h3>
        </motion.div>
      </div>

      {/* Recent Users Table */}
      <motion.div className="bg-[#111111] border border-white/5 p-6 rounded-xl shadow-lg mt-8">
        <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
          <Users className="w-5 h-5 text-red-400" />
          Recent Signups
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-300">
            <thead className="bg-[#1a1a1a] border-b border-white/5">
              <tr>
                <th className="px-5 py-4 font-semibold text-gray-400 rounded-tl-lg">User</th>
                <th className="px-5 py-4 font-semibold text-gray-400">Email</th>
                <th className="px-5 py-4 font-semibold text-gray-400">Role</th>
                <th className="px-5 py-4 font-semibold text-gray-400 text-right">Balance</th>
                <th className="px-5 py-4 font-semibold text-gray-400 text-right rounded-tr-lg">Joined</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {users.slice(0, 8).map((user) => (
                <tr key={user.id} className="hover:bg-white/5 transition-colors group">
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-gray-700 to-gray-600 flex items-center justify-center text-white font-bold text-xs flex-shrink-0">
                        {user.name.charAt(0).toUpperCase()}
                      </div>
                      <div className="font-medium text-white">{user.name}</div>
                    </div>
                  </td>
                  <td className="px-5 py-4 text-gray-400">{user.email}</td>
                  <td className="px-5 py-4">
                    <span className={`px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider ${user.role === 'ADMIN' ? 'bg-red-500/20 text-red-400 border border-red-500/20' : 'bg-blue-500/20 text-blue-400 border border-blue-500/20'}`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="px-5 py-4 font-mono font-medium text-white text-right">
                    ${user.wallet?.capitalBalance?.toFixed(2) || '0.00'}
                  </td>
                  <td className="px-5 py-4 text-gray-500 text-xs text-right">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))}
              {users.length === 0 && (
                <tr>
                  <td colSpan="5" className="px-5 py-8 text-center text-gray-500">No users found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
}
