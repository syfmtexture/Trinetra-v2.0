'use client';

import { motion } from 'framer-motion';
import { UserX, Building2, Landmark, ShieldCheck } from 'lucide-react';

export default function UseCases() {
  const cases = [
    {
      icon: <UserX className="w-6 h-6" />,
      title: "NCII Victims",
      description: "Immediate crisis management and takedown generation for non-consensual intimate imagery.",
      image: "https://images.unsplash.com/photo-1573164713988-8665fc963095?auto=format&fit=crop&q=80&w=800"
    },
    {
      icon: <Landmark className="w-6 h-6" />,
      title: "Financial Targets",
      description: "Stop financial identity cloning and executive impersonation before markets react.",
      image: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=800"
    },
    {
      icon: <Building2 className="w-6 h-6" />,
      title: "Enterprises",
      description: "Protect brand reputation from sophisticated deepfake extortion and misinformation.",
      image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=800"
    },
    {
      icon: <ShieldCheck className="w-6 h-6" />,
      title: "Platforms",
      description: "Ensure compliance with 2026 IT Rules and SSMI obligations for rapid media removal.",
      image: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=800"
    }
  ];

  return (
    <section id="customers" className="py-32 bg-transparent relative overflow-hidden border-t border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-20">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-display font-bold text-trinetra-text mb-4"
          >
            Who Needs <br />
            <span className="text-trinetra-yellow text-glow">Trinetra?</span>
          </motion.h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {cases.map((useCase, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group relative rounded-[2rem] overflow-hidden shadow-lg hover:shadow-[0_0_25px_rgba(252,88,3,0.3)] transition-all duration-500 border border-white/10 glass-panel h-[450px]"
            >
              {/* Massive Background Text */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden z-0 opacity-[0.03]">
        <h1 className="text-[18vw] font-display font-black text-trinetra-text leading-none tracking-tighter whitespace-nowrap uppercase">
          Defense
        </h1>
      </div>              {/* Background Image/Graphic */}
              <div className="absolute inset-0 p-4 pb-32">
                <div className="w-full h-full rounded-[1.5rem] overflow-hidden relative bg-trinetra-surface">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={useCase.image}
                    alt={useCase.title}
                    className="w-full h-full object-cover opacity-30 grayscale group-hover:grayscale-0 group-hover:opacity-60 group-hover:scale-110 transition-all duration-700 mix-blend-luminosity"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-trinetra-bg via-trinetra-bg/40 to-transparent"></div>
                </div>
              </div>

              {/* Content Bottom */}
              <div className="absolute bottom-0 left-0 w-full p-6 bg-gradient-to-t from-trinetra-bg via-trinetra-bg to-transparent pt-20">
                <div className="w-12 h-12 rounded-full bg-trinetra-orange flex items-center justify-center text-white mb-4 shadow-lg shadow-trinetra-orange/30 group-hover:scale-110 transition-transform">
                  {useCase.icon}
                </div>
                <h3 className="text-xl font-bold text-trinetra-text mb-2">{useCase.title}</h3>
                <p className="text-trinetra-muted text-sm">{useCase.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
