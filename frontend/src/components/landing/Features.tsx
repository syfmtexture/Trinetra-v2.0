'use client';

import { motion } from 'framer-motion';
import { Search, ShieldAlert, Lock, FileWarning } from 'lucide-react';

export default function Features() {
  const features = [
    {
      icon: <Search className="w-6 h-6 text-trinetra-text" />,
      title: "Hybrid Detection Model",
      description: "Combines local EfficientNet-B4 + LSTM with cloud-based Reality Defender APIs for unmatched accuracy in detecting synthetic media."
    },
    {
      icon: <FileWarning className="w-6 h-6 text-trinetra-text" />,
      title: "Deep Forensics (XAI)",
      description: "Explainable AI including Grad-CAM heatmaps, Error Level Analysis (ELA), and Geometric Landmark Jitter to prove manipulation."
    },
    {
      icon: <ShieldAlert className="w-6 h-6 text-trinetra-text" />,
      title: "Blast Radius Containment",
      description: "Generates a pre-bunking defense package with an AI-drafted WhatsApp message and a simplified forensic report to stop viral spread."
    },
    {
      icon: <Lock className="w-6 h-6 text-trinetra-text" />,
      title: "SSMI Takedown Engine",
      description: "Automated legal payload generator for Meta, X, and YouTube to enforce the 3-hour takedown compliance under 2026 IT Rules."
    }
  ];

  return (
    <section id="features" className="py-32 bg-transparent relative overflow-hidden border-t border-white/5">
      {/* Massive Background Text */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 flex flex-col items-center justify-start pointer-events-none select-none overflow-hidden z-0 w-full pt-10 opacity-[0.03]">
        <h1 className="text-[15vw] font-display font-black text-trinetra-text leading-[0.8] tracking-tighter whitespace-nowrap">
          GLASSBOX
        </h1>
        <h1 className="text-[15vw] font-display font-black text-trinetra-text leading-[0.8] tracking-tighter whitespace-nowrap">
          ENGINE
        </h1>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 mt-10">
        <div className="text-center mb-20">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-display font-bold text-trinetra-text mb-4"
          >
            The Technology <br />
            <span className="text-trinetra-yellow text-glow">Behind Trinetra</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-trinetra-muted max-w-2xl mx-auto"
          >
            A premium, information-dense platform designed to analyze, explain, and neutralize deepfake threats.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              whileHover={{ y: -10, boxShadow: "0 20px 40px rgba(0,0,0,0.5), 0 0 20px rgba(252,88,3,0.2)" }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="glass-panel p-8 rounded-[2rem] flex flex-col h-full group"
            >
              <div className="w-14 h-14 rounded-2xl bg-trinetra-orange flex items-center justify-center mb-6 shadow-lg shadow-trinetra-orange/30 group-hover:scale-110 transition-transform">
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold text-trinetra-text mb-4">{feature.title}</h3>
              <p className="text-trinetra-muted text-sm leading-relaxed flex-grow">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
