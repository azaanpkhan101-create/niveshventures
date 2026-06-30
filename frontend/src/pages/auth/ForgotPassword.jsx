import { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Mail, ArrowLeft } from 'lucide-react';
import axios from 'axios';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post('/auth/forgot-password', { email });
      setSuccess(true);
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to send reset link');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0f0f11] flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-[#111111] border border-white/5 p-8 sm:p-10 rounded-[2rem] w-full max-w-md relative overflow-hidden shadow-2xl"
      >
        <div className="absolute top-0 right-0 -mr-10 -mt-10 w-40 h-40 bg-orange-600 rounded-full mix-blend-multiply filter blur-3xl opacity-10"></div>
        <div className="absolute bottom-0 left-0 -ml-10 -mb-10 w-40 h-40 bg-blue-600 rounded-full mix-blend-multiply filter blur-3xl opacity-10"></div>
        
        <div className="relative z-10">
          <Link to="/login" className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-6 text-sm">
            <ArrowLeft className="w-4 h-4" /> Back to Login
          </Link>

          <div className="mb-8">
            <h1 className="text-3xl font-bold text-white mb-2" style={{ fontFamily: "'Orbitron', sans-serif" }}>Reset Password</h1>
            <p className="text-gray-400 text-sm">Enter your email address and we'll send you instructions to reset your password.</p>
          </div>

          {success ? (
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-green-500/10 border border-green-500/20 text-green-400 p-4 rounded-xl text-center"
            >
              <h3 className="font-bold mb-1">Check your email</h3>
              <p className="text-sm">We've sent a password reset link to {email}</p>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="email"
                  required
                  placeholder="Email Address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full pl-10 pr-3 py-3 border border-white/10 rounded-xl bg-black/20 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all font-mono"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 px-4 bg-[#111111] border border-orange-500/50 hover:bg-orange-500/10 text-white rounded-xl font-medium transition-all shadow-lg hover:shadow-orange-500/20 mt-4 flex justify-center items-center gap-2"
                style={{ fontFamily: "'Orbitron', sans-serif" }}
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-orange-500/30 border-t-orange-500 rounded-full animate-spin"></div>
                ) : 'Send Reset Link'}
              </button>
            </form>
          )}
        </div>
      </motion.div>
    </div>
  );
}
