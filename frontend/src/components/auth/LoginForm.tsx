'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { LogIn, User } from 'lucide-react';

export default function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: implement actual auth with MongoDB via API
    router.push('/dashboard');
  };

  const handleGuestLogin = () => {
    router.push('/dashboard');
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="relative z-10 w-full max-w-md p-8 rounded-2xl backdrop-blur-xl bg-white/5 border border-white/10 shadow-2xl"
    >
      <div className="flex flex-col items-center mb-8">
        <div className="w-16 h-16 rounded-full bg-[#D2FF00]/10 flex items-center justify-center mb-4 border border-[#D2FF00]/30 shadow-[0_0_15px_rgba(210,255,0,0.15)]">
          <LogIn className="w-8 h-8 text-[#D2FF00]" />
        </div>
        <h2 className="text-3xl font-bold text-white tracking-tight">TRINETRA V2</h2>
        <p className="text-gray-400 mt-2 text-sm">Secure Authentication Gateway</p>
      </div>

      <form onSubmit={handleLogin} className="space-y-4">
        <div>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Analyst Email"
            className="w-full px-4 py-3 rounded-lg bg-black/40 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-[#D2FF00]/50 focus:ring-1 focus:ring-[#D2FF00]/50 transition-all"
            required
          />
        </div>
        <div>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Passphrase"
            className="w-full px-4 py-3 rounded-lg bg-black/40 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-[#D2FF00]/50 focus:ring-1 focus:ring-[#D2FF00]/50 transition-all"
            required
          />
        </div>
        <button
          type="submit"
          className="w-full py-3 px-4 rounded-lg bg-white text-black font-medium hover:bg-gray-200 transition-colors mt-2"
        >
          Authenticate
        </button>
      </form>

      <div className="mt-6 pt-6 border-t border-white/10">
        <button
          onClick={handleGuestLogin}
          className="w-full py-3 px-4 rounded-lg flex items-center justify-center space-x-2 bg-transparent border border-white/20 text-white font-medium hover:border-[#D2FF00]/50 hover:text-[#D2FF00] hover:bg-[#D2FF00]/10 transition-all group"
        >
          <User className="w-4 h-4 group-hover:text-[#D2FF00] transition-colors" />
          <span>Access as Guest</span>
        </button>
        <p className="text-center text-xs text-gray-500 mt-4">
          Guest sessions have limited persistence and feature access.
        </p>
      </div>
    </motion.div>
  );
}
