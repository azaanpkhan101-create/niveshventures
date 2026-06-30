import { useState } from 'react';
import { motion } from 'framer-motion';
import { LifeBuoy, Send, MessageSquare } from 'lucide-react';

export default function SupportCenter() {
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    alert('Support ticket submitted successfully. Our team will review it shortly.');
    setSubject('');
    setMessage('');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center gap-3 mb-8">
        <div className="p-3 bg-teal-500/20 rounded-xl text-teal-400"><LifeBuoy className="w-6 h-6" /></div>
        <h2 className="text-2xl font-bold text-white">Support Center</h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <motion.div className="glass-card p-6 md:p-8 rounded-[2rem]">
            <h3 className="text-xl font-bold text-white mb-6">Create New Ticket</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Subject</label>
                <input 
                  type="text"
                  required
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full bg-black/40 border border-white/10 rounded-xl py-3 px-4 text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
                  placeholder="e.g. Deposit not showing"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Message</label>
                <textarea 
                  required
                  rows="5"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full bg-black/40 border border-white/10 rounded-xl py-3 px-4 text-white focus:outline-none focus:ring-2 focus:ring-teal-500 resize-none"
                  placeholder="Describe your issue in detail..."
                ></textarea>
              </div>
              <button 
                type="submit"
                className="py-3 px-6 bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-500 hover:to-emerald-500 text-white rounded-xl font-bold transition-all shadow-lg shadow-teal-500/25 flex items-center gap-2"
              >
                <Send className="w-4 h-4" /> Submit Ticket
              </button>
            </form>
          </motion.div>
        </div>

        <div className="space-y-6">
          <motion.div className="glass-card p-6 rounded-2xl">
            <h3 className="font-bold text-white mb-4 flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-teal-400" /> Recent Tickets
            </h3>
            <div className="flex flex-col items-center justify-center py-10 text-gray-500 text-sm text-center">
              <p>You have no active support tickets.</p>
            </div>
          </motion.div>

          <motion.div className="bg-gradient-to-br from-teal-500/10 to-emerald-500/10 border border-teal-500/20 p-6 rounded-2xl">
            <h3 className="font-bold text-white mb-2">Need immediate help?</h3>
            <p className="text-sm text-gray-400 mb-4">Check out our knowledge base or join our community Telegram group for live support.</p>
            <button className="w-full py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg text-sm font-medium transition-colors">
              Join Telegram
            </button>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
