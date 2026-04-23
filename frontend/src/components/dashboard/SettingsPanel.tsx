'use client';

import { useState, useEffect, useRef } from 'react';
import {
  X, Languages, Bell, Activity, LogOut, History, Loader2,
  CheckCircle2, Globe, Shield, Download, ExternalLink, ChevronRight,
  AlertCircle, User,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// ─── Language options ───────────────────────────────────────────
export const LANGUAGE_OPTIONS = [
  { code: 'en', label: 'English',    native: 'EN' },
  { code: 'hi', label: 'Hindi',      native: 'हिंदी' },
  { code: 'mr', label: 'Marathi',    native: 'मराठी' },
  { code: 'bn', label: 'Bengali',    native: 'বাংলা' },
  { code: 'ta', label: 'Tamil',      native: 'தமிழ்' },
  { code: 'gu', label: 'Gujarati',   native: 'ગુજ' },
] as const;

export type LangCode = typeof LANGUAGE_OPTIONS[number]['code'];

// ─── Translations ───────────────────────────────────────────────
export const TRANSLATIONS: Record<LangCode, Record<string, string>> = {
  en: {
    analyze:     'Analyze with Trinetra',
    analyzing:   'Running detection…',
    dropMedia:   'Drop an image to analyze',
    orBrowse:    'or browse files',
    supported:   'JPG, PNG or WEBP · max 20MB',
    workspace:   'Detection',
    workspaceSub:'workspace',
    subtitle:    'Upload an image to analyze. View the verdict, inspect the explainable heatmap, and read the auto‑generated summary.',
    signIn:      'Sign In',
    guest:       'Continue as Guest',
    welcome:     'Welcome back',
    welcomeSub:  'Sign in to access the deepfake scanner.',
  },
  hi: {
    analyze:     'विश्लेषण करें',
    analyzing:   'जाँच रहा है…',
    dropMedia:   'छवि यहाँ छोड़ें',
    orBrowse:    'या फ़ाइल चुनें',
    supported:   'JPG, PNG या WEBP · अधिकतम 20MB',
    workspace:   'डिटेक्शन',
    workspaceSub:'वर्कस्पेस',
    subtitle:    'विश्लेषण के लिए एक छवि अपलोड करें।',
    signIn:      'साइन इन करें',
    guest:       'अतिथि के रूप में जारी रखें',
    welcome:     'वापसी पर स्वागत है',
    welcomeSub:  'डीपफेक स्कैनर के लिए साइन इन करें।',
  },
  mr: {
    analyze:     'विश्लेषण करा',
    analyzing:   'तपासत आहे…',
    dropMedia:   'प्रतिमा येथे टाका',
    orBrowse:    'किंवा फाइल निवडा',
    supported:   'JPG, PNG किंवा WEBP · कमाल 20MB',
    workspace:   'डिटेक्शन',
    workspaceSub:'वर्कस्पेस',
    subtitle:    'विश्लेषणासाठी एक प्रतिमा अपलोड करा।',
    signIn:      'साइन इन करा',
    guest:       'पाहुणे म्हणून सुरू ठेवा',
    welcome:     'परत आलात स्वागत',
    welcomeSub:  'डीपफेक स्कॅनरसाठी साइन इन करा।',
  },
  bn: {
    analyze:     'বিশ্লেষণ করুন',
    analyzing:   'পরীক্ষা করা হচ্ছে…',
    dropMedia:   'ছবিটি এখানে ফেলুন',
    orBrowse:    'অথবা ফাইল বেছে নিন',
    supported:   'JPG, PNG বা WEBP · সর্বোচ্চ 20MB',
    workspace:   'ডিটেকশন',
    workspaceSub:'ওয়ার্কস্পেস',
    subtitle:    'বিশ্লেষণের জন্য একটি ছবি আপলোড করুন।',
    signIn:      'সাইন ইন',
    guest:       'অতিথি হিসাবে চালিয়ে যান',
    welcome:     'ফিরে আসুন',
    welcomeSub:  'ডিপফেক স্ক্যানারে প্রবেশ করতে সাইন ইন করুন।',
  },
  ta: {
    analyze:     'பகுப்பாய்வு செய்',
    analyzing:   'சோதிக்கிறது…',
    dropMedia:   'படத்தை இங்கே வீசவும்',
    orBrowse:    'அல்லது கோப்பை உலாவுக',
    supported:   'JPG, PNG அல்லது WEBP · அதிகபட்சம் 20MB',
    workspace:   'கண்டறிதல்',
    workspaceSub:'பணியிடம்',
    subtitle:    'பகுப்பாய்வுக்கு படம் பதிவேற்றவும்।',
    signIn:      'உள்நுழை',
    guest:       'விருந்தினராக தொடரவும்',
    welcome:     'மீண்டும் வரவேற்கிறோம்',
    welcomeSub:  'டீப்ஃபேக் ஸ்கேனருக்கு உள்நுழையவும்.',
  },
  gu: {
    analyze:     'વિશ્લેષણ કરો',
    analyzing:   'તપાસ ચાલુ છે…',
    dropMedia:   'છબી અહીં છોડો',
    orBrowse:    'અથવા ફાઇલ પસંદ કરો',
    supported:   'JPG, PNG અથવા WEBP · મહત્તમ 20MB',
    workspace:   'ડિટેક્શન',
    workspaceSub:'વર્કસ્પેસ',
    subtitle:    'વિશ્લેષણ માટે ઇમેજ અપલોડ કરો।',
    signIn:      'સાઇન ઇન',
    guest:       'મહેમાન તરીકે ચાલુ રાખો',
    welcome:     'પાછા આવ્યા',
    welcomeSub:  'ડીપફેક સ્કેનર ઍક્સેસ કરવા સાઇન ઇન કરો।',
  },
};

// ─── History item type ──────────────────────────────────────────
export interface HistoryItem {
  id: string;
  name: string;
  date: string;
  verdict: string;
  confidence: number;
}

// ─── Props ──────────────────────────────────────────────────────
interface SettingsPanelProps {
  isOpen: boolean;
  onClose: () => void;
  lang: LangCode;
  setLang: (l: LangCode) => void;
  history: HistoryItem[];
  userEmail: string;
  onLogout: () => void;
}

// ─── Simulated newsletter subscribe ────────────────────────────
async function subscribeToNewsletter(email: string): Promise<void> {
  return new Promise((res) => setTimeout(res, 1400));
}

// ─── Section title ──────────────────────────────────────────────
function SectionTitle({ icon: Icon, label }: { icon: React.ElementType; label: string }) {
  return (
    <h3 className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-3">
      <Icon className="h-3.5 w-3.5" />
      {label}
    </h3>
  );
}

// ─── Settings Panel ─────────────────────────────────────────────
export function SettingsPanel({
  isOpen, onClose, lang, setLang, history, userEmail, onLogout,
}: SettingsPanelProps) {
  const [newsletterEmail, setNewsletterEmail] = useState(userEmail || '');
  const [isSubscribing, setIsSubscribing]     = useState(false);
  const [subscribed, setSubscribed]           = useState(false);
  const [showHistory, setShowHistory]         = useState(false);
  const [toast, setToast]                     = useState<string | null>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  const triggerToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3500);
  };

  const handleSubscribe = async () => {
    if (!newsletterEmail.includes('@')) {
      triggerToast('Please enter a valid email address.');
      return;
    }
    setIsSubscribing(true);
    try {
      await subscribeToNewsletter(newsletterEmail);
      setSubscribed(true);
      triggerToast(`Confirmation sent to ${newsletterEmail} ✅`);
    } catch {
      triggerToast('Subscription failed. Please try again.');
    } finally {
      setIsSubscribing(false);
    }
  };

  // Close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) onClose();
    };
    if (isOpen) document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[110] bg-black/30 backdrop-blur-sm"
          />

          {/* Slide-in drawer */}
          <motion.div
            key="panel"
            ref={panelRef}
            initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
            transition={{ type: 'spring', stiffness: 320, damping: 32 }}
            className="fixed right-0 top-0 z-[120] h-full w-full max-w-sm bg-card border-l border-border shadow-elevated flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-border">
              <div className="flex items-center gap-2.5">
                <div className="h-8 w-8 rounded-xl bg-gradient-brand flex items-center justify-center shadow-glow">
                  <Shield className="h-4 w-4 text-white" />
                </div>
                <span className="font-display font-bold text-lg">Settings</span>
              </div>
              <button
                onClick={onClose}
                className="p-2 rounded-xl hover:bg-muted/60 text-muted-foreground transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Scrollable body */}
            <div className="flex-1 overflow-y-auto px-6 py-6 space-y-8">

              {/* ── Language ── */}
              <section>
                <SectionTitle icon={Languages} label="Interface Language" />
                <div className="flex flex-wrap gap-2">
                  {LANGUAGE_OPTIONS.map((opt) => (
                    <button
                      key={opt.code}
                      onClick={() => { setLang(opt.code); triggerToast(`Language changed to ${opt.label}`); }}
                      className={`px-3 py-2 rounded-xl text-xs font-bold transition-all border ${
                        lang === opt.code
                          ? 'bg-brand-orange text-white border-brand-orange shadow-glow'
                          : 'bg-muted/40 text-foreground border-border hover:border-brand-orange/50 hover:text-brand-orange'
                      }`}
                    >
                      {opt.native} <span className="opacity-60 ml-1 font-normal">{opt.label}</span>
                    </button>
                  ))}
                </div>
              </section>

              {/* ── Newsletter ── */}
              <section>
                <SectionTitle icon={Bell} label="Newsletter" />
                <p className="text-xs text-muted-foreground mb-3">
                  Subscribe to Trinetra updates, threat reports & AI forensics news.
                </p>
                {subscribed ? (
                  <div className="flex items-center gap-2 text-emerald-600 text-sm font-semibold">
                    <CheckCircle2 className="h-4 w-4" /> You&apos;re subscribed!
                  </div>
                ) : (
                  <div className="flex gap-2">
                    <input
                      type="email"
                      value={newsletterEmail}
                      onChange={(e) => setNewsletterEmail(e.target.value)}
                      placeholder="your@email.com"
                      className="flex-1 px-3 py-2 rounded-xl bg-muted/40 border border-border text-sm focus:outline-none focus:ring-2 focus:ring-brand-orange/40 text-foreground"
                    />
                    <button
                      onClick={handleSubscribe}
                      disabled={isSubscribing}
                      className="px-4 py-2 rounded-xl bg-foreground text-background text-sm font-semibold hover:bg-foreground/90 transition-colors disabled:opacity-50 flex items-center gap-1.5"
                    >
                      {isSubscribing ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Bell className="h-3.5 w-3.5" />}
                      {isSubscribing ? 'Subscribing…' : 'Subscribe'}
                    </button>
                  </div>
                )}
              </section>

              {/* ── Analysis History ── */}
              <section>
                <div className="flex items-center justify-between mb-3">
                  <SectionTitle icon={Activity} label="Analysis History" />
                  {history.length > 0 && (
                    <button
                      onClick={() => setShowHistory(v => !v)}
                      className="text-[10px] font-bold text-brand-orange hover:underline"
                    >
                      {showHistory ? 'Hide' : `View all (${history.length})`}
                    </button>
                  )}
                </div>

                {history.length === 0 ? (
                  <div className="rounded-2xl border border-dashed border-border bg-muted/20 p-5 text-center">
                    <History className="h-8 w-8 mx-auto mb-2 text-muted-foreground/40" />
                    <p className="text-xs text-muted-foreground">No history yet. Run a scan to begin.</p>
                  </div>
                ) : showHistory ? (
                  <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                    {history.map((item) => (
                      <div key={item.id} className="flex items-center justify-between rounded-2xl border border-border bg-muted/30 px-4 py-3">
                        <div>
                          <p className="text-sm font-medium truncate max-w-[160px]">{item.name}</p>
                          <p className="text-[10px] text-muted-foreground font-mono">{item.date}</p>
                        </div>
                        <span className={`text-xs font-bold px-2 py-1 rounded-full ${
                          item.verdict === 'FAKE'
                            ? 'bg-brand-orange/10 text-brand-orange'
                            : 'bg-emerald-500/10 text-emerald-600'
                        }`}>
                          {item.verdict} · {item.confidence.toFixed(0)}%
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <button
                    onClick={() => setShowHistory(true)}
                    className="w-full flex items-center justify-between rounded-2xl border border-border bg-muted/30 px-4 py-3 hover:border-brand-orange/40 transition-colors"
                  >
                    <span className="text-sm font-medium">{history.length} scan{history.length !== 1 ? 's' : ''} recorded</span>
                    <ChevronRight className="h-4 w-4 text-muted-foreground" />
                  </button>
                )}
              </section>

              {/* ── Quick Links ── */}
              <section>
                <SectionTitle icon={Globe} label="Quick Links" />
                <div className="space-y-2">
                  {[
                    { label: 'Cybercrime Portal (India)', url: 'https://cybercrime.gov.in/' },
                    { label: 'Report on Meta', url: 'https://www.facebook.com/help/contact/274459462613911' },
                    { label: 'Report on X (Twitter)', url: 'https://help.twitter.com/en/forms/safety-and-sensitive-content/abuse' },
                    { label: 'Report on YouTube', url: 'https://support.google.com/youtube/answer/2802027' },
                  ].map((link) => (
                    <a
                      key={link.url}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-between rounded-2xl border border-border bg-muted/20 px-4 py-3 hover:border-brand-orange/40 hover:text-brand-orange transition-colors group"
                    >
                      <span className="text-sm">{link.label}</span>
                      <ExternalLink className="h-3.5 w-3.5 text-muted-foreground group-hover:text-brand-orange transition-colors" />
                    </a>
                  ))}
                </div>
              </section>

              {/* ── App info ── */}
              <section>
                <SectionTitle icon={Shield} label="About" />
                <div className="rounded-2xl border border-border bg-muted/20 px-4 py-4 space-y-2 text-xs font-mono text-muted-foreground">
                  <div className="flex justify-between"><span>Version</span><span>v2.0.0</span></div>
                  <div className="flex justify-between"><span>Model</span><span>EfficientNet-V2-S</span></div>
                  <div className="flex justify-between"><span>Backend</span><span>FastAPI · PyTorch</span></div>
                </div>
              </section>
            </div>

            {/* Footer: Sign out */}
            <div className="px-6 py-5 border-t border-border">
              <button
                onClick={() => { onLogout(); onClose(); }}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl border border-destructive/30 text-destructive hover:bg-destructive/10 transition-colors font-semibold text-sm"
              >
                <LogOut className="h-4 w-4" /> Sign Out
              </button>
            </div>
          </motion.div>

          {/* Toast */}
          <AnimatePresence>
            {toast && (
              <motion.div
                key="toast"
                initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 40 }}
                className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[200] flex items-center gap-2 rounded-2xl border border-border bg-card px-5 py-3 shadow-elevated text-sm font-medium"
              >
                <Bell className="h-4 w-4 text-brand-orange" />
                {toast}
              </motion.div>
            )}
          </AnimatePresence>
        </>
      )}
    </AnimatePresence>
  );
}
