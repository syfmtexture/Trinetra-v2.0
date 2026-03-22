'use client';

import { motion } from 'framer-motion';
import { AlertTriangle, ShieldAlert } from 'lucide-react';

export default function Problem() {
  return (
    <section id="problem" className="py-24 bg-transparent relative overflow-hidden border-t border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex flex-col lg:flex-row items-center gap-16">

          {/* Image Side */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="w-full lg:w-1/2 relative"
          >
            <div className="relative rounded-[2rem] overflow-hidden shadow-[0_0_30px_rgba(252,88,3,0.1)] border border-white/10">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="https://images.unsplash.com/photo-1563206767-5b18f218e8de?auto=format&fit=crop&q=80&w=1000"
                alt="Cyber crisis"
                className="w-full h-[400px] object-cover mix-blend-luminosity opacity-40 hover:opacity-60 transition-opacity duration-500"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-trinetra-bg to-transparent opacity-80"></div>

              {/* Overlay Alert */}
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                whileInView={{ scale: 1, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.4, type: "spring" }}
                className="absolute bottom-8 left-8 glass-panel border-trinetra-orange/50 p-4 rounded-2xl flex items-center gap-4 glow-orange"
              >
                <div className="w-12 h-12 rounded-full bg-trinetra-orange/20 flex items-center justify-center text-trinetra-orange">
                  <AlertTriangle size={24} />
                </div>
                <div>
                  <p className="text-trinetra-text font-bold text-lg leading-none mb-1">NCII Detected</p>
                  <p className="text-trinetra-orange text-sm font-medium">Viral Spread Imminent</p>
                </div>
              </motion.div>
            </div>
          </motion.div>

          {/* Text Side */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="w-full lg:w-1/2"
          >
            <div className="glass-panel p-10 md:p-14 rounded-[3rem] relative">
              <div className="absolute top-0 left-0 w-full h-full rounded-[3rem] border border-trinetra-orange/20 bg-gradient-to-br from-trinetra-orange/5 to-transparent pointer-events-none"></div>

              <h2 className="text-4xl md:text-5xl font-display font-bold text-trinetra-text mb-6">
                The Deepfake <br />
                <span className="text-trinetra-orange text-glow">Crisis</span>
              </h2>
              <div className="space-y-4 text-trinetra-muted leading-relaxed">
                <p>
                  Victims of Non-Consensual Intimate Imagery (NCII) or financial identity cloning are in crisis. The immediate fear is uncontrolled viral spread.
                </p>
                <p>
                  Traditional reporting is a multi-hour help-center nightmare. While victims struggle to navigate complex forms, the synthetic media spreads across networks, causing irreversible reputational and financial damage.
                </p>
                <p className="text-trinetra-text/90 font-medium border-l-2 border-trinetra-orange pl-4 mt-6">
                  Trinetra provides a pre-built, credible defense to deploy in minutes—killing the rumor before it reaches the extended network.
                </p>
              </div>
            </div>
          </motion.div>

        </div>

        {/* Shield Graphic Below */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mt-24 flex justify-center relative"
        >
          <div className="relative w-64 h-80 flex items-center justify-center">
            <div className="absolute inset-0 bg-gradient-to-b from-trinetra-orange to-trinetra-purple rounded-t-full rounded-b-[4rem] opacity-20 blur-2xl"></div>
            <div className="relative z-10 w-48 h-64 glass-panel rounded-t-full rounded-b-[3rem] flex items-center justify-center overflow-hidden">
              <div className="absolute inset-2 border border-trinetra-orange/30 rounded-t-full rounded-b-[2.5rem]"></div>
              <ShieldAlert className="w-24 h-24 text-trinetra-orange opacity-90 drop-shadow-[0_0_15px_rgba(252,88,3,0.8)]" />
            </div>
          </div>

          <svg className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] -z-10 pointer-events-none" viewBox="0 0 800 400" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 200 C 200 200, 300 0, 400 200 C 500 400, 600 200, 800 200" stroke="#fc5803" strokeWidth="2" strokeDasharray="5 5" className="opacity-30" />
            <circle cx="200" cy="100" r="6" fill="#fc5803" className="opacity-70 glow-orange" />
            <circle cx="600" cy="300" r="6" fill="#f7a505" className="opacity-70" />
          </svg>
        </motion.div>
      </div>
    </section>
  );
}
