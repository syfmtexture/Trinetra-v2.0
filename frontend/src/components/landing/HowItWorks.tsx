'use client';

import { motion } from 'framer-motion';
import { Search, ShieldAlert, Gavel, Lock } from 'lucide-react';

export default function HowItWorks() {
  const steps = [
    {
      icon: <Search className="w-6 h-6" />,
      title: "1. Detect & Analyze",
      description: "Upload media or use our Chrome Extension. Trinetra's hybrid model provides a definitive 'FAKE' or 'REAL' verdict with deep forensic evidence."
    },
    {
      icon: <ShieldAlert className="w-6 h-6" />,
      title: "2. Contain the Blast Radius",
      description: "Instantly generate a credible, AI-drafted WhatsApp defense message and forensic PDF to warn your network before the rumor spreads."
    },
    {
      icon: <Gavel className="w-6 h-6" />,
      title: "3. Automated Takedowns",
      description: "One-click legal strikes. We generate the exact JSON payloads required by Meta, X, and YouTube for mandatory 3-hour SSMI takedowns."
    },
    {
      icon: <Lock className="w-6 h-6" />,
      title: "4. Digital Lockdown Protocol",
      description: "A tactical, LLM-powered crisis manager guides victims through a rigid checklist to secure accounts and preserve evidence."
    }
  ];

  return (
    <section id="how-it-works" className="py-32 bg-transparent relative overflow-hidden border-t border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-20">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-display font-bold text-trinetra-text mb-4"
          >
            The Trinetra <br />
            <span className="text-trinetra-orange text-glow">Protocol</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-trinetra-muted max-w-2xl mx-auto"
          >
            From detection to complete digital lockdown in minutes.
          </motion.p>
        </div>

        <div className="relative max-w-5xl mx-auto">
          {/* Central Line */}
          <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-trinetra-orange/50 to-transparent -translate-x-1/2 glow-orange"></div>

          <div className="space-y-12 md:space-y-24">
            {steps.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.2 }}
                className={`flex flex-col md:flex-row items-center gap-8 ${index % 2 === 0 ? 'md:flex-row-reverse' : ''
                  }`}
              >
                <div className="w-full md:w-1/2 flex justify-center md:justify-start">
                  {/* Empty space for alternating layout */}
                </div>

                {/* Center Node */}
                <div className="hidden md:flex absolute left-1/2 -translate-x-1/2 w-12 h-12 rounded-full glass-panel border border-trinetra-orange items-center justify-center text-trinetra-orange z-10 shadow-[0_0_20px_rgba(252,88,3,0.5)] bg-trinetra-bg">
                  {step.icon}
                </div>

                <div className={`w-full md:w-1/2 glass-panel p-8 rounded-2xl ${index % 2 === 0 ? 'md:text-right' : 'md:text-left'
                  } hover:border-trinetra-orange/30 transition-all duration-300 relative group`}>
                  <div className={`w-12 h-12 rounded-full bg-trinetra-bg border border-trinetra-orange/50 flex items-center justify-center text-trinetra-orange mb-6 md:hidden shadow-[0_0_15px_rgba(252,88,3,0.4)]`}>
                    {step.icon}
                  </div>

                  {/* Hover Glow Background */}
                  <div className="absolute inset-0 bg-gradient-to-tr from-trinetra-orange/0 via-trinetra-orange/0 to-trinetra-orange/0 group-hover:from-trinetra-orange/5 group-hover:to-transparent rounded-2xl transition-all duration-500 pointer-events-none"></div>

                  <h3 className="text-2xl font-bold text-trinetra-text mb-3">{step.title}</h3>
                  <p className="text-trinetra-muted leading-relaxed">{step.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
      {/* Massive Background Text */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden z-0 opacity-[0.03]">
        <h1 className="text-[20vw] font-display font-black text-trinetra-text leading-none tracking-tighter whitespace-nowrap">
          PROTOCOL
        </h1>
      </div>
    </section>
  );
}
