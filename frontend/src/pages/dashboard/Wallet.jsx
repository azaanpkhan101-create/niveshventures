import { useState, useEffect } from 'react';
import { EyeOff, Eye, Lock, Trash2, RefreshCw, CheckCircle2 } from 'lucide-react';
import axios from 'axios';

export default function Wallet() {
  const [address, setAddress] = useState('');
  const [txPassword, setTxPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [savedAddresses, setSavedAddresses] = useState([]);
  const [fetchingAddresses, setFetchingAddresses] = useState(true);
  const [success, setSuccess] = useState(false);

  const fetchAddresses = async () => {
    setFetchingAddresses(true);
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get('/wallet/addresses', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSavedAddresses(res.data || []);
    } catch (err) {
      console.error('Error fetching addresses:', err);
    } finally {
      setFetchingAddresses(false);
    }
  };

  useEffect(() => {
    fetchAddresses();
  }, []);

  const handleSendOtp = () => {
    if (!address.trim()) {
      alert('Please enter a wallet address first!');
      return;
    }
    alert('OTP sent to your registered email. For demo, use: 123456');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!address.trim() || !txPassword || !otp) {
      alert('Please fill all fields: Address, Transaction Password, and OTP.');
      return;
    }
    // OTP validation (in production, validate on backend)
    if (otp !== '123456') {
      alert('Invalid OTP. Please check your email or use 123456 for demo.');
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      await axios.post(
        '/wallet/addresses',
        { walletType: 'USDT.BEP20', address: address.trim() },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setSuccess(true);
      setAddress('');
      setTxPassword('');
      setOtp('');
      setTimeout(() => setSuccess(false), 3000);
      await fetchAddresses();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to add wallet address. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this wallet address? This cannot be undone.')) return;
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`/wallet/addresses/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      await fetchAddresses();
    } catch (err) {
      alert(err.response?.data?.message || 'Delete failed. Please try again.');
    }
  };

  return (
    <div className="space-y-6 text-white pb-10">
      {/* Header & Breadcrumbs */}
      <div>
        <h2 className="text-xl font-bold mb-1">Wallet Address</h2>
        <div className="text-sm text-gray-400 flex items-center gap-2">
          <span>Home</span><span>/</span>
          <span>Setting</span><span>/</span>
          <span className="text-gray-200">Wallet Address</span>
        </div>
      </div>

      {success && (
        <div className="bg-green-500/10 border border-green-500/20 text-green-400 p-4 rounded-xl flex items-center gap-3 text-sm">
          <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
          Wallet address added successfully!
        </div>
      )}

      {/* Add New Wallet Form */}
      <div className="border border-white/10 rounded-lg overflow-hidden bg-[#111111]">
        <div className="border-b border-white/10 p-4">
          <h3 className="font-medium text-[15px]">Add New USDT.BEP20 Address to Receive Profits</h3>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Select Wallet */}
          <FormRow label="Select Wallet">
            <div className="w-full bg-[#0a0a0a] border border-white/10 rounded px-4 py-2.5 text-sm text-gray-300">
              USDT.BEP20
            </div>
          </FormRow>

          {/* Address */}
          <FormRow label="Address">
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Enter your BEP20 wallet address"
              className="w-full bg-[#f8f9fa] border border-gray-300 text-gray-900 rounded px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 font-medium"
            />
          </FormRow>

          {/* Transaction Password */}
          <FormRow label="Transaction Password">
            <div className="flex-1 flex border border-gray-300 rounded overflow-hidden bg-[#f8f9fa]">
              <div className="px-3 flex items-center border-r border-gray-300 text-gray-500">
                <Lock className="w-4 h-4" />
              </div>
              <input
                type={showPassword ? 'text' : 'password'}
                value={txPassword}
                onChange={(e) => setTxPassword(e.target.value)}
                placeholder="Enter transaction password"
                className="flex-1 bg-transparent px-3 py-2.5 text-sm text-gray-900 focus:outline-none"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="px-3 flex items-center border-l border-gray-300 text-gray-500 hover:bg-gray-100 transition-colors"
              >
                {showPassword ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
              </button>
            </div>
          </FormRow>

          {/* One Time Password */}
          <FormRow label="One Time Password">
            <div className="flex gap-3 flex-1">
              <div className="flex-1 flex border border-white/10 rounded overflow-hidden bg-[#0a0a0a]">
                <div className="px-3 flex items-center border-r border-white/10 text-gray-500">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  className="flex-1 bg-transparent px-3 py-2.5 text-sm text-gray-300 focus:outline-none placeholder-gray-500"
                  placeholder="Enter One Time Password"
                />
              </div>
              <button
                type="button"
                onClick={handleSendOtp}
                className="px-4 py-2 border border-[#1e3a8a] text-blue-400 rounded text-sm hover:bg-blue-900/20 transition-colors font-medium whitespace-nowrap"
              >
                Send OTP
              </button>
            </div>
          </FormRow>

          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className="bg-[#fb923c] hover:bg-[#f97316] text-white px-8 py-2.5 rounded text-sm font-medium transition-colors shadow-lg disabled:opacity-60 flex items-center gap-2"
            >
              {loading ? <><RefreshCw className="w-4 h-4 animate-spin" /> Saving...</> : 'Submit'}
            </button>
          </div>
        </form>
      </div>

      {/* Wallet Address Table */}
      <div>
        <h3 className="font-medium text-[15px] mb-4">Saved Wallet Addresses</h3>
        <div className="overflow-x-auto border border-white/10 rounded-lg">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead>
              <tr className="bg-[#1f2329] border-b border-white/10 text-sm">
                <th className="py-3 px-4 font-medium text-gray-300 w-16">#</th>
                <th className="py-3 px-4 font-medium text-gray-300 w-40">Wallet</th>
                <th className="py-3 px-4 font-medium text-gray-300">Address</th>
                <th className="py-3 px-4 font-medium text-gray-300 w-56">Created At</th>
                <th className="py-3 px-4 font-medium text-gray-300 w-36 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {fetchingAddresses ? (
                <tr className="bg-white border-b">
                  <td colSpan="5" className="py-8 text-center text-gray-400">
                    <RefreshCw className="w-5 h-5 animate-spin mx-auto mb-2 text-gray-500" />
                    <span className="text-sm">Loading addresses...</span>
                  </td>
                </tr>
              ) : savedAddresses.length === 0 ? (
                <tr className="bg-white border-b">
                  <td colSpan="5" className="py-8 text-center text-gray-500 text-sm">
                    No wallet addresses saved yet. Add one above.
                  </td>
                </tr>
              ) : savedAddresses.map((item, index) => (
                <tr key={item.id} className="bg-white border-b border-gray-200 text-sm hover:bg-gray-50 transition-colors">
                  <td className="py-3 px-4 text-gray-700">{index + 1}</td>
                  <td className="py-3 px-4 text-gray-700 font-medium">{item.walletType}</td>
                  <td className="py-3 px-4 text-gray-700 font-mono text-[12px] truncate max-w-xs">{item.address}</td>
                  <td className="py-3 px-4 text-gray-600 text-xs">{new Date(item.createdAt).toLocaleString()}</td>
                  <td className="py-3 px-4">
                    <div className="flex items-center justify-center gap-2">
                      <span className="text-green-600 text-xs font-medium">{item.status}</span>
                      <button
                        onClick={() => handleDelete(item.id)}
                        className="bg-red-600 hover:bg-red-700 text-white p-1.5 rounded transition-colors shadow-sm"
                        title="Delete address"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function FormRow({ label, children }) {
  return (
    <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-8">
      <label className="text-sm text-gray-300 md:w-48 flex-shrink-0">{label}</label>
      <div className="flex-1">{children}</div>
    </div>
  );
}
