import { motion } from 'framer-motion';
import { MonitorPlay, Download } from 'lucide-react';

export default function Presentation() {
  return (
    <div className="max-w-4xl mx-auto space-y-6 pt-8">
      <div className="flex flex-col items-center text-center mb-8">
        <div className="w-16 h-16 rounded-2xl bg-orange-500/20 text-orange-400 flex items-center justify-center mb-4">
          <MonitorPlay className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-bold text-white mb-2">Platform Presentations</h2>
        <p className="text-gray-400">Download the official Niveshventures business plans and promotional materials.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <motion.div className="glass-card p-6 rounded-2xl group hover:border-orange-500/50 transition-colors">
          <div className="h-40 bg-gradient-to-br from-orange-500/20 to-red-500/20 rounded-xl mb-6 flex items-center justify-center">
             <span className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-red-500">ENGLISH</span>
          </div>
          <h3 className="text-lg font-bold text-white mb-2">Niveshventures Business Plan (EN)</h3>
          <p className="text-sm text-gray-400 mb-6">Complete overview of packages, referral bonuses, and platform mechanics.</p>
          <button className="w-full py-3 bg-white/10 hover:bg-orange-600 text-white rounded-xl font-bold transition-all flex items-center justify-center gap-2">
            <Download className="w-4 h-4" /> Download PDF
          </button>
        </motion.div>

        <motion.div className="glass-card p-6 rounded-2xl group hover:border-orange-500/50 transition-colors">
          <div className="h-40 bg-gradient-to-br from-purple-500/20 to-blue-500/20 rounded-xl mb-6 flex items-center justify-center">
             <span className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-blue-500">SPANISH</span>
          </div>
          <h3 className="text-lg font-bold text-white mb-2">Niveshventures Business Plan (ES)</h3>
          <p className="text-sm text-gray-400 mb-6">El plan oficial de Niveshventures en español. Detalles de los paquetes y comisiones.</p>
          <button className="w-full py-3 bg-white/10 hover:bg-orange-600 text-white rounded-xl font-bold transition-all flex items-center justify-center gap-2">
            <Download className="w-4 h-4" /> Descargar PDF
          </button>
        </motion.div>
      </div>
    </div>
  );
}
