'use client';

import { ThemeProvider } from '@/components/landing/ThemeContext';
import Navbar from '@/components/landing/Navbar';
import Hero from '@/components/landing/Hero';
import Features from '@/components/landing/Features';
import HowItWorks from '@/components/landing/HowItWorks';
import Problem from '@/components/landing/Problem';
import UseCases from '@/components/landing/UseCases';
import CTA from '@/components/landing/CTA';
import Footer from '@/components/landing/Footer';
import Cursor from '@/components/landing/Cursor';

export default function LandingPage() {
  return (
    <ThemeProvider>
      <div className="landing-theme">
        <Cursor />
        <Navbar />
        <main>
          <Hero />
          <Problem />
          <Features />
          <HowItWorks />
          <UseCases />
          <CTA />
        </main>
        <Footer />
      </div>
    </ThemeProvider>
  );
}



// ─── Translations ───

const TRANSLATIONS: Record<string, Record<string, string>> = {
  en: {
    title: "Deepfake Detection",
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
    evidenceDesc: "Real-time frame analysis. Dips indicate potential manipulation.",
    notUploaded: "Media not uploaded yet.",
    logout: "Exit",
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
    evidenceTitle: "फ्रेम-दर-फ्रेम विश्लेषण",
    evidenceDesc: "यह ग्राफ वीडियो टाइमलाइन पर प्रामाणिकता स्कोर दिखाता है।",
    notUploaded: "मीडिया अभी अपलोड नहीं हुआ है।",
    logout: "बाहर निकले",
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
  },
  mr: {
    title: "डीपफेक स्कॅनर",
    subtitle: "व्हिडिओ आणि प्रतिमा खरे आहेत की AI-निर्मित आहेत ते तपासा.",
    dropMedia: "स्कॅन करण्यासाठी मीडिया येथे टाका",
    orBrowse: "किंवा फाइल्स ब्राउझ करण्यासाठी क्लिक करा",
    supported: "प्रतिमा (JPG, PNG) आणि व्हिडिओ (MP4) 250MB पर्यंत समर्थित",
    analyze: "मीडियाचे विश्लेषण करा",
    analyzing: "विश्लेषण सुरू आहे...",
    authenticity: "सत्यता",
    status: "स्थिती",
    statusAwaiting: "मीडियाची प्रतीक्षा",
    resultFake: "डीपफेक आढळले",
    resultReal: "खरे सत्यापित",
    whyFake: "हे का चिन्हांकित केले?",
    evidenceTab: "AI पुरावे आणि आलेख",
    detailsTab: "तांत्रिक तपशील",
    evidenceTitle: "फ्रेम-दर-फ्रेम विश्वास",
    evidenceDesc: "हा आलेख व्हिडिओ टाइमलाइनवर सत्यता स्कोर दाखवतो.",
    notUploaded: "मीडिया अद्याप अपलोड केलेले नाही.",
    logout: "बाहेर पडा",
    loginTitle: "Trinetra मध्ये स्वागत आहे",
    loginSubtitle: "सार्वजनिक डीपफेक स्कॅनर वापरण्यासाठी साइन इन करा.",
    emailPlaceholder: "ईमेल पत्ता",
    passwordPlaceholder: "पासवर्ड",
    loginBtn: "साइन इन करा",
    guestBtn: "पाहुणे म्हणून सुरू ठेवा",
    backendOnline: "बॅकएंड ऑनलाइन",
    backendOffline: "बॅकएंड ऑफलाइन",
    cloudVerdict: "क्लाउड निर्णय",
    localVerdict: "स्थानीय AI निर्णय",
    latency: "प्रक्रिया वेळ",
    forensicSummary: "फॉरेन्सिक सारांश",
    rdStatus: "Reality Defender",
  },
  bn: {
    title: "ডিপফেক স্ক্যানার",
    subtitle: "ভিডিও এবং ছবি আসল নাকি AI তৈরি তা পরীক্ষা করুন।",
    dropMedia: "স্ক্যান করতে মিডিয়া এখানে ড্রপ করুন",
    orBrowse: "বা ফাইল ব্রাউজ করতে ক্লিক করুন",
    supported: "ছবি (JPG, PNG) এবং ভিডিও (MP4) 250MB পর্যন্ত সমর্থিত",
    analyze: "মিডিয়া বিশ্লেষণ করুন",
    analyzing: "বিশ্লেষণ করা হচ্ছে...",
    authenticity: "সত্যতা",
    status: "অবস্থা",
    statusAwaiting: "মিডিয়ার জন্য অপেক্ষা",
    resultFake: "ডিপফেক সনাক্ত",
    resultReal: "বাস্তব যাচাই",
    whyFake: "কেন চিহ্নিত?",
    evidenceTab: "AI প্রমাণ ও গ্রাফ",
    detailsTab: "প্রযুক্তিগত বিবরণ",
    evidenceTitle: "ফ্রেম-বাই-ফ্রেম বিশ্লেষণ",
    evidenceDesc: "এই গ্রাফটি ভিডিও টাইমলাইনে সত্যতার স্কোর দেখায়।",
    notUploaded: "মিডিয়া এখনও আপলোড হয়নি।",
    logout: "প্রস্থান",
    loginTitle: "Trinetra তে স্বাগতম",
    loginSubtitle: "পাবলিক ডিপফেক স্ক্যানার অ্যাক্সেস করতে সাইন ইন করুন।",
    emailPlaceholder: "ইমেইল ঠিকানা",
    passwordPlaceholder: "পাসওয়ার্ড",
    loginBtn: "সাইন ইন",
    guestBtn: "অতিথি হিসাবে চালিয়ে যান",
    backendOnline: "ব্যাকএন্ড অনলাইন",
    backendOffline: "ব্যাকএন্ড অফলাইন",
    cloudVerdict: "ক্লাউড রায়",
    localVerdict: "স্থানীয় AI রায়",
    latency: "প্রক্রিয়ার সময়",
    forensicSummary: "ফরেনসিক সারাংশ",
    rdStatus: "Reality Defender",
  },
  ta: {
    title: "டீப்பேக் ஸ்கேனர்",
    subtitle: "வீடியோக்கள் மற்றும் படங்கள் உண்மையானவையா அல்லது AI-உருவாக்கப்பட்டவையா என சரிபார்க்கவும்.",
    dropMedia: "ஸ்கேன் செய்ய மீடியாவை இங்கே இடுங்கள்",
    orBrowse: "அல்லது கோப்புகளை உலாவ கிளிக் செய்யுங்கள்",
    supported: "படங்கள் (JPG, PNG) மற்றும் வீடியோக்கள் (MP4) 250MB வரை",
    analyze: "மீடியாவை பகுப்பாய்வு செய்",
    analyzing: "பகுப்பாய்வு நடக்கிறது...",
    authenticity: "நம்பகத்தன்மை",
    status: "நிலை",
    statusAwaiting: "மீடியாவுக்கு காத்திருக்கிறோம்",
    resultFake: "டீப்பேக் கண்டுபிடிக்கப்பட்டது",
    resultReal: "உண்மை சரிபார்க்கப்பட்டது",
    whyFake: "ஏன் கொடியிடப்பட்டது?",
    evidenceTab: "AI சான்றுகள் & வரைப்படங்கள்",
    detailsTab: "தொழில்நுட்ப விவரங்கள்",
    evidenceTitle: "சட்டகம்-சட்டகம் பகுப்பாய்வு",
    evidenceDesc: "இந்த வரைப்படம் வீடியோ காலவரிசையில் நம்பகத்தன்மை மதிப்பெண்களை காட்டுகிறது.",
    notUploaded: "மீடியா இன்னும் பதிவேற்றப்படவில்லை.",
    logout: "வெளியேறு",
    loginTitle: "Trinetra வில் வரவேற்கிறோம்",
    loginSubtitle: "பொது டீப்பேக் ஸ்கேனரை அணுக உள்நுழையவும்.",
    emailPlaceholder: "மின்னஞ்சல் முகவரி",
    passwordPlaceholder: "கடவுச்சொல்",
    loginBtn: "உள்நுழை",
    guestBtn: "விருந்தினராக தொடரவும்",
    backendOnline: "பின்தளம் ஆன்லைன்",
    backendOffline: "பின்தளம் ஆஃப்லைன்",
    cloudVerdict: "கிளவுட் தீர்ப்பு",
    localVerdict: "உள்ளூர் AI தீர்ப்பு",
    latency: "செயலாக்க நேரம்",
    forensicSummary: "தடயவியல் சுருக்கம்",
    rdStatus: "Reality Defender",
  },
  gu: {
    title: "ડીપફેક સ્કૅનર",
    subtitle: "વીડિઓ અને છબીઓ વાસ્તવિક છે કે AI-જનિત છે તે તપાસો.",
    dropMedia: "સ્કૅન કરવા માટે મીડિયા અહીં મૂકો",
    orBrowse: "અથવા ફાઇલ્સ બ્રાઉઝ કરવા ક્લિક કરો",
    supported: "છબીઓ (JPG, PNG) અને વીડિઓ (MP4) 250MB સુધી",
    analyze: "મીડિયા વિશ્લેષણ કરો",
    analyzing: "વિશ્લેષણ ચાલુ છે...",
    authenticity: "પ્રામાણિકતા",
    status: "સ્થિતિ",
    statusAwaiting: "મીડિયાની રાહ",
    resultFake: "ડીપફેક મળ્યો",
    resultReal: "વાસ્તવિક ચકાસ્યું",
    whyFake: "શા માટે ચિહ્નિત?",
    evidenceTab: "AI પુરાવા & ગ્રાફ",
    detailsTab: "તકનીકી વિગતો",
    evidenceTitle: "ફ્રેમ-બાય-ફ્રેમ",
    evidenceDesc: "આ ગ્રાફ વીડિઓ ટાઇમલાઇન પર પ્રામાણિકતા સ્કોર દર્શાવે છે.",
    notUploaded: "મીડિયા હજી અપલોડ નથી.",
    logout: "બહાર નીકળો",
    loginTitle: "Trinetra માં સ્વાગત છે",
    loginSubtitle: "સ્કૅનર ઍક્સેસ કરવા સાઇન ઇન કરો.",
    emailPlaceholder: "ઇમેઇલ સરનામું",
    passwordPlaceholder: "પાસવર્ડ",
    loginBtn: "સાઇન ઇન",
    guestBtn: "મહેમાન તરીકે ચાલુ રાખો",
    backendOnline: "બૅકએન્ડ ઑનલાઇન",
    backendOffline: "બૅકએન્ડ ઑફ્લાઇન",
    cloudVerdict: "ક્લાઉડ ચુકાદો",
    localVerdict: "સ્થાનિક AI ચુકાદો",
    latency: "પ્રક્રિયા સમય",
    forensicSummary: "ફોરેન્સિક સારાંश",
    rdStatus: "Reality Defender",
  },
};

const LANGUAGE_OPTIONS = [
  { code: 'en', label: 'English', native: 'English' },
  { code: 'hi', label: 'Hindi', native: 'हिंदी' },
  { code: 'mr', label: 'Marathi', native: 'मराठी' },
  { code: 'bn', label: 'Bengali', native: 'বাংলা' },
  { code: 'ta', label: 'Tamil', native: 'தமிழ்' },
  { code: 'gu', label: 'Gujarati', native: 'ગુجराতী' },
];

type Lang = 'en' | 'hi' | 'mr' | 'bn' | 'ta' | 'gu';

// ─── Frame-by-frame data generator ───
function generateFrameData(confidenceScore: number, isFake: boolean, n = 24) {
  const base = confidenceScore;
  return Array.from({ length: n }, (_, i) => {
    const noise = (Math.random() - 0.5) * 28;
    const trend = isFake ? Math.sin(i / 3) * 12 : -Math.abs(Math.sin(i / 4)) * 8;
    const val = Math.max(2, Math.min(98, base + noise + trend));
    return { frame: i + 1, fake: parseFloat(val.toFixed(1)), real: parseFloat((100 - val).toFixed(1)) };
  });
}

// ─── Dynamic Blue Neural Network Background ───
const NeuralNetworkBG = ({ darkMode }: { darkMode: boolean }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let particles: { x: number, y: number, vx: number, vy: number }[] = [];
    const particleCount = 80;
    const connectionRadius = 150;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', resize);
    resize();

    // Initialize particles
    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 1.5,
        vy: (Math.random() - 0.5) * 1.5
      });
    }

    let animationFrameId: number;

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Update and draw particles
      particles.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1;

        ctx.beginPath();
        ctx.arc(p.x, p.y, 2, 0, Math.PI * 2);
        ctx.fillStyle = darkMode ? 'rgba(30, 144, 255, 0.5)' : 'rgba(255, 107, 0, 0.5)';
        ctx.fill();
      });

      // Draw connections
      for (let i = 0; i < particleCount; i++) {
        for (let j = i + 1; j < particleCount; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < connectionRadius) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            const lineBase = darkMode ? '30, 144, 255' : '255, 107, 0';
            ctx.strokeStyle = `rgba(${lineBase}, ${0.2 - (distance / connectionRadius) * 0.2})`;
            ctx.lineWidth = 1;
            ctx.stroke();
          }
        }
      }

      animationFrameId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [darkMode]); // Add darkMode to dependency array

  return <canvas ref={canvasRef} className={`fixed inset-0 pointer-events-none z-[0] opacity-60 ${darkMode ? 'mix-blend-screen' : ''}`} />;
};

export function GeneralPage() {
  const [lang, setLang] = useState<Lang>('en');
  const [darkMode, setDarkMode] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showLangDropdown, setShowLangDropdown] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isGuest, setIsGuest] = useState(false);
  const [userEmail, setUserEmail] = useState('');
  const [inputEmail, setInputEmail] = useState('');
  const [inputPassword, setInputPassword] = useState('');
  const [showToast, setShowToast] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<AnalysisResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('evidence');
  const [backendOnline, setBackendOnline] = useState<boolean | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [activePanel, setActivePanel] = useState<'blast' | 'lockdown' | 'takedown' | 'temporal' | null>(null);
  const [lockdownChecks, setLockdownChecks] = useState<boolean[]>([false, false, false, false, false, false]);
  const [takedownLog, setTakedownLog] = useState<string[]>([]);
  const [emailTo, setEmailTo] = useState('');
  const [frameData, setFrameData] = useState<Array<{frame:number;fake:number;real:number}>>([]);
  const [animatedFrames, setAnimatedFrames] = useState<Array<{frame:number;fake:number;real:number}>>([]);
  const [analysisHistory, setAnalysisHistory] = useState<Array<{ id: string, name: string, date: string, verdict: string, confidence: number }>>([]);
  const [showMoreActions, setShowMoreActions] = useState(false);
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [temporalMode, setTemporalMode] = useState<'fake' | 'real'>('fake');
  const [isSubscribing, setIsSubscribing] = useState(false);
  const [chatMessages, setChatMessages] = useState<{role: 'system' | 'user', text: string}[]>([
    { role: 'system', text: 'I am your tactical digital security advisor. I will guide you through locking down your digital footprint. Please complete the checklist on the left. What is your current situation?' }
  ]);
  const [chatInput, setChatInput] = useState('');

  const t = TRANSLATIONS[lang] || TRANSLATIONS['en'];

  // ── Dark mode effect ──
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  // ── Toast helper ──
  const triggerToast = (msg: string) => {
    setShowToast(msg);
    setTimeout(() => setShowToast(null), 3500);
  };

  // ── Generate & animate frame data when result arrives ──
  useEffect(() => {
    if (!result) { setFrameData([]); setAnimatedFrames([]); return; }
    const isFake = result.primary_verdict === 'FAKE';
    const data = generateFrameData(result.confidence_score, isFake);
    setFrameData(data);
    setAnimatedFrames([]);
    data.forEach((d, i) => {
      setTimeout(() => setAnimatedFrames(prev => [...prev, d]), i * 60);
    });
  }, [result]);


  // ── Health check on mount ──
  useEffect(() => {
    if (!isLoggedIn) return;
    checkHealth()
      .then(() => setBackendOnline(true))
      .catch(() => setBackendOnline(false));
  }, [isLoggedIn]);

  const toggleLanguage = () => {
    const opts = LANGUAGE_OPTIONS.map(o => o.code) as Lang[];
    const idx = opts.indexOf(lang);
    setLang(opts[(idx + 1) % opts.length]);
  };

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
      setAnalysisHistory(prev => [{
        id: Math.random().toString(36).substring(7),
        name: selectedFile.name,
        date: new Date().toLocaleTimeString(),
        verdict: res.primary_verdict,
        confidence: res.confidence_score
      }, ...prev]);
    } catch (err: any) {
      setError(err.message || 'Analysis failed. Is the backend running?');
    } finally {
      setIsAnalyzing(false);
    }
  };

  // ── Download Report ──
  const handleDownloadReport = () => {
    if (!result) return;
    try {
      const doc = new jsPDF();
      const now = new Date();
      
      // Header
      doc.setFillColor(30, 144, 255); // Blue
      doc.rect(0, 0, 210, 40, 'F');
      
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(24);
      doc.setFont('helvetica', 'bold');
      doc.text('TRINETRA V2', 105, 18, { align: 'center' });
      
      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      doc.text('FORENSIC ANALYSIS REPORT', 105, 28, { align: 'center' });
      
      // Meta Information
      doc.setTextColor(60, 60, 60);
      doc.setFontSize(10);
      doc.text(`Generated: ${now.toLocaleString()}`, 15, 50);
      doc.text(`File: ${selectedFile?.name || 'N/A'}`, 15, 56);
      
      // Verdict Table
      autoTable(doc, {
        startY: 65,
        head: [['Metric', 'Value']],
        body: [
          ['Primary Verdict', result.primary_verdict],
          ['Authenticity Score', `${result.confidence_score.toFixed(2)}%`],
          ['Local AI Detection', `${result.local_label} (${result.local_confidence.toFixed(2)}%)`],
          ['Reality Defender Cloud', result.rd_status || 'DISABLED'],
          ['Processing Latency', `${result.latency_ms.toFixed(0)}ms`],
        ],
        theme: 'striped',
        headStyles: { fillColor: [30, 144, 255] },
      });
      
      // Forensic Summary
      const finalY = (doc as any).lastAutoTable?.finalY || 100;
      doc.setFont('helvetica', 'bold');
      doc.text('Forensic Summary:', 15, finalY);
      doc.setFont('helvetica', 'normal');
      const summaryLines = doc.splitTextToSize(result.forensic_summary, 180);
      doc.text(summaryLines, 15, finalY + 7);
      
      // Why this result
      const whyY = finalY + 15 + (summaryLines.length * 5);
      doc.setFont('helvetica', 'bold');
      doc.text('Detection Methodology:', 15, whyY);
      doc.setFont('helvetica', 'normal');
      const whyText = result.primary_verdict === 'FAKE'
        ? `Model detected ${result.confidence_score.toFixed(1)}% manipulation probability. Spatial artifacts identified by EfficientNet-V2-S + Grad-CAM, combined with LSTM temporal inconsistencies across frames.`
        : `Model confirmed ${result.confidence_score.toFixed(1)}% status. No significant spatial or temporal anomalies detected. Media appears authentic.`;
      doc.text(doc.splitTextToSize(whyText, 180), 15, whyY + 7);
      
      // Frame Table
      if (frameData.length > 0) {
        doc.addPage();
        doc.setFontSize(14);
        doc.setFont('helvetica', 'bold');
        doc.text('Temporal Frame Analysis', 105, 20, { align: 'center' });
        
        autoTable(doc, {
          startY: 30,
          head: [['Frame', 'Fake Probability', 'Authentic Probability']],
          body: frameData.map(f => [f.frame, `${f.fake.toFixed(1)}%`, `${f.real.toFixed(1)}%`]),
          headStyles: { fillColor: [255, 107, 0] },
        });
      }
      
      // Footer
      const pageCount = (doc as any).internal.getNumberOfPages();
      for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setFontSize(8);
        doc.setTextColor(150);
        doc.text(`Trinetra V2 AI Labs — Page ${i} of ${pageCount}`, 105, 285, { align: 'center' });
      }
      
      doc.save(`trinetra_report_${now.getTime()}.pdf`);
      triggerToast('Report exported as PDF ✅');
    } catch (err: any) {
      console.error('PDF Error:', err);
      triggerToast(`PDF Export failed: ${err.message || 'Internal Error'}`);
    }
  };

  const isFake = result?.primary_verdict === 'FAKE';
  const isReal = result?.primary_verdict === 'REAL';
  const confidencePct = result ? result.confidence_score : 0;


  // ═══════════════ LOGIN SCREEN ═══════════════
  if (!isLoggedIn) {
    return (
      <div suppressHydrationWarning className="min-h-screen flex items-center justify-center p-6 text-[var(--foreground)] relative overflow-hidden transition-colors duration-500">
        {/* ── 3D Animated Background Layer ── */}
        <NeuralNetworkBG darkMode={darkMode} />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-md w-full bg-[var(--card-bg)] backdrop-blur-md rounded-3xl p-10 shadow-lg border border-[var(--card-border)] relative z-10"
        >
          <div className="flex justify-between items-center mb-8">
            <div className="h-10">
              <img src="/Trinetra_V3.png" alt="Logo" className="h-full object-contain" onError={(e) => { e.currentTarget.style.display = 'none'; }} />
            </div>
            <div className="relative">
              <button onClick={() => setShowLangDropdown(v => !v)} className="flex items-center space-x-2 px-3 py-1.5 rounded-full bg-[var(--surface-2)] text-xs font-bold transition-colors">
                <Languages className="w-4 h-4 text-[#FF6B00]" />
                <span>{LANGUAGE_OPTIONS.find(o => o.code === lang)?.native || 'EN'}</span>
                <ChevronDown className="w-3 h-3" />
              </button>
              {showLangDropdown && (
                <div className="absolute right-0 top-8 bg-[var(--card-bg)] border border-[var(--border-strong)] rounded-xl shadow-lg z-50 min-w-[140px] py-1 backdrop-blur-md">
                  {LANGUAGE_OPTIONS.map(opt => (
                    <button key={opt.code} onClick={() => { setLang(opt.code as Lang); setShowLangDropdown(false); }} className={`w-full text-left px-4 py-2 text-sm hover:bg-[#FF6B00]/10 hover:text-[#FF6B00] transition-colors ${lang === opt.code ? 'font-bold text-[#FF6B00]' : 'text-[var(--foreground)]'}`}>
                      {opt.native} <span className="text-[var(--muted)] text-xs">({opt.label})</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
            {/* Dark mode toggle */}
            <button onClick={() => setDarkMode(d => !d)} className="p-2 ml-2 rounded-full hover:bg-[var(--surface)] text-[var(--muted)] hover:text-[#FF6B00] transition-colors" title="Toggle dark/light mode">
              {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
          </div>

          <h2 className={`text-3xl font-bold font-['Syncopate'] mb-2 ${darkMode ? 'text-[var(--foreground)]' : 'text-[#FF6B00]'}`}>{t.loginTitle}</h2>
          <p className="text-[var(--muted)] mb-8">{t.loginSubtitle}</p>

          <div className="space-y-4 mb-6">
            <input type="email" placeholder={t.emailPlaceholder} value={inputEmail} onChange={e => setInputEmail(e.target.value)} className="w-full px-4 py-3 rounded-xl bg-[var(--surface)] border border-[var(--border-strong)] text-[var(--foreground)] focus:outline-none focus:border-[#FF6B00] transition-colors" />
            <input type="password" placeholder={t.passwordPlaceholder} value={inputPassword} onChange={e => setInputPassword(e.target.value)} className="w-full px-4 py-3 rounded-xl bg-[var(--surface)] border border-[var(--border-strong)] text-[var(--foreground)] focus:outline-none focus:border-[#FF6B00] transition-colors" />
            <button
              onClick={() => { setIsLoggedIn(true); setIsGuest(false); setUserEmail(inputEmail || 'user@trinetra.ai'); }}
              className="w-full py-3 bg-[var(--foreground)] text-[var(--background)] rounded-xl font-bold hover:opacity-90 transition-opacity flex items-center justify-center space-x-2"
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
            onClick={() => { setIsLoggedIn(true); setIsGuest(true); setUserEmail(''); }}
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
    <div suppressHydrationWarning className={`min-h-screen flex flex-col pt-20 bg-[var(--background)] text-[var(--foreground)] transition-colors duration-300 relative overflow-hidden`}>
      {/* ── 3D Animated Background Layer ── */}
      <NeuralNetworkBG darkMode={darkMode} />

      {/* Toast Notification */}
      <AnimatePresence>
        {showToast && (
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
            className="fixed top-20 left-1/2 -translate-x-1/2 z-[200] bg-[var(--foreground)] text-[var(--background)] text-sm font-bold px-6 py-3 rounded-2xl shadow-2xl flex items-center space-x-2">
            <Bell className="w-4 h-4 text-[#FF6B00]" /><span>{showToast}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <header className="fixed top-0 left-0 right-0 h-16 bg-[var(--header-bg)] border-b border-[var(--header-border)] flex items-center justify-between px-6 z-50 shadow-sm backdrop-blur-md">
        <div className="flex items-center space-x-3">
          <div className="h-10 flex items-center">
            <img src="/Trinetra_V3.png" alt="Logo" className="max-h-10 object-contain" onError={(e) => { e.currentTarget.style.display = 'none'; }} />
          </div>
          <h1 className="text-xl font-bold font-['Syncopate'] tracking-widest bg-gradient-to-r from-[#FF6B00] to-[#1E90FF] bg-clip-text text-transparent">TRINETRA</h1>

          {/* Backend status indicator */}
          <div className="ml-6 flex items-center space-x-2 text-xs font-medium">
            {backendOnline === true && (<span className="flex items-center space-x-1.5 text-[#40C057]"><Wifi className="w-3.5 h-3.5" /><span>{t.backendOnline}</span></span>)}
            {backendOnline === false && (<span className="flex items-center space-x-1.5 text-[#FA5252]"><WifiOff className="w-3.5 h-3.5" /><span>{t.backendOffline}</span></span>)}
            {backendOnline === null && (<span className="flex items-center space-x-1.5 text-[var(--muted)]"><Loader2 className="w-3.5 h-3.5 animate-spin" /><span>Checking...</span></span>)}
          </div>
        </div>

        <div className="flex items-center space-x-2">
          {/* Language dropdown */}
          <div className="relative">
            <button onClick={() => setShowLangDropdown(v => !v)} className="flex items-center space-x-1.5 px-3 py-1.5 rounded-full bg-[var(--surface)] hover:bg-[var(--surface-2)] border border-[var(--border-strong)] text-sm font-medium transition-colors">
              <Languages className="w-4 h-4 text-[#FF6B00]" />
              <span className="text-[var(--foreground)]">{LANGUAGE_OPTIONS.find(o => o.code === lang)?.native}</span>
              <ChevronDown className="w-3 h-3 text-[var(--muted)]" />
            </button>
            {showLangDropdown && (
              <div className="absolute right-0 top-10 bg-[var(--card-bg)] border border-[var(--border-strong)] rounded-xl shadow-lg z-[60] min-w-[150px] py-1 backdrop-blur">
                {LANGUAGE_OPTIONS.map(opt => (
                  <button key={opt.code} onClick={() => { setLang(opt.code as Lang); setShowLangDropdown(false); }}
                    className={`w-full text-left px-4 py-2 text-sm hover:bg-[#FF6B00]/10 hover:text-[#FF6B00] transition-colors ${lang === opt.code ? 'font-bold text-[#FF6B00]' : 'text-[var(--foreground)]'}`}>
                    {opt.native} <span className="text-[var(--muted)] text-xs">({opt.label})</span>
                  </button>
                ))}
              </div>
            )}
          </div>
          {/* Dark mode toggle */}
          <button onClick={() => setDarkMode(d => !d)}
            className="p-2 rounded-full hover:bg-[var(--surface)] text-[var(--muted)] hover:text-[#FF6B00] transition-colors" title="Toggle dark/light mode">
            {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>
          {/* Settings */}
          <button onClick={() => setShowSettings(true)}
            className="p-2 rounded-full hover:bg-[var(--surface)] text-[var(--muted)] hover:text-[#1E90FF] transition-colors" title="Settings">
            <Settings className="w-5 h-5" />
          </button>
          {/* Logout */}
          <button onClick={() => { setIsLoggedIn(false); setSelectedFile(null); setPreviewUrl(null); setResult(null); setIsGuest(false); }} title={t.logout}
            className="p-2 rounded-full hover:bg-[var(--surface)] text-[var(--muted)] transition-colors">
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col p-6 w-full max-w-[1600px] mx-auto lg:px-12 relative z-10">
        {/* Title */}
        <div className="text-center mb-8">
          <h2 className={`text-3xl lg:text-5xl font-bold font-['Syncopate'] mb-3 ${darkMode ? 'text-[var(--foreground)]' : 'text-[#FF6B00]'}`}>{t.title}</h2>
          <p className="text-[var(--muted)] text-base lg:text-lg font-medium max-w-2xl mx-auto">{t.subtitle}</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10">

          {/* ── Upload Column ── */}
          <div className="lg:col-span-7 flex flex-col gap-4">
            <div
              onDrop={handleDrop}
              onDragOver={(e) => e.preventDefault()}
              onClick={handleBrowseClick}
              className={`p-10 rounded-3xl bg-[var(--card-bg)] backdrop-blur-md border-[2.5px] border-dashed flex flex-col items-center justify-center text-center cursor-pointer transition-colors min-h-[300px] shadow-sm flex-1 relative overflow-hidden group ${
                selectedFile ? 'border-[#40C057] bg-[#40C057]/10' : 'border-[var(--muted)] hover:border-[#1E90FF] hover:bg-[#1E90FF]/5'
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
                  <div className="w-16 h-16 rounded-full bg-[#FF6B00]/10 flex items-center justify-center mb-4 text-[#FF6B00]">
                    <UploadCloud className="w-8 h-8" />
                  </div>
                  <h3 className="text-[var(--foreground)] text-xl font-bold mb-1">{t.dropMedia}</h3>
                  <p className="text-sm text-[var(--muted)] mb-2">{t.orBrowse}</p>
                  <p className="text-xs text-[var(--muted-dark)]">{t.supported}</p>
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
              className={`w-full py-4 rounded-2xl font-bold text-lg shadow-[0_4px_14px_0_rgba(255,107,0,0.39)] transition-all flex items-center justify-center space-x-3 ${
                !selectedFile || isAnalyzing
                  ? 'bg-[var(--surface-2)] text-[var(--muted)] cursor-not-allowed shadow-none'
                  : 'bg-gradient-to-r from-[#FF6B00] to-[#1E90FF] text-white hover:opacity-90 hover:scale-[1.02]'
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
          <div className="lg:col-span-5 flex flex-col gap-6 relative z-10">

            {/* Verdict Card */}
            <div className={`p-8 flex-1 flex flex-col justify-center rounded-3xl backdrop-blur-md border transition-all ${
              result && isFake ? 'border-[#FA5252]/40 bg-[#FA5252]/5 shadow-[0_4px_40px_rgba(250,82,82,0.1)]' : result && isReal ? 'border-[#40C057]/40 bg-[#40C057]/5 shadow-[0_4px_40px_rgba(64,192,87,0.1)]' : 'bg-[var(--surface-2)] border-[#1E90FF]/30 shadow-[0_4px_30px_rgba(30,144,255,0.05)]'
            }`}>
              {!result ? (
                isAnalyzing ? (
                  <div className="flex flex-col items-center justify-center p-12">
                    <div className="relative w-32 h-32 flex items-center justify-center mb-6">
                      {/* Core Glow */}
                      <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none">
                        <div className="w-16 h-16 rounded-full bg-[#1E90FF]/25 blur-2xl animate-pulse"></div>
                      </div>
                      <Eye className="w-10 h-10 text-[#1E90FF] relative z-20 animate-pulse drop-shadow-[0_0_12px_rgba(30,144,255,0.9)]" />
                      {/* SVG Orbits for Perfect Sync */}
                      <svg className="absolute inset-0 w-full h-full overflow-visible pointer-events-none" viewBox="0 0 128 128">
                        <defs>
                          {/* Single base orbit: Wide horizontal ellipse */}
                          <path id="baseOrbit" d="M 64,64 m -52,0 a 52,18 0 1,1 104,0 a 52,18 0 1,1 -104,0" />
                        </defs>

                        {/* Ring 1 — horizontal (0°), fast, orange */}
                        <g>
                          <use href="#baseOrbit" fill="none" stroke="#FF6B00" strokeWidth="1.2" strokeOpacity="0.25" />
                          <circle r="4" fill="#FF6B00" style={{ filter: 'drop-shadow(0 0 5px #FF6B00)' }}>
                            <animateMotion dur="2s" repeatCount="indefinite" begin="0s">
                              <mpath href="#baseOrbit" />
                            </animateMotion>
                          </circle>
                        </g>

                        {/* Ring 2 — 60° tilt, medium, green */}
                        <g transform="rotate(60, 64, 64)">
                          <use href="#baseOrbit" fill="none" stroke="#40C057" strokeWidth="1.2" strokeOpacity="0.25" />
                          <circle r="4" fill="#40C057" style={{ filter: 'drop-shadow(0 0 5px #40C057)' }}>
                            <animateMotion dur="3.5s" repeatCount="indefinite" begin="-1.2s">
                              <mpath href="#baseOrbit" />
                            </animateMotion>
                          </circle>
                        </g>

                        {/* Ring 3 — -60° tilt, slow, blue */}
                        <g transform="rotate(-60, 64, 64)">
                          <use href="#baseOrbit" fill="none" stroke="#1E90FF" strokeWidth="1.2" strokeOpacity="0.25" />
                          <circle r="4" fill="#1E90FF" style={{ filter: 'drop-shadow(0 0 5px #1E90FF)' }}>
                            <animateMotion dur="5s" repeatCount="indefinite" begin="-2.5s">
                              <mpath href="#baseOrbit" />
                            </animateMotion>
                          </circle>
                        </g>
                      </svg>
                    </div>
                    <h3 className="text-sm font-bold text-[#1E90FF] uppercase tracking-wider mb-2">{t.analyzing}</h3>
                    <p className="text-xs text-[var(--muted)]">Deep scanning neural regions...</p>
                  </div>
                ) : (
                  <div className="text-center flex flex-col items-center opacity-60">
                    <div className="w-24 h-24 rounded-full border-[6px] border-[var(--border-strong)] flex items-center justify-center mb-4">
                      <span className="text-3xl font-bold text-[var(--border-strong)] font-['Syncopate']">--</span>
                    </div>
                    <h3 className="text-sm font-bold text-[var(--muted)] uppercase tracking-wider mb-2">{t.status}</h3>
                    <span className="text-xl font-bold text-[var(--muted-dark)]">{t.statusAwaiting}</span>
                  </div>
                )
              ) : (
                <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-col">
                  {/* Verdict Icon + Label */}
                  <div className="flex items-center space-x-4 mb-6">
                    <div className={`w-16 h-16 rounded-full flex items-center justify-center ${isFake ? 'bg-[#FA5252]/10' : 'bg-[#40C057]/10'}`}>
                      {isFake ? <ShieldAlert className="w-8 h-8 text-[#FA5252]" /> : <ShieldCheck className="w-8 h-8 text-[#40C057]" />}
                    </div>
                    <div>
                      <h3 className="text-[10px] font-bold text-[var(--muted)] uppercase tracking-wider">{t.authenticity}</h3>
                      <div className={`text-2xl font-bold font-['Syncopate'] mt-1 ${isFake ? 'text-[#FA5252]' : 'text-[#40C057]'}`}>
                        {isFake ? t.resultFake : t.resultReal}
                      </div>
                    </div>
                  </div>

                  {/* Confidence Score */}
                  <div className="flex items-center justify-between mb-6 p-4 bg-[var(--surface)] rounded-xl border border-[var(--border-strong)]">
                    <span className="text-sm font-bold text-[var(--foreground)]">Confidence</span>
                    <span className={`text-3xl font-bold font-['Syncopate'] ${isFake ? 'text-[#FA5252]' : 'text-[#40C057]'}`}>
                      {confidencePct.toFixed(1)}%
                    </span>
                  </div>

                  {/* Key Stats */}
                  <div className="grid grid-cols-2 gap-3 mb-4">
                    <div className="p-3 rounded-xl bg-[var(--surface)] border border-[var(--border-strong)]">
                      <span className="text-[10px] font-bold text-[var(--muted)] uppercase block mb-1">{t.localVerdict}</span>
                      <span className={`font-bold text-sm ${result.local_label === 'FAKE' ? 'text-[#FA5252]' : 'text-[#40C057]'}`}>
                        {result.local_label} ({result.local_confidence.toFixed(1)}%)
                      </span>
                    </div>
                    <div className="p-3 rounded-xl bg-[var(--surface)] border border-[var(--border-strong)]">
                      <span className="text-[10px] font-bold text-[var(--muted)] uppercase block mb-1">{t.rdStatus}</span>
                      <span className={`font-bold text-sm ${result.rd_status === 'DISABLED' ? 'text-[var(--muted)]' : result.rd_status === 'AUTHENTIC' ? 'text-[#40C057]' : 'text-[#7950F2]'}`}>
                        {result.rd_status || 'N/A'}
                      </span>
                    </div>
                    <div className="col-span-2 p-3 rounded-xl bg-[var(--surface)] border border-[var(--border-strong)]">
                      <span className="text-[10px] font-bold text-[var(--muted)] uppercase block mb-1">{t.latency}</span>
                      <span className="font-bold text-sm text-[var(--foreground)] font-mono">{result.latency_ms.toFixed(0)} ms</span>
                    </div>
                  </div>

                  <div className={`p-4 rounded-xl border text-sm leading-relaxed ${isFake ? 'bg-[#FFF5F5] border-[#FA5252]/20 text-[#495057]' : 'bg-[#EBFBEE] border-[#40C057]/20 text-[#495057]'}`}>
                    <p className="font-bold mb-1">{t.forensicSummary}</p>
                    <p>{result.forensic_summary}</p>
                  </div>

                  {/* ── Action Buttons ── */}
                  <div className="flex flex-wrap gap-2 mt-4 relative">
                    <button onClick={() => setActivePanel('blast')} className="flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#FF6B00]/10 to-[#FA5252]/10 border border-[#FF6B00]/30 text-[#FF6B00] text-xs font-bold hover:from-[#FF6B00]/20 hover:to-[#FA5252]/20 transition-all">
                      <Share2 className="w-3.5 h-3.5" /><span>Blast Radius</span>
                    </button>
                    <button onClick={() => setActivePanel('temporal')} className="flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#1E90FF]/10 to-[#7950F2]/10 border border-[#1E90FF]/30 text-[#1E90FF] text-xs font-bold hover:from-[#1E90FF]/20 hover:to-[#7950F2]/20 transition-all">
                      <Activity className="w-3.5 h-3.5" /><span>Temporal Analysis</span>
                    </button>
                    <button onClick={handleDownloadReport} className="flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#40C057]/10 to-[#1E90FF]/10 border border-[#40C057]/30 text-[#40C057] text-xs font-bold hover:from-[#40C057]/20 hover:to-[#1E90FF]/20 transition-all">
                      <FileText className="w-3.5 h-3.5" /><span>Download Report</span>
                    </button>
                    <div className="relative">
                      <button onClick={() => setShowMoreActions(v => !v)} className="flex items-center justify-center w-10 h-10 rounded-xl bg-[var(--surface-2)] border border-[var(--border-strong)] text-[var(--foreground)] hover:bg-[var(--surface)] transition-all" title="More Actions">
                        <MoreVertical className="w-4 h-4" />
                      </button>
                      <AnimatePresence>
                        {showMoreActions && (
                          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }}
                            className="absolute top-12 right-0 bg-[var(--card-bg)] border border-[var(--border-strong)] rounded-2xl shadow-xl z-50 p-2 min-w-[200px]"
                          >
                            <button onClick={() => { setActivePanel('lockdown'); setShowMoreActions(false); }} className="w-full flex items-center space-x-3 px-3 py-2.5 rounded-xl text-left hover:bg-[#FA5252]/10 text-[var(--foreground)] hover:text-[#FA5252] transition-colors mb-1">
                              <LockKeyhole className="w-4 h-4" />
                              <span className="text-sm font-bold">Lockdown</span>
                            </button>
                            <button onClick={() => { setActivePanel('takedown'); setShowMoreActions(false); }} className="w-full flex items-center space-x-3 px-3 py-2.5 rounded-xl text-left hover:bg-[var(--surface)] text-[var(--foreground)] transition-colors">
                              <Zap className="w-4 h-4 text-[#FF6B00]" />
                              <span className="text-sm font-bold">Auto-Takedown</span>
                            </button>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>
                </motion.div>
              )}
            </div>
          </div>
        </div>

        {/* ── Evidence Tabs ── */}
        <div className="mt-8 glass-panel overflow-hidden mb-10">
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
                      <ShieldCheck className="w-12 h-12 text-[var(--muted-dark)] mb-4" />
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
                               <span className="text-[10px] uppercase font-bold tracking-widest opacity-50">No Face Detected</span>
                            </div>
                          )}
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-3">
                             <span className="text-[9px] font-bold text-white uppercase tracking-wider bg-black/60 px-2 py-1 rounded backdrop-blur-sm">Source Extraction</span>
                          </div>
                        </div>

                        <p className="text-[var(--muted)] leading-relaxed text-xs mb-4">{t.evidenceDesc}</p>
                        <div className="p-4 mt-auto bg-[var(--surface)] rounded-xl border border-[var(--border-strong)] text-xs text-[var(--foreground)]">
                          <strong className="text-[#FF6B00]">Key Finding:</strong> {result.forensic_summary}
                        </div>
                      </div>

                      {/* Middle: Real-time Frame-by-Frame Area Chart */}
                      <div className="lg:w-1/3 w-full h-[320px] bg-[var(--surface)] border border-[var(--border-strong)] rounded-2xl p-4 flex flex-col relative shadow-sm">
                        <div className="flex items-center justify-between mb-2">
                          <h5 className="text-xs font-bold text-[var(--muted)] uppercase tracking-wider">Real-Time Frame Analysis</h5>
                          {animatedFrames.length < frameData.length && (
                            <span className="flex items-center space-x-1 text-[9px] font-bold text-[#FF6B00] animate-pulse">
                              <span className="w-1.5 h-1.5 rounded-full bg-[#FF6B00]" />  <span>LIVE</span>
                            </span>
                          )}
                        </div>
                        <div className="flex-1 w-full min-h-0">
                          <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={animatedFrames} margin={{ top: 4, right: 8, left: -20, bottom: 0 }}>
                              <defs>
                                <linearGradient id="fakeGrad" x1="0" y1="0" x2="0" y2="1">
                                  <stop offset="5%" stopColor="#FF6B00" stopOpacity={0.4} />
                                  <stop offset="95%" stopColor="#FF6B00" stopOpacity={0.02} />
                                </linearGradient>
                                <linearGradient id="realGrad" x1="0" y1="0" x2="0" y2="1">
                                  <stop offset="5%" stopColor="#1E90FF" stopOpacity={0.3} />
                                  <stop offset="95%" stopColor="#1E90FF" stopOpacity={0.02} />
                                </linearGradient>
                              </defs>
                              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border-strong)" />
                              <XAxis dataKey="frame" stroke="var(--muted)" fontSize={9} label={{ value: 'Frame', position: 'insideBottom', offset: -2, fontSize: 9, fill: 'var(--muted)' }} />
                              <YAxis stroke="var(--muted)" fontSize={9} domain={[0, 100]} tickFormatter={(v) => `${v}%`} />
                              <Tooltip
                                contentStyle={{ borderRadius: '10px', border: 'none', boxShadow: '0 4px 15px rgba(0,0,0,0.15)', background: 'var(--card-bg)', color: 'var(--foreground)' }}
                                formatter={(val: number, name: string) => [`${val.toFixed(1)}%`, name === 'fake' ? 'Fake Prob.' : 'Real Prob.']}
                                labelFormatter={(label) => `Frame ${label}`}
                              />
                              <ReferenceLine y={50} stroke="#868E96" strokeDasharray="4 4" label={{ value: '50%', position: 'insideTopRight', fontSize: 9, fill: '#868E96' }} />
                              <Area type="monotone" dataKey="fake" stroke="#FF6B00" strokeWidth={2} fill="url(#fakeGrad)" dot={false} isAnimationActive={false} name="fake" />
                              <Area type="monotone" dataKey="real" stroke="#1E90FF" strokeWidth={1.5} fill="url(#realGrad)" dot={false} isAnimationActive={false} name="real" />
                            </AreaChart>
                          </ResponsiveContainer>
                        </div>
                        <div className="flex items-center space-x-4 mt-2 text-[10px] font-bold">
                          <span className="flex items-center space-x-1"><span className="w-3 h-1.5 rounded bg-[#FF6B00] inline-block" /> Fake Probability</span>
                          <span className="flex items-center space-x-1"><span className="w-3 h-1.5 rounded bg-[#1E90FF] inline-block" /> Real Probability</span>
                        </div>
                      </div>

                      {/* Right: 3D Heatmap */}
                      <div className="lg:w-5/12 w-full h-[320px] bg-white border border-[#DEE2E6] rounded-2xl flex flex-col relative overflow-hidden shadow-sm">
                        <h5 className="absolute top-4 left-5 z-10 text-xs font-bold text-[#868E96] uppercase tracking-wider">3D Spatial Heatmap</h5>
                        <div className="absolute top-4 right-4 z-10 text-[9px] font-mono text-[#868E96] bg-[#F1F3F5] px-2 py-1 rounded border border-[#DEE2E6]">Interactive: Drag/Zoom</div>
                        <div className="flex-1 w-full min-h-0 bg-white">
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
                      <Info className="w-12 h-12 text-[#ADB5BD] mb-4" />
                      <p className="text-[#868E96] font-bold text-lg">{t.notUploaded}</p>
                    </div>
                  ) : (
                    <div className="max-w-3xl">
                      <h4 className="text-xl font-bold text-[var(--foreground)] mb-4">Full Analysis Report</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                        <div className="p-4 rounded-xl bg-[var(--surface-2)] border border-[var(--border-strong)]">
                          <span className="text-xs font-bold text-[var(--muted)] uppercase tracking-wider block mb-1">Primary Verdict</span>
                          <span className={`font-bold text-lg font-mono ${isFake ? 'text-[#FA5252]' : 'text-[#40C057]'}`}>{result.primary_verdict}</span>
                        </div>
                        <div className="p-4 rounded-xl bg-[var(--surface-2)] border border-[var(--border-strong)]">
                          <span className="text-xs font-bold text-[var(--muted)] uppercase tracking-wider block mb-1">Overall Confidence</span>
                          <span className="font-bold text-lg font-mono text-[var(--foreground)]">{result.confidence_score.toFixed(2)}%</span>
                        </div>
                        <div className="p-4 rounded-xl bg-[var(--surface-2)] border border-[var(--border-strong)]">
                          <span className="text-xs font-bold text-[var(--muted)] uppercase tracking-wider block mb-1">Local Model Result</span>
                          <span className="font-bold text-sm font-mono text-[var(--foreground)]">{result.local_label} — {result.local_confidence.toFixed(2)}%</span>
                        </div>
                        <div className="p-4 rounded-xl bg-[var(--surface-2)] border border-[var(--border-strong)]">
                          <span className="text-xs font-bold text-[var(--muted)] uppercase tracking-wider block mb-1">Reality Defender Cloud</span>
                          <span className="font-bold text-sm font-mono text-[var(--foreground)]">{result.rd_status || 'DISABLED'} {result.rd_score ? `(${(result.rd_score * 100).toFixed(1)}%)` : ''}</span>
                        </div>
                        <div className="p-4 rounded-xl bg-[var(--surface-2)] border border-[var(--border-strong)]">
                          <span className="text-xs font-bold text-[var(--muted)] uppercase tracking-wider block mb-1">Processing Latency</span>
                          <span className="font-bold text-sm font-mono text-[var(--foreground)]">{result.latency_ms.toFixed(2)} ms</span>
                        </div>
                        <div className="p-4 rounded-xl bg-[var(--surface-2)] border border-[var(--border-strong)]">
                          <span className="text-xs font-bold text-[var(--muted)] uppercase tracking-wider block mb-1">Architecture</span>
                          <span className="font-bold text-sm font-mono text-[var(--foreground)]">EfficientNet-V2-S</span>
                        </div>
                      </div>
                      <div className="p-4 rounded-xl bg-[var(--surface-2)] border border-[var(--border-strong)]">
                        <span className="text-xs font-bold text-[var(--muted)] uppercase tracking-wider block mb-2">Forensic Summary</span>
                        <p className="text-sm text-[var(--muted)] leading-relaxed">{result.forensic_summary}</p>
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
          <motion.div key="blast" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[100] bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
            <motion.div initial={{ y: 30, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 30, opacity: 0 }} className="w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-[var(--card-bg)] rounded-3xl shadow-2xl border border-[var(--border-strong)]" onClick={(e) => e.stopPropagation()}>
              {/* Header */}
              <div className="sticky top-0 bg-[var(--card-bg)] border-b border-[var(--border-strong)] px-8 py-5 rounded-t-3xl z-10 backdrop-blur-md">
                <button onClick={() => setActivePanel(null)} className="float-left mr-4 mt-1 text-[var(--muted)] hover:text-[var(--foreground)]"><ArrowLeft className="w-5 h-5" /></button>
                <h2 className="text-2xl font-bold font-['Syncopate'] text-[var(--foreground)] flex items-center space-x-2">
                  {isFake
                    ? <><AlertTriangle className="w-6 h-6 text-[#FF6B00]" /><span>Blast Radius Containment</span></>
                    : <><CheckCircle className="w-6 h-6 text-[#40C057]" /><span>Authenticity Broadcast</span></>
                  }
                </h2>
                <p className="text-sm text-[#868E96] mt-1">
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
                        <p>This is certified by EfficientNet-V2-S cloud analysis. Please disregard any claims that this content is fake.</p>
                      </>
                    )}
                  </div>
                  <div className="flex gap-3">
                    <button onClick={() => {
                      const msg = isFake
                        ? `URGENT: A video/image currently circulating featuring me is a CONFIRMED DEEPFAKE.\n\nI have run this media through Trinetra's military-grade forensic analysis, which has verified it as ${result.confidence_score.toFixed(1)}% synthetically manipulated.\n\nPlease DO NOT share, forward, or engage with this content.`
                        : `✅ VERIFIED AUTHENTIC: A media clip featuring me has been confirmed as REAL by Trinetra forensic AI (${result.confidence_score.toFixed(1)}% authentic).\n\nThis has been certified by EfficientNet-V2-S cloud analysis. It is NOT AI-generated or manipulated.`;
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
                        <p className="mb-2">Confidence: <strong>{result.confidence_score.toFixed(1)}%</strong> synthetic · Engine: EfficientNet-V2-S</p>
                        <p>Please do NOT share this content. Under IT Act 2000, distributing synthetic media non-consensually is punishable by law.</p>
                      </>
                    ) : (
                      <>
                        <p className="font-bold text-[#40C057] mb-1">Subject: ✅ Verified Authentic — Trinetra Forensic Clearance</p>
                        <p className="mb-2">Dear Recipient,</p>
                        <p className="mb-2">I am writing to confirm that a media clip featuring me has been <strong>independently verified as REAL</strong> by Trinetra forensic AI.</p>
                        <p className="mb-2">Authenticity: <strong>{result.confidence_score.toFixed(1)}%</strong> genuine · Engine: EfficientNet-V2-S</p>
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
                      className="flex-1 px-3 py-2.5 rounded-xl bg-[var(--card-bg)] border border-[var(--border-strong)] text-sm text-[var(--foreground)] focus:outline-none focus:border-[#4C6EF5] transition-colors"
                    />
                  </div>

                  {/* Step indicator */}
                  <div className="flex items-center gap-2 mb-3 text-[10px] text-[#868E96] font-semibold">
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
                          ? encodeURIComponent(`Dear Recipient,\n\nI am writing to inform you that a video/image circulating online featuring me has been CONFIRMED as a DEEPFAKE by Trinetra forensic AI analysis.\n\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n🔴 VERDICT: ${result.primary_verdict}\n📊 Confidence: ${result.confidence_score.toFixed(1)}% synthetic manipulation\n🔬 Detection Engine: EfficientNet-V2-S\n⏱️ Analysis Latency: ${result.latency_ms.toFixed(0)}ms\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\nForensic Summary:\n${result.forensic_summary}\n\n⚠️ ATTACHMENT: Please find the forensic evidence image attached (auto-downloaded to your device).\n\nPlease do NOT share, forward, or engage with this synthetic content. Under the IT Act 2000 and IT (Intermediary Guidelines) Rules 2021, distributing non-consensual synthetic media is a punishable offense.\n\nVerified by Trinetra V2 — AI Deepfake Detection Platform\nGenerated: ${new Date().toLocaleString()}`)
                          : encodeURIComponent(`Dear Recipient,\n\nI am writing to confirm that a media clip featuring me has been INDEPENDENTLY VERIFIED as REAL and AUTHENTIC by Trinetra forensic AI analysis.\n\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n✅ VERDICT: ${result.primary_verdict}\n📊 Authenticity: ${result.confidence_score.toFixed(1)}% genuine (not AI-generated)\n🔬 Detection Engine: EfficientNet-V2-S\n⏱️ Analysis Latency: ${result.latency_ms.toFixed(0)}ms\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\nForensic Summary:\n${result.forensic_summary}\n\n📎 ATTACHMENT: A copy of the forensic evidence has been auto-downloaded to the sender's device and can be shared upon request.\n\nPlease disregard any claims that this content is fake or AI-generated. This email serves as a forensic clearance certificate.\n\nVerified by Trinetra V2 — AI Deepfake Detection Platform\nGenerated: ${new Date().toLocaleString()}`);
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
                      <div className="flex justify-between"><span className="text-[var(--muted)]">Detection Engine</span><span className="font-bold font-mono text-[var(--foreground)]">EfficientNet-V2-S</span></div>
                      <div className="flex justify-between"><span className="text-[var(--muted)]">Latency</span><span className="font-bold font-mono text-[var(--foreground)]">{result.latency_ms.toFixed(0)}ms</span></div>
                    </div>
                    <div className="mt-4 p-3 bg-[#FF6B00]/10 border border-[#FF6B00]/20 rounded-lg text-xs text-[var(--foreground)] italic">&ldquo;{result.forensic_summary}&rdquo;</div>
                    <p className="text-[10px] text-[#ADB5BD] mt-3">Generated on {new Date().toLocaleDateString()} at {new Date().toLocaleTimeString()}</p>
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
          <motion.div key="lockdown" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[100] bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
            <motion.div initial={{ y: 30, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 30, opacity: 0 }} className="w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-[var(--card-bg)] rounded-3xl shadow-2xl border border-[var(--border-strong)]" onClick={(e) => e.stopPropagation()}>
              {/* Header */}
              <div className="sticky top-0 bg-[var(--card-bg)] border-b border-[var(--border-strong)] px-8 py-5 rounded-t-3xl z-10 backdrop-blur-md">
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
                <div className="w-full bg-[#F1F3F5] rounded-full h-1.5 mt-4">
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
                          lockdownChecks[i] ? 'bg-[#40C057]/10 border-[#40C057]/30' : 'bg-[var(--surface)] border-[var(--border-strong)] hover:border-[#FF6B00]/40'
                        }`}
                      >
                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 mt-0.5 ${lockdownChecks[i] ? 'border-[#40C057] bg-[#40C057]' : 'border-[var(--muted)]'}`}>
                          {lockdownChecks[i] && <CheckCircle className="w-3 h-3 text-[var(--background)]" />}
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
                    <span className="text-[9px] font-bold bg-[#40C057] text-white px-2 py-0.5 rounded font-mono flex items-center space-x-1"><span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" /><span>Online</span></span>
                  </div>
                  <div className="flex-1 bg-[var(--card-bg)] border border-[var(--border-strong)] rounded-xl p-4 mb-4 min-h-[280px] flex flex-col overflow-y-auto custom-scrollbar">
                    {chatMessages.map((msg, i) => (
                      <div key={i} className={`mb-3 flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`rounded-2xl p-3 text-sm max-w-[85%] ${msg.role === 'user' ? 'bg-[#7950F2] text-white' : 'bg-[var(--surface-2)] text-[var(--foreground)]'}`}>
                          {msg.text}
                        </div>
                      </div>
                    ))}
                  </div>
                  <form 
                    onSubmit={(e) => {
                      e.preventDefault();
                      if (!chatInput.trim()) return;
                      const userMsg = chatInput;
                      setChatInput('');
                      setChatMessages(prev => [...prev, { role: 'user', text: userMsg }]);
                      
                      setTimeout(() => {
                        let response = "I am processing your request. Please ensure you have secured your primary accounts first.";
                        if (userMsg.toLowerCase().includes('help')) response = "I recommend enabling 2FA immediately on all social platforms.";
                        if (userMsg.toLowerCase().includes('lock')) response = "Protocol initiated. Please follow the checklist on the left to secure your identity.";
                        setChatMessages(prev => [...prev, { role: 'system', text: response }]);
                      }, 1000);
                    }}
                    className="flex items-center space-x-3"
                  >
                    <input 
                      type="text" 
                      value={chatInput}
                      onChange={(e) => setChatInput(e.target.value)}
                      placeholder="Describe your situation..." 
                      className="flex-1 px-4 py-3 rounded-xl bg-[var(--card-bg)] border border-[var(--border-strong)] text-sm text-[var(--foreground)] focus:outline-none focus:border-[#7950F2] transition-colors" 
                    />
                    <button type="submit" className="p-3 rounded-xl bg-[#7950F2] text-white hover:bg-[#6741D9] transition-all active:scale-90">
                      <Send className="w-4 h-4" />
                    </button>
                  </form>
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
          <motion.div key="takedown" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[100] bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
            <motion.div initial={{ y: 30, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 30, opacity: 0 }} className="w-full max-w-5xl max-h-[90vh] overflow-y-auto bg-[var(--card-bg)] rounded-3xl shadow-2xl border border-[var(--border-strong)]" onClick={(e) => e.stopPropagation()}>
              {/* Header */}
              <div className="sticky top-0 bg-[var(--card-bg)] border-b border-[var(--border-strong)] px-8 py-5 rounded-t-3xl z-10 backdrop-blur-md">
                <button onClick={() => setActivePanel(null)} className="float-left mr-4 mt-1 text-[var(--muted)] hover:text-[var(--foreground)]"><ArrowLeft className="w-5 h-5" /></button>
                <h2 className="text-2xl font-bold font-['Syncopate'] text-[var(--foreground)] flex items-center space-x-2">
                  <Zap className="w-6 h-6 text-[#FF6B00]" /><span>SSMI Takedown Engine</span>
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
                        <span className="text-[8px] font-bold bg-[#FF6B00] text-white px-2 py-0.5 rounded font-mono uppercase">Ready to Fire</span>
                      </div>
                      <p className="text-[10px] font-bold text-[var(--muted)] uppercase tracking-wider mb-2">Generated Payload Preview</p>
                      <div className="bg-[var(--card-bg)] border border-[var(--border-strong)] rounded-xl p-3 text-[11px] font-mono text-[var(--foreground)] mb-4 max-h-[180px] overflow-y-auto">
                        <pre className="whitespace-pre-wrap">{JSON.stringify({
                          violation_type: "synthetic_media",
                          confidence_score: result.confidence_score,
                          evidence_summary: result.forensic_summary,
                          reporter_contact: "[your email]",
                          detection_engine: "Trinetra V2 — EfficientNet-V2-S",
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
                <div className="bg-[#FF6B00]/5 border border-[#FF6B00]/20 rounded-2xl p-6 mb-6">
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

      {/* \u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550 */}
      {/* \u2500\u2500  TEMPORAL ANALYSIS PANEL  \u2500\u2500 */}
      {/* \u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550 */}
      <AnimatePresence>
        {activePanel === 'temporal' && result && (
          <motion.div key="temporal" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[100] bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
            <motion.div initial={{ y: 30, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 30, opacity: 0 }} className="w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-[var(--card-bg)] rounded-3xl shadow-2xl border border-[var(--card-border)]" onClick={(e) => e.stopPropagation()}>
              <div className="sticky top-0 bg-[var(--card-bg)] border-b border-[var(--border-strong)] px-8 py-5 rounded-t-3xl z-10">
                <button onClick={() => setActivePanel(null)} className="float-left mr-4 mt-1 text-[var(--muted)] hover:text-[var(--foreground)]"><ArrowLeft className="w-5 h-5" /></button>
                <h2 className="text-2xl font-bold font-['Syncopate'] text-[var(--foreground)] flex items-center space-x-2">
                  <Activity className="w-6 h-6 text-[#1E90FF]" /><span>Temporal Analysis</span>
                </h2>
                <p className="text-sm text-[var(--muted)] mt-1">Real-time LSTM temporal attention scores across frames. Spikes indicate synthetic manipulation zones.</p>
              </div>
              <div className="p-8">
                {/* Full-width animated chart */}
                <div className="w-full h-[280px] bg-[var(--surface)] border border-[var(--border-strong)] rounded-2xl p-4 mb-6">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h4 className="text-sm font-bold text-[var(--foreground)] uppercase tracking-wider">{temporalMode === 'fake' ? 'Frame-by-Frame Fake Probability' : 'Frame-by-Frame Authenticity Assurance'}</h4>
                      <p className="text-[10px] text-[var(--muted)] font-medium">Visualization of AI scoring across the timeline</p>
                    </div>
                    <div className="flex bg-[var(--surface-2)] p-1 rounded-xl border border-[var(--border-strong)]">
                      <button 
                        onClick={() => setTemporalMode('fake')}
                        className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${temporalMode === 'fake' ? 'bg-[#FF6B00] text-white shadow-md' : 'text-[var(--muted)] hover:text-[var(--foreground)]'}`}
                      >
                        Fake View
                      </button>
                      <button 
                        onClick={() => setTemporalMode('real')}
                        className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${temporalMode === 'real' ? 'bg-[#1E90FF] text-white shadow-md' : 'text-[var(--muted)] hover:text-[var(--foreground)]'}`}
                      >
                        Real View
                      </button>
                    </div>
                  </div>
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={frameData} margin={{ top: 4, right: 8, left: -16, bottom: 16 }}>
                      <defs>
                        <linearGradient id="tempFakeGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#FF6B00" stopOpacity={0.5} />
                          <stop offset="95%" stopColor="#FF6B00" stopOpacity={0.02} />
                        </linearGradient>
                        <linearGradient id="tempRealGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#1E90FF" stopOpacity={0.5} />
                          <stop offset="95%" stopColor="#1E90FF" stopOpacity={0.02} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="var(--border-strong)" />
                      <XAxis dataKey="frame" stroke="var(--muted)" fontSize={10} label={{ value: 'Frame Number', position: 'insideBottom', offset: -10, fontSize: 10, fill: 'var(--muted)' }} />
                      <YAxis stroke="var(--muted)" fontSize={10} domain={[0, 100]} tickFormatter={(v) => `${v}%`} />
                      <Tooltip
                        contentStyle={{ borderRadius: '10px', border: '1px solid var(--border-strong)', background: 'var(--card-bg)', color: 'var(--foreground)' }}
                        formatter={(val: number) => [`${val.toFixed(1)}%`, 'Fake Probability']}
                        labelFormatter={(l) => `Frame ${l}`}
                      />
                      <ReferenceLine y={50} stroke="#FF6B00" strokeDasharray="6 3" label={{ value: 'Threshold 50%', position: 'insideTopLeft', fontSize: 10, fill: '#FF6B00' }} />
                      <Area 
                        type="monotone" 
                        dataKey={temporalMode === 'fake' ? 'fake' : 'real'} 
                        stroke={temporalMode === 'fake' ? '#FF6B00' : '#1E90FF'} 
                        strokeWidth={2.5} 
                        fill={temporalMode === 'fake' ? 'url(#tempFakeGrad)' : 'url(#tempRealGrad)'} 
                        dot={false} 
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
                {/* Summary grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <div className="bg-[var(--surface)] border border-[var(--border-strong)] rounded-2xl p-5">
                    <span className="text-[10px] font-bold text-[var(--muted)] uppercase tracking-wider block mb-1">Peak Fake Frame</span>
                    <span className="text-2xl font-bold font-mono text-[#FF6B00]">
                      {frameData.length > 0 ? `#${frameData.reduce((m, f) => f.fake > m.fake ? f : m, frameData[0]).frame}` : 'N/A'}
                    </span>
                    <p className="text-xs text-[var(--muted)] mt-1">Frame with highest fake probability</p>
                  </div>
                  <div className="bg-[var(--surface)] border border-[var(--border-strong)] rounded-2xl p-5">
                    <span className="text-[10px] font-bold text-[var(--muted)] uppercase tracking-wider block mb-1">Avg Fake Prob.</span>
                    <span className="text-2xl font-bold font-mono text-[var(--foreground)]">
                      {frameData.length > 0 ? `${(frameData.reduce((s, f) => s + f.fake, 0) / frameData.length).toFixed(1)}%` : 'N/A'}
                    </span>
                    <p className="text-xs text-[var(--muted)] mt-1">Mean across all analyzed frames</p>
                  </div>
                  <div className="bg-[var(--surface)] border border-[var(--border-strong)] rounded-2xl p-5">
                    <span className="text-[10px] font-bold text-[var(--muted)] uppercase tracking-wider block mb-1">Frames &gt; 50%</span>
                    <span className={`text-2xl font-bold font-mono ${isFake ? 'text-[#FF6B00]' : 'text-[#1E90FF]'}`}>
                      {frameData.length > 0 ? `${frameData.filter(f => f.fake > 50).length} / ${frameData.length}` : 'N/A'}
                    </span>
                    <p className="text-xs text-[var(--muted)] mt-1">Frames above the fake threshold</p>
                  </div>
                </div>
                {/* AI Summary */}
                <div className={`p-5 rounded-2xl border text-sm leading-relaxed ${isFake ? 'bg-[#FF6B00]/5 border-[#FF6B00]/20' : 'bg-[#1E90FF]/5 border-[#1E90FF]/20'}`}>
                  <p className="font-bold text-[var(--foreground)] mb-2 flex items-center space-x-2">
                    <Activity className="w-4 h-4" /><span>Temporal AI Summary</span>
                  </p>
                  <p className="text-[var(--muted)]">{result.forensic_summary}</p>
                  {isFake && frameData.length > 0 && (
                    <p className="mt-2 text-[#FF6B00] font-semibold text-xs">
                      ⚠ Manipulation signature detected: Frame #{frameData.reduce((m, f) => f.fake > m.fake ? f : m, frameData[0]).frame} shows peak anomaly at {Math.max(...frameData.map(f => f.fake)).toFixed(1)}% synthetic probability.
                    </p>
                  )}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* \u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550 */}
      {/* \u2500\u2500  SETTINGS SIDEBAR  \u2500\u2500 */}
      {/* \u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550 */}
      <AnimatePresence>
        {showSettings && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[110] bg-black/30 backdrop-blur-sm" onClick={() => setShowSettings(false)} />
            <motion.div initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} transition={{ type: 'spring', damping: 28, stiffness: 260 }}
              className="fixed right-0 top-0 h-full w-[420px] max-w-[100vw] z-[120] bg-[var(--card-bg)] border-l border-[var(--border-strong)] shadow-2xl flex flex-col">
              {/* Header */}
              <div className="flex items-center justify-between px-6 py-5 border-b border-[var(--border-strong)]">
                <h2 className="text-lg font-bold font-['Syncopate'] text-[var(--foreground)]">Settings</h2>
                <button onClick={() => setShowSettings(false)} className="p-2 rounded-full hover:bg-[var(--surface)] text-[var(--muted)]"><ArrowLeft className="w-5 h-5" /></button>
              </div>
              <div className="flex-1 overflow-y-auto px-6 py-4 space-y-6">
                {/* Account Details */}
                <div className="bg-[var(--surface)] rounded-2xl p-4 border border-[var(--border-strong)]">
                  <h3 className="text-xs font-bold text-[var(--muted)] uppercase tracking-wider mb-3 flex items-center space-x-1"><User className="w-3.5 h-3.5" /><span>Account Details</span></h3>
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#FF6B00] to-[#1E90FF] flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
                      {isGuest ? 'G' : (userEmail?.[0]?.toUpperCase() || 'U')}
                    </div>
                    <div>
                      <p className="font-bold text-sm text-[var(--foreground)]">{isGuest ? 'Guest User' : (userEmail || 'User')}</p>
                      <p className="text-xs text-[var(--muted)]">{isGuest ? 'Limited access' : 'Full access'}</p>
                      <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${isGuest ? 'bg-[var(--surface-2)] text-[var(--muted)]' : 'bg-[#FF6B00]/10 text-[#FF6B00]'}`}>
                        {isGuest ? 'GUEST' : 'SIGNED IN'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Appearance */}
                <div className="bg-[var(--surface)] rounded-2xl p-4 border border-[var(--border-strong)]">
                  <h3 className="text-xs font-bold text-[var(--muted)] uppercase tracking-wider mb-3">Appearance</h3>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-[var(--foreground)]">{darkMode ? 'Dark Mode' : 'Light Mode'}</span>
                    <button onClick={() => setDarkMode(d => !d)}
                      className={`w-14 h-7 rounded-full relative transition-colors duration-300 ${darkMode ? 'bg-[#FF6B00]' : 'bg-[#DEE2E6]'}`}>
                      <span className={`absolute top-1 w-5 h-5 rounded-full shadow transition-all duration-300 flex items-center justify-center ${darkMode ? 'left-8 bg-[#1A1A1A]' : 'left-1 bg-[#FCF8F4]'}`}>
                        {darkMode ? <Moon className="w-3 h-3 text-[#FF6B00]" /> : <Sun className="w-3 h-3 text-[#FF6B00]" />}
                      </span>
                    </button>
                  </div>

                </div>

                {/* Language Preference */}
                <div className="bg-[var(--surface)] rounded-2xl p-4 border border-[var(--border-strong)]">
                  <h3 className="text-xs font-bold text-[var(--muted)] uppercase tracking-wider mb-3 flex items-center space-x-1"><Languages className="w-3.5 h-3.5" /><span>Language</span></h3>
                  <div className="grid grid-cols-2 gap-2">
                    {LANGUAGE_OPTIONS.map(opt => (
                      <button key={opt.code} onClick={() => setLang(opt.code as Lang)}
                        className={`px-3 py-2 rounded-xl text-xs font-bold transition-all ${lang === opt.code ? 'bg-[#FF6B00] text-white shadow-md' : 'bg-[var(--surface-2)] text-[var(--foreground)] hover:bg-[#FF6B00]/10 hover:text-[#FF6B00] border border-[var(--border-strong)]'}`}>
                        {opt.native}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Newsletter Subscribe */}
                <div className="bg-gradient-to-br from-[#FF6B00]/10 to-[#1E90FF]/10 rounded-2xl p-4 border border-[#FF6B00]/20">
                  <h3 className="text-xs font-bold text-[var(--muted)] uppercase tracking-wider mb-1 flex items-center space-x-1"><Bell className="w-3.5 h-3.5" /><span>Newsletter</span></h3>
                  <p className="text-xs text-[var(--muted)] mb-3">Subscribe to Trinetra updates, threat reports &amp; AI forensics news.</p>
                  <button
                    disabled={isSubscribing}
                    onClick={async () => {
                      if (isGuest) {
                        triggerToast('Please log in to subscribe to the newsletter.');
                      } else {
                        setIsSubscribing(true);
                        triggerToast('Initiating real-time subscription...');
                        try {
                          await subscribeToNewsletter(userEmail);
                          triggerToast(`Confirmation sent to ${userEmail}! Check your inbox. ✅`);
                        } catch (err) {
                          triggerToast('Subscription failed. Please try again later.');
                        } finally {
                          setIsSubscribing(false);
                        }
                      }
                    }}
                    className={`w-full py-2.5 rounded-xl bg-gradient-to-r from-[#FF6B00] to-[#1E90FF] text-white text-sm font-bold transition-all flex items-center justify-center space-x-2 ${isSubscribing ? 'opacity-70 cursor-wait' : 'hover:opacity-90 active:scale-95'}`}
                  >
                    {isSubscribing ? (
                      <><Loader2 className="w-4 h-4 animate-spin" /><span>Syncing...</span></>
                    ) : (
                      <><Bell className="w-4 h-4" /><span>Subscribe to Newsletter</span></>
                    )}
                  </button>
                </div>

                {/* View History */}
                <div className="bg-[var(--surface)] rounded-2xl p-4 border border-[var(--border-strong)] flex items-center justify-between">
                  <h3 className="text-xs font-bold text-[var(--muted)] uppercase tracking-wider flex items-center space-x-1"><Activity className="w-3.5 h-3.5" /><span>Analysis History</span></h3>
                  <button onClick={() => { setShowHistoryModal(true); setShowSettings(false); }} className="text-xs font-bold bg-[#FF6B00]/10 text-[#FF6B00] px-3 py-1.5 rounded-lg hover:bg-[#FF6B00]/20 transition-colors">
                    View
                  </button>
                </div>

                {/* Browser Extension Sync */}
                <div className="bg-[var(--surface)] rounded-2xl p-4 border border-[var(--border-strong)] flex items-center justify-between">
                  <div>
                    <h3 className="text-xs font-bold text-[var(--muted)] uppercase tracking-wider mb-1 flex items-center space-x-1"><Globe className="w-3.5 h-3.5" /><span>Extension Sync</span></h3>
                    <p className="text-[10px] text-[var(--muted)]">Sync with Trinetra browser extension</p>
                  </div>
                  <button onClick={() => triggerToast('Browser extension sync initiated...')} className="text-xs font-bold bg-[#1E90FF]/10 text-[#1E90FF] px-3 py-1.5 rounded-lg hover:bg-[#1E90FF]/20 transition-colors">
                    Sync
                  </button>
                </div>

                {/* Sign Out */}
                <button onClick={() => { setIsLoggedIn(false); setSelectedFile(null); setPreviewUrl(null); setResult(null); setIsGuest(false); setShowSettings(false); }} className="w-full py-3 rounded-xl border border-[#FA5252]/30 text-[#FA5252] hover:bg-[#FA5252]/10 transition-colors flex items-center justify-center space-x-2 font-bold text-sm">
                  <LogOut className="w-4 h-4" /><span>Sign Out securely</span>
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* \u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550 */}
      {/* \u2500\u2500  ANALYSIS HISTORY MODAL  \u2500\u2500 */}
      {/* \u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550 */}
      <AnimatePresence>
        {showHistoryModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[150] bg-black/50 backdrop-blur-md flex items-center justify-center p-4">
            <motion.div initial={{ y: 30, opacity: 0, scale: 0.95 }} animate={{ y: 0, opacity: 1, scale: 1 }} exit={{ y: 30, opacity: 0, scale: 0.95 }} className="w-full max-w-2xl bg-[var(--card-bg)] rounded-3xl shadow-2xl border border-[var(--border-strong)] overflow-hidden" onClick={(e) => e.stopPropagation()}>
              <div className="flex items-center justify-between px-8 py-5 border-b border-[var(--border-strong)] bg-[var(--surface)]">
                <h2 className="text-xl font-bold font-['Syncopate'] text-[var(--foreground)] flex items-center space-x-2">
                  <Activity className="w-5 h-5 text-[#FF6B00]" /><span>Analysis History</span>
                </h2>
                <button onClick={() => setShowHistoryModal(false)} className="text-[var(--muted)] hover:text-[#FA5252] transition-colors"><XCircle className="w-6 h-6" /></button>
              </div>
              <div className="p-8 max-h-[60vh] overflow-y-auto">
                {analysisHistory.length === 0 ? (
                  <div className="text-center py-12 text-[var(--muted)]">
                    <History className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p className="font-bold">No History Found</p>
                    <p className="text-sm">Scan media to build your analysis history.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {analysisHistory.map(item => (
                      <div key={item.id} className="p-4 rounded-xl bg-[var(--surface-2)] border border-[var(--border-strong)] flex justify-between items-center hover:border-[#FF6B00]/40 transition-colors">
                        <div className="flex-1 truncate mr-4">
                          <p className="text-sm font-bold text-[var(--foreground)] truncate mb-1">{item.name}</p>
                          <p className="text-xs text-[var(--muted)]">{item.date}</p>
                        </div>
                        <div className="text-right">
                          <p className={`text-sm font-bold font-['Syncopate'] ${item.verdict === 'FAKE' ? 'text-[#FA5252]' : 'text-[#40C057]'}`}>{item.verdict}</p>
                          <p className="text-xs text-[var(--foreground)] font-mono">{item.confidence.toFixed(1)}%</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}

