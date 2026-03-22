'use client';

import { motion } from 'framer-motion';
import { ShieldAlert, Clock, Activity, Zap } from 'lucide-react';
import Link from 'next/link';

export default function Hero() {
  return (
    <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden bg-transparent">
      {/* Animated Glowing Background Matrix */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{ x: ['-20%', '20%', '-20%'], y: ['-10%', '10%', '-10%'], scale: [1, 1.2, 1] }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-[-10%] left-[-10%] w-[60vw] h-[60vw] rounded-full bg-trinetra-orange opacity-20 blur-[120px]"
        />
        <motion.div
          animate={{ x: ['20%', '-20%', '20%'], y: ['10%', '-10%', '10%'], scale: [1, 1.3, 1] }}
          transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-[-10%] right-[-10%] w-[60vw] h-[60vw] rounded-full bg-trinetra-purple opacity-20 blur-[120px]"
        />
        <motion.div
          animate={{ x: ['-10%', '10%', '-10%'], y: ['10%', '-10%', '10%'], scale: [1, 1.5, 1] }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-[20%] left-[20%] w-[50vw] h-[50vw] rounded-full bg-trinetra-yellow opacity-10 blur-[100px]"
        />
      </div>

      {/* Massive Background Text */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden z-0">
        <h1 className="text-[20vw] font-display font-black text-trinetra-text opacity-5 leading-none tracking-tighter whitespace-nowrap">
          TRINETRA
        </h1>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-panel mb-8"
          >
            <span className="w-2 h-2 rounded-full bg-trinetra-orange animate-pulse glow-orange"></span>
            <span className="text-xs font-bold tracking-widest uppercase text-trinetra-muted">Hybrid Deepfake Detection Model</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-5xl md:text-7xl lg:text-8xl font-display font-bold tracking-tight text-trinetra-text mb-6 leading-[1.1] uppercase drop-shadow-2xl"
          >
            Detect. Contain. <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-trinetra-orange via-trinetra-yellow to-trinetra-purple text-glow">Takedown.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg md:text-xl text-trinetra-muted mb-10 max-w-2xl mx-auto font-medium"
          >
            Trinetra combines EfficientNet-B4, LSTM, and Reality Defender to detect synthetic media, execute automated platform takedowns, and guide victims through digital lockdowns.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-col sm:flex-row justify-center gap-4"
          >
            <Link href="/dashboard">
              <motion.button
                whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                className="bg-trinetra-orange text-white px-8 py-4 rounded-full text-lg font-bold hover:bg-orange-600 transition-all shadow-lg glow-orange"
              >
                ANALYZE MEDIA
              </motion.button>
            </Link>
            <motion.button
              whileHover={{ scale: 1.05, backgroundColor: "rgba(161, 161, 170, 0.1)" }} whileTap={{ scale: 0.95 }}
              className="glass-panel text-trinetra-text px-8 py-4 rounded-full text-lg font-bold transition-all"
              onClick={() => document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' })}
            >
              VIEW PROTOCOL
            </motion.button>
          </motion.div>
        </div>

        {/* Center Graphic & Floating Badges */}
        <div className="mt-20 relative max-w-5xl mx-auto h-[400px] md:h-[600px] flex items-center justify-center">
          {/* Main Logo Graphic */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 1, type: "spring" }}
            className="relative z-10 w-64 h-64 md:w-96 md:h-96 rounded-full glass-panel flex items-center justify-center overflow-hidden glow-orange"
          >
            <div className="absolute inset-0 rounded-full bg-gradient-to-b from-trinetra-orange/20 via-transparent to-trinetra-purple/20"></div>
            <motion.img
              animate={{ y: [-10, 10, -10] }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
              src="/logo.png"
              alt="Trinetra Core Engine"
              className="relative z-10 w-3/4 h-3/4 object-contain drop-shadow-[0_10px_25px_rgba(252,88,3,0.5)]"
            />
          </motion.div>

          {/* Floating Badges */}
          <motion.div
            initial={{ opacity: 0, x: -50 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6, delay: 0.4 }}
            className="absolute top-10 left-0 md:left-10 glass-panel p-4 rounded-2xl flex items-center gap-3 z-30 pointer-events-none"
          >
            <div className="w-10 h-10 rounded-full bg-trinetra-orange/20 flex items-center justify-center text-trinetra-orange border border-trinetra-orange/30">
              <Activity size={20} />
            </div>
            <div>
              <p className="text-xs text-trinetra-muted font-medium uppercase tracking-wider">Dual-Verdict Engine</p>
              <p className="text-lg font-bold text-trinetra-text">Cloud + Local</p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6, delay: 0.5 }}
            className="absolute top-32 right-0 md:right-10 glass-panel p-4 rounded-2xl flex items-center gap-3 z-30 pointer-events-none"
          >
            <div className="w-10 h-10 rounded-full bg-trinetra-yellow/20 flex items-center justify-center text-trinetra-yellow border border-trinetra-yellow/30">
              <Clock size={20} />
            </div>
            <div>
              <p className="text-xs text-trinetra-muted font-medium uppercase tracking-wider">SSMI Compliance</p>
              <p className="text-lg font-bold text-trinetra-text">&lt; 3hr Takedown</p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.6 }}
            className="absolute bottom-10 left-10 md:left-32 glass-panel p-4 rounded-2xl flex items-center gap-3 z-30 pointer-events-none"
          >
            <div className="w-10 h-10 rounded-full bg-trinetra-purple/20 flex items-center justify-center text-trinetra-purple border border-trinetra-purple/30">
              <ShieldAlert size={20} />
            </div>
            <div>
              <p className="text-xs text-trinetra-muted font-medium uppercase tracking-wider">Crisis Manager</p>
              <p className="text-lg font-bold text-trinetra-text">Blast Radius</p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.7 }}
            className="absolute bottom-32 right-10 md:right-32 glass-panel p-4 rounded-2xl flex items-center gap-3 z-30 pointer-events-none"
          >
            <div className="w-10 h-10 rounded-full bg-trinetra-orange/20 flex items-center justify-center text-trinetra-orange border border-trinetra-orange/30">
              <Zap size={20} />
            </div>
            <div>
              <p className="text-xs text-trinetra-muted font-medium uppercase tracking-wider">Deep Forensics</p>
              <p className="text-lg font-bold text-trinetra-text">Grad-CAM & ELA</p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
