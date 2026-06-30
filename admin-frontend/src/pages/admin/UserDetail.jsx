import { useState, useEffect } from 'react';
import { ArrowLeft, User, Shield, Wallet, Lock, Activity, Check, AlertCircle } from 'lucide-react';
import axios from 'axios';

export default function UserDetail({ userId, onBack }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // Forms state
  const [profileForm, setProfileForm] = useState({});
  const [walletForm, setWalletForm] = useState({ action: 'DEPOSIT', walletType: 'mineBalance', amount: '', note: '' });
  const [passwordForm, setPasswordForm] = useState('');
  
  const [statusMsg, setStatusMsg] = useState(null);

  const fetchUser = async () => {
    try {
      const res = await axios.get(`/admin/users/${userId}`);
      setUser(res.data);
      setProfileForm({
        name: res.data.name,
        email: res.data.email,
        phone: res.data.phone || '',
        country: res.data.country || '',
        status: res.data.status
      });
    } catch (err) {
      console.error(err);
      setStatusMsg({ type: 'error', text: 'Failed to load user details.' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, [userId]);

  const showMsg = (type, text) => {
    setStatusMsg({ type, text });
    setTimeout(() => setStatusMsg(null), 4000);
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    try {
      await axios.patch(`/admin/users/${userId}`, profileForm);
      showMsg('success', 'Profile updated successfully.');
      fetchUser();
    } catch (err) {
      showMsg('error', err.response?.data?.message || 'Update failed.');
    }
  };

  const handleWalletUpdate = async (e) => {
    e.preventDefault();
    if (!walletForm.amount || walletForm.amount <= 0) return;
    try {
      await axios.post(`/admin/users/${userId}/wallet`, {
        ...walletForm,
        amount: Number(walletForm.amount)
      });
      showMsg('success', `Wallet updated successfully.`);
      setWalletForm(prev => ({ ...prev, amount: '', note: '' }));
      fetchUser();
    } catch (err) {
      showMsg('error', err.response?.data?.message || 'Wallet update failed.');
    }
  };

  const handlePasswordReset = async (e) => {
    e.preventDefault();
    if (passwordForm.length < 6) {
      showMsg('error', 'Password must be at least 6 characters.');
      return;
    }
    try {
      await axios.post(`/admin/users/${userId}/password`, { newPassword: passwordForm });
      showMsg('success', 'Password reset successfully.');
      setPasswordForm('');
    } catch (err) {
      showMsg('error', err.response?.data?.message || 'Password reset failed.');
    }
  };

  if (loading) return <div className="text-gray-400 py-10">Loading user data...</div>;
  if (!user) return <div className="text-red-400 py-10">User not found.</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4 mb-2">
        <button onClick={onBack} className="p-2 bg-white/5 hover:bg-white/10 rounded-lg text-gray-400 hover:text-white transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h2 className="text-2xl font-bold text-white flex items-center gap-3">
            Master Control: {user.name}
            {user.status === 'SUSPENDED' && <span className="text-xs bg-red-500 text-white px-2 py-0.5 rounded uppercase">Suspended</span>}
          </h2>
          <p className="text-gray-400 text-sm">{user.email} • ID: <span className="font-mono text-xs">{user.id}</span></p>
        </div>
      </div>

      {statusMsg && (
        <div className={`p-4 rounded-xl flex items-center gap-3 text-sm font-medium border ${statusMsg.type === 'error' ? 'bg-red-500/10 border-red-500/20 text-red-400' : 'bg-green-500/10 border-green-500/20 text-green-400'}`}>
          {statusMsg.type === 'error' ? <AlertCircle className="w-5 h-5" /> : <Check className="w-5 h-5" />}
          {statusMsg.text}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Profile Control */}
        <div className="glass-card p-6 rounded-2xl border border-white/10">
          <div className="flex items-center gap-3 mb-6">
            <User className="w-5 h-5 text-blue-400" />
            <h3 className="font-bold text-white text-lg">Profile & Status Control</h3>
          </div>
          <form onSubmit={handleProfileUpdate} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs text-gray-400 mb-1">Full Name</label>
                <input type="text" value={profileForm.name} onChange={e => setProfileForm(f => ({...f, name: e.target.value}))} className="w-full bg-[#111] border border-white/10 rounded-lg p-2 text-white text-sm" />
              </div>
              <div>
                <label className="block text-xs text-gray-400 mb-1">Email</label>
                <input type="email" value={profileForm.email} onChange={e => setProfileForm(f => ({...f, email: e.target.value}))} className="w-full bg-[#111] border border-white/10 rounded-lg p-2 text-white text-sm" />
              </div>
              <div>
                <label className="block text-xs text-gray-400 mb-1">Phone</label>
                <input type="text" value={profileForm.phone} onChange={e => setProfileForm(f => ({...f, phone: e.target.value}))} className="w-full bg-[#111] border border-white/10 rounded-lg p-2 text-white text-sm" />
              </div>
              <div>
                <label className="block text-xs text-gray-400 mb-1">Country</label>
                <input type="text" value={profileForm.country} onChange={e => setProfileForm(f => ({...f, country: e.target.value}))} className="w-full bg-[#111] border border-white/10 rounded-lg p-2 text-white text-sm" />
              </div>
            </div>
            <div>
              <label className="block text-xs text-gray-400 mb-1">Account Status</label>
              <select value={profileForm.status} onChange={e => setProfileForm(f => ({...f, status: e.target.value}))} className={`w-full bg-[#111] border border-white/10 rounded-lg p-2 text-sm outline-none ${profileForm.status === 'SUSPENDED' ? 'text-red-400' : 'text-green-400'}`}>
                <option value="ACTIVE" className="text-green-400">ACTIVE</option>
                <option value="SUSPENDED" className="text-red-400">SUSPENDED</option>
              </select>
              <p className="text-xs text-gray-500 mt-1">Suspending the account prevents the user from logging in.</p>
            </div>
            <button type="submit" className="w-full bg-blue-600 hover:bg-blue-500 text-white font-medium py-2 rounded-lg text-sm transition-colors">
              Save Profile Changes
            </button>
          </form>
        </div>

        {/* Wallet Master Control */}
        <div className="glass-card p-6 rounded-2xl border border-white/10">
          <div className="flex items-center gap-3 mb-6">
            <Wallet className="w-5 h-5 text-green-400" />
            <h3 className="font-bold text-white text-lg">Wallet Master Control</h3>
          </div>
          
          <div className="grid grid-cols-3 gap-3 mb-6">
            <div className="bg-[#111] border border-white/10 p-3 rounded-xl">
              <div className="text-xs text-gray-500">Mine Balance</div>
              <div className="font-mono text-white font-bold">${user.wallet?.mineBalance?.toFixed(2) || '0.00'}</div>
            </div>
            <div className="bg-[#111] border border-white/10 p-3 rounded-xl">
              <div className="text-xs text-gray-500">Node Balance</div>
              <div className="font-mono text-white font-bold">${user.wallet?.nodeBalance?.toFixed(2) || '0.00'}</div>
            </div>
            <div className="bg-[#111] border border-white/10 p-3 rounded-xl">
              <div className="text-xs text-gray-500">Capital Balance</div>
              <div className="font-mono text-white font-bold">${user.wallet?.capitalBalance?.toFixed(2) || '0.00'}</div>
            </div>
          </div>

          <form onSubmit={handleWalletUpdate} className="space-y-4 border-t border-white/5 pt-4">
            <div className="flex gap-4">
              <div className="flex-1">
                <label className="block text-xs text-gray-400 mb-1">Action</label>
                <select value={walletForm.action} onChange={e => setWalletForm(f => ({...f, action: e.target.value}))} className="w-full bg-[#111] border border-white/10 rounded-lg p-2 text-white text-sm">
                  <option value="DEPOSIT">DEPOSIT (Add Funds)</option>
                  <option value="DEDUCT">DEDUCT (Remove Funds)</option>
                </select>
              </div>
              <div className="flex-1">
                <label className="block text-xs text-gray-400 mb-1">Target Wallet</label>
                <select value={walletForm.walletType} onChange={e => setWalletForm(f => ({...f, walletType: e.target.value}))} className="w-full bg-[#111] border border-white/10 rounded-lg p-2 text-white text-sm">
                  <option value="mineBalance">Mine Wallet</option>
                  <option value="nodeBalance">Node Wallet</option>
                  <option value="capitalBalance">Capital Wallet</option>
                </select>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="flex-1">
                <label className="block text-xs text-gray-400 mb-1">Amount ($)</label>
                <input type="number" min="0.01" step="0.01" required value={walletForm.amount} onChange={e => setWalletForm(f => ({...f, amount: e.target.value}))} className="w-full bg-[#111] border border-white/10 rounded-lg p-2 text-white text-sm" placeholder="0.00" />
              </div>
              <div className="flex-1">
                <label className="block text-xs text-gray-400 mb-1">Admin Note (Visible to User)</label>
                <input type="text" value={walletForm.note} onChange={e => setWalletForm(f => ({...f, note: e.target.value}))} className="w-full bg-[#111] border border-white/10 rounded-lg p-2 text-white text-sm" placeholder="e.g. Refund" />
              </div>
            </div>
            <button type="submit" className={`w-full font-medium py-2 rounded-lg text-sm transition-colors text-white ${walletForm.action === 'DEPOSIT' ? 'bg-green-600 hover:bg-green-500' : 'bg-orange-600 hover:bg-orange-500'}`}>
              Execute {walletForm.action}
            </button>
          </form>
        </div>

        {/* Security Control */}
        <div className="glass-card p-6 rounded-2xl border border-white/10">
          <div className="flex items-center gap-3 mb-6">
            <Shield className="w-5 h-5 text-red-400" />
            <h3 className="font-bold text-white text-lg">Security Control</h3>
          </div>
          <p className="text-sm text-gray-400 mb-4">Forcefully reset the user's login password. They will be logged out of all active sessions.</p>
          <form onSubmit={handlePasswordReset} className="flex gap-3">
            <div className="flex-1 relative">
              <Lock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
              <input type="text" required value={passwordForm} onChange={e => setPasswordForm(e.target.value)} placeholder="Enter new password" className="w-full bg-[#111] border border-white/10 rounded-lg py-2 pl-9 pr-3 text-white text-sm" />
            </div>
            <button type="submit" className="bg-red-600 hover:bg-red-500 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
              Reset Password
            </button>
          </form>
        </div>

        {/* Recent Transactions Audit */}
        <div className="glass-card p-6 rounded-2xl border border-white/10">
          <div className="flex items-center gap-3 mb-6">
            <Activity className="w-5 h-5 text-purple-400" />
            <h3 className="font-bold text-white text-lg">Financial Audit (Last 10)</h3>
          </div>
          {user.transactions?.length > 0 ? (
            <div className="space-y-3">
              {user.transactions.map(tx => (
                <div key={tx.id} className="flex items-center justify-between p-3 bg-[#111] rounded-lg border border-white/5">
                  <div>
                    <div className="text-sm font-medium text-white flex items-center gap-2">
                      <span className={`w-2 h-2 rounded-full ${tx.type === 'DEPOSIT' ? 'bg-green-500' : tx.type === 'WITHDRAW' ? 'bg-red-500' : 'bg-blue-500'}`}></span>
                      {tx.type} <span className="text-gray-500 font-normal text-xs ml-1">({tx.walletType})</span>
                    </div>
                    <div className="text-xs text-gray-500 mt-1">{tx.note || 'No note'} • {new Date(tx.createdAt).toLocaleString()}</div>
                  </div>
                  <div className={`font-mono font-bold ${tx.type === 'DEPOSIT' || tx.type === 'BONUS' ? 'text-green-400' : 'text-red-400'}`}>
                    {tx.type === 'DEPOSIT' || tx.type === 'BONUS' ? '+' : '-'}${tx.amount.toFixed(2)}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-6 text-gray-500 text-sm">No recent transactions found.</div>
          )}
        </div>

      </div>
    </div>
  );
}
