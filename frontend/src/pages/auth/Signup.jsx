import { useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const InputField = ({ label, type = 'text', name, value, onChange, placeholder = '' }) => (
  <div className="flex flex-col gap-1 w-full">
    <label className="text-white text-sm tracking-wide" style={{ fontFamily: "'Orbitron', sans-serif" }}>{label}</label>
    <input
      type={type}
      required
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      name={name}
      className="block w-full px-4 py-3 border border-white/10 rounded-md bg-[#111111] text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all font-mono"
    />
  </div>
);

export default function Signup() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    referralCode: '',
  });

  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.post('/auth/signup', form);
      if (res.data.access_token) {
        localStorage.setItem('token', res.data.access_token);
      }
      navigate('/dashboard');
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || 'Signup failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-[#0f0f11]">
      {/* Left Form Panel */}
      <div className="w-full lg:w-1/2 flex flex-col justify-between p-8 sm:p-12 lg:p-16 relative overflow-y-auto custom-scrollbar">
        
        <div className="flex-1 flex flex-col justify-center max-w-md mx-auto w-full py-10">
          
          {/* Logo */}
          <div className="flex items-center justify-center mb-10">
             <div className="text-center" style={{ fontFamily: "'Orbitron', sans-serif" }}>
                <div className="text-xs tracking-[0.3em] text-purple-400 -mb-1">NIVESHVENTURES</div>
                <div className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-blue-500 tracking-wider flex items-center gap-1">
                  CRYP<span className="text-yellow-500 text-3xl">🪙</span>S
                </div>
             </div>
          </div>

          <h1 className="text-3xl text-white mb-2" style={{ fontFamily: "'Orbitron', sans-serif" }}>Register</h1>
          <p className="text-gray-400 text-sm mb-6">Create a new account on the Niveshventures Cryptos network.</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <InputField 
              label="Full Name" 
              name="name" 
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
            <InputField 
              label="Username" 
              name="email" 
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
            <InputField 
              label="Password" 
              name="password" 
              type="password" 
              placeholder=".........."
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
            />
            <InputField 
              label="Referral ID (Optional)" 
              name="referralCode" 
              placeholder="Ex: NODE1234"
              value={form.referralCode}
              onChange={(e) => setForm({ ...form, referralCode: e.target.value })}
            />

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 mt-4 bg-[#111111] border border-orange-500/50 hover:bg-orange-500/10 text-white rounded-md font-medium transition-all shadow-lg hover:shadow-orange-500/20 flex items-center justify-center gap-2"
              style={{ fontFamily: "'Orbitron', sans-serif" }}
            >
              {loading ? 'Processing...' : 'Create Account'}
            </button>
          </form>

          <p className="mt-6 text-sm text-gray-400" style={{ fontFamily: "'Orbitron', sans-serif" }}>
            Already have an account?{' '}
            <Link to="/login" className="text-white font-bold hover:text-orange-400 transition-colors">
              Sign In
            </Link>
          </p>
        </div>

        {/* Footer */}
        <div className="text-center text-gray-500 text-xs pb-4 mt-8" style={{ fontFamily: "'Orbitron', sans-serif" }}>
          Copyright © 2025 Niveshventures Cryptos
        </div>
      </div>

      {/* Right Image Panel */}
      <div 
        className="hidden lg:block lg:w-1/2 bg-cover bg-center" 
        style={{ backgroundImage: "url('/auth-bg.png')" }}
      >
        <div className="w-full h-full bg-orange-500/5 mix-blend-overlay border-l border-white/5"></div>
      </div>
    </div>
  );
}
