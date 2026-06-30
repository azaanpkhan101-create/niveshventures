import { useEffect, useState } from 'react';
import { User, Mail, Globe, Phone, Edit2, Check, X, RefreshCw } from 'lucide-react';
import axios from 'axios';

export default function Profile() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ name: '', phone: '', country: '' });
  const [saveSuccess, setSaveSuccess] = useState(false);

  const fetchProfile = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get('/auth/profile', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUser(res.data);
      setForm({ name: res.data.name || '', phone: res.data.phone || '', country: res.data.country || '' });
    } catch (err) {
      console.error('Profile fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      const token = localStorage.getItem('token');
      const res = await axios.patch('/auth/profile', form, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUser(res.data);
      setEditing(false);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to save profile. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setForm({ name: user.name || '', phone: user.phone || '', country: user.country || '' });
    setEditing(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64 text-gray-500">
        <RefreshCw className="w-8 h-8 animate-spin opacity-50" />
      </div>
    );
  }

  if (!user) return <div className="text-red-400">Failed to load profile.</div>;

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-xl font-bold text-white mb-1">Your Profile</h2>
          <p className="text-sm text-gray-400">Home / Setting / Profile</p>
        </div>
        {!editing ? (
          <button
            onClick={() => setEditing(true)}
            className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white text-sm rounded-lg transition-colors font-medium"
          >
            <Edit2 className="w-4 h-4" /> Edit Profile
          </button>
        ) : (
          <div className="flex gap-2">
            <button
              onClick={handleCancel}
              className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 text-white text-sm rounded-lg transition-colors"
            >
              <X className="w-4 h-4" /> Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={saving}
              className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-500 text-white text-sm rounded-lg transition-colors font-medium disabled:opacity-60"
            >
              {saving ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        )}
      </div>

      {saveSuccess && (
        <div className="bg-green-500/10 border border-green-500/20 text-green-400 p-4 rounded-xl text-sm flex items-center gap-3">
          <Check className="w-5 h-5" />
          Profile updated successfully!
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Profile Card */}
        <div className="bg-[#111111] border border-white/10 rounded-xl p-6">
          {/* Avatar */}
          <div className="flex items-center gap-5 mb-8 pb-6 border-b border-white/10">
            <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-purple-600 to-blue-600 flex items-center justify-center text-3xl font-bold text-white shadow-lg shadow-purple-500/20 flex-shrink-0">
              {user.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <h3 className="text-xl font-bold text-white">{user.name}</h3>
              <p className="text-purple-400 text-sm">{user.referralCode}</p>
              <span className="inline-block mt-1 px-2 py-0.5 text-xs bg-green-500/20 text-green-400 rounded-full font-medium">
                {user.role}
              </span>
            </div>
          </div>

          {/* Fields */}
          <div className="space-y-5">
            <Field
              icon={<User className="w-4 h-4 text-purple-400" />}
              label="Full Name"
              value={form.name}
              editing={editing}
              onChange={(v) => setForm((f) => ({ ...f, name: v }))}
            />
            <Field
              icon={<Mail className="w-4 h-4 text-blue-400" />}
              label="Email Address"
              value={user.email}
              editing={false}
            />
            <Field
              icon={<Phone className="w-4 h-4 text-green-400" />}
              label="Phone Number"
              value={form.phone}
              editing={editing}
              placeholder="e.g. +92 300 1234567"
              onChange={(v) => setForm((f) => ({ ...f, phone: v }))}
            />
            <Field
              icon={<Globe className="w-4 h-4 text-yellow-400" />}
              label="Country"
              value={form.country}
              editing={editing}
              placeholder="e.g. Pakistan"
              onChange={(v) => setForm((f) => ({ ...f, country: v }))}
            />
          </div>
        </div>

        {/* Account Status Card */}
        <div className="bg-[#111111] border border-white/10 rounded-xl p-6 flex flex-col justify-between">
          <div>
            <h3 className="font-semibold text-white mb-5">Account Information</h3>
            <div className="space-y-4 text-sm">
              <div className="flex justify-between border-b border-white/5 pb-3">
                <span className="text-gray-400">Account ID</span>
                <span className="text-white font-mono">{user.id?.slice(0, 12)}...</span>
              </div>
              <div className="flex justify-between border-b border-white/5 pb-3">
                <span className="text-gray-400">Status</span>
                <span className="text-green-400 font-medium">Active</span>
              </div>
              <div className="flex justify-between border-b border-white/5 pb-3">
                <span className="text-gray-400">Referral Code</span>
                <span className="text-purple-400 font-mono font-medium">{user.referralCode}</span>
              </div>
              <div className="flex justify-between border-b border-white/5 pb-3">
                <span className="text-gray-400">Sponsor</span>
                <span className="text-white">{user.referredBy || 'None (Top Level)'}</span>
              </div>
              <div className="flex justify-between border-b border-white/5 pb-3">
                <span className="text-gray-400">Registered On</span>
                <span className="text-white">{new Date(user.createdAt).toLocaleDateString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">KYC Verified</span>
                <span className={user.isVerified ? 'text-green-400' : 'text-yellow-400'}>
                  {user.isVerified ? 'Verified' : 'Pending'}
                </span>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-6 border-t border-white/10">
            <div className="w-16 h-16 rounded-full bg-green-500/20 border-2 border-green-500/30 flex items-center justify-center mx-auto mb-4">
              <User className="w-8 h-8 text-green-400" />
            </div>
            <h4 className="text-white font-semibold text-center mb-2">Account Active</h4>
            <p className="text-gray-400 text-xs text-center mb-4">
              Complete KYC verification to unlock higher withdrawal limits.
            </p>
            <button className="w-full px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white rounded-lg text-sm font-medium transition-all">
              Start KYC Verification
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function Field({ icon, label, value, editing, onChange, placeholder }) {
  return (
    <div className="flex items-start gap-3">
      <div className="p-2 bg-white/5 rounded-lg mt-0.5">{icon}</div>
      <div className="flex-1 min-w-0">
        <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">{label}</p>
        {editing && onChange ? (
          <input
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder || `Enter ${label}`}
            className="w-full bg-black/40 border border-white/20 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        ) : (
          <p className="text-white font-medium text-sm">{value || 'Not provided'}</p>
        )}
      </div>
    </div>
  );
}
