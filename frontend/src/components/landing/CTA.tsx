'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';

export default function CTA() {
  return (
    <section className="py-32 bg-transparent relative overflow-hidden border-t border-trinetra-border">
      {/* Massive Background Text */}
      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none select-none overflow-hidden z-0 opacity-[0.03]">
        <h1 className="text-[18vw] font-display font-black text-trinetra-text leading-none tracking-tighter whitespace-nowrap">
          DIGITAL
        </h1>
        <h1 className="text-[18vw] font-display font-black text-trinetra-text leading-none tracking-tighter whitespace-nowrap">
          LOCKDOWN
        </h1>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, type: "spring" }}
          className="glass-panel p-12 md:p-20 rounded-[3rem] text-center relative overflow-hidden"
        >
          {/* Animated Glow Behind CTA Content */}
          <div className="absolute inset-0 bg-gradient-to-br from-trinetra-orange/10 via-transparent to-trinetra-yellow/10 pointer-events-none"></div>
          <div className="absolute top-0 right-0 w-64 h-64 bg-trinetra-orange opacity-20 blur-[100px] rounded-full pointer-events-none"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-trinetra-yellow opacity-20 blur-[100px] rounded-full pointer-events-none"></div>
          
          <h2 className="text-4xl md:text-6xl font-display font-bold text-trinetra-text mb-6 leading-tight relative z-10 drop-shadow-xl">
            Stop The Spread. <br />
            <span className="text-trinetra-orange text-glow">Take Control.</span>
          </h2>
          
          <p className="text-trinetra-muted text-lg mb-10 max-w-xl mx-auto relative z-10">
            Don&apos;t wait for the damage to be done. Detect synthetic media, contain the blast radius, and execute automated takedowns today.
          </p>
          
          <Link href="/dashboard">
            <motion.button 
              whileHover={{ scale: 1.05, boxShadow: "0 0 25px rgba(252, 88, 3, 0.6)" }}
              whileTap={{ scale: 0.95 }}
              className="bg-trinetra-orange text-white px-10 py-4 rounded-full text-lg font-bold hover:bg-orange-600 transition-all shadow-lg shadow-trinetra-orange/30 relative z-10 glow-orange"
            >
              ACTIVATE TRINETRA
            </motion.button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
