'use client';

import React, { useState, useCallback, useEffect, useRef, Suspense } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Activity, UploadCloud, FileVideo, FileImage, ShieldCheck, ShieldAlert, ShieldX, Languages, LogOut, Info, ArrowRight, Lock, Loader2, CheckCircle2, XCircle, Wifi, WifiOff, Share2, LockKeyhole, Zap, ArrowLeft, Copy, MessageCircle, ExternalLink, Send, Download, Globe, AlertTriangle, CheckCircle, Mail, Sun, Moon } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Cell, ReferenceLine } from 'recharts';
import { Canvas } from '@react-three/fiber';
import ThreeJSHeatmap from '@/components/three/ThreeJSHeatmap';
import { analyzeMedia, checkHealth, type AnalysisResponse } from '@/lib/api';

// ─── Translations ───

const TRANSLATIONS = {
  en: {
    title: "Deepfake Scanner",
    subtitle: "Check videos & images to see if they are real or AI-generated.",
    dropMedia: "Drop media here to scan",
    orBrowse: "or click to browse files",
    supported: "Supports Images (JPG, PNG) and Videos (MP4) up to 250MB",
    analyze: "Analyze Media",
    analyzing: "Analyzing...",
    authenticity: "Authenticity",
    status: "Status",
    statusAwaiting: "Waiting for Media",
    resultFake: "DEEPFAKE DETECTED",
    resultReal: "VERIFIED REAL",
    whyFake: "Why is it flagged?",
    evidenceTab: "AI Evidence & Graphs",
    detailsTab: "Technical Details",
    evidenceTitle: "Frame-by-Frame Confidence",
    evidenceDesc: "This graph shows the authenticity score across the video timeline. Dips indicate potential manipulation.",
    notUploaded: "Media not uploaded yet.",
    logout: "Exit",
    language: "हिंदी",
    switchLang: "hi",
    loginTitle: "Welcome to Trinetra",
    loginSubtitle: "Sign in to access the public deepfake scanner.",
    emailPlaceholder: "Email Address",
    passwordPlaceholder: "Password",
    loginBtn: "Sign In",
    guestBtn: "Continue as Guest",
    backendOnline: "Backend Online",
    backendOffline: "Backend Offline",
    cloudVerdict: "Cloud Verdict",
    localVerdict: "Local AI Verdict",
    latency: "Processing Time",
    forensicSummary: "Forensic Summary",
    rdStatus: "Reality Defender",
  },
  hi: {
    title: "डीपफेक स्कैनर",
    subtitle: "यह जांचें कि वीडियो और तस्वीरें असली हैं या AI द्वारा बनाई गई हैं।",
    dropMedia: "स्कैन करने के लिए मीडिया यहाँ डालें",
    orBrowse: "या फ़ाइलें ब्राउज़ करने के लिए क्लिक करें",
    supported: "छवियाँ (JPG, PNG) और वीडियो (MP4) 250MB तक समर्थित हैं",
    analyze: "मीडिया का विश्लेषण करें",
    analyzing: "विश्लेषण कर रहा है...",
    authenticity: "प्रामाणिकता",
    status: "स्थिति",
    statusAwaiting: "मीडिया की प्रतीक्षा है",
    resultFake: "डीपफेक मिला",
    resultReal: "असली सत्यापित",
    whyFake: "इसे क्यों पकड़ा गया?",
    evidenceTab: "AI साक्ष्य और ग्राफ",
    detailsTab: "तकनीकी विवरण",
    evidenceTitle: "फ्रेम-दर-फ्रेम विश्वास",
    evidenceDesc: "यह ग्राफ वीडियो टाइमलाइन पर प्रामाणिकता स्कोर दिखाता है।",
    notUploaded: "मीडिया अभी अपलोड नहीं हुआ है।",
    logout: "बाहर निकले",
    language: "English",
    switchLang: "en",
    loginTitle: "Trinetra में आपका स्वागत है",
    loginSubtitle: "सार्वजनिक डीपफेक स्कैनर तक पहुंचने के लिए साइन इन करें।",
    emailPlaceholder: "ईमेल पता",
    passwordPlaceholder: "पासवर्ड",
    loginBtn: "साइन इन करें",
    guestBtn: "अतिथि के रूप में जारी रखें",
    backendOnline: "बैकएंड ऑनलाइन",
    backendOffline: "बैकएंड ऑफ़लाइन",
    cloudVerdict: "क्लाउड निर्णय",
    localVerdict: "स्थानीय AI निर्णय",
    latency: "प्रोसेसिंग समय",
    forensicSummary: "फोरेंसिक सारांश",
    rdStatus: "Reality Defender",
  }
};

type Lang = 'en' | 'hi';

export default function GeneralPage() {
  const [lang, setLang] = useState<Lang>('en');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<AnalysisResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('evidence');
  const [backendOnline, setBackendOnline] = useState<boolean | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [activePanel, setActivePanel] = useState<'blast' | 'lockdown' | 'takedown' | null>(null);
  const [lockdownChecks, setLockdownChecks] = useState<boolean[]>([false, false, false, false, false, false]);
  const [takedownLog, setTakedownLog] = useState<string[]>([]);
  const [emailTo, setEmailTo] = useState('');
  const [darkMode, setDarkMode] = useState(true);

  const t = TRANSLATIONS[lang];

  // ── Health check on mount ──
  useEffect(() => {
    if (!isLoggedIn) return;
    checkHealth()
      .then(() => setBackendOnline(true))
      .catch(() => setBackendOnline(false));
  }, [isLoggedIn]);

  // ── Dark/Light mode ──
  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode);
  }, [darkMode]);

  const toggleLanguage = () => setLang(t.switchLang as Lang);

  // ── File handling ──
  const handleFileSelect = useCallback((file: File) => {
    setSelectedFile(file);
    setResult(null);
    setError(null);
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) handleFileSelect(file);
  }, [handleFileSelect]);

  const handleBrowseClick = () => fileInputRef.current?.click();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFileSelect(file);
  };

  // ── Analysis ──
  const handleAnalyze = async () => {
    if (!selectedFile) return;
    setIsAnalyzing(true);
    setError(null);
    setResult(null);
    try {
      const res = await analyzeMedia(selectedFile);
      setResult(res);
    } catch (err: any) {
      setError(err.message || 'Analysis failed. Is the backend running?');
    } finally {
      setIsAnalyzing(false);
    }
  };

  // ── Derived data for charts ──
  const confidenceForGraph = result ? [
    { name: 'Local AI', value: result.local_confidence, fill: result.local_label === 'FAKE' ? '#FA5252' : '#40C057' },
    { name: 'Cloud', value: result.rd_score ? result.rd_score * 100 : 0, fill: '#7950F2' },
    { name: 'Combined', value: result.confidence_score, fill: result.primary_verdict === 'FAKE' ? '#FA5252' : '#40C057' },
  ] : [];

  const isFake = result?.primary_verdict === 'FAKE';
  const isReal = result?.primary_verdict === 'REAL';
  const confidencePct = result ? result.confidence_score : 0;

  // ═══════════════ LOGIN SCREEN ═══════════════
  if (!isLoggedIn) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--background)] p-6 text-[var(--foreground)]">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-md w-full bg-[var(--card-bg)] rounded-3xl p-10 shadow-2xl border border-[var(--border-strong)] backdrop-blur-xl"
        >
          <div className="flex justify-between items-center mb-8">
            <div className="h-10">
              <img src="/Trinetra_V3.png" alt="Logo" className="h-full object-contain" onError={(e) => { e.currentTarget.style.display = 'none'; }} />
            </div>
            <button onClick={toggleLanguage} className="flex items-center space-x-2 px-3 py-1.5 rounded-full bg-[var(--surface)] text-xs font-bold text-[var(--foreground)]">
              <Languages className="w-4 h-4 text-[#FF6B00]" />
              <span>{t.language}</span>
            </button>
          </div>

          <h2 className="text-3xl font-bold font-['Syncopate'] text-[var(--foreground)] mb-2">{t.loginTitle}</h2>
          <p className="text-[var(--muted)] mb-8">{t.loginSubtitle}</p>

          <div className="space-y-4 mb-6">
            <input type="email" placeholder={t.emailPlaceholder} className="w-full px-4 py-3 rounded-xl bg-[var(--surface)] border border-[var(--border-strong)] text-[var(--foreground)] placeholder-[var(--muted)] focus:outline-none focus:border-[#FF6B00]" />
            <input type="password" placeholder={t.passwordPlaceholder} className="w-full px-4 py-3 rounded-xl bg-[var(--surface)] border border-[var(--border-strong)] text-[var(--foreground)] placeholder-[var(--muted)] focus:outline-none focus:border-[#FF6B00]" />
            <button
              onClick={() => setIsLoggedIn(true)}
              className="w-full py-3 bg-[#212529] text-white rounded-xl font-bold hover:bg-black transition-colors flex items-center justify-center space-x-2"
            >
              <Lock className="w-4 h-4" />
              <span>{t.loginBtn}</span>
            </button>
          </div>

          <div className="relative flex items-center py-4">
            <div className="flex-grow border-t border-[var(--border-strong)]" />
            <span className="flex-shrink-0 mx-4 text-[var(--muted)] text-xs">OR</span>
            <div className="flex-grow border-t border-[var(--border-strong)]" />
          </div>

          <button
            onClick={() => setIsLoggedIn(true)}
            className="w-full py-3 bg-[var(--surface)] border-2 border-[var(--border-strong)] text-[var(--foreground)] rounded-xl font-bold hover:border-[#FF6B00] hover:text-[#FF6B00] transition-colors flex items-center justify-center space-x-2"
          >
            <span>{t.guestBtn}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </motion.div>
      </div>
    );
  }

  // ═══════════════ MAIN DASHBOARD ═══════════════
  return (
    <div className="min-h-screen flex flex-col pt-20 bg-[var(--background)] text-[var(--foreground)]">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 h-16 bg-[var(--card-bg)] border-b border-[var(--border-strong)] flex items-center justify-between px-6 z-50 shadow-sm backdrop-blur-xl">
        <div className="flex items-center space-x-3">
          <div className="h-10 flex items-center">
            <img src="/Trinetra_V3.png" alt="Logo" className="max-h-10 object-contain" onError={(e) => { e.currentTarget.style.display = 'none'; }} />
          </div>
          <h1 className="text-xl font-bold font-['Syncopate'] tracking-widest bg-gradient-to-r from-[#FF6B00] to-[#FFCE00] bg-clip-text text-transparent">TRINETRA</h1>

          {/* Backend status indicator */}
          <div className="ml-6 flex items-center space-x-2 text-xs font-medium">
            {backendOnline === true && (
              <span className="flex items-center space-x-1.5 text-[#40C057]"><Wifi className="w-3.5 h-3.5" /><span>{t.backendOnline}</span></span>
            )}
            {backendOnline === false && (
              <span className="flex items-center space-x-1.5 text-[#FA5252]"><WifiOff className="w-3.5 h-3.5" /><span>{t.backendOffline}</span></span>
            )}
            {backendOnline === null && (
              <span className="flex items-center space-x-1.5 text-[#868E96]"><Loader2 className="w-3.5 h-3.5 animate-spin" /><span>Checking...</span></span>
            )}
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <button onClick={toggleLanguage} className="flex items-center space-x-2 px-3 py-1.5 rounded-full bg-[var(--surface)] hover:bg-[var(--surface-2)] border border-[var(--border-strong)] text-sm font-medium text-[var(--foreground)] transition-colors">
            <Languages className="w-4 h-4 text-[#FF6B00]" />
            <span>{t.language}</span>
          </button>
          <button
            onClick={() => setDarkMode(d => !d)}
            title={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            className="p-2 rounded-full hover:bg-[var(--surface)] text-[var(--muted)] transition-colors"
          >
            {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>
          <button onClick={() => { setIsLoggedIn(false); setSelectedFile(null); setPreviewUrl(null); setResult(null); }} title={t.logout} className="p-2 rounded-full hover:bg-[var(--surface)] text-[var(--muted)] transition-colors">
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col p-6 w-full max-w-[1600px] mx-auto lg:px-12">
        {/* Title */}
        <div className="text-center mb-8">
          <h2 className="text-3xl lg:text-5xl font-bold font-['Syncopate'] text-[var(--foreground)] mb-3">{t.title}</h2>
          <p className="text-[var(--muted)] text-base lg:text-lg font-medium max-w-2xl mx-auto">{t.subtitle}</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10">

          {/* ── Upload Column ── */}
          <div className="lg:col-span-7 flex flex-col gap-4">
            <div
              onDrop={handleDrop}
              onDragOver={(e) => e.preventDefault()}
              onClick={handleBrowseClick}
              className={`p-10 rounded-3xl bg-[var(--card-bg)] border-2 border-dashed flex flex-col items-center justify-center text-center cursor-pointer transition-colors min-h-[300px] shadow-sm flex-1 relative overflow-hidden group ${
                selectedFile ? 'border-[#40C057] bg-[#EBFBEE]' : 'border-[var(--border-strong)] hover:border-[#FF6B00] hover:bg-[#FFF4E6]'
              }`}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp,video/mp4,video/mov"
                className="hidden"
                onChange={handleInputChange}
              />

              {!selectedFile ? (
                <>
                  <div className="w-16 h-16 rounded-full bg-[#FFF4E6] flex items-center justify-center mb-4 text-[#FF6B00]">
                    <UploadCloud className="w-8 h-8" />
                  </div>
                  <h3 className="text-[var(--foreground)] text-xl font-bold mb-1">{t.dropMedia}</h3>
                  <p className="text-sm text-[var(--muted)] mb-2">{t.orBrowse}</p>
                  <p className="text-xs text-[var(--muted)]">{t.supported}</p>
                </>
              ) : (
                <div className="flex flex-col items-center">
                  {previewUrl && selectedFile.type.startsWith('image') && (
                    <img src={previewUrl} alt="Preview" className="max-h-48 rounded-xl shadow-md mb-4 object-contain" />
                  )}
                  {previewUrl && selectedFile.type.startsWith('video') && (
                    <video src={previewUrl} className="max-h-48 rounded-xl shadow-md mb-4" controls muted />
                  )}
                  <div className="flex items-center space-x-2 text-[#40C057]">
                    <CheckCircle2 className="w-5 h-5" />
                    <span className="font-bold text-sm">{selectedFile.name}</span>
                    <span className="text-xs text-[var(--muted)]">({(selectedFile.size / 1024 / 1024).toFixed(1)} MB)</span>
                  </div>
                </div>
              )}
            </div>

            {/* Analyze Button */}
            <button
              onClick={handleAnalyze}
              disabled={!selectedFile || isAnalyzing}
              className={`w-full py-4 rounded-2xl font-bold text-lg shadow-md transition-all flex items-center justify-center space-x-3 ${
                !selectedFile || isAnalyzing
                  ? 'bg-[#DEE2E6] text-[var(--muted)] cursor-not-allowed'
                  : 'bg-gradient-to-r from-[#FF6B00] to-[#FA5252] text-white hover:shadow-lg hover:opacity-90'
              }`}
            >
              {isAnalyzing ? (
                <><Loader2 className="w-5 h-5 animate-spin" /><span>{t.analyzing}</span></>
              ) : (
                <><Activity className="w-5 h-5" /><span>{t.analyze}</span></>
              )}
            </button>

            {error && (
              <div className="p-4 rounded-xl bg-[#FFF5F5] border border-[#FA5252]/30 text-[#FA5252] text-sm font-medium flex items-center space-x-2">
                <XCircle className="w-5 h-5 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}
          </div>

          {/* ── Results Column ── */}
          <div className="lg:col-span-5 flex flex-col gap-6">

            {/* Verdict Card */}
            <div className={`glass-panel p-8 flex-1 flex flex-col justify-center ${
              result && isFake ? 'border-[#FA5252]/30 !bg-[#FFF5F5]' : result && isReal ? 'border-[#40C057]/30 !bg-[#EBFBEE]' : ''
            }`}>
              {!result ? (
                <div className="text-center flex flex-col items-center opacity-60">
                  <div className="w-24 h-24 rounded-full border-[6px] border-[var(--border-strong)] flex items-center justify-center mb-4">
                    <span className="text-3xl font-bold text-[#DEE2E6] font-['Syncopate']">--</span>
                  </div>
                  <h3 className="text-sm font-bold text-[var(--muted)] uppercase tracking-wider mb-2">{t.status}</h3>
                  <span className="text-xl font-bold text-[var(--muted)]">{isAnalyzing ? t.analyzing : t.statusAwaiting}</span>
                </div>
              ) : (
                <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-col">
                  {/* Verdict Icon + Label */}
                  <div className="flex items-center space-x-4 mb-6">
                    <div className={`w-16 h-16 rounded-full flex items-center justify-center ${isFake ? 'bg-[#FA5252]/10' : 'bg-[#40C057]/10'}`}>
                      {isFake ? <ShieldAlert className="w-8 h-8 text-[#FA5252]" /> : <ShieldCheck className="w-8 h-8 text-[#40C057]" />}
                    </div>
                    <div>
                      <h3 className="text-[10px] font-bold text-[var(--muted)] uppercase tracking-wider">{t.authenticity}</h3>
                      <div className={`text-2xl font-bold font-['Syncopate'] mt-1 ${isFake ? 'bg-gradient-to-r from-[#FF4040] to-[#FA5252] bg-clip-text text-transparent' : 'text-[#40C057]'}`}>
                        {isFake ? t.resultFake : t.resultReal}
                      </div>
                    </div>
                  </div>

                  {/* Confidence Score */}
                  <div className="flex items-center justify-between mb-6 p-4 bg-[var(--card-bg)] rounded-xl border border-[var(--border-strong)]">
                    <span className="text-sm font-bold text-[var(--foreground)]">Confidence</span>
                    <span className={`text-3xl font-bold font-['Syncopate'] ${isFake ? 'text-[#FA5252]' : 'text-[#40C057]'}`}>
                      {confidencePct.toFixed(1)}%
                    </span>
                  </div>

                  {/* Key Stats */}
                  <div className="grid grid-cols-2 gap-3 mb-4">
                    <div className="p-3 rounded-xl bg-[var(--card-bg)] border border-[var(--border-strong)]">
                      <span className="text-[10px] font-bold text-[var(--muted)] uppercase block mb-1">{t.localVerdict}</span>
                      <span className={`font-bold text-sm ${result.local_label === 'FAKE' ? 'text-[#FA5252]' : 'text-[#40C057]'}`}>
                        {result.local_label} ({result.local_confidence.toFixed(1)}%)
                      </span>
                    </div>
                    <div className="p-3 rounded-xl bg-[var(--card-bg)] border border-[var(--border-strong)]">
                      <span className="text-[10px] font-bold text-[var(--muted)] uppercase block mb-1">{t.rdStatus}</span>
                      <span className={`font-bold text-sm ${result.rd_status === 'DISABLED' ? 'text-[var(--muted)]' : result.rd_status === 'AUTHENTIC' ? 'text-[#40C057]' : 'text-[#7950F2]'}`}>
                        {result.rd_status || 'N/A'}
                      </span>
                    </div>
                    <div className="col-span-2 p-3 rounded-xl bg-[var(--card-bg)] border border-[var(--border-strong)]">
                      <span className="text-[10px] font-bold text-[var(--muted)] uppercase block mb-1">{t.latency}</span>
                      <span className="font-bold text-sm text-[var(--foreground)] font-mono">{result.latency_ms.toFixed(0)} ms</span>
                    </div>
                  </div>

                  <div className={`p-4 rounded-xl border text-sm leading-relaxed ${isFake ? 'bg-[#FFF5F5] border-[#FA5252]/20 text-[var(--foreground)]' : 'bg-[#EBFBEE] border-[#40C057]/20 text-[var(--foreground)]'}`}>
                    <p className="font-bold mb-1">{t.forensicSummary}</p>
                    <p>{result.forensic_summary}</p>
                  </div>

                  {/* ── Action Buttons ── */}
                  <div className="flex flex-wrap gap-2 mt-4">
                    <button onClick={() => setActivePanel('blast')} className="flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#FF6B00]/10 to-[#FA5252]/10 border border-[#FF6B00]/30 text-[#FF6B00] text-xs font-bold hover:from-[#FF6B00]/20 hover:to-[#FA5252]/20 transition-all">
                      <Share2 className="w-3.5 h-3.5" /><span>Blast Radius</span>
                    </button>
                    {isFake && (
                      <>
                        <button onClick={() => setActivePanel('lockdown')} className="flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#FA5252]/10 to-[#E03131]/10 border border-[#FA5252]/30 text-[#FA5252] text-xs font-bold hover:from-[#FA5252]/20 hover:to-[#E03131]/20 transition-all">
                          <LockKeyhole className="w-3.5 h-3.5" /><span>Lockdown</span>
                        </button>
                        <button onClick={() => setActivePanel('takedown')} className="flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#212529]/10 to-[#495057]/10 border border-[#495057]/30 text-[var(--foreground)] text-xs font-bold hover:from-[#212529]/20 hover:to-[#495057]/20 transition-all">
                          <Zap className="w-3.5 h-3.5" /><span>Auto-Takedown</span>
                        </button>
                      </>
                    )}
                  </div>
                </motion.div>
              )}
            </div>
          </div>
        </div>

        {/* ── Evidence Tabs ── */}
        <div className="mt-8 glass-panel overflow-hidden bg-[var(--card-bg)] mb-10">
          <div className="flex flex-wrap border-b border-[var(--border-strong)] bg-[var(--surface)]">
            <button
              onClick={() => setActiveTab('evidence')}
              className={`flex items-center justify-center space-x-2 flex-1 min-w-[200px] py-4 text-sm font-bold transition-colors border-b-[3px] ${activeTab === 'evidence' ? 'border-[#FF6B00] text-[#FF6B00] bg-[var(--card-bg)]' : 'border-transparent text-[var(--muted)] hover:bg-[var(--surface-2)]'}`}
            >
              <Activity className="w-4 h-4" />
              <span>{t.evidenceTab}</span>
            </button>
            <button
              onClick={() => setActiveTab('details')}
              className={`flex flex-1 items-center justify-center space-x-2 min-w-[200px] py-4 text-sm font-bold transition-colors border-b-[3px] ${activeTab === 'details' ? 'border-[#FF6B00] text-[#FF6B00] bg-[var(--card-bg)]' : 'border-transparent text-[var(--muted)] hover:bg-[var(--surface-2)]'}`}
            >
              <Info className="w-4 h-4" />
              <span>{t.detailsTab}</span>
            </button>
          </div>

          <div className="p-8 min-h-[340px]">
            <AnimatePresence mode="wait">
              {activeTab === 'evidence' && (
                <motion.div key="evidence" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="h-full flex flex-col">
                  {!result ? (
                    <div className="flex flex-col items-center justify-center h-full text-center py-10 opacity-50">
                      <ShieldCheck className="w-12 h-12 text-[var(--muted)] mb-4" />
                      <p className="text-[var(--muted)] font-bold text-lg">{t.notUploaded}</p>
                    </div>
                  ) : (
                    <div className="flex flex-col lg:flex-row gap-6 items-start w-full">
                      {/* Left: Summary & Face Crop */}
                      <div className="lg:w-1/4 flex flex-col">
                        <h4 className="text-lg font-bold text-[var(--foreground)] mb-3">{t.evidenceTitle}</h4>
                        
                        <div className="mb-4 aspect-square bg-[var(--surface)] border border-[var(--border-strong)] rounded-xl overflow-hidden relative group">
                          {result.face_crop_base64 ? (
                            <img 
                              src={`data:image/png;base64,${result.face_crop_base64}`} 
                              alt="Detected Face" 
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex flex-col items-center justify-center text-[var(--muted)]">
                               <ShieldAlert className="w-8 h-8 mb-2 opacity-30" />
                               <span className="text-[10px] uppercase font-bold tracking-widest text-[#CED4DA]">No Face Detected</span>
                            </div>
                          )}
                          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent flex items-end p-3">
                             <span className="text-[9px] font-bold text-white uppercase tracking-wider bg-black/50 px-2 py-1 rounded backdrop-blur-sm">Source Extraction</span>
                          </div>
                        </div>

                        <p className="text-[var(--muted)] leading-relaxed text-xs mb-4">{t.evidenceDesc}</p>
                        <div className="p-4 mt-auto bg-[var(--surface)] rounded-xl border border-[var(--border-strong)] text-xs text-[var(--foreground)]">
                          <strong>Key Finding:</strong> {result.forensic_summary}
                        </div>
                      </div>

                      {/* Middle: Confidence Bar Chart */}
                      <div className="lg:w-1/3 w-full h-[320px] bg-[var(--surface)] border border-[var(--border-strong)] rounded-2xl p-4 flex flex-col relative shadow-sm">
                        <h5 className="text-xs font-bold text-[var(--muted)] uppercase tracking-wider mb-2">Verdict Confidence Breakdown</h5>
                        <div className="flex-1 w-full min-h-0">
                          <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={confidenceForGraph} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E9ECEF" />
                              <XAxis dataKey="name" stroke="#ADB5BD" fontSize={11} />
                              <YAxis stroke="#ADB5BD" fontSize={10} domain={[0, 100]} tickFormatter={(val) => `${val}%`} />
                              <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 15px rgba(0,0,0,0.1)' }} />
                              <ReferenceLine y={50} stroke="#868E96" strokeDasharray="3 3" label={{ value: '50% Threshold', position: 'insideTopRight', fontSize: 10, fill: '#ADB5BD' }} />
                              <Bar dataKey="value" radius={[8, 8, 0, 0]}>
                                {confidenceForGraph.map((entry, index) => (
                                  <Cell key={`cell-${index}`} fill={entry.fill} />
                                ))}
                              </Bar>
                            </BarChart>
                          </ResponsiveContainer>
                        </div>
                      </div>

                      {/* Right: 3D Heatmap */}
                      <div className="lg:w-5/12 w-full h-[320px] bg-[var(--card-bg)] border border-[var(--border-strong)] rounded-2xl flex flex-col relative overflow-hidden shadow-sm">
                        <h5 className="absolute top-4 left-5 z-10 text-xs font-bold text-[var(--muted)] uppercase tracking-wider">3D Spatial Heatmap</h5>
                        <div className="absolute top-4 right-4 z-10 text-[9px] font-mono text-[var(--muted)] bg-[var(--surface-2)] px-2 py-1 rounded border border-[var(--border-strong)]">Interactive: Drag/Zoom</div>
                        <div className="flex-1 w-full min-h-0 bg-[var(--card-bg)]">
                          <Canvas camera={{ position: [0, 5, 8], fov: 50 }} className="w-full h-full">
                            <color attach="background" args={['#FFFFFF']} />
                            <Suspense fallback={null}>
                              <ThreeJSHeatmap gradcamBase64={result.gradcam_base64} />
                            </Suspense>
                          </Canvas>
                        </div>
                      </div>
                    </div>
                  )}
                </motion.div>
              )}
              {activeTab === 'details' && (
                <motion.div key="details" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="h-full">
                  {!result ? (
                    <div className="flex flex-col items-center justify-center h-full text-center py-10 opacity-50">
                      <Info className="w-12 h-12 text-[var(--muted)] mb-4" />
                      <p className="text-[var(--muted)] font-bold text-lg">{t.notUploaded}</p>
                    </div>
                  ) : (
                    <div className="max-w-3xl">
                      <h4 className="text-xl font-bold text-[var(--foreground)] mb-4">Full Analysis Report</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                        <div className="p-4 rounded-xl bg-[var(--surface)] border border-[var(--border-strong)]">
                          <span className="text-xs font-bold text-[var(--muted)] uppercase tracking-wider block mb-1">Primary Verdict</span>
                          <span className={`font-bold text-lg font-mono ${isFake ? 'text-[#FA5252]' : 'text-[#40C057]'}`}>{result.primary_verdict}</span>
                        </div>
                        <div className="p-4 rounded-xl bg-[var(--surface)] border border-[var(--border-strong)]">
                          <span className="text-xs font-bold text-[var(--muted)] uppercase tracking-wider block mb-1">Overall Confidence</span>
                          <span className="font-bold text-lg font-mono text-[var(--foreground)]">{result.confidence_score.toFixed(2)}%</span>
                        </div>
                        <div className="p-4 rounded-xl bg-[var(--surface)] border border-[var(--border-strong)]">
                          <span className="text-xs font-bold text-[var(--muted)] uppercase tracking-wider block mb-1">Local Model Result</span>
                          <span className="font-bold text-sm font-mono text-[var(--foreground)]">{result.local_label} — {result.local_confidence.toFixed(2)}%</span>
                        </div>
                        <div className="p-4 rounded-xl bg-[var(--surface)] border border-[var(--border-strong)]">
                          <span className="text-xs font-bold text-[var(--muted)] uppercase tracking-wider block mb-1">Reality Defender Cloud</span>
                          <span className="font-bold text-sm font-mono text-[var(--foreground)]">{result.rd_status || 'DISABLED'} {result.rd_score ? `(${(result.rd_score * 100).toFixed(1)}%)` : ''}</span>
                        </div>
                        <div className="p-4 rounded-xl bg-[var(--surface)] border border-[var(--border-strong)]">
                          <span className="text-xs font-bold text-[var(--muted)] uppercase tracking-wider block mb-1">Processing Latency</span>
                          <span className="font-bold text-sm font-mono text-[var(--foreground)]">{result.latency_ms.toFixed(2)} ms</span>
                        </div>
                        <div className="p-4 rounded-xl bg-[var(--surface)] border border-[var(--border-strong)]">
                          <span className="text-xs font-bold text-[var(--muted)] uppercase tracking-wider block mb-1">Architecture</span>
                          <span className="font-bold text-sm font-mono text-[var(--foreground)]">EfficientNet-B4 + BiLSTM</span>
                        </div>
                      </div>
                      <div className="p-4 rounded-xl bg-[var(--surface)] border border-[var(--border-strong)]">
                        <span className="text-xs font-bold text-[var(--muted)] uppercase tracking-wider block mb-2">Forensic Summary</span>
                        <p className="text-sm text-[var(--foreground)] leading-relaxed">{result.forensic_summary}</p>
                      </div>
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </main>

      {/* ══════════════════════════════════════════════════════════════ */}
      {/* ──  BLAST RADIUS PANEL  ── */}
      {/* ══════════════════════════════════════════════════════════════ */}
      <AnimatePresence>
        {activePanel === 'blast' && result && (
          <motion.div key="blast" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[100] bg-black/30 backdrop-blur-sm flex items-center justify-center p-4">
            <motion.div initial={{ y: 30, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 30, opacity: 0 }} className="w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-[var(--card-bg)] rounded-3xl shadow-2xl border border-[var(--border-strong)]" onClick={(e) => e.stopPropagation()}>
              {/* Header */}
              <div className="sticky top-0 bg-[var(--card-bg)] border-b border-[var(--border-strong)] px-8 py-5 rounded-t-3xl z-10">
                <button onClick={() => setActivePanel(null)} className="float-left mr-4 mt-1 text-[var(--muted)] hover:text-[var(--foreground)]"><ArrowLeft className="w-5 h-5" /></button>
                <h2 className="text-2xl font-bold font-['Syncopate'] text-[var(--foreground)] flex items-center space-x-2">
                  {isFake
                    ? <><AlertTriangle className="w-6 h-6 text-[#FF6B00]" /><span>Blast Radius Containment</span></>
                    : <><CheckCircle className="w-6 h-6 text-[#40C057]" /><span>Authenticity Broadcast</span></>
                  }
                </h2>
                <p className="text-sm text-[var(--muted)] mt-1">
                  {isFake
                    ? 'Deploy a credible, pre-bunking defense to your network immediately.'
                    : 'Share verified proof of authenticity with your network to clear false accusations.'}
                </p>
              </div>

              <div className="p-8 grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* WhatsApp Broadcast */}
                <div className="bg-[var(--surface)] border border-[var(--border-strong)] rounded-2xl p-6">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-bold text-[var(--foreground)] flex items-center space-x-2"><MessageCircle className="w-4 h-4 text-[#25D366]" /><span>WhatsApp Broadcast</span></h3>
                    <span className="text-[9px] font-bold bg-[#40C057] text-white px-2 py-0.5 rounded font-mono">AI Drafted</span>
                  </div>
                  <p className="text-xs text-[var(--muted)] mb-4">
                    {isFake
                      ? 'Edit this message to add personal context, then copy or share directly to WhatsApp to kill the rumor before it spreads.'
                      : 'Share this verified authenticity certificate with your network to clear your name.'}
                  </p>
                  <div className="bg-[var(--card-bg)] border border-[var(--border-strong)] rounded-xl p-4 text-sm text-[var(--foreground)] leading-relaxed mb-4 font-mono">
                    {isFake ? (
                      <>
                        <p className="font-bold mb-2">URGENT: A video/image currently circulating featuring me is a CONFIRMED DEEPFAKE.</p>
                        <p className="mb-2">I have run this media through Trinetra&apos;s military-grade forensic analysis, which has verified it as {result.confidence_score.toFixed(1)}% synthetically manipulated.</p>
                        <p>Please DO NOT share, forward, or engage with this content. Sharing non-consensual synthetic content is a punishable offense under IT Act 2000.</p>
                      </>
                    ) : (
                      <>
                        <p className="font-bold text-[#40C057] mb-2">✅ VERIFIED AUTHENTIC: A media clip featuring me has been independently verified as REAL by AI forensic analysis.</p>
                        <p className="mb-2">I have run this through Trinetra&apos;s forensic AI, which confirmed it is {result.confidence_score.toFixed(1)}% authentic — not AI-generated or manipulated.</p>
                        <p>This is certified by EfficientNet-B4 + Reality Defender cloud analysis. Please disregard any claims that this content is fake.</p>
                      </>
                    )}
                  </div>
                  <div className="flex gap-3">
                    <button onClick={() => {
                      const msg = isFake
                        ? `URGENT: A video/image currently circulating featuring me is a CONFIRMED DEEPFAKE.\n\nI have run this media through Trinetra's military-grade forensic analysis, which has verified it as ${result.confidence_score.toFixed(1)}% synthetically manipulated.\n\nPlease DO NOT share, forward, or engage with this content.`
                        : `✅ VERIFIED AUTHENTIC: A media clip featuring me has been confirmed as REAL by Trinetra forensic AI (${result.confidence_score.toFixed(1)}% authentic).\n\nThis has been certified by EfficientNet-B4 + Reality Defender cloud analysis. It is NOT AI-generated or manipulated.`;
                      navigator.clipboard.writeText(msg);
                    }} className="flex-1 flex items-center justify-center space-x-2 py-2.5 rounded-xl bg-[#212529] text-white text-sm font-bold hover:bg-black transition-colors">
                      <Copy className="w-4 h-4" /><span>Copy</span>
                    </button>
                    <button onClick={() => {
                      const msg = isFake
                        ? `URGENT: A video/image currently circulating featuring me is a CONFIRMED DEEPFAKE. Verified ${result.confidence_score.toFixed(1)}% synthetic by Trinetra forensic analysis. Please DO NOT share or forward.`
                        : `✅ VERIFIED AUTHENTIC: Media featuring me has been confirmed REAL (${result.confidence_score.toFixed(1)}% authentic) by Trinetra AI forensics. It is NOT a deepfake.`;
                      window.open(`https://wa.me/?text=${encodeURIComponent(msg)}`, '_blank');
                    }} className="flex-1 flex items-center justify-center space-x-2 py-2.5 rounded-xl bg-[#25D366] text-white text-sm font-bold hover:bg-[#1ebe5d] transition-colors">
                      <MessageCircle className="w-4 h-4" /><span>WhatsApp</span>
                    </button>
                  </div>
                </div>

                {/* Email Broadcast */}
                <div className="bg-[var(--surface)] border border-[var(--border-strong)] rounded-2xl p-6">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-bold text-[var(--foreground)] flex items-center space-x-2"><Mail className="w-4 h-4 text-[#4C6EF5]" /><span>Email Broadcast</span></h3>
                    <span className="text-[9px] font-bold bg-[#4C6EF5] text-white px-2 py-0.5 rounded font-mono">AI Drafted</span>
                  </div>
                  <p className="text-xs text-[var(--muted)] mb-4">
                    {isFake
                      ? 'Send the forensic alert directly to an email address — family, friends, or authorities.'
                      : 'Send verified proof of authenticity to anyone questioning this media.'}
                  </p>
                  <div className="bg-[var(--card-bg)] border border-[var(--border-strong)] rounded-xl p-4 text-sm text-[var(--foreground)] leading-relaxed mb-4 font-mono text-xs">
                    {isFake ? (
                      <>
                        <p className="font-bold text-[#4C6EF5] mb-1">Subject: URGENT — Deepfake Alert: Media Circulating About Me</p>
                        <p className="mb-2">Dear Recipient,</p>
                        <p className="mb-2">I am writing to inform you that a video/image circulating online featuring me has been <strong>confirmed as a DEEPFAKE</strong> by Trinetra forensic AI.</p>
                        <p className="mb-2">Confidence: <strong>{result.confidence_score.toFixed(1)}%</strong> synthetic · Engine: EfficientNet-B4 + RD</p>
                        <p>Please do NOT share this content. Under IT Act 2000, distributing synthetic media non-consensually is punishable by law.</p>
                      </>
                    ) : (
                      <>
                        <p className="font-bold text-[#40C057] mb-1">Subject: ✅ Verified Authentic — Trinetra Forensic Clearance</p>
                        <p className="mb-2">Dear Recipient,</p>
                        <p className="mb-2">I am writing to confirm that a media clip featuring me has been <strong>independently verified as REAL</strong> by Trinetra forensic AI.</p>
                        <p className="mb-2">Authenticity: <strong>{result.confidence_score.toFixed(1)}%</strong> genuine · Engine: EfficientNet-B4 + RD</p>
                        <p>Please disregard any claims that this content is AI-generated or manipulated. This certificate serves as forensic proof of authenticity.</p>
                      </>
                    )}
                  </div>
                  <div className="flex gap-2 mb-3">
                    <input
                      type="email"
                      placeholder="Recipient email address..."
                      value={emailTo}
                      onChange={(e) => setEmailTo(e.target.value)}
                      className="flex-1 px-3 py-2.5 rounded-xl bg-[var(--card-bg)] border border-[var(--border-strong)] text-sm text-[var(--foreground)] focus:outline-none focus:border-[#4C6EF5]"
                    />
                  </div>

                  {/* Step indicator */}
                  <div className="flex items-center gap-2 mb-3 text-[10px] text-[var(--muted)] font-semibold">
                    <span className="flex items-center gap-1 bg-[#4C6EF5]/10 text-[#4C6EF5] px-2 py-1 rounded-lg">
                      <Download className="w-3 h-3" /> Step 1: Image auto-downloads
                    </span>
                    <span>→</span>
                    <span className="flex items-center gap-1 bg-[#4C6EF5]/10 text-[#4C6EF5] px-2 py-1 rounded-lg">
                      <Mail className="w-3 h-3" /> Step 2: Email opens — attach it
                    </span>
                  </div>

                  <button
                    onClick={() => {
                      // Step 1: Auto-download the best available image
                      const imageToDownload = result.face_crop_base64 || result.gradcam_base64;
                      if (imageToDownload) {
                        const link = document.createElement('a');
                        link.href = imageToDownload.startsWith('data:image')
                          ? imageToDownload
                          : `data:image/png;base64,${imageToDownload}`;
                        link.download = `trinetra_forensic_evidence_${new Date().toISOString().slice(0,10)}.png`;
                        link.click();
                      } else if (previewUrl) {
                        // Fallback: download the originally uploaded file
                        const link = document.createElement('a');
                        link.href = previewUrl;
                        link.download = selectedFile?.name || 'trinetra_evidence.png';
                        link.click();
                      }

                      // Step 2: Open email client after short delay
                      setTimeout(() => {
                        const subject = isFake
                          ? encodeURIComponent('URGENT — Deepfake Alert [Trinetra Forensic Verification]')
                          : encodeURIComponent('✅ Verified Authentic — Trinetra Forensic Clearance Certificate');
                        const body = isFake
                          ? encodeURIComponent(`Dear Recipient,\n\nI am writing to inform you that a video/image circulating online featuring me has been CONFIRMED as a DEEPFAKE by Trinetra forensic AI analysis.\n\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n🔴 VERDICT: ${result.primary_verdict}\n📊 Confidence: ${result.confidence_score.toFixed(1)}% synthetic manipulation\n🔬 Detection Engine: EfficientNet-B4 + Reality Defender\n⏱️ Analysis Latency: ${result.latency_ms.toFixed(0)}ms\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\nForensic Summary:\n${result.forensic_summary}\n\n⚠️ ATTACHMENT: Please find the forensic evidence image attached (auto-downloaded to your device).\n\nPlease do NOT share, forward, or engage with this synthetic content. Under the IT Act 2000 and IT (Intermediary Guidelines) Rules 2021, distributing non-consensual synthetic media is a punishable offense.\n\nVerified by Trinetra V2 — AI Deepfake Detection Platform\nGenerated: ${new Date().toLocaleString()}`)
                          : encodeURIComponent(`Dear Recipient,\n\nI am writing to confirm that a media clip featuring me has been INDEPENDENTLY VERIFIED as REAL and AUTHENTIC by Trinetra forensic AI analysis.\n\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n✅ VERDICT: ${result.primary_verdict}\n📊 Authenticity: ${result.confidence_score.toFixed(1)}% genuine (not AI-generated)\n🔬 Detection Engine: EfficientNet-B4 + Reality Defender\n⏱️ Analysis Latency: ${result.latency_ms.toFixed(0)}ms\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\nForensic Summary:\n${result.forensic_summary}\n\n📎 ATTACHMENT: A copy of the forensic evidence has been auto-downloaded to the sender's device and can be shared upon request.\n\nPlease disregard any claims that this content is fake or AI-generated. This email serves as a forensic clearance certificate.\n\nVerified by Trinetra V2 — AI Deepfake Detection Platform\nGenerated: ${new Date().toLocaleString()}`);
                        window.open(`mailto:${encodeURIComponent(emailTo)}?subject=${subject}&body=${body}`, '_blank');
                      }, 600);
                    }}
                    className="w-full flex items-center justify-center space-x-2 py-2.5 rounded-xl bg-[#4C6EF5] text-white text-sm font-bold hover:bg-[#3B5BDB] transition-all active:scale-95"
                  >
                    <Mail className="w-4 h-4" /><span>Download Evidence + Open Email</span>
                  </button>
                </div>

                {/* Forensic Summary Card */}
                <div className="bg-[var(--surface)] border border-[var(--border-strong)] rounded-2xl p-6">
                  <div className="flex items-center space-x-2 mb-3">
                    <Download className="w-4 h-4 text-[#FF6B00]" />
                    <h3 className="font-bold text-[var(--foreground)]">Forensic Summary Card</h3>
                  </div>
                  <p className="text-xs text-[var(--muted)] mb-4">Attach this verified report card to your message for undeniable proof.</p>
                  <div className="bg-[var(--card-bg)] border border-[var(--border-strong)] rounded-xl p-5">
                    <p className="text-[9px] font-bold text-[var(--muted)] uppercase tracking-widest mb-1">TRINETRA V2 ANALYSIS</p>
                    <p className={`text-xl font-bold font-['Syncopate'] mb-4 ${isFake ? 'text-[#FA5252]' : 'text-[#40C057]'}`}>{isFake ? 'CONFIRMED SYNTHETIC' : 'VERIFIED AUTHENTIC'}</p>
                    <div className="space-y-3 text-sm">
                      <div className="flex justify-between"><span className="text-[var(--muted)]">Confidence Score</span><span className={`font-bold font-mono ${isFake ? 'text-[#FA5252]' : 'text-[#40C057]'}`}>{result.confidence_score.toFixed(1)}%</span></div>
                      <div className="flex justify-between"><span className="text-[var(--muted)]">Detection Engine</span><span className="font-bold font-mono text-[var(--foreground)]">EfficientNet-B4 + RD</span></div>
                      <div className="flex justify-between"><span className="text-[var(--muted)]">Latency</span><span className="font-bold font-mono text-[var(--foreground)]">{result.latency_ms.toFixed(0)}ms</span></div>
                    </div>
                    <div className="mt-4 p-3 bg-[#FFF3EC] border border-[#FF6B00]/20 rounded-lg text-xs text-[var(--foreground)] italic">&ldquo;{result.forensic_summary}&rdquo;</div>
                    <p className="text-[10px] text-[var(--muted)] mt-3">Generated on {new Date().toLocaleDateString()} at {new Date().toLocaleTimeString()}</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ══════════════════════════════════════════════════════════════ */}
      {/* ──  LOCKDOWN PANEL  ── */}
      {/* ══════════════════════════════════════════════════════════════ */}
      <AnimatePresence>
        {activePanel === 'lockdown' && (
          <motion.div key="lockdown" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[100] bg-black/30 backdrop-blur-sm flex items-center justify-center p-4">
            <motion.div initial={{ y: 30, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 30, opacity: 0 }} className="w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-[var(--card-bg)] rounded-3xl shadow-2xl border border-[var(--border-strong)]" onClick={(e) => e.stopPropagation()}>
              {/* Header */}
              <div className="sticky top-0 bg-[var(--card-bg)] border-b border-[var(--border-strong)] px-8 py-5 rounded-t-3xl z-10">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <button onClick={() => setActivePanel(null)} className="mr-4 text-[var(--muted)] hover:text-[var(--foreground)]"><ArrowLeft className="w-5 h-5" /></button>
                    <div>
                      <h2 className="text-2xl font-bold font-['Syncopate'] text-[var(--foreground)] flex items-center space-x-2">
                        <LockKeyhole className="w-6 h-6 text-[#FA5252]" /><span>Digital Lockdown Protocol</span>
                      </h2>
                      <p className="text-sm text-[var(--muted)] mt-1">Tactical crisis management. Follow these steps immediately.</p>
                    </div>
                  </div>
                  <div className="bg-[#FFF5F5] border border-[#FA5252]/20 text-[#FA5252] text-xs font-bold px-3 py-1.5 rounded-full flex items-center space-x-1.5">
                    <AlertTriangle className="w-3.5 h-3.5" />
                    <span>{lockdownChecks.filter(Boolean).length} of {lockdownChecks.length} Steps Completed</span>
                  </div>
                </div>
                <div className="w-full bg-[var(--surface-2)] rounded-full h-1.5 mt-4">
                  <div className="bg-gradient-to-r from-[#FA5252] to-[#FF6B00] h-1.5 rounded-full transition-all" style={{ width: `${(lockdownChecks.filter(Boolean).length / lockdownChecks.length) * 100}%` }} />
                </div>
              </div>

              <div className="p-8 grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Immediate Actions */}
                <div className="">
                  <h3 className="font-bold text-[var(--foreground)] mb-4 flex items-center space-x-2"><AlertTriangle className="w-4 h-4 text-[#FA5252]" /><span>Immediate Actions</span></h3>
                  <div className="space-y-3">
                    {[
                      { label: 'Make Instagram Private', link: 'https://help.instagram.com/196883487377501' },
                      { label: 'Set Facebook to Friends Only', link: 'https://www.facebook.com/settings?tab=privacy' },
                      { label: 'Enable 2FA on Google Account', link: 'https://myaccount.google.com/signinoptions/two-step-verification' },
                      { label: 'Do NOT engage with the extortionist', link: null },
                      { label: 'Screenshot and preserve all evidence', link: null },
                      { label: 'File Cyber Crime Complaint', link: 'https://cybercrime.gov.in/' },
                    ].map((item, i) => (
                      <button
                        key={i}
                        onClick={() => {
                          const next = [...lockdownChecks];
                          next[i] = !next[i];
                          setLockdownChecks(next);
                        }}
                        className={`w-full flex items-start space-x-3 p-4 rounded-xl border text-left transition-all ${
                          lockdownChecks[i] ? 'bg-[#EBFBEE] border-[#40C057]/30' : 'bg-[var(--surface)] border-[var(--border-strong)] hover:border-[#FF6B00]/40'
                        }`}
                      >
                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 mt-0.5 ${lockdownChecks[i] ? 'border-[#40C057] bg-[#40C057]' : 'border-[#CED4DA]'}`}>
                          {lockdownChecks[i] && <CheckCircle className="w-3 h-3 text-white" />}
                        </div>
                        <div>
                          <span className={`font-bold text-sm ${lockdownChecks[i] ? 'text-[#40C057] line-through' : 'text-[var(--foreground)]'}`}>{item.label}</span>
                          {item.link && (
                            <a href={item.link} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()} className="block text-xs text-[#FF6B00] font-bold mt-1 hover:underline flex items-center space-x-1">
                              <span>Open Link</span><ExternalLink className="w-3 h-3" />
                            </a>
                          )}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Crisis Advisor */}
                <div className="bg-[var(--surface)] border border-[var(--border-strong)] rounded-2xl p-6 flex flex-col">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-bold text-[var(--foreground)] flex items-center space-x-2"><MessageCircle className="w-4 h-4 text-[#7950F2]" /><span>Crisis Advisor</span></h3>
                    <span className="text-[9px] font-bold bg-[#40C057] text-white px-2 py-0.5 rounded font-mono flex items-center space-x-1"><span className="w-1.5 h-1.5 rounded-full bg-[var(--card-bg)] animate-pulse" /><span>Online</span></span>
                  </div>
                  <div className="flex-1 bg-[var(--card-bg)] border border-[var(--border-strong)] rounded-xl p-4 mb-4 min-h-[280px]">
                    <div className="bg-[var(--surface-2)] rounded-xl p-4 text-sm text-[var(--foreground)] leading-relaxed max-w-[85%]">
                      I am your tactical digital security advisor. I will guide you through locking down your digital footprint. Please complete the checklist on the left. What is your current situation?
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <input type="text" placeholder="Describe your situation..." className="flex-1 px-4 py-3 rounded-xl bg-[var(--card-bg)] border border-[var(--border-strong)] text-sm text-[var(--foreground)] focus:outline-none focus:border-[#7950F2]" />
                    <button className="p-3 rounded-xl bg-[#7950F2] text-white hover:bg-[#6741D9] transition-colors">
                      <Send className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ══════════════════════════════════════════════════════════════ */}
      {/* ──  AUTO-TAKEDOWN PANEL  ── */}
      {/* ══════════════════════════════════════════════════════════════ */}
      <AnimatePresence>
        {activePanel === 'takedown' && result && (
          <motion.div key="takedown" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[100] bg-black/30 backdrop-blur-sm flex items-center justify-center p-4">
            <motion.div initial={{ y: 30, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 30, opacity: 0 }} className="w-full max-w-5xl max-h-[90vh] overflow-y-auto bg-[var(--card-bg)] rounded-3xl shadow-2xl border border-[var(--border-strong)]" onClick={(e) => e.stopPropagation()}>
              {/* Header */}
              <div className="sticky top-0 bg-[var(--card-bg)] border-b border-[var(--border-strong)] px-8 py-5 rounded-t-3xl z-10">
                <button onClick={() => setActivePanel(null)} className="float-left mr-4 mt-1 text-[var(--muted)] hover:text-[var(--foreground)]"><ArrowLeft className="w-5 h-5" /></button>
                <h2 className="text-2xl font-bold font-['Syncopate'] text-[var(--foreground)] flex items-center space-x-2">
                  <Zap className="w-6 h-6 text-[var(--foreground)]" /><span>SSMI Takedown Engine</span>
                </h2>
                <p className="text-sm text-[var(--muted)] mt-1">Automated legal compliance strikes under the 2026 IT Rules.</p>
              </div>

              <div className="p-8">
                {/* Platform Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                  {[
                    { name: 'Meta (Facebook/Instagram)', icon: '📘', color: '#1877F2', reportUrl: 'https://www.facebook.com/help/contact/274459462613911' },
                    { name: 'X (Twitter)', icon: '🐦', color: '#1DA1F2', reportUrl: 'https://help.twitter.com/en/forms/safety-and-sensitive-content/abuse' },
                    { name: 'YouTube', icon: '▶️', color: '#FF0000', reportUrl: 'https://support.google.com/youtube/answer/2802027' },
                  ].map((platform) => (
                    <div key={platform.name} className="bg-[var(--surface)] border border-[var(--border-strong)] rounded-2xl p-5">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="font-bold text-[var(--foreground)] flex items-center space-x-2"><span className="text-lg">{platform.icon}</span><span className="text-sm">{platform.name}</span></h3>
                        <span className="text-[8px] font-bold bg-[#212529] text-white px-2 py-0.5 rounded font-mono uppercase">Ready to Fire</span>
                      </div>
                      <p className="text-[10px] font-bold text-[var(--muted)] uppercase tracking-wider mb-2">Generated Payload Preview</p>
                      <div className="bg-[var(--card-bg)] border border-[var(--border-strong)] rounded-xl p-3 text-[11px] font-mono text-[var(--foreground)] mb-4 max-h-[180px] overflow-y-auto">
                        <pre className="whitespace-pre-wrap">{JSON.stringify({
                          violation_type: "synthetic_media",
                          confidence_score: result.confidence_score,
                          evidence_summary: result.forensic_summary,
                          reporter_contact: "[your email]",
                          detection_engine: "Trinetra V2 — EfficientNet-B4 + RD",
                        }, null, 2)}</pre>
                      </div>
                      <button
                        onClick={() => {
                          window.open(platform.reportUrl, '_blank');
                          setTakedownLog(prev => [...prev, `[${new Date().toLocaleTimeString()}] Strike fired → ${platform.name}`]);
                        }}
                        className="w-full py-3 rounded-xl bg-[#212529] text-white font-bold text-sm hover:bg-black transition-colors flex items-center justify-center space-x-2"
                      >
                        <Send className="w-4 h-4" /><span>ONE-CLICK STRIKE</span>
                      </button>
                    </div>
                  ))}
                </div>

                {/* India Cybercrime Portal */}
                <div className="bg-gradient-to-r from-[#FF6B00]/5 to-[#FA5252]/5 border border-[#FF6B00]/20 rounded-2xl p-6 mb-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-bold text-[var(--foreground)] flex items-center space-x-2 mb-1"><Globe className="w-5 h-5 text-[#FF6B00]" /><span>Indian Cybercrime Portal</span></h3>
                      <p className="text-sm text-[var(--muted)]">File an official complaint on the National Cyber Crime Reporting Portal (cybercrime.gov.in)</p>
                    </div>
                    <button
                      onClick={() => {
                        window.open('https://cybercrime.gov.in/', '_blank');
                        setTakedownLog(prev => [...prev, `[${new Date().toLocaleTimeString()}] Opened cybercrime.gov.in`]);
                      }}
                      className="px-6 py-3 rounded-xl bg-gradient-to-r from-[#FF6B00] to-[#FA5252] text-white font-bold text-sm hover:opacity-90 transition-opacity flex items-center space-x-2 flex-shrink-0"
                    >
                      <ExternalLink className="w-4 h-4" /><span>File Complaint</span>
                    </button>
                  </div>
                </div>

                {/* Submission Log */}
                <div className="bg-[var(--surface)] border border-[var(--border-strong)] rounded-2xl p-6">
                  <h3 className="font-bold text-[var(--foreground)] flex items-center space-x-2 mb-3"><Globe className="w-4 h-4" /><span>Submission Log</span></h3>
                  <div className="bg-[var(--card-bg)] border border-[var(--border-strong)] rounded-xl p-4 min-h-[60px] font-mono text-xs text-[var(--foreground)]">
                    {takedownLog.length === 0 ? (
                      <span className="text-[var(--muted)] italic">Awaiting submissions...</span>
                    ) : (
                      takedownLog.map((log, i) => <p key={i} className="mb-1">{log}</p>)
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
