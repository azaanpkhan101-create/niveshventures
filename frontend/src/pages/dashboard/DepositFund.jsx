import { useState } from 'react';
import { motion } from 'framer-motion';
import { Download, Copy, AlertCircle, QrCode } from 'lucide-react';
import axios from 'axios';

export default function DepositFund() {
  const [currency, setCurrency] = useState('USDT (TRC20)');
  const [amount, setAmount] = useState('');
  const [address, setAddress] = useState('');
  const [loading, setLoading] = useState(false);
  
  // Submit state
  const [txHash, setTxHash] = useState('');
  const [submitLoading, setSubmitLoading] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const handleGenerate = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSubmitSuccess(false);
    try {
      const res = await axios.post('/wallet/deposit-address', { network: currency });
      setAddress(res.data.address);
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to generate address');
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(address);
    alert('Address copied to clipboard!');
  };

  const handleSubmitDeposit = async (e) => {
    e.preventDefault();
    if (!amount || !txHash) return alert('Amount and Transaction Hash are required');
    setSubmitLoading(true);
    try {
      await axios.post('/wallet/deposit/submit', {
        amount: Number(amount),
        network: currency,
        txHash
      });
      setSubmitSuccess(true);
      setTxHash('');
      setAmount('');
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to submit deposit');
    } finally {
      setSubmitLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 pt-8">
      <div className="flex flex-col items-center text-center mb-8">
        <div className="w-16 h-16 rounded-2xl bg-blue-500/20 text-blue-400 flex items-center justify-center mb-4">
          <Download className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-bold text-white mb-2">Deposit Funds (Online)</h2>
        <p className="text-gray-400">Add crypto to your Mine Wallet to purchase packages or upgrade your node.</p>
      </div>

      <motion.div className="glass-card p-6 md:p-8 rounded-[2rem]">
        {!address ? (
          <form onSubmit={handleGenerate} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Select Currency</label>
              <select 
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                className="w-full bg-black/40 border border-white/10 rounded-xl py-3 px-4 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="USDT (TRC20)">USDT (TRC20)</option>
                <option value="USDT (BEP20)">USDT (BEP20)</option>
                <option value="BTC">Bitcoin (BTC)</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Deposit Amount (Optional)</label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-bold">$</span>
                <input 
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full bg-black/40 border border-white/10 rounded-xl py-3 pl-8 pr-4 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="0.00"
                />
              </div>
            </div>

            <button 
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white rounded-xl font-bold transition-all shadow-lg shadow-blue-500/25 flex items-center justify-center disabled:opacity-50"
            >
              {loading ? 'Generating Address...' : 'Generate Deposit Address'}
            </button>
          </form>
        ) : (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="space-y-6 flex flex-col items-center"
          >
            <div className="bg-yellow-500/10 border border-yellow-500/20 text-yellow-400 p-4 rounded-xl flex items-start gap-3 w-full text-sm">
              <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
              <p>Send ONLY <strong>{currency}</strong> to this address. Sending any other currency will result in permanent loss.</p>
            </div>

            <div className="p-4 bg-white rounded-2xl">
              <QrCode className="w-48 h-48 text-black" />
            </div>

            <div className="w-full space-y-2">
              <label className="block text-sm font-medium text-gray-400 text-center">Your unique {currency} deposit address</label>
              <div className="flex items-center gap-2 bg-black/40 border border-white/10 rounded-xl p-3">
                <code className="text-green-400 font-mono text-sm flex-1 text-center break-all">{address}</code>
                <button onClick={copyToClipboard} className="p-2 hover:bg-white/10 rounded-lg transition-colors text-gray-400 hover:text-white">
                  <Copy className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="w-full pt-6 border-t border-white/10 mt-6">
              <h3 className="text-lg font-bold text-white mb-4">Confirm Payment</h3>
              {submitSuccess ? (
                <div className="bg-green-500/10 border border-green-500/20 text-green-400 p-4 rounded-xl text-center">
                  Deposit submitted successfully! Awaiting admin approval.
                </div>
              ) : (
                <form onSubmit={handleSubmitDeposit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">Amount Sent</label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-bold">$</span>
                      <input 
                        type="number"
                        required
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        className="w-full bg-black/40 border border-white/10 rounded-xl py-3 pl-8 pr-4 text-white focus:outline-none focus:ring-2 focus:ring-green-500"
                        placeholder="0.00"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">Transaction Hash (TxID)</label>
                    <input 
                      type="text"
                      required
                      value={txHash}
                      onChange={(e) => setTxHash(e.target.value)}
                      className="w-full bg-black/40 border border-white/10 rounded-xl py-3 px-4 text-white focus:outline-none focus:ring-2 focus:ring-green-500"
                      placeholder="Enter the transaction hash"
                    />
                  </div>
                  <button 
                    type="submit"
                    disabled={submitLoading}
                    className="w-full py-3 bg-green-600 hover:bg-green-500 text-white rounded-xl font-bold transition-all disabled:opacity-50"
                  >
                    {submitLoading ? 'Submitting...' : 'I Have Transferred the Funds'}
                  </button>
                </form>
              )}
            </div>

            <button 
              onClick={() => {
                setAddress('');
                setSubmitSuccess(false);
                setTxHash('');
              }}
              className="w-full py-3 mt-4 bg-white/5 hover:bg-white/10 text-white rounded-xl font-medium transition-all"
            >
              Generate Different Address
            </button>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}
