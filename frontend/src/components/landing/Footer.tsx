'use client';

import { Twitter, Linkedin, Github } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-trinetra-surface border-t border-trinetra-border text-trinetra-text pt-24 pb-12 relative overflow-hidden">
      {/* Massive Background Text */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center pointer-events-none select-none overflow-hidden z-0 w-full opacity-[0.02]">
        <h1 className="text-[25vw] font-display font-black text-trinetra-text leading-none tracking-tighter whitespace-nowrap">
          TRINETRA
        </h1>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-20">
          <div className="md:col-span-1">
            <div className="flex items-center gap-3 mb-6">
              <img src="/logo.png" alt="Trinetra Logo" className="w-8 h-8 object-contain drop-shadow-[0_0_8px_rgba(252,88,3,0.5)]" />
              <span className="font-display font-bold text-2xl tracking-widest text-trinetra-text text-glow">TRINETRA</span>
            </div>
            <p className="text-trinetra-muted text-sm leading-relaxed">
              Advanced deepfake detection and crisis containment platform. Protecting digital identities from synthetic media threats.
            </p>
          </div>
          
          <div>
            <h4 className="font-bold text-lg mb-6 text-trinetra-text/90">Platform</h4>
            <ul className="space-y-4 text-sm text-trinetra-muted">
              <li><a href="#" className="hover:text-trinetra-orange transition-colors">Hybrid Detection</a></li>
              <li><a href="#" className="hover:text-trinetra-orange transition-colors">Deep Forensics</a></li>
              <li><a href="#" className="hover:text-trinetra-orange transition-colors">Blast Radius Containment</a></li>
              <li><a href="#" className="hover:text-trinetra-orange transition-colors">SSMI Takedowns</a></li>
              <li><a href="#" className="hover:text-trinetra-orange transition-colors">Digital Lockdown</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-lg mb-6 text-trinetra-text/90">Resources</h4>
            <ul className="space-y-4 text-sm text-trinetra-muted">
              <li><a href="#" className="hover:text-trinetra-orange transition-colors">Documentation</a></li>
              <li><a href="#" className="hover:text-trinetra-orange transition-colors">API Reference</a></li>
              <li><a href="#" className="hover:text-trinetra-orange transition-colors">Chrome Extension</a></li>
              <li><a href="#" className="hover:text-trinetra-orange transition-colors">Security Blog</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-lg mb-6 text-trinetra-text/90">Legal</h4>
            <ul className="space-y-4 text-sm text-trinetra-muted">
              <li><a href="#" className="hover:text-trinetra-orange transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-trinetra-orange transition-colors">Terms of Service</a></li>
              <li><a href="#" className="hover:text-trinetra-orange transition-colors">SSMI Compliance</a></li>
              <li><a href="#" className="hover:text-trinetra-orange transition-colors">Contact Support</a></li>
            </ul>
          </div>
        </div>

        <div className="flex flex-col md:flex-row items-center justify-between pt-8 border-t border-trinetra-border">
          <p className="text-sm text-trinetra-muted mb-4 md:mb-0">
            &copy; 2026 Trinetra Security. All Rights Reserved.
          </p>
          <div className="flex items-center gap-4">
            <a href="#" className="w-10 h-10 rounded-full bg-trinetra-bg flex items-center justify-center text-trinetra-muted hover:bg-trinetra-orange hover:text-white hover:shadow-[0_0_15px_rgba(252,88,3,0.5)] transition-all border border-trinetra-border">
              <Twitter size={18} />
            </a>
            <a href="#" className="w-10 h-10 rounded-full bg-trinetra-bg flex items-center justify-center text-trinetra-muted hover:bg-trinetra-orange hover:text-white hover:shadow-[0_0_15px_rgba(252,88,3,0.5)] transition-all border border-trinetra-border">
              <Linkedin size={18} />
            </a>
            <a href="#" className="w-10 h-10 rounded-full bg-trinetra-bg flex items-center justify-center text-trinetra-muted hover:bg-trinetra-orange hover:text-white hover:shadow-[0_0_15px_rgba(252,88,3,0.5)] transition-all border border-trinetra-border">
              <Github size={18} />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
