import { useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { CheckCircle2 } from 'lucide-react';
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

export default function Login() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    email: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.post('/auth/admin-login', form);
      if (res.data.user) {
        navigate('/admin/dashboard');
      }
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-[#0f0f11]">
      {/* Left Form Panel */}
      <div className="w-full lg:w-1/2 flex flex-col justify-between p-8 sm:p-12 lg:p-16 relative">
        {/* Abstract dark overlay / texture could go here if needed */}
        
        <div className="flex-1 flex flex-col max-w-md mx-auto w-full pt-10">
          
          {/* Logo */}
          <div className="flex items-center justify-center mb-12">
             <div className="text-center" style={{ fontFamily: "'Orbitron', sans-serif" }}>
                <div className="text-xs tracking-[0.3em] text-red-500 -mb-1">SYSTEM CONTROLLER</div>
                <div className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-orange-500 tracking-wider flex items-center gap-1">
                  ADMIN<span className="text-white text-3xl">🛡️</span>PANEL
                </div>
             </div>
          </div>

          <h1 className="text-3xl text-white mb-2" style={{ fontFamily: "'Orbitron', sans-serif" }}>Secure Login</h1>
          <p className="text-gray-400 text-sm mb-8">Access the restricted Niveshventures admin system.</p>

          <form onSubmit={handleSubmit} className="space-y-6">
            <InputField 
              label="Username" 
              name="email" 
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

            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 text-gray-400 cursor-pointer">
                <input type="checkbox" className="rounded bg-white/10 border-white/20 text-orange-500 focus:ring-orange-500/20" />
                <span style={{ fontFamily: "'Orbitron', sans-serif" }}>Remember me</span>
              </label>
              <Link to="/forgot-password" className="text-orange-500 hover:text-orange-400 transition-colors" style={{ fontFamily: "'Orbitron', sans-serif" }}>
                Forgot Password?
              </Link>
            </div>

            {/* Cloudflare Mock Widget */}
            <div className="border border-white/10 bg-[#111111] rounded p-4 flex items-center justify-between">
               <div className="flex items-center gap-3">
                 <CheckCircle2 className="text-green-500 w-6 h-6 fill-green-500/20" />
                 <span className="text-white text-sm">Success!</span>
               </div>
               <div className="flex flex-col items-end text-[10px] text-gray-400">
                  <span className="font-bold text-orange-400 flex items-center gap-1">
                    ☁️ CLOUDFLARE
                  </span>
                  <div className="flex gap-1">
                    <a href="#" className="hover:text-gray-300">Privacy</a> - <a href="#" className="hover:text-gray-300">Terms</a>
                  </div>
               </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-[#111111] border border-orange-500/50 hover:bg-orange-500/10 text-white rounded-md font-medium transition-all shadow-lg hover:shadow-orange-500/20 flex items-center justify-center gap-2"
              style={{ fontFamily: "'Orbitron', sans-serif" }}
            >
              {loading ? 'Authenticating...' : 'Sign In'}
            </button>
          </form>


        </div>

        {/* Footer */}
        <div className="text-center text-gray-500 text-xs pb-4" style={{ fontFamily: "'Orbitron', sans-serif" }}>
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
