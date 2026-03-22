'use client';

import Navbar from '@/components/landing/Navbar';
import Hero from '@/components/landing/Hero';
import Problem from '@/components/landing/Problem';
import Features from '@/components/landing/Features';
import HowItWorks from '@/components/landing/HowItWorks';
import UseCases from '@/components/landing/UseCases';
import CTA from '@/components/landing/CTA';
import Footer from '@/components/landing/Footer';
import Cursor from '@/components/landing/Cursor';
import MandalaScroll from '@/components/landing/MandalaScroll';
import { ThemeProvider } from '@/components/landing/ThemeContext';

export default function LandingPage() {
  return (
    <ThemeProvider>
      <div className="landing-theme">
        <Cursor />
        <Navbar />
        <Hero />
        <Problem />
        <Features />
        <HowItWorks />
        <UseCases />
        <CTA />
        <Footer />
        <MandalaScroll />
      </div>
    </ThemeProvider>
  );
}
