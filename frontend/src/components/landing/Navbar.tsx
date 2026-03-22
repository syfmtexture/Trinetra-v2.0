'use client';

import { motion } from 'framer-motion';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from './ThemeContext';
import Link from 'next/link';

export default function Navbar() {
  const { theme, toggleTheme } = useTheme();
  return (
    <motion.nav 
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="fixed top-0 left-0 right-0 z-50 glass-nav"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <img src="/logo.png" alt="Trinetra Logo" className="w-10 h-10 object-contain drop-shadow-[0_0_10px_rgba(252,88,3,0.5)]" />
          <span className="font-display font-bold text-2xl tracking-widest text-trinetra-text text-glow">TRINETRA</span>
        </div>
        <div className="hidden lg:flex items-center gap-8 text-sm font-medium text-trinetra-muted">
          <a href="#problem" className="hover:text-trinetra-orange transition-colors duration-300">The Crisis</a>
          <a href="#features" className="hover:text-trinetra-orange transition-colors duration-300">Technology</a>
          <a href="#how-it-works" className="hover:text-trinetra-orange transition-colors duration-300">Protocol</a>
          <a href="#customers" className="hover:text-trinetra-orange transition-colors duration-300">Targets</a>
        </div>
        <div className="flex items-center gap-4">
          <button onClick={toggleTheme} className="text-trinetra-muted hover:text-trinetra-orange transition-colors" aria-label="Toggle Theme">
            {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
          </button>
          <Link href="/dashboard">
            <motion.button 
              whileHover={{ scale: 1.05, boxShadow: "0 0 20px rgba(252, 88, 3, 0.4)" }}
              whileTap={{ scale: 0.95 }}
              className="hidden sm:inline-block bg-trinetra-orange text-white px-6 py-2.5 rounded-full text-sm font-bold hover:bg-orange-600 transition-colors shadow-lg shadow-trinetra-orange/20"
            >
              LAUNCH DASHBOARD
            </motion.button>
          </Link>
        </div>
      </div>
    </motion.nav>
  );
}
