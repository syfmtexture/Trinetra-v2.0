'use client';

import React, { useState, useEffect } from 'react';
import {
  Heart, Phone, Scale, Users, BookOpen, Shield,
  ExternalLink, CheckCircle2, AlertTriangle, Eye, EyeOff,
  Sparkles,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface ChecklistItem {
  id: string;
  label: string;
  checked: boolean;
}

const CRISIS_RESOURCES = [
  {
    category: '🧠 Mental Health Support',
    icon: Heart,
    color: 'from-pink-500 to-rose-600',
    items: [
      { name: 'iCall Psychosocial Helpline', desc: 'Free counseling — Mon–Sat 8am–10pm IST', link: 'tel:9152987821', action: 'Call Now' },
      { name: 'Vandrevala Foundation', desc: '24/7 mental health support in India', link: 'tel:18602662345', action: 'Call Now' },
      { name: 'NIMHANS Helpline', desc: 'National Institute of Mental Health', link: 'tel:08046110007', action: 'Call Now' },
      { name: 'Crisis Text Line', desc: 'Text HOME to 741741 for crisis support', link: 'sms:741741?body=HOME', action: 'Text Now' },
    ],
  },
  {
    category: '⚖️ Legal Resources',
    icon: Scale,
    color: 'from-blue-500 to-indigo-600',
    items: [
      { name: 'Cyber Civil Rights Initiative', desc: 'Free legal support for image abuse victims', link: 'https://cybercivilrights.org/', action: 'Visit' },
      { name: 'Electronic Frontier Foundation', desc: 'Digital rights advocacy & legal guidance', link: 'https://www.eff.org/', action: 'Visit' },
      { name: 'National Cyber Crime Portal', desc: 'File a complaint with Indian Cyber Crime', link: 'https://cybercrime.gov.in/', action: 'Report' },
      { name: 'IT Act Helpline (India)', desc: 'Report under IT Act Sec 66E, 67', link: 'tel:1930', action: 'Call Now' },
    ],
  },
  {
    category: '👥 Support Communities',
    icon: Users,
    color: 'from-emerald-500 to-teal-600',
    items: [
      { name: 'r/DeepfakeVictims', desc: 'Reddit support community for victims', link: 'https://reddit.com/r/deepfakes_discussion', action: 'Join' },
      { name: 'MyPlan App', desc: 'Safety planning for technology-facilitated abuse', link: 'https://www.myplanapp.org/', action: 'Download' },
      { name: 'Without My Consent', desc: 'Resources for non-consensual media victims', link: 'https://withoutmyconsent.org/', action: 'Visit' },
    ],
  },
  {
    category: '📋 What To Do Next',
    icon: BookOpen,
    color: 'from-amber-500 to-orange-600',
    items: [
      { name: 'StopNCII.org', desc: 'Hash & block intimate images across platforms', link: 'https://stopncii.org/', action: 'Start' },
      { name: 'Google Image Removal', desc: 'Request removal of personal images', link: 'https://support.google.com/websearch/troubleshooter/9685456', action: 'Request' },
      { name: 'Take It Down (NCMEC)', desc: 'Remove nude/explicit content if under 18', link: 'https://takeitdown.ncmec.org/', action: 'Visit' },
    ],
  },
];

const INITIAL_CHECKLIST: ChecklistItem[] = [
  { id: '1', label: 'Save a copy of the deepfake as evidence (screenshot + URL)', checked: false },
  { id: '2', label: 'Document where and when you first found it', checked: false },
  { id: '3', label: 'Report to the platform(s) where it was posted', checked: false },
  { id: '4', label: 'File a complaint with cyber crime authorities', checked: false },
  { id: '5', label: 'Inform trusted friends and family', checked: false },
  { id: '6', label: 'Consult with a digital rights attorney', checked: false },
  { id: '7', label: 'Set up Google Alerts for your name', checked: false },
  { id: '8', label: 'Review and tighten your social media privacy settings', checked: false },
  { id: '9', label: 'Consider professional counseling or support groups', checked: false },
];

export const CrisisTab = ({ onPanic }: { onPanic: (active: boolean) => void }) => {
  const [panicActive, setPanicActive] = useState(false);
  const [checklist, setChecklist] = useState<ChecklistItem[]>(INITIAL_CHECKLIST);
  const [breathePhase, setBreathePhase] = useState<'inhale' | 'hold' | 'exhale'>('inhale');
  const [breatheActive, setBreatheActive] = useState(false);
  const [contentHidden, setContentHidden] = useState(false);

  // Breathing exercise timer
  useEffect(() => {
    if (!breatheActive) return;
    const phases: Array<{ phase: 'inhale' | 'hold' | 'exhale'; duration: number }> = [
      { phase: 'inhale', duration: 4000 },
      { phase: 'hold', duration: 4000 },
      { phase: 'exhale', duration: 6000 },
    ];
    let idx = 0;
    setBreathePhase(phases[0].phase);
    const next = () => {
      idx = (idx + 1) % phases.length;
      setBreathePhase(phases[idx].phase);
    };
    let timeout: NodeJS.Timeout;
    const run = () => {
      timeout = setTimeout(() => { next(); run(); }, phases[idx].duration);
    };
    run();
    return () => clearTimeout(timeout);
  }, [breatheActive]);

  const togglePanic = () => {
    const next = !panicActive;
    setPanicActive(next);
    onPanic(next);
    setContentHidden(next);
    if (next) setBreatheActive(true);
  };

  const toggleCheck = (id: string) => {
    setChecklist(prev => prev.map(c => c.id === id ? { ...c, checked: !c.checked } : c));
  };

  const completedCount = checklist.filter(c => c.checked).length;
  const progressPct = Math.round((completedCount / checklist.length) * 100);

  return (
    <div className="space-y-6">
      {/* Panic Button */}
      <div className={`rounded-3xl border-2 p-8 shadow-soft transition-all duration-500 ${
        panicActive
          ? 'border-brand-purple/40 bg-gradient-to-br from-brand-purple/10 to-blue-500/10'
          : 'border-red-500/30 bg-card'
      }`}>
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-3">
            <div className={`h-11 w-11 rounded-2xl flex items-center justify-center shadow-lg transition-colors ${
              panicActive ? 'bg-gradient-to-br from-brand-purple to-blue-600' : 'bg-gradient-to-br from-red-500 to-rose-600'}`}>
              <Shield className="h-5 w-5 text-white" />
            </div>
            <div>
              <h2 className="font-display text-lg font-semibold">
                {panicActive ? 'Safe Mode Active' : 'Crisis Support & First Aid'}
              </h2>
              <p className="text-xs text-muted-foreground">
                {panicActive ? 'Triggering content is hidden. You are safe here.' : 'Immediate support resources and safety tools'}
              </p>
            </div>
          </div>

          <button onClick={togglePanic}
            className={`px-6 py-3 rounded-2xl text-sm font-bold transition-all flex items-center gap-2 ${
              panicActive
                ? 'bg-brand-purple/10 border-2 border-brand-purple/30 text-brand-purple hover:bg-brand-purple/20'
                : 'bg-red-500 text-white hover:bg-red-600 shadow-lg hover:shadow-red-500/30 animate-pulse hover:animate-none'
            }`}>
            {panicActive ? (
              <><Eye className="h-4 w-4" /> Exit Safe Mode</>
            ) : (
              <><EyeOff className="h-4 w-4" /> 🚨 Panic Button</>
            )}
          </button>
        </div>

        {panicActive && (
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            className="mt-4 text-sm text-brand-purple font-medium">
            ✓ All deepfake imagery across the dashboard is now hidden behind a blur filter.
            Take your time. When you&apos;re ready, use the resources below.
          </motion.p>
        )}
      </div>

      {/* Breathing Exercise */}
      <AnimatePresence>
        {breatheActive && (
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
            className="rounded-3xl border border-brand-purple/20 bg-gradient-to-br from-brand-purple/5 to-blue-500/5 p-8 shadow-soft">
            <div className="text-center">
              <h3 className="font-display text-lg font-semibold mb-2">Guided Breathing</h3>
              <p className="text-xs text-muted-foreground mb-8">Follow the circle. This calming exercise helps reduce anxiety.</p>

              <div className="relative w-40 h-40 mx-auto mb-6">
                <motion.div
                  className="absolute inset-0 rounded-full border-4 border-brand-purple/30"
                  animate={{
                    scale: breathePhase === 'inhale' ? 1.3 : breathePhase === 'hold' ? 1.3 : 0.8,
                    borderColor: breathePhase === 'inhale' ? 'hsl(255 70% 55% / 0.6)' : breathePhase === 'hold' ? 'hsl(255 70% 55% / 0.4)' : 'hsl(255 70% 55% / 0.2)',
                  }}
                  transition={{ duration: breathePhase === 'exhale' ? 6 : 4, ease: 'easeInOut' }}
                />
                <motion.div
                  className="absolute inset-4 rounded-full bg-brand-purple/10"
                  animate={{
                    scale: breathePhase === 'inhale' ? 1.2 : breathePhase === 'hold' ? 1.2 : 0.7,
                  }}
                  transition={{ duration: breathePhase === 'exhale' ? 6 : 4, ease: 'easeInOut' }}
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="font-display text-lg font-bold text-brand-purple capitalize">{breathePhase}</span>
                </div>
              </div>

              <button onClick={() => setBreatheActive(false)}
                className="text-xs text-muted-foreground hover:text-foreground transition-colors">
                Close breathing exercise
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Toggle content visibility */}
      <button onClick={() => setContentHidden(!contentHidden)}
        className="inline-flex items-center gap-2 text-xs text-muted-foreground hover:text-foreground transition-colors">
        {contentHidden ? <Eye className="h-3 w-3" /> : <EyeOff className="h-3 w-3" />}
        {contentHidden ? 'Show' : 'Hide'} triggering content across dashboard
      </button>

      {/* Crisis Resources */}
      <div className="grid md:grid-cols-2 gap-6">
        {CRISIS_RESOURCES.map((cat) => {
          const Icon = cat.icon;
          return (
            <div key={cat.category} className="rounded-3xl border border-border bg-card p-6 shadow-soft">
              <div className="flex items-center gap-3 mb-4">
                <div className={`h-9 w-9 rounded-xl bg-gradient-to-br ${cat.color} flex items-center justify-center`}>
                  <Icon className="h-4 w-4 text-white" />
                </div>
                <h3 className="font-display font-semibold text-sm">{cat.category}</h3>
              </div>
              <div className="space-y-2">
                {cat.items.map((item) => (
                  <a key={item.name} href={item.link} target="_blank" rel="noopener noreferrer"
                    className="flex items-center justify-between gap-3 rounded-xl border border-border bg-muted/20 p-3 hover:bg-muted/40 transition-colors group">
                    <div className="min-w-0">
                      <p className="text-sm font-medium group-hover:text-brand-orange transition-colors">{item.name}</p>
                      <p className="text-[11px] text-muted-foreground truncate">{item.desc}</p>
                    </div>
                    <span className="shrink-0 inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-foreground/5 text-[10px] font-semibold text-foreground group-hover:bg-brand-orange group-hover:text-white transition-colors">
                      {item.action} <ExternalLink className="h-2.5 w-2.5" />
                    </span>
                  </a>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* Safety Checklist */}
      <div className="rounded-3xl border border-border bg-card p-8 shadow-soft">
        <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
          <div>
            <h3 className="font-display text-lg font-semibold">Safety Checklist</h3>
            <p className="text-xs text-muted-foreground">Step-by-step actions to protect yourself</p>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs text-muted-foreground font-mono">{completedCount}/{checklist.length}</span>
            <div className="w-24 h-2 rounded-full bg-muted overflow-hidden">
              <div className="h-full rounded-full bg-gradient-to-r from-brand-purple to-emerald-500 transition-all" style={{ width: `${progressPct}%` }} />
            </div>
          </div>
        </div>
        <div className="space-y-2">
          {checklist.map((item, i) => (
            <button key={item.id} onClick={() => toggleCheck(item.id)}
              className={`w-full flex items-center gap-4 rounded-2xl border p-4 text-left transition-all ${
                item.checked ? 'border-emerald-500/30 bg-emerald-500/5' : 'border-border hover:bg-muted/30'}`}>
              <div className={`h-6 w-6 rounded-lg flex items-center justify-center shrink-0 transition-colors ${
                item.checked ? 'bg-emerald-500 text-white' : 'border-2 border-border'}`}>
                {item.checked && <CheckCircle2 className="h-4 w-4" />}
              </div>
              <span className={`text-sm ${item.checked ? 'line-through text-muted-foreground' : 'font-medium'}`}>
                {item.label}
              </span>
            </button>
          ))}
        </div>

        {completedCount === checklist.length && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
            className="mt-6 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 p-5 text-center">
            <Sparkles className="h-8 w-8 text-emerald-500 mx-auto mb-2" />
            <h4 className="font-display font-bold text-emerald-600 dark:text-emerald-400">All steps completed!</h4>
            <p className="text-xs text-muted-foreground mt-1">You&apos;ve taken all recommended safety actions. Stay vigilant and don&apos;t hesitate to reach out for support.</p>
          </motion.div>
        )}
      </div>

      {/* How to talk to friends & family */}
      <div className="rounded-3xl border border-border bg-card p-8 shadow-soft">
        <h3 className="font-display text-lg font-semibold mb-1">💬 How to Talk to Friends & Family</h3>
        <p className="text-xs text-muted-foreground mb-6">A step-by-step guide for difficult conversations</p>
        <div className="space-y-4">
          {[
            { step: '01', title: 'Choose the right moment', desc: 'Find a private, calm setting. Don\'t do this over text — face-to-face or video call is best.' },
            { step: '02', title: 'Be direct but gentle', desc: '"I need to tell you something upsetting. There is a fake video/image of me circulating online. It was made using AI and is not real."' },
            { step: '03', title: 'Show the evidence', desc: 'Share the Trinetra analysis report showing the FAKE verdict and confidence score. This proves it\'s AI-generated.' },
            { step: '04', title: 'Explain what a deepfake is', desc: '"Deepfakes are AI-generated media that can make anyone appear to do or say things they never did. Anyone can be a victim."' },
            { step: '05', title: 'Ask for their support', desc: '"If you see this content, please report it and do not share it. I\'m working with authorities to get it removed."' },
            { step: '06', title: 'Set boundaries', desc: 'It\'s okay to say you don\'t want to discuss details. Direct them to the resources in this hub if they want to help.' },
          ].map(s => (
            <div key={s.step} className="flex gap-4 rounded-2xl border border-border bg-muted/20 p-4">
              <span className="font-display font-bold text-brand-orange text-sm shrink-0 mt-0.5">{s.step}</span>
              <div>
                <p className="text-sm font-semibold">{s.title}</p>
                <p className="text-xs text-muted-foreground mt-1 leading-relaxed">{s.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
