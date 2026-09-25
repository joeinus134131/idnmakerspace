import { useState, useEffect } from 'react';
import {
  Cpu,
  Zap,
  Calendar,
  Wrench,
  Gauge,
  Printer,
  Shield,
  ShieldCheck,
  ShieldAlert,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  X,
  Clock,
  CreditCard,
  QrCode,
  Award,
  Users,
  Boxes,
  TrendingUp,
  Check,
  MapPin,
  ChevronLeft,
  ChevronRight,
  Play,
  Pause,
  MessageCircle,
  Send,
  Camera,
  ExternalLink,
  Eye,
} from 'lucide-react';
import './App.css';

// Hero Showcase Slider Data (Atmospheric Makerspace Zones)
const HERO_SLIDES = [
  {
    id: '3dprint',
    tag: '3D Printing',
    title: 'Precision 3D Rapid Prototyping',
    subtitle: 'Bambu Lab Multi-Color & Engineering Filaments',
    desc: 'Cetak prototipe fisik presisi tinggi dengan Bambu Lab FDM & Resin SLA 8K, didukung pelacak jam operasional nozzle otomatis.',
    image: '/images/slide-3dprint.webp',
    statBadge: 'Toleransi ±0.08mm',
    kpi: '3 Unit Ready'
  },
  {
    id: 'iot',
    tag: 'Elektronika & IoT',
    title: 'Electronics Workbench & Testing',
    subtitle: 'Hakko Soldering & Digital Oscilloscope',
    desc: 'Meja solder suhu presisi, catu daya variabel, osiloskop digital, dan uji mikrokontroler. Akses bebas Level 1 K3.',
    image: '/images/electronics-iot-real.webp',
    statBadge: 'Akses Bebas Lv.1',
    kpi: 'Meja Bebas'
  },
  {
    id: 'community',
    tag: 'Belajar & Berkarya',
    title: 'Kolaborasi & Inkubasi Hardware',
    subtitle: 'Komunitas & Riset Rekayasa',
    desc: 'Ruang interaksi antar mahasiswa, pembuat lepas, dan mentor industri untuk memvalidasi prototipe produk jadi.',
    image: '/images/og-image.jpg',
    statBadge: '250+ Anggota',
    kpi: 'Workshop Mingguan'
  }
];

// Layanan yang saat ini tersedia di IDN Makerspace
const MACHINES_DATA = [
  {
    id: '3d-bambu-a1-mini',
    name: 'Bambu Lab A1 mini',
    category: '3dprint',
    level: 2,
    levelName: 'Level 2 : Dengan Pendampingan',
    status: 'available',
    statusLabel: 'Tersedia',
    hoursLogged: 42, hoursLimit: 300,
    area: '180 x 180 x 180 mm', speed: 'FDM · hingga 500 mm/s', materials: 'PLA, PETG & TPU; ABS/ASA tidak didukung', hourlyRate: 25000,
    icon: Printer,
    image: '/images/tools/bambu-a1-mini.jpg',
    imageCaption: 'Foto Asli Unit 3D Printer Bambu Lab A1 mini - Cetak FDM Presisi Tinggi'
  },
  {
    id: 'power-supply-sunshine-pro', name: 'Sunshine Power Supply P2 Pro', category: 'iot', level: 1,
    levelName: 'Level 1 : Akses Dasar', status: 'available', statusLabel: 'Tersedia',
    hoursLogged: 18, hoursLimit: 500, area: 'Meja Elektronika', speed: 'Catu daya variabel 30V/5A', materials: 'Rangkaian elektronik', hourlyRate: 10000,
    icon: Zap,
    image: '/images/tools/power-supply-sunshine.jpg',
    imageCaption: 'Foto Asli Unit Sunshine Power Supply P2 Pro - Catu Daya Variabel DC Presisi'
  },
  {
    id: 'solder-digital', name: 'Solder Digital', category: 'iot', level: 1,
    levelName: 'Level 1 : Akses Dasar', status: 'available', statusLabel: 'Tersedia',
    hoursLogged: 67, hoursLimit: 600, area: 'Meja Elektronika', speed: 'Suhu terkontrol', materials: 'Komponen elektronik', hourlyRate: 10000,
    icon: Boxes,
    image: '/images/tools/solder-digital.jpg',
    imageCaption: 'Foto Asli Workstation Solder Digital - Suhu Presisi & Stand Holder'
  },
  {
    id: 'timbangan-digital', name: 'Timbangan Digital', category: 'iot', level: 1,
    levelName: 'Level 1 : Akses Dasar', status: 'available', statusLabel: 'Tersedia',
    hoursLogged: 12, hoursLimit: 1000, area: 'Meja Persiapan', speed: 'Pengukuran bahan', materials: 'Filamen & komponen', hourlyRate: 0,
    icon: Gauge,
    image: '/images/tools/timbangan-digital.jpg',
    imageCaption: 'Foto Asli Timbangan Digital Presisi - Akurasi Gramasi Filamen & Benda Cetak'
  },
  {
    id: 'multimeter-unit', name: 'Multimeter UNI-T', category: 'iot', level: 1,
    levelName: 'Level 1 : Akses Dasar', status: 'available', statusLabel: 'Tersedia',
    hoursLogged: 23, hoursLimit: 800, area: 'Meja Elektronika', speed: 'Ukur tegangan & arus', materials: 'Proyek elektronik', hourlyRate: 10000,
    icon: Cpu,
    image: '/images/tools/multimeter-unit.jpg',
    imageCaption: 'Foto Asli Multimeter Digital UNI-T - Probe Pengukur Tegangan, Arus & Hambatan'
  },
  {
    id: 'toolkit-elektronika', name: 'Perkakas Elektronika', category: 'iot', level: 1,
    levelName: 'Level 1 : Akses Dasar', status: 'available', statusLabel: 'Tersedia',
    hoursLogged: 31, hoursLimit: 1000, area: 'Meja Elektronika', speed: 'Toolkit perakitan', materials: 'Komponen elektronik', hourlyRate: 0,
    icon: Wrench,
    image: '/images/tools/toolkit-elektronika.jpg',
    imageCaption: 'Foto Asli Toolkit Perkakas Presisi - Tang Potong, Pinset ESD & Obeng Mekanik'
  },
  {
    id: 'jangka-sorong-digital', name: 'Jangka Sorong Digital', category: 'iot', level: 1,
    levelName: 'Level 1 : Akses Dasar', status: 'inuse', statusLabel: 'Sedang Dipakai',
    hoursLogged: 8, hoursLimit: 500, area: 'Meja Persiapan', speed: 'Pengukuran presisi', materials: 'Komponen & prototipe', hourlyRate: 5000,
    icon: Gauge,
    image: '/images/tools/jangka-sorong-digital.jpg',
    imageCaption: 'Foto Asli Jangka Sorong Digital - Kaliper Stainless Steel Akurasi 0.01 mm'
  }
];

const WHATSAPP_NUMBER = '6283802436288';
const WHATSAPP_URL = `https://wa.me/${WHATSAPP_NUMBER}`;
const DISCORD_URL = 'https://discord.gg/vwmCHN78H';
const GITHUB_URL = 'https://github.com/idnmakerspace-lab';
const INSTAGRAM_URL = 'https://www.instagram.com/idnmakerspace';
const TIKTOK_URL = 'https://www.tiktok.com/@idn_makerspace';
const YOUTUBE_URL = 'https://www.youtube.com/@idnmakerspace';

function InstagramIcon({ size = 17, ...props }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
    </svg>
  );
}

function TikTokIcon({ size = 17, ...props }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5" />
    </svg>
  );
}

function YouTubeIcon({ size = 17, ...props }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      <path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17" />
      <polygon points="10 15 15 12 10 9 10 15" fill="currentColor" />
    </svg>
  );
}

function DiscordIcon({ size = 17, ...props }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      {...props}
    >
      <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.061 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.893.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.028zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
    </svg>
  );
}

function GitHubIcon({ size = 17, ...props }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      {...props}
    >
      <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0 1 12 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0 0 22 12.017C22 6.484 17.522 2 12 2z" />
    </svg>
  );
}

export default function App() {
  const [scrollProgress, setScrollProgress] = useState(0);
  // Hero Slider State
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isSliderPaused, setIsSliderPaused] = useState(false);

  // Live Grace Period Countdown (BR-03 Anti-Ghosting)
  const [graceSeconds, setGraceSeconds] = useState(14 * 60 + 59);

  // Auto-advance hero slider
  useEffect(() => {
    if (isSliderPaused) return;
    const timer = setInterval(() => {
      setCurrentSlide(prev => (prev + 1) % HERO_SLIDES.length);
    }, 5500);
    return () => clearInterval(timer);
  }, [isSliderPaused]);

  // Anti-ghosting timer counting down 1s every second
  useEffect(() => {
    const timer = setInterval(() => {
      setGraceSeconds(prev => (prev > 0 ? prev - 1 : 14 * 60 + 59));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Let the page feel responsive to the reader without introducing a heavy animation library.
  useEffect(() => {
    const updateProgress = () => {
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      setScrollProgress(maxScroll > 0 ? (window.scrollY / maxScroll) * 100 : 0);
    };

    const revealObserver = new IntersectionObserver(
      (entries) => entries.forEach((entry) => {
        if (entry.isIntersecting) entry.target.classList.add('is-visible');
      }),
      { threshold: 0.14 }
    );

    document.querySelectorAll('.scroll-reveal').forEach((element) => revealObserver.observe(element));
    updateProgress();
    window.addEventListener('scroll', updateProgress, { passive: true });
    window.addEventListener('resize', updateProgress);

    return () => {
      revealObserver.disconnect();
      window.removeEventListener('scroll', updateProgress);
      window.removeEventListener('resize', updateProgress);
    };
  }, []);

  const formatGraceTime = (sec) => {
    const m = Math.floor(sec / 60).toString().padStart(2, '0');
    const s = (sec % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  // User Profile / Safety Clearance State
  const [userProfile, setUserProfile] = useState({
    name: 'Fatih Pratama',
    role: 'Maker Member',
    creditsBalance: 175000,
    badges: [1, 2] // Has Level 1 & Level 2 verified
  });

  // Machine Filter Tab
  const [activeMachineFilter, setActiveMachineFilter] = useState('all');

  // Stakeholder Portal Tab
  const [activeStakeholder, setActiveStakeholder] = useState('makers');

  // Material Calculator State (BR-06)
  const [calcMaterial, setCalcMaterial] = useState('pla');
  const [calcAmount, setCalcAmount] = useState(120);
  const [calcMachineHours, setCalcMachineHours] = useState(2);

  // Pricing Interval Toggle
  const [pricingCycle, setPricingCycle] = useState('monthly');

  // Booking Wizard Modal State
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [bookingStep, setBookingStep] = useState(1);
  const [selectedMachine, setSelectedMachine] = useState(MACHINES_DATA[0]);
  const todayDateStr = new Date().toISOString().split('T')[0];
  const [selectedDate, setSelectedDate] = useState(todayDateStr);
  const [selectedSlot, setSelectedSlot] = useState('14:00 - 14:30');
  const [estimatedFilament, setEstimatedFilament] = useState(60);
  const [agreedAntiGhosting, setAgreedAntiGhosting] = useState(false);
  const [generatedTicket, setGeneratedTicket] = useState(null);

  // K3 Induction Quiz Modal State
  const [isQuizModalOpen, setIsQuizModalOpen] = useState(false);
  const [quizScore, setQuizScore] = useState(0);
  const [quizAnswers, setQuizAnswers] = useState({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);

  // Machine Real Image Preview (Eye View Modal)
  const [selectedToolPreview, setSelectedToolPreview] = useState(null);

  // Filtered Machines
  const filteredMachines = MACHINES_DATA.filter(m => {
    if (activeMachineFilter === 'all') return true;
    return m.category === activeMachineFilter;
  });

  // Calculate Material Cost
  const calculateMaterialCost = () => {
    let materialUnitCost = 0;
    if (calcMaterial === 'pla') materialUnitCost = 350; // per gram
    if (calcMaterial === 'petg') materialUnitCost = 450; // per gram
    if (calcMaterial === 'acrylic') materialUnitCost = 18; // per cm2
    if (calcMaterial === 'balsa') materialUnitCost = 12; // per cm2
    if (calcMaterial === 'resin') materialUnitCost = 850; // per ml

    const materialSubtotal = calcAmount * materialUnitCost;
    const machineSubtotal = calcMachineHours * 35000;
    const totalCost = materialSubtotal + machineSubtotal;

    return {
      materialSubtotal,
      machineSubtotal,
      totalCost
    };
  };

  const currentCalc = calculateMaterialCost();

  // Handle Start Booking
  const handleOpenBooking = (machine = null) => {
    if (machine) {
      setSelectedMachine(machine);
    }
    setBookingStep(1);
    setGeneratedTicket(null);
    setIsBookingModalOpen(true);
  };

  const openWhatsApp = (message) => {
    window.open(`${WHATSAPP_URL}?text=${encodeURIComponent(message)}`, '_blank', 'noopener,noreferrer');
  };

  // Kirim permintaan ke admin. Reservasi dan pembayaran baru sah setelah dikonfirmasi via WhatsApp.
  const handleFinishBooking = () => {
    const requestId = `IDN-REQ-${Math.floor(100000 + Math.random() * 900000)}`;
    const total = selectedMachine.hourlyRate + estimatedFilament * 350;
    setGeneratedTicket({
      id: requestId,
      machine: selectedMachine.name,
      slot: selectedSlot,
      date: selectedDate,
      cost: total
    });
    setBookingStep(6);
    openWhatsApp(`Halo IDN Makerspace, saya ingin mengajukan reservasi.\n\nKode permintaan: ${requestId}\nMesin: ${selectedMachine.name}\nTanggal: ${selectedDate}\nSlot: ${selectedSlot}\nEstimasi bahan PLA+: ${estimatedFilament} gram\nEstimasi total: Rp ${total.toLocaleString('id-ID')}\n\nMohon konfirmasi ketersediaan slot dan instruksi pembayaran. Terima kasih.`);
  };

  const handleTopUpWhatsApp = () => {
    openWhatsApp('Halo IDN Makerspace, saya ingin top up saldo / menanyakan metode pembayaran. Mohon kirim instruksi pembayarannya. Terima kasih.');
  };

  const handleMembershipWhatsApp = (tierName, priceNote) => {
    openWhatsApp(`Halo IDN Makerspace, saya tertarik bergabung dengan paket ${tierName} (${priceNote}). Mohon informasi pendaftaran dan aktivasi benefit member. Terima kasih!`);
  };

  const handleWorkshopWhatsApp = (workshopTitle, fee) => {
    openWhatsApp(`Halo IDN Makerspace, saya ingin mendaftar workshop "${workshopTitle}" (${fee}). Mohon informasi jadwal kelas terdekat dan instruksi pembayarannya. Terima kasih!`);
  };

  // Handle Quiz Submission
  const handleQuizSubmit = (e) => {
    e.preventDefault();
    let score = 0;
    if (quizAnswers.q1 === 'b') score += 1;
    if (quizAnswers.q2 === 'c') score += 1;
    if (quizAnswers.q3 === 'a') score += 1;

    setQuizScore(score);
    setQuizSubmitted(true);

    if (score === 3) {
      setUserProfile(prev => ({
        ...prev,
        badges: prev.badges.includes(3) ? prev.badges : [...prev.badges, 3]
      }));
    }
  };

  return (
    <div className="app-root">
      {/* Subtle Ambient Glow Aura */}
      <div className="ambient-aura-wrapper" aria-hidden="true">
        <div className="ambient-orb ambient-orb-lime"></div>
        <div className="ambient-orb ambient-orb-cyan"></div>
        <div className="ambient-orb ambient-orb-purple"></div>
      </div>
      <div className="scroll-progress" aria-hidden="true">
        <span style={{ transform: `scaleX(${scrollProgress / 100})` }} />
      </div>

      {/* ========================================================
          HEADER NAVIGATION (CLEAN, FOCUSED)
          ======================================================== */}
      <header className="header-nav">
        <div className="container nav-container">
          <a href="#" className="nav-logo-group">
            <div className="nav-logo-text">
              <span className="nav-brand-title">
                IDN <span className="highlight-lime">MAKER SPACE</span>
              </span>
              <span className="nav-brand-sub">STEM CREATIVE HUB</span>
            </div>
          </a>

          <nav>
            <ul className="nav-links">
              <li><a href="#the-lab" className="nav-link">Fasilitas Mesin</a></li>
              <li><a href="#showcase" className="nav-link">Karya Maker</a></li>
              <li><a href="#pricing" className="nav-link">Paket &amp; Biaya</a></li>
              <li><a href="#workshops" className="nav-link">Workshop</a></li>
              <li><a href="#faq" className="nav-link">FAQ</a></li>
            </ul>
          </nav>

          <div className="nav-actions">
            <button
              type="button"
              className="badge-pill-btn"
              onClick={() => setIsQuizModalOpen(true)}
              title="Cek lencana keselamatan K3 Anda"
            >
              <Award size={14} />
              <span>Lv.{Math.max(...userProfile.badges)} K3</span>
            </button>

            <button
              type="button"
              className="btn-primary-lime"
              onClick={() => handleOpenBooking()}
            >
              <Calendar size={15} />
              <span>Reservasi Mesin</span>
            </button>
          </div>
        </div>
      </header>

      {/* ========================================================
          HERO SECTION: DYNAMIC BACKGROUND SLIDER & ATMOSPHERIC AESTHETIC
          ======================================================== */}
      <section className="hero-section">
        {/* Dynamic Background Slider with Ken Burns & Smooth Crossfade */}
        <div
          className="hero-slider-backdrop"
          onMouseEnter={() => setIsSliderPaused(true)}
          onMouseLeave={() => setIsSliderPaused(false)}
        >
          {HERO_SLIDES.map((slide, idx) => (
            <div
              key={slide.id}
              className={`hero-slide-bg ${idx === currentSlide ? 'active' : ''}`}
              style={{ backgroundImage: `url(${slide.image})` }}
              aria-hidden={idx !== currentSlide}
            />
          ))}
          <div className="hero-slider-overlay" />
        </div>

        <div className="container hero-grid">
          <div>
            <div className="hero-chip-badge">
              <span className="pulse-dot"></span>
              <span>{HERO_SLIDES[currentSlide].tag}</span>
            </div>

            <h1 className="hero-main-title">
              WHERE IDEAS <br />
              <span className="text-gradient-lime">TAKE SHAPE.</span>
              <span className="sr-only"> — IDN Makerspace: Lab Fabrikasi Hardware, 3D Printing Bambu Lab &amp; Prototyping Jakarta Selatan</span>
            </h1>

            <p className="hero-subtitle">
              Satu ekosistem terpadu laboratorium fabrikasi fisik (3D Printing, Elektronika, IoT)
              dengan sertifikasi K3 digital, pengajuan reservasi terarah, dan estimasi biaya bahan yang transparan.
            </p>

            <div className="hero-actions-row">
              <button
                type="button"
                className="btn-primary-lime"
                onClick={() => handleOpenBooking()}
              >
                <Calendar size={16} />
                <span>Mulai Reservasi Mesin</span>
              </button>

              <a href="#the-lab" className="btn-secondary-clean">
                <Wrench size={16} />
                <span>Katalog Mesin</span>
              </a>

              <button
                type="button"
                className="btn-outline-cyan"
                onClick={() => setIsQuizModalOpen(true)}
              >
                <ShieldCheck size={16} />
                <span>Uji Lisensi K3</span>
              </button>
            </div>

            <div className="hero-checklist-row">
              <span className="hero-check-item">
                <Check size={14} color="var(--accent-lime)" /> Standar K3 Terakreditasi
              </span>
              <span className="hero-check-item">
                <Check size={14} color="var(--accent-lime)" /> Konfirmasi Pesan via WhatsApp
              </span>
              <span className="hero-check-item">
                <Check size={14} color="var(--accent-lime)" /> Timbangan Digital Bahan
              </span>
            </div>
          </div>

          {/* Status Lab: informasi yang benar-benar membantu sebelum booking */}
          <div>
            <div className="telemetry-console-card">
              <div className="console-header-bar">
                <div className="console-window-dots">
                  <span className="dot-red"></span>
                  <span className="dot-yellow"></span>
                  <span className="dot-green"></span>
                </div>
                <span className="console-tag-title">Status Lab Hari Ini</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontFamily: 'var(--font-code)', fontSize: '0.72rem', color: 'var(--accent-lime)' }}>
                    BUKA
                  </span>
                </div>
              </div>

              <div className="telemetry-content-padding">
                <div className="telemetry-status-row">
                  <div>
                    <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', display: 'block' }}>LAYANAN TERSEDIA</span>
                    <span style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, color: 'var(--text-white)' }}>
                      6 dari 7 alat siap digunakan
                    </span>
                  </div>
                  <span className="status-badge-active">
                    <span className="pulse-dot"></span> UPDATE LANGSUNG
                  </span>
                </div>

                <div className="telemetry-metrics-grid">
                  <div className="telemetry-metric-item">
                    <div className="metric-label-mono"><Printer size={13} /> 3D Printer</div>
                    <div className="metric-value-dynamic">1<span className="metric-unit"> tersedia</span></div>
                  </div>

                  <div className="telemetry-metric-item">
                    <div className="metric-label-mono"><Zap size={13} /> Elektronika</div>
                    <div className="metric-value-dynamic">5<span className="metric-unit"> alat</span></div>
                  </div>

                  <div className="telemetry-metric-item">
                    <div className="metric-label-mono"><Gauge size={13} /> Pengukuran</div>
                    <div className="metric-value-dynamic">1<span className="metric-unit"> sedang dipakai</span></div>
                  </div>

                  <div className="telemetry-metric-item">
                    <div className="metric-label-mono"><Clock size={13} /> Jam Lab</div>
                    <div className="metric-value-dynamic">08–17<span className="metric-unit"> WIB</span></div>
                  </div>
                </div>

                <div className="console-alert-notice">
                  Pilih alat di katalog untuk melihat tarif dan meminta slot penggunaan.
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Hero Slider Interactive Controls Bar */}
        <div className="container" style={{ marginTop: '30px' }}>
          <div className="hero-slider-controls">
            <div className="slider-tabs-group">
              {HERO_SLIDES.map((slide, idx) => (
                <button
                  key={slide.id}
                  type="button"
                  className={`slider-tab-btn ${idx === currentSlide ? 'active' : ''}`}
                  onClick={() => setCurrentSlide(idx)}
                >
                  <span className="slider-tab-tag">Pilihan {idx + 1}</span>
                  <span>{slide.title.split(' ')[0]} {slide.title.split(' ')[1]}</span>
                  {idx === currentSlide && <span className="slider-progress-bar"></span>}
                </button>
              ))}
            </div>

            <div className="slider-nav-arrows">
              <button
                type="button"
                className="slider-arrow-btn"
                onClick={() => setCurrentSlide(prev => (prev === 0 ? HERO_SLIDES.length - 1 : prev - 1))}
                title="Slide sebelumnya"
              >
                <ChevronLeft size={16} />
              </button>
              <button
                type="button"
                className="slider-arrow-btn"
                onClick={() => setIsSliderPaused(prev => !prev)}
                title={isSliderPaused ? "Putar otomatis" : "Jeda slider"}
              >
                {isSliderPaused ? <Play size={14} /> : <Pause size={14} />}
              </button>
              <button
                type="button"
                className="slider-arrow-btn"
                onClick={() => setCurrentSlide(prev => (prev + 1) % HERO_SLIDES.length)}
                title="Slide berikutnya"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================
          PROJECT SHOWCASE & COMMUNITY SOCIAL PROOF
          ======================================================== */}
      <section id="showcase" className="section-wrapper section-band-cyan scroll-reveal">
        <div className="container">
          <div className="showcase-heading-row">
            <div>
              <span className="showcase-kicker"><Camera size={14} /> DIBUAT DI IDN MAKERSPACE</span>
              <h2 className="section-headline">Dari Ide Menjadi <span className="text-gradient-lime">Karya Nyata</span></h2>
              <p className="section-desc-lead showcase-desc">
                Lihat kualitas hasil dan suasana kolaborasi sebelum kamu memesan alat. Setiap proyek dimulai dari meja yang sama.
              </p>
            </div>
            <div className="showcase-proof">
              <strong>250+</strong>
              <span>maker telah belajar &amp; berkarya bersama</span>
            </div>
          </div>

          <div className="showcase-grid">
            <article className="showcase-card showcase-card-featured">
              <img src="/images/slide-3dprint.webp" alt="Proses dan hasil prototipe 3D printing di IDN Makerspace" />
              <div className="showcase-card-overlay">
                <span>3D PRINTING</span>
                <h3>Prototipe presisi, siap diuji</h3>
                <p>PLA, PETG, dan TPU dengan pendampingan Lab Assistant.</p>
              </div>
            </article>
            <article className="showcase-card">
              <img src="/images/electronics-iot-real.webp" alt="Aktivitas perakitan elektronik dan IoT di makerspace" />
              <div className="showcase-card-overlay">
                <span>ELEKTRONIKA &amp; IOT</span>
                <h3>Rakit, ukur, iterasi</h3>
              </div>
            </article>
            <article className="showcase-card">
              <img src="/images/og-image.jpg" alt="Komunitas maker sedang berkolaborasi di IDN Makerspace" />
              <div className="showcase-card-overlay">
                <span>COMMUNITY LAB</span>
                <h3>Belajar bersama, tumbuh bersama</h3>
              </div>
            </article>
          </div>

          <div id="community" className="community-invite-panel">
            <div>
              <span className="showcase-kicker"><Users size={14} /> KOMUNITAS MAKER &amp; OPEN SOURCE</span>
              <h3>Punya ide, butuh teman diskusi &amp; kolaborasi?</h3>
              <p>
                Gabung server Discord resmi IDN Makerspace untuk diskusi proyek, tanya jawab mikrokontroler &amp; 3D printing, serta pantau repositori riset dan template kami di GitHub.
              </p>
            </div>
            <div className="community-invite-actions">
              <a
                href={DISCORD_URL}
                target="_blank"
                rel="noreferrer"
                className="btn-primary-lime"
                title="Gabung Discord Server IDN Makerspace"
              >
                <DiscordIcon size={16} /> Gabung Discord
              </a>
              <a
                href={GITHUB_URL}
                target="_blank"
                rel="noreferrer"
                className="btn-secondary-clean"
                title="Lihat Repositori GitHub idnmakerspace-lab"
              >
                <GitHubIcon size={16} /> Repositori GitHub
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================
          KPI STRATEGIC BANNER (CLEAN, INTEGRATED)
          ======================================================== */}
      <div className="stats-banner-strip scroll-reveal secondary-landing-content">
        <div className="container">
          <div className="stats-card-container">
            <div className="stats-grid-quad">
              <div className="stat-box-modern">
                <div className="stat-numeric-big">&gt;65<span className="highlight-stat">%</span></div>
                <div className="stat-title-strong">Utilisasi Alat Optimal</div>
                <div className="stat-sub-text">Meminimalkan waktu diam mesin investasi tinggi per kuartal.</div>
              </div>

              <div className="stat-box-modern">
                <div className="stat-numeric-big">&lt;2<span className="highlight-stat">%</span></div>
                <div className="stat-title-strong">Mitigasi Risiko K3</div>
                <div className="stat-sub-text">Downtime akibat human-error ditekan lewat sertifikasi bertingkat.</div>
              </div>

              <div className="stat-box-modern">
                <div className="stat-numeric-big">9 <span className="highlight-stat">Bulan</span></div>
                <div className="stat-title-strong">Keberlanjutan Finansial</div>
                <div className="stat-sub-text">Target break-even operational cost melalui ekosistem terpadu.</div>
              </div>

              <div className="stat-box-modern">
                <div className="stat-numeric-big">&gt;45<span className="highlight-stat">%</span></div>
                <div className="stat-title-strong">Retensi Komunitas</div>
                <div className="stat-sub-text">Tingkat repeat-booking bulanan member dan startup rekayasa.</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================
          4 ALUR OPERASIONAL TERINTEGRASI (THE CORE ECOSYSTEM)
          ======================================================== */}
      <section id="ecosystem" className="section-wrapper section-band-cyan scroll-reveal secondary-landing-content">
        <div className="container">
          <div className="section-header-centered">
            <h2 className="section-headline">
              Sistem Ekosistem Fabrikasi &amp; <span className="text-gradient-lime">K3 Terintegrasi</span>
            </h2>
            <p className="section-desc-lead">
              Layanan awal untuk belajar, membuat prototipe sederhana, dan tumbuh bersama komunitas.
            </p>
          </div>

          <div className="ecosystem-four-grid">
            <div className="ecosystem-card">
              <span className="card-step-badge">PILAR 01</span>
              <div className="card-icon-bubble"><Users size={20} /></div>
              <h3>Tier Membership</h3>
              <p>
                Pilih akses harian atau membership ringan sesuai kebutuhanmu saat ini.
              </p>
            </div>

            <div className="ecosystem-card">
              <span className="card-step-badge">PILAR 02</span>
              <div className="card-icon-bubble"><ShieldCheck size={20} /></div>
              <h3>Digital Safety Badging</h3>
              <p>
                Panduan penggunaan alat dasar dan pendampingan untuk 3D printing.
              </p>
            </div>

            <div className="ecosystem-card">
              <span className="card-step-badge">PILAR 03</span>
              <div className="card-icon-bubble"><Clock size={20} /></div>
              <h3>Reservasi &amp; Anti-Ghosting</h3>
              <p>
                Pesan slot, datang tepat waktu, dan mulai berkarya.
              </p>
            </div>

            <div className="ecosystem-card">
              <span className="card-step-badge">PILAR 04</span>
              <div className="card-icon-bubble"><CreditCard size={20} /></div>
              <h3>Integrated Material Billing</h3>
              <p>
                Bahan cetak 3D dihitung sesuai pemakaian.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================
          FASILITAS MESIN (THE LAB & HARDWARE ARSENAL)
          ======================================================== */}
      <section id="the-lab" className="section-wrapper section-band-deep scroll-reveal">
        <div className="container">
          <div className="section-header-centered">
            <h2 className="section-headline">
              Fasilitas &amp; <span className="text-gradient-lime">Peralatan Canggih</span>
            </h2>
            <p className="section-desc-lead">
              Pilih alat yang tersedia, cek tarifnya, lalu pesan slot penggunaan.
            </p>
          </div>

          {/* Filter Tabs */}
          <div className="lab-filter-tabs">
            <button
              type="button"
              className={`lab-tab-btn ${activeMachineFilter === 'all' ? 'active' : ''}`}
              onClick={() => setActiveMachineFilter('all')}
            >
              Semua Mesin ({MACHINES_DATA.length})
            </button>
            <button
              type="button"
              className={`lab-tab-btn ${activeMachineFilter === '3dprint' ? 'active' : ''}`}
              onClick={() => setActiveMachineFilter('3dprint')}
            >
              3D Printing
            </button>
            <button
              type="button"
              className={`lab-tab-btn ${activeMachineFilter === 'iot' ? 'active' : ''}`}
              onClick={() => setActiveMachineFilter('iot')}
            >
              Elektronika &amp; Perkakas
            </button>
          </div>

          {/* Machines Catalog Grid */}
          <div className="machines-catalog-grid">
            {filteredMachines.map(machine => {
              const progressPct = Math.round((machine.hoursLogged / machine.hoursLimit) * 100);

              return (
                <div key={machine.id} className="machine-card-detailed">
                  <div className="machine-card-header">
                    <div>
                      <div className="machine-type-kicker">{machine.levelName}</div>
                      <h3 className="machine-card-title">{machine.name}</h3>
                    </div>
                    <span className={`machine-status-badge ${
                      machine.status === 'available' ? 'badge-status-available' : 'badge-status-inuse'
                    }`}>
                      {machine.statusLabel}
                    </span>
                  </div>

                  <div className="machine-card-body">
                    <div className="machine-specs-row">
                      <div className="spec-item">
                        <span className="spec-k">WORK AREA</span>
                        <span className="spec-v">{machine.area}</span>
                      </div>
                      <div className="spec-item">
                        <span className="spec-k">SPESIFIKASI</span>
                        <span className="spec-v">{machine.speed}</span>
                      </div>
                    </div>

                    <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
                      <strong style={{ color: 'var(--text-white)' }}>Material:</strong> {machine.materials}
                    </div>

                    {/* Preventive Maintenance Log */}
                    <div className="maintenance-tracker-box">
                      <div className="maintenance-tracker-head">
                        <span>Jam Kerja Nozzle / Spindle (BR-05)</span>
                        <span style={{ fontFamily: 'var(--font-code)', color: progressPct > 80 ? 'var(--accent-amber)' : 'var(--accent-lime)' }}>
                          {machine.hoursLogged} / {machine.hoursLimit} Jam ({progressPct}%)
                        </span>
                      </div>
                      <div className="maintenance-progress-bar-bg">
                        <div
                          className={`maintenance-progress-fill ${progressPct > 80 ? 'fill-caution' : 'fill-safe'}`}
                          style={{ width: `${progressPct}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>

                  <div className="machine-card-footer">
                    <div className="machine-footer-price-row">
                      <span className="price-kicker">TARIF SEWA DASAR</span>
                      <div className="price-val-wrap">
                        <span className="price-amount">
                          Rp {machine.hourlyRate.toLocaleString('id-ID')}
                        </span>
                        <span className="price-unit"> / jam</span>
                      </div>
                    </div>

                    <div className="machine-footer-actions">
                      <button
                        type="button"
                        className="btn-view-eye"
                        title={`Lihat foto asli ${machine.name}`}
                        aria-label={`Lihat foto asli ${machine.name}`}
                        onClick={() => setSelectedToolPreview(machine)}
                      >
                        <Eye size={15} />
                        <span>Lihat Foto</span>
                      </button>

                      <button
                        type="button"
                        className="btn-primary-lime"
                        onClick={() => handleOpenBooking(machine)}
                      >
                        <span>Pesan Slot</span>
                        <ArrowRight size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ========================================================
          GERBANG SERTIFIKASI ALAT & MATRIKS K3 (BR-02)
          ======================================================== */}
      <section id="k3-safety" className="section-wrapper section-band-deep scroll-reveal lab-safety-panel" style={{ paddingTop: 0 }}>
        <div className="container">
          <div className="safety-badging-container">
            <div className="section-header-centered" style={{ marginBottom: '28px' }}>
              <h2 className="section-headline">
                Gerbang Sertifikasi Alat &amp; <span className="text-gradient-lime">Matriks K3</span>
              </h2>
              <p className="section-desc-lead">
                Seluruh mesin diklasifikasikan ke dalam 3 level bahaya untuk mencegah insiden downtime
                dan memastikan keselamatan kerja setiap member.
              </p>
            </div>

            <div className="safety-matrix-grid">
              {/* Level 1 */}
              <div className="safety-card level-green">
                <span className="safety-level-pill pill-green">
                  <Shield size={13} /> LEVEL 1 : HIJAU (AMAN)
                </span>
                <h3>Alat Elektronika Dasar</h3>
                <p className="req-text">
                  Gunakan bersama Lab Assistant untuk memastikan alat dipakai dengan benar.
                </p>
                <div className="machines-under-level">
                  <div className="machines-under-level-title">Peralatan Tercover:</div>
                  <div className="machine-tag-list">
                    <span className="machine-mini-badge">Hakko Solder Station</span>
                    <span className="machine-mini-badge">Power Supply Sunshine Pro</span>
                    <span className="machine-mini-badge">Multimeter UNI-T</span>
                    <span className="machine-mini-badge">Perkakas Elektronika</span>
                  </div>
                </div>
                <div style={{ fontSize: '0.72rem', color: '#4ade80', fontFamily: 'var(--font-code)' }}>
                  STATUS AKUN: AKTIF BEBAS
                </div>
              </div>

              {/* Level 2 */}
              <div className="safety-card level-yellow">
                <span className="safety-level-pill pill-yellow">
                  <AlertTriangle size={13} /> LEVEL 2 : KUNING (MODERAT)
                </span>
                <h3>3D Printing</h3>
                <p className="req-text">
                  Bambu Lab A1 mini digunakan dengan pendampingan Lab Assistant.
                </p>
                <div className="machines-under-level">
                  <div className="machines-under-level-title">Peralatan Tercover:</div>
                  <div className="machine-tag-list">
                    <span className="machine-mini-badge">Bambu Lab A1 mini</span>
                  </div>
                </div>
                <div style={{ fontSize: '0.72rem', color: '#fbbf24', fontFamily: 'var(--font-code)' }}>
                  SYARAT: Kuis Teori K3 Online
                </div>
              </div>

              {/* Level 3 */}
              <div className="safety-card level-red">
                <span className="safety-level-pill pill-red">
                  <ShieldAlert size={13} /> LEVEL 3 : MERAH (RISIKO TINGGI)
                </span>
                <h3>Pengembangan Fasilitas</h3>
                <p className="req-text">
                  Alat lanjutan seperti hot air station, logic analyzer, dan mikroskop SMD belum tersedia.
                </p>
                <div className="machines-under-level">
                  <div className="machines-under-level-title">Peralatan Tercover:</div>
                  <div className="machine-tag-list">
                    <span className="machine-mini-badge">Hot Air Rework Station</span>
                    <span className="machine-mini-badge">Logic Analyzer</span>
                    <span className="machine-mini-badge">Mikroskop SMD</span>
                  </div>
                </div>
                <div style={{ fontSize: '0.72rem', color: '#f87171', fontFamily: 'var(--font-code)' }}>
                  ROADMAP: BELUM TERSEDIA
                </div>
              </div>
            </div>

            {/* Action Bar */}
            <div className="safety-action-box">
              <div className="safety-action-text">
                <h4>Status Anda: Akses Alat Dasar</h4>
                <p>Ikuti panduan singkat sebelum memakai alat elektronik atau 3D printer.</p>
              </div>
              <button
                type="button"
                className="btn-primary-lime"
                onClick={() => setIsQuizModalOpen(true)}
              >
                <Award size={16} />
                <span>Mulai Panduan Alat</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================
          PILIH PAKET KREATIVITASMU (MEMBERSHIP BR-01)
          ======================================================== */}
      <section id="pricing" className="section-wrapper section-band-lime scroll-reveal experience-group-start">
        <div className="container">
          <div className="section-header-centered">
            <h2 className="section-headline">
              Pilih Paket <span className="text-gradient-lime">Kreativitasmu</span>
            </h2>
            <p className="section-desc-lead">
              Harga dibuat ringan karena fasilitas masih berkembang. Sewa alat dihitung terpisah.
            </p>

            <div style={{ marginTop: '18px', display: 'inline-flex', gap: '6px', background: 'rgba(255,255,255,0.04)', padding: '4px', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}>
              <button
                type="button"
                className={`lab-tab-btn ${pricingCycle === 'monthly' ? 'active' : ''}`}
                style={{ padding: '6px 14px' }}
                onClick={() => setPricingCycle('monthly')}
              >
                Langganan Bulanan
              </button>
              <button
                type="button"
                className={`lab-tab-btn ${pricingCycle === 'payg' ? 'active' : ''}`}
                style={{ padding: '6px 14px' }}
                onClick={() => setPricingCycle('payg')}
              >
                Pay As You Go (Harian)
              </button>
            </div>
          </div>

          <div className="pricing-tier-grid">
            {/* Walk-In */}
            <div className="pricing-card">
              <h3 className="tier-name">Walk-In</h3>
              <p className="tier-target">Untuk pembuat lepas &amp; coba-coba</p>
              <div className="tier-price-row">
                <span className="tier-price-amount">Rp 0</span>
                <span className="tier-price-period">/ komitmen</span>
              </div>
              <ul className="tier-features-list">
                <li><Check size={14} /> Tarif sewa Rp 35k - 75k per jam</li>
                <li><Check size={14} /> Bebas akses Meja Solder &amp; IoT</li>
                <li><Check size={14} /> Pembayaran dikonfirmasi via WhatsApp</li>
                <li><Check size={14} /> Sertifikasi keselamatan online</li>
                <li style={{ color: 'var(--text-muted)' }}><X size={14} /> Tanpa kuota jam bulanan</li>
              </ul>
              <button type="button" className="btn-secondary-clean" onClick={() => handleOpenBooking()}>
                Pilih Walk-In
              </button>
            </div>

            {/* Student Tier */}
            <div className="pricing-card">
              <h3 className="tier-name">Student Tier</h3>
              <p className="tier-target">Khusus mahasiswa &amp; peneliti</p>
              <div className="tier-price-row">
                <span className="tier-price-amount">Rp 49k</span>
                <span className="tier-price-period">/ bulan</span>
              </div>
              <ul className="tier-features-list">
                <li><Check size={14} /> Diskon 10% sewa Bambu Lab A1 mini</li>
                <li><Check size={14} /> Akses alat elektronik dasar</li>
                <li><Check size={14} /> Harga workshop member</li>
                <li><Check size={14} /> Pendampingan dasar</li>
                <li><Check size={14} /> Verifikasi kartu mahasiswa (KTM)</li>
              </ul>
              <button type="button" className="btn-outline-cyan" onClick={() => handleMembershipWhatsApp('Student Tier', 'Rp 49.000 / bulan')}>
                Daftar Mahasiswa
              </button>
            </div>

            {/* Pro Maker */}
            <div className="pricing-card featured-tier">
              <span className="popular-ribbon">POPULER</span>
              <h3 className="tier-name">Pro Maker</h3>
              <p className="tier-target">Untuk kreator yang aktif berkarya</p>
              <div className="tier-price-row">
                <span className="tier-price-amount" style={{ color: 'var(--accent-lime)' }}>Rp 99k</span>
                <span className="tier-price-period">/ bulan</span>
              </div>
              <ul className="tier-features-list">
                <li><Check size={14} /> Prioritas reservasi Bambu Lab A1 mini</li>
                <li><Check size={14} /> Diskon 15% bahan PLA</li>
                <li><Check size={14} /> Harga workshop member</li>
                <li><Check size={14} /> Akses komunitas makers</li>
                <li><Check size={14} /> Update roadmap fasilitas</li>
              </ul>
              <button type="button" className="btn-primary-lime" onClick={() => handleMembershipWhatsApp('Pro Maker', 'Rp 99.000 / bulan')}>
                Pilih Pro Maker
              </button>
            </div>

            {/* Team / Startup */}
            <div className="pricing-card">
              <h3 className="tier-name">Team / Startup</h3>
              <p className="tier-target">Untuk tim kecil dan proyek bersama</p>
              <div className="tier-price-row">
                <span className="tier-price-amount">Hubungi kami</span>
                <span className="tier-price-period">/ kebutuhan tim</span>
              </div>
              <ul className="tier-features-list">
                <li><Check size={14} /> Sesi penggunaan untuk tim</li>
                <li><Check size={14} /> Pendampingan proyek dasar</li>
                <li><Check size={14} /> Kelas privat sesuai jadwal</li>
                <li><Check size={14} /> Penawaran sesuai kebutuhan</li>
                <li><Check size={14} /> Fasilitas lanjutan masih roadmap</li>
              </ul>
              <button type="button" className="btn-secondary-clean" onClick={() => handleMembershipWhatsApp('Team / Startup', 'Konsultasi Tim')}>
                Hubungi Kami
              </button>
            </div>
          </div>

          {/* Credits Top-Up Banner */}
          <div className="credits-banner-strip">
            <div className="credits-info">
              <h4>Top Up Saldo Hemat dengan Makerspace Credits</h4>
              <p>Ajukan top up untuk pembelian filamen, akrilik, dan sewa mesin. Instruksi pembayaran serta konfirmasi dikirim langsung oleh admin via WhatsApp.</p>
            </div>
            <button
              type="button"
              className="btn-primary-lime"
              onClick={handleTopUpWhatsApp}
            >
              <CreditCard size={15} /> Top Up Saldo Sekarang
            </button>
          </div>
        </div>
      </section>

      {/* ========================================================
          KALKULATOR KONSUMABEL & BILLING BAHAN (BR-06)
          ======================================================== */}
      <section id="materials" className="section-wrapper section-band-deep scroll-reveal experience-group-end" style={{ paddingTop: 0 }}>
        <div className="container">
          <div className="section-header-centered">
            <h2 className="section-headline">
              Kalkulator Bahan &amp; <span className="text-gradient-lime">Konsumabel Fabrikasi</span>
            </h2>
            <p className="section-desc-lead">
              Transparansi biaya fabrikasi tanpa kejutan. Hitung estimasi pemakaian filamen 3D, akrilik lembaran,
              kayu balsa, dan resin SLA sebelum meminta konfirmasi admin.
            </p>
          </div>

          <div className="calculator-box">
            <div>
              <div className="calc-input-group">
                <label className="calc-label">1. Pilih Jenis Bahan Baku</label>
                <div className="material-select-chips">
                  <button
                    type="button"
                    className={`material-chip ${calcMaterial === 'pla' ? 'active' : ''}`}
                    onClick={() => setCalcMaterial('pla')}
                  >
                    Filamen PLA+ (Rp 350/gr)
                  </button>
                  <button
                    type="button"
                    className={`material-chip ${calcMaterial === 'petg' ? 'active' : ''}`}
                    onClick={() => setCalcMaterial('petg')}
                  >
                    Filamen PETG (Rp 450/gr)
                  </button>
                  <button
                    type="button"
                    className={`material-chip ${calcMaterial === 'acrylic' ? 'active' : ''}`}
                    onClick={() => setCalcMaterial('acrylic')}
                  >
                    Akrilik Bening 3mm (Rp 18/cm²)
                  </button>
                  <button
                    type="button"
                    className={`material-chip ${calcMaterial === 'balsa' ? 'active' : ''}`}
                    onClick={() => setCalcMaterial('balsa')}
                  >
                    Kayu Balsa 5mm (Rp 12/cm²)
                  </button>
                  <button
                    type="button"
                    className={`material-chip ${calcMaterial === 'resin' ? 'active' : ''}`}
                    onClick={() => setCalcMaterial('resin')}
                  >
                    Resin SLA 8K (Rp 850/ml)
                  </button>
                </div>
              </div>

              <div className="calc-input-group">
                <label className="calc-label">
                  2. Estimasi Jumlah Pemakaian ({calcMaterial === 'acrylic' || calcMaterial === 'balsa' ? 'cm² Luas Area' : calcMaterial === 'resin' ? 'ml Resin' : 'Gram Filamen'})
                </label>
                <div className="slider-container">
                  <input
                    type="range"
                    min="10"
                    max="500"
                    step="5"
                    value={calcAmount}
                    onChange={(e) => setCalcAmount(parseInt(e.target.value))}
                    className="custom-range-slider"
                  />
                  <div className="slider-val-box">
                    {calcAmount} {calcMaterial === 'acrylic' || calcMaterial === 'balsa' ? 'cm²' : calcMaterial === 'resin' ? 'ml' : 'gr'}
                  </div>
                </div>
              </div>

              <div className="calc-input-group">
                <label className="calc-label">3. Durasi Sewa Mesin</label>
                <div className="slider-container">
                  <input
                    type="range"
                    min="1"
                    max="8"
                    step="1"
                    value={calcMachineHours}
                    onChange={(e) => setCalcMachineHours(parseInt(e.target.value))}
                    className="custom-range-slider"
                  />
                  <div className="slider-val-box">
                    {calcMachineHours} Jam
                  </div>
                </div>
              </div>
            </div>

            {/* Bill Receipt Card */}
            <div className="calc-receipt-card">
              <div>
                <div className="receipt-header">
                  <h3 className="receipt-title">Simulasi Estimasi Biaya</h3>
                  <span className="receipt-sub">KONFIRMASI AKHIR OLEH ADMIN</span>
                </div>

                <div className="receipt-items-list">
                  <div className="receipt-item-row">
                    <span>Sewa Mesin ({calcMachineHours} Jam x Rp 35k)</span>
                    <span style={{ fontFamily: 'var(--font-code)', color: 'var(--text-white)' }}>
                      Rp {currentCalc.machineSubtotal.toLocaleString('id-ID')}
                    </span>
                  </div>

                  <div className="receipt-item-row">
                    <span>Bahan Baku ({calcAmount} unit)</span>
                    <span style={{ fontFamily: 'var(--font-code)', color: 'var(--text-white)' }}>
                      Rp {currentCalc.materialSubtotal.toLocaleString('id-ID')}
                    </span>
                  </div>

                  <div className="receipt-item-row">
                    <span>Biaya Pemeliharaan &amp; K3</span>
                    <span style={{ fontFamily: 'var(--font-code)', color: 'var(--accent-lime)' }}>
                      Termasuk (Rp 0)
                    </span>
                  </div>
                </div>
              </div>

              <div>
                <div className="receipt-total-row">
                  <div>
                    <span className="total-label">Total Estimasi</span>
                    <span style={{ display: 'block', fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                      Belum ditagihkan; admin akan mengonfirmasi via WhatsApp
                    </span>
                  </div>
                  <div className="total-amount-lime">
                    Rp {currentCalc.totalCost.toLocaleString('id-ID')}
                  </div>
                </div>

                <button
                  type="button"
                  className="btn-primary-lime"
                  style={{ width: '100%', marginTop: '14px', justifyContent: 'center' }}
                  onClick={() => {
                    const matMeta = {
                      pla: { name: 'Filamen PLA+', unit: 'gram' },
                      petg: { name: 'Filamen PETG', unit: 'gram' },
                      acrylic: { name: 'Akrilik Bening 3mm', unit: 'cm²' },
                      balsa: { name: 'Kayu Balsa 5mm', unit: 'cm²' },
                      resin: { name: 'Resin SLA 8K', unit: 'ml' }
                    }[calcMaterial] || { name: calcMaterial, unit: 'unit' };
                    openWhatsApp(`Halo IDN Makerspace, saya ingin menanyakan estimasi biaya kalkulator website.\n\nBahan baku: ${matMeta.name} (${calcAmount} ${matMeta.unit})\nDurasi sewa mesin: ${calcMachineHours} jam\nEstimasi total: Rp ${currentCalc.totalCost.toLocaleString('id-ID')}\n\nMohon konfirmasi ketersediaan alat dan bahan. Terima kasih.`);
                  }}
                >
                  <MessageCircle size={15} /> Konfirmasi Estimasi via WhatsApp
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================
          PROGRAM & WORKSHOPS
          ======================================================== */}
      <section id="workshops" className="section-wrapper section-band-cyan scroll-reveal">
        <div className="container">
          <div className="section-header-centered">
            <h2 className="section-headline">
              Program &amp; <span className="text-gradient-lime">Workshop Kreatif</span>
            </h2>
            <p className="section-desc-lead">
              Mulai dari dasar bersama mentor Makerspace. Tidak perlu pengalaman sebelumnya.
            </p>
          </div>

          <div className="workshop-grid">
            <div className="workshop-card">
              <div className="workshop-meta-bar">
                <span>Praktik langsung · 6 jam</span>
                <span>RP 150.000</span>
              </div>
              <h3>IoT untuk Pemula</h3>
              <p>Buat proyek sensor sederhana dengan microcontroller dan komponen dasar.</p>
              <div className="workshop-badge-earned">
                <Award size={13} /> Dapatkan Badge IoT Dasar
              </div>
              <button
                type="button"
                className="btn-outline-cyan"
                style={{ width: '100%', marginTop: '14px', justifyContent: 'center', fontSize: '0.8rem', padding: '8px 14px' }}
                onClick={() => handleWorkshopWhatsApp('IoT untuk Pemula', 'Rp 150.000')}
              >
                Daftar Workshop IoT
              </button>
            </div>

            <div className="workshop-card">
              <div className="workshop-meta-bar">
                <span>Praktik · 4 jam</span>
                <span>RP 100.000</span>
              </div>
              <h3>Elektronika Dasar</h3>
              <p>Kenali komponen, pakai multimeter, dan belajar solder dengan aman.</p>
              <div className="workshop-badge-earned">
                <Award size={13} /> Dapatkan Badge Elektronika Dasar
              </div>
              <button
                type="button"
                className="btn-outline-cyan"
                style={{ width: '100%', marginTop: '14px', justifyContent: 'center', fontSize: '0.8rem', padding: '8px 14px' }}
                onClick={() => handleWorkshopWhatsApp('Elektronika Dasar', 'Rp 100.000')}
              >
                Daftar Workshop Elektronika
              </button>
            </div>

            <div className="workshop-card">
              <div className="workshop-meta-bar">
                <span>Intensif · 6 jam</span>
                <span>RP 150.000</span>
              </div>
              <h3>Pemrograman Web Dasar</h3>
              <p>Buat halaman web pertama dengan HTML, CSS, dan JavaScript.</p>
              <div className="workshop-badge-earned">
                <Award size={13} /> Dapatkan Badge Web Dasar
              </div>
              <button
                type="button"
                className="btn-outline-cyan"
                style={{ width: '100%', marginTop: '14px', justifyContent: 'center', fontSize: '0.8rem', padding: '8px 14px' }}
                onClick={() => handleWorkshopWhatsApp('Pemrograman Web Dasar', 'Rp 150.000')}
              >
                Daftar Workshop Web
              </button>
            </div>

            <div className="workshop-card" style={{ display: 'none' }}>
              <div className="workshop-meta-bar">
                <span>Lanjutan · 10 jam</span>
                <span>RP 450.000</span>
              </div>
              <h3>Precision CNC Routing &amp; G-Code</h3>
              <p>Setup coordinate zero, pemilihan bit router, feed rate kayu keras &amp; aluminium, dan pencegahan tool breakage.</p>
              <div className="workshop-badge-earned">
                <Award size={13} /> Dapatkan Badge CNC Operator
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================
          ANTI-GHOSTING & PENJADWALAN PRESISI (BR-03)
          ======================================================== */}
      <section className="section-wrapper section-band-amber scroll-reveal secondary-landing-content" style={{ paddingTop: 0 }}>
        <div className="container">
          <div className="anti-ghosting-banner">
            <div>
              <span className="card-step-badge" style={{ color: 'var(--accent-amber)', background: 'var(--accent-amber-soft)' }}>
                Aturan Booking
              </span>
              <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.85rem', fontWeight: 800, color: 'var(--text-white)', margin: '10px 0' }}>
                Mekanisme Penjadwalan &amp; <span style={{ color: 'var(--accent-amber)' }}>Anti-Ghosting</span>
              </h2>
              <p style={{ color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '18px', fontSize: '0.92rem' }}>
                Untuk mengeliminasi monopoli mesin dan memastikan utilisasi alat optimal (&gt;65%),
                setiap member wajib memindai QR Code Check-in di terminal Lab Assistant maksimal
                <strong> 15 menit</strong> setelah jam reservasi dimulai.
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.82rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-primary)' }}>
                  <Clock size={15} color="var(--accent-amber)" />
                  <strong>Interval Slot 30 Menit:</strong> Terstruktur dengan distributed locking anti double-booking.
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-primary)' }}>
                  <AlertTriangle size={15} color="var(--accent-red)" />
                  <strong>Pembatalan Otomatis:</strong> Telat &gt;15 menit menyebabkan slot dibatalkan dan saldo terkena penalti.
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-primary)' }}>
                  <QrCode size={15} color="var(--accent-lime)" />
                  <strong>Konfirmasi Admin:</strong> Detail booking dan instruksi check-in dikirim via WhatsApp setelah slot disetujui.
                </div>
              </div>
            </div>

            <div className="anti-ghosting-clock-card">
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: 'var(--accent-amber)', letterSpacing: '0.08em' }}>
                LIVE GRACE PERIOD COUNTDOWN
              </span>
              <div className="ghosting-timer-digits">{formatGraceTime(graceSeconds)}</div>
              <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', maxWidth: '280px', margin: '0 auto' }}>
                Waktu toleransi kedatangan di lokasi sebelum mesin dialihkan otomatis ke antrean walk-in.
              </p>
              <button
                type="button"
                className="btn-primary-lime"
                style={{ marginTop: '16px' }}
                onClick={() => handleOpenBooking()}
              >
                Simulasi Booking &amp; QR
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================
          MULTI-STAKEHOLDER & ROADMAP TAHAP (SECTION 4 & 7 BRD)
          ======================================================== */}
      <section className="section-wrapper section-band-deep scroll-reveal secondary-landing-content" style={{ paddingTop: 0 }}>
        <div className="container">
          <div className="section-header-centered">
            <h2 className="section-headline">
              Antarmuka Terpadu &amp; <span className="text-gradient-lime">Rencana Rilis</span>
            </h2>
            <p className="section-desc-lead">
              Dirancang untuk seluruh pemangku kepentingan, dari mahasiswa dan pembuat perangkat keras
              hingga tim manajemen dan mitra industri.
            </p>
          </div>

          <div className="stakeholder-tabs-container">
            <button
              type="button"
              className={`stakeholder-tab-pill ${activeStakeholder === 'makers' ? 'active' : ''}`}
              onClick={() => setActiveStakeholder('makers')}
            >
              <Users size={15} /> Makers / Mahasiswa
            </button>
            <button
              type="button"
              className={`stakeholder-tab-pill ${activeStakeholder === 'assistant' ? 'active' : ''}`}
              onClick={() => setActiveStakeholder('assistant')}
            >
              <Wrench size={15} /> Lab Assistant / Specialist
            </button>
            <button
              type="button"
              className={`stakeholder-tab-pill ${activeStakeholder === 'mentor' ? 'active' : ''}`}
              onClick={() => setActiveStakeholder('mentor')}
            >
              <Award size={15} /> Instruktur / Mentor
            </button>
            <button
              type="button"
              className={`stakeholder-tab-pill ${activeStakeholder === 'owner' ? 'active' : ''}`}
              onClick={() => setActiveStakeholder('owner')}
            >
              <TrendingUp size={15} /> Management / Owner
            </button>
          </div>

          <div className="stakeholder-detail-card" style={{ marginBottom: '32px' }}>
            {activeStakeholder === 'makers' && (
              <>
                <div className="stakeholder-info-pane">
                  <span className="card-step-badge">APLIKASI MEMBER // MOBILE &amp; DESKTOP</span>
                  <h3>Pusat Kreativitas Mahasiswa &amp; Hardware Startup</h3>
                  <p className="role-desc">
                    Akses tanpa friksi. Cek ketersediaan mesin secara real-time di smartphone Anda, booking slot 30 menit, dan catat dokumentasi portofolio proyek fisik Anda.
                  </p>
                  <ul className="feature-checklist">
                    <li><CheckCircle2 size={15} /> Ajukan reservasi mesin melalui WhatsApp admin</li>
                    <li><CheckCircle2 size={15} /> Instruksi dan konfirmasi pembayaran via WhatsApp</li>
                    <li><CheckCircle2 size={15} /> Estimasi biaya bahan yang transparan sebelum pesan</li>
                    <li><CheckCircle2 size={15} /> Lencana keselamatan K3 tersimpan permanen di akun</li>
                  </ul>
                  <button type="button" className="btn-primary-lime" onClick={() => handleOpenBooking()}>
                    Mulai Eksperimen Anda
                  </button>
                </div>

                <div className="stakeholder-mock-terminal">
                  <div className="terminal-top-bar">
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                      MEMBER_PORTAL // UI_PREVIEW
                    </span>
                    <span style={{ color: 'var(--accent-lime)', fontSize: '0.7rem' }}>ONLINE</span>
                  </div>
                  <div className="terminal-body">
                    <p style={{ color: 'var(--accent-lime)' }}>&gt; session: Active (Fatih Pratama)</p>
                    <p>&gt; tier: Pro Maker (20 Jam Kuota)</p>
                    <p>&gt; k3_clearance: Level 1 &amp; Level 2 (Verified)</p>
                    <p>&gt; upcoming_slot: Tomorrow 14:00 (Bambu Lab X1-C)</p>
                    <p>&gt; token_status: Grace period 15m active</p>
                    <p style={{ color: 'var(--accent-cyan)', marginTop: '10px' }}>
                      [LOG] 120g PLA Filament auto-debited Rp 42.000.
                    </p>
                  </div>
                </div>
              </>
            )}

            {activeStakeholder === 'assistant' && (
              <>
                <div className="stakeholder-info-pane">
                  <span className="card-step-badge">PORTAL LAPANGAN // TABLET &amp; DESKTOP</span>
                  <h3>Operasional Lapangan &amp; Validasi K3</h3>
                  <p className="role-desc">
                    Alat kerja utama bagi Fab Specialist di garasi. Memverifikasi kedatangan member via scanner QR, memeriksa kalibrasi mesin, dan menimbang sisa bahan.
                  </p>
                  <ul className="feature-checklist">
                    <li><CheckCircle2 size={15} /> Scanner QR Check-in kedatangan (15-min grace period)</li>
                    <li><CheckCircle2 size={15} /> Integrasi timbangan digital material konsumabel</li>
                    <li><CheckCircle2 size={15} /> Form inspeksi kalibrasi dan keselamatan harian</li>
                    <li><CheckCircle2 size={15} /> Pelaporan log insiden &amp; tiket maintenance mesin</li>
                  </ul>
                  <button type="button" className="btn-outline-cyan">Buka Dasbor Kasir</button>
                </div>

                <div className="stakeholder-mock-terminal">
                  <div className="terminal-top-bar">
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                      FIELD_DESK // SCANNER_MODE
                    </span>
                    <span style={{ color: 'var(--accent-cyan)', fontSize: '0.7rem' }}>READY</span>
                  </div>
                  <div className="terminal-body">
                    <p style={{ color: 'var(--accent-cyan)' }}>&gt; station: Lab Assistant Desk 01</p>
                    <p>&gt; scan_status: Member #IDN-4892 Verified</p>
                    <p>&gt; checkin_time: 14:04 (Anti-Ghosting Cleared)</p>
                    <p>&gt; scale_input: 84.50g Filament weighed</p>
                    <p style={{ color: 'var(--accent-lime)', marginTop: '10px' }}>
                      [SUCCESS] Bill Rp 29.575 deducted from Member deposit.
                    </p>
                  </div>
                </div>
              </>
            )}

            {activeStakeholder === 'mentor' && (
              <>
                <div className="stakeholder-info-pane">
                  <span className="card-step-badge">PORTAL MENTOR // MANAJEMEN KURSUS</span>
                  <h3>Pusat Pelatihan &amp; Pengujian Lencana K3</h3>
                  <p className="role-desc">
                    Mendukung instruktur menyelenggarakan kelas intensif perangkat keras, membagikan modul teknis, dan memvalidasi kelulusan ujian praktik peserta.
                  </p>
                  <ul className="feature-checklist">
                    <li><CheckCircle2 size={15} /> Penjadwalan workshop fabrikasi dan hands-on masterclass</li>
                    <li><CheckCircle2 size={15} /> Penilaian kelulusan ujian lencana keselamatan Level 2 &amp; 3</li>
                    <li><CheckCircle2 size={15} /> Distribusi modul teknis dan template cutting G-Code</li>
                    <li><CheckCircle2 size={15} /> Monitoring portofolio inovasi perangkat keras</li>
                  </ul>
                  <button type="button" className="btn-primary-lime">Buka Portal Mentor</button>
                </div>

                <div className="stakeholder-mock-terminal">
                  <div className="terminal-top-bar">
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                      MENTOR_CONSOLE // GRADING
                    </span>
                    <span style={{ color: 'var(--accent-amber)', fontSize: '0.7rem' }}>BATCH_04</span>
                  </div>
                  <div className="terminal-body">
                    <p style={{ color: 'var(--accent-amber)' }}>&gt; class: 3D Printing &amp; CAD Masterclass</p>
                    <p>&gt; students: 12 Makers enrolled</p>
                    <p>&gt; theory_quiz: 100% Passed Safety Rules</p>
                    <p>&gt; practical: Acrylic 5mm Precision Test (Cleared)</p>
                    <p style={{ color: 'var(--accent-lime)', marginTop: '10px' }}>
                      [ISSUED] 12x Level 3 Safety Badges deployed to member IDs.
                    </p>
                  </div>
                </div>
              </>
            )}

            {activeStakeholder === 'owner' && (
              <>
                <div className="stakeholder-info-pane">
                  <span className="card-step-badge">EXECUTIVE DASHBOARD // ANALYTICS SUITE</span>
                  <h3>Kendali Finansial &amp; Rasio Utilisasi</h3>
                  <p className="role-desc">
                    Menyajikan metrik performa tingkat tinggi bagi manajemen. Pantau pencapaian KPI utilisasi mesin (&gt;65%), pendapatan berulang membership, dan persediaan bahan.
                  </p>
                  <ul className="feature-checklist">
                    <li><CheckCircle2 size={15} /> Real-time machine utilization ratio (&gt;65% target KPI)</li>
                    <li><CheckCircle2 size={15} /> Laporan break-even operational cost &amp; burn rate</li>
                    <li><CheckCircle2 size={15} /> Manajemen stok grosir filamen &amp; akrilik</li>
                    <li><CheckCircle2 size={15} /> Metrik retensi repeat-booking bulanan (&gt;45%)</li>
                  </ul>
                  <button type="button" className="btn-outline-cyan">Akses Analytics Suite</button>
                </div>

                <div className="stakeholder-mock-terminal">
                  <div className="terminal-top-bar">
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                      EXECUTIVE_BI // METRICS
                    </span>
                    <span style={{ color: 'var(--accent-lime)', fontSize: '0.7rem' }}>TARGET_Q4</span>
                  </div>
                  <div className="terminal-body">
                    <p style={{ color: 'var(--accent-lime)' }}>&gt; kpi.machine_utilization: 68.4% [PASS &gt;65%]</p>
                    <p>&gt; kpi.k3_human_downtime: 0.8% [PASS &lt;2%]</p>
                    <p>&gt; kpi.monthly_retention: 52.1% [PASS &gt;45%]</p>
                    <p>&gt; monthly_recurring_revenue: Rp 84.500.000</p>
                    <p style={{ color: 'var(--accent-cyan)', marginTop: '10px' }}>
                      [FORECAST] Break-even operational target on track.
                    </p>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* 3-Phase Roadmap Grid */}
          <div className="roadmap-timeline-grid">
            <div className="roadmap-card">
              <span className="roadmap-phase-pill">FASE 1 (MVP)</span>
              <h3>Dasar Operasional &amp; Kasir</h3>
              <div className="roadmap-duration">Durasi: Bulan 1 – 2</div>
              <ul className="roadmap-items">
                <li>• Autentikasi Pengguna &amp; Profil Dasar (OTP WhatsApp)</li>
                <li>• Reservasi Kalender Mesin Dasar (Slot 30 Menit)</li>
                <li>• Integrasi QRIS Manual &amp; Otomatis</li>
                <li>• Kasir POS Lapangan Sederhana di Lokasi</li>
              </ul>
            </div>

            <div className="roadmap-card" style={{ borderColor: 'rgba(163, 255, 18, 0.35)' }}>
              <span className="roadmap-phase-pill" style={{ background: 'var(--accent-lime-soft)' }}>
                FASE 2 (SCALE-UP)
              </span>
              <h3>Lencana K3 &amp; Otomasi Material</h3>
              <div className="roadmap-duration">Durasi: Bulan 3 – 4</div>
              <ul className="roadmap-items">
                <li>• Modul Lencana K3 (Badging) &amp; Ujian Induction Online</li>
                <li>• Manajemen Inventaris Material Timbangan Digital</li>
                <li>• Notifikasi WhatsApp Pengingat Jadwal &amp; Bukti Tagihan</li>
                <li>• Preventive Maintenance Log Tracker Mesin</li>
              </ul>
            </div>

            <div className="roadmap-card">
              <span className="roadmap-phase-pill">FASE 3 (ECOSYSTEM)</span>
              <h3>Smart Access &amp; B2B Network</h3>
              <div className="roadmap-duration">Durasi: Bulan 5 – 6</div>
              <ul className="roadmap-items">
                <li>• Akses Pintu Fisik berbasis RFID &amp; Dynamic QR Gate</li>
                <li>• Modul Galeri Portofolio Proyek Terbuka &amp; Showcase</li>
                <li>• B2B Sub-contracting Dashboard untuk Klien Korporat</li>
                <li>• Multi-Branch Sync Antar Cabang IDN Makerspace</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================
          FAQ ACCORDION (CLEAN, MINIMALIST)
          ======================================================== */}
      <section id="faq" className="section-wrapper section-band-cyan scroll-reveal" style={{ paddingTop: 0 }}>
        <div className="container">
          <div className="section-header-centered">
            <h2 className="section-headline">
              Pertanyaan <span className="text-gradient-lime">Umum</span>
            </h2>
            <p className="section-desc-lead">
              Hal-hal penting seputar lisensi keselamatan kerja, pemesanan alat, dan penagihan bahan.
            </p>
          </div>

          <div className="faq-accordion-list">
            <details className="faq-item-card" open>
              <summary className="faq-question-btn">
                <span>Bagaimana cara mendapatkan lencana K3 untuk mesin Level 2 &amp; 3?</span>
              </summary>
              <div className="faq-answer-pane">
                Untuk mesin Level 2 (seperti 3D Printer), Anda cukup menyelesaikan modul teori K3 singkat dan kuis daring di platform ini.
                Peralatan lanjutan akan memiliki panduan dan pendampingan tersendiri saat sudah tersedia di workshop.
              </div>
            </details>

            <details className="faq-item-card">
              <summary className="faq-question-btn">
                <span>Apa yang terjadi jika saya terlambat datang saat jadwal booking?</span>
              </summary>
              <div className="faq-answer-pane">
                Sesuai regulasi anti-ghosting (BR-03), kami memberikan toleransi kedatangan maksimal 15 menit sejak jam pemesanan dimulai.
                Jika lewat 15 menit Anda belum memindai QR Check-in di meja Lab Assistant, sistem otomatis membatalkan pesanan Anda,
                biaya sewa slot dianggap hangus, dan mesin dialihkan kepada antrean berikutnya.
              </div>
            </details>

            <details className="faq-item-card">
              <summary className="faq-question-btn">
                <span>Bagaimana jika 3D print gagal karena masalah mesin?</span>
              </summary>
              <div className="faq-answer-pane">
                Hentikan proses dan panggil Lab Assistant agar penyebabnya dicatat. Jika kegagalan terverifikasi berasal dari mesin atau setup yang ditangani tim,
                biaya material yang gagal tidak ditagihkan dan satu kali cetak ulang dijadwalkan tanpa biaya sewa tambahan. Bila kegagalan berasal dari file,
                parameter yang disetujui pengguna, atau material eksternal, bahan yang sudah terpakai tetap menjadi tanggungan pengguna.
              </div>
            </details>

            <details className="faq-item-card">
              <summary className="faq-question-btn">
                <span>Apakah booking dapat dibatalkan atau dijadwalkan ulang?</span>
              </summary>
              <div className="faq-answer-pane">
                Bisa. Pembatalan atau reschedule minimal 2 jam sebelum slot dimulai mengembalikan saldo sewa 100%. Pada rentang 1–2 jam, 50% saldo sewa
                dikembalikan sebagai kredit Makerspace. Kurang dari 1 jam, biaya sewa slot tetap berlaku. Bahan tidak pernah dibebankan sebelum proses produksi dimulai.
              </div>
            </details>

            <details className="faq-item-card">
              <summary className="faq-question-btn">
                <span>Apakah saya boleh membawa material / filamen sendiri dari luar?</span>
              </summary>
              <div className="faq-answer-pane">
                Boleh! Namun seluruh bahan eksternal, terutama filamen khusus dan komponen elektronik, perlu diperiksa
                Lab Assistant terlebih dahulu agar sesuai dengan spesifikasi alat yang digunakan.
              </div>
            </details>

            <details className="faq-item-card">
              <summary className="faq-question-btn">
                <span>Bagaimana cara kerja billing timbangan filamen 3D printing?</span>
              </summary>
              <div className="faq-answer-pane">
                Setelah hasil cetak 3D selesai, Anda membawa benda cetak (beserta support material) ke meja kasir operasional.
                Lab Assistant akan menaruhnya di timbangan digital yang terhubung ke sistem. Nilai gramasi dikalikan tarif per gram (misal Rp 350/gr)
                lalu mengonfirmasi total akhir dan instruksi pembayaran melalui WhatsApp sebelum pembayaran dilakukan.
              </div>
            </details>
          </div>
        </div>
      </section>

      {/* ========================================================
          FOOTER STRIP (CLEAN & SUBTLE)
          ======================================================== */}
      <footer className="footer-strip">
        <div className="container">
          <div className="footer-grid">
            <div>
              <div className="nav-logo-group" style={{ marginBottom: '12px' }}>
                <div className="nav-logo-text">
                  <span className="nav-brand-title" style={{ fontSize: '1.05rem' }}>
                    IDN <span className="highlight-lime">MAKER SPACE</span>
                  </span>
                  <span className="nav-brand-sub">STEM CREATIVE HUB</span>
                </div>
              </div>
              <p style={{ color: 'var(--text-secondary)', lineHeight: 1.5, fontSize: '0.82rem' }}>
                Ruang belajar dan membuat untuk 3D printing, elektronika, IoT, dan pemrograman web.
              </p>
              <div style={{ marginTop: '12px', fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: 'var(--accent-lime)' }}>
                Status Lab: Buka Hari Ini
              </div>
            </div>

            <div className="footer-col">
              <h4>Fasilitas Lab</h4>
              <ul className="footer-links-list">
                <li><a href="#the-lab">Bambu Lab A1 mini</a></li>
                <li><a href="#the-lab">Sunshine Power Supply P2 Pro</a></li>
                <li><a href="#the-lab">Solder Digital</a></li>
                <li><a href="#the-lab">Multimeter UNI-T</a></li>
                <li><a href="#the-lab">Timbangan Digital</a></li>
                <li><a href="#the-lab">Jangka Sorong Digital</a></li>
                <li><a href="#the-lab">Perkakas Elektronika</a></li>
              </ul>
            </div>

            <div className="footer-col">
              <h4>Informasi</h4>
              <ul className="footer-links-list">
                <li><a href="#pricing">Keanggotaan</a></li>
                <li><a href="#workshops">Workshop</a></li>
                <li><a href="#materials">Estimasi Bahan</a></li>
                <li><a href="#faq">Pertanyaan Umum</a></li>
              </ul>
            </div>

            <div className="footer-col">
              <h4>Terhubung</h4>
              <div className="footer-social-links">
                <a href={`${WHATSAPP_URL}?text=${encodeURIComponent('Halo IDN Makerspace, saya ingin bertanya.')}`} target="_blank" rel="noreferrer" aria-label="WhatsApp admin IDN Makerspace"><MessageCircle size={17} /> WhatsApp Admin</a>
                <a href={DISCORD_URL} target="_blank" rel="noreferrer" aria-label="Discord IDN Makerspace" title="Gabung Discord IDN Makerspace"><DiscordIcon size={17} /> Discord Community</a>
                <a href={GITHUB_URL} target="_blank" rel="noreferrer" aria-label="GitHub IDN Makerspace (@idnmakerspace-lab)" title="GitHub @idnmakerspace-lab"><GitHubIcon size={17} /> GitHub (@idnmakerspace-lab)</a>
                <a href={INSTAGRAM_URL} target="_blank" rel="noreferrer" aria-label="Instagram IDN Makerspace (@idnmakerspace)" title="Instagram @idnmakerspace"><InstagramIcon size={17} /> Instagram (@idnmakerspace)</a>
                <a href={TIKTOK_URL} target="_blank" rel="noreferrer" aria-label="TikTok IDN Makerspace (@idn_makerspace)" title="TikTok @idn_makerspace"><TikTokIcon size={17} /> TikTok (@idn_makerspace)</a>
                <a href={YOUTUBE_URL} target="_blank" rel="noreferrer" aria-label="YouTube IDN Makerspace (@idnmakerspace)" title="YouTube @idnmakerspace"><YouTubeIcon size={17} /> YouTube (@idnmakerspace)</a>
                <a href="#community" aria-label="Kanal Komunitas IDN Makerspace" title="Info kanal komunitas IDN Makerspace"><Send size={17} /> Komunitas</a>
              </div>
            </div>

            <div className="footer-col">
              <h4>Lokasi &amp; Jam</h4>
              <p style={{ fontSize: '0.8rem', lineHeight: 1.5, color: 'var(--text-secondary)', marginBottom: '8px' }}>
                <MapPin size={13} style={{ verticalAlign: 'middle', marginRight: '4px' }} />
                IDN Makerspace, Jl. Gotong Royong No. 21A, Cipete Utara, Kebayoran Baru, Jakarta Selatan 12150.
              </p>
              <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '8px' }}>
                Senin – Sabtu <br />
                08:00 – 17:00 WIB
              </p>
              <a
                href="https://maps.google.com/?q=IDN+Makerspace,+Jl.+Gotong+Royong+No.+21A,+Cipete+Utara,+Kebayoran+Baru,+Jakarta+Selatan"
                target="_blank"
                rel="noreferrer"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '5px',
                  fontSize: '0.75rem',
                  color: 'var(--accent-lime)',
                  textDecoration: 'none',
                  fontWeight: 600,
                }}
              >
                Buka di Google Maps <ExternalLink size={12} />
              </a>
            </div>
          </div>

          <div className="footer-copyright-bar">
            <span>© 2026 IDN Makerspace. Semua hak dilindungi.</span>
            <span>PRIVASI &amp; KEAMANAN DATA</span>
          </div>
        </div>
      </footer>

      {/* ========================================================
          MODAL: PREVIEW FOTO ALAT ASLI (VIEW MATA)
          ======================================================== */}
      {selectedToolPreview && (
        <div className="modal-backdrop-overlay" onClick={() => setSelectedToolPreview(null)}>
          <div className="modal-dialog-box tool-preview-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-head">
              <h3>
                <Eye size={18} color="var(--accent-lime)" />
                Foto Fisik Alat: {selectedToolPreview.name}
              </h3>
              <button
                type="button"
                className="btn-close-modal"
                onClick={() => setSelectedToolPreview(null)}
                aria-label="Tutup preview foto"
              >
                <X size={18} />
              </button>
            </div>

            <div style={{ padding: '20px' }}>
              <div className="tool-preview-image-wrapper">
                <img
                  src={selectedToolPreview.image}
                  alt={selectedToolPreview.name}
                  className="tool-preview-img"
                />
                <div className="tool-source-tag">
                  <span>Foto Alat Fisik Nyata (Bukan AI Generated)</span>
                </div>
              </div>

              <div style={{ marginTop: '14px' }}>
                <p style={{ fontSize: '0.88rem', color: 'var(--text-white)', fontWeight: 600, marginBottom: '6px' }}>
                  {selectedToolPreview.imageCaption}
                </p>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                  Unit fisik operasional di workstation IDN Makerspace Cipete. Dilengkapi kalibrasi rutin dan pengawasan Lab Assistant.
                </p>
              </div>

              <div className="tool-preview-specs-grid" style={{ marginTop: '16px' }}>
                <div className="preview-spec-box">
                  <span className="spec-k">WORK AREA</span>
                  <span className="spec-v">{selectedToolPreview.area}</span>
                </div>
                <div className="preview-spec-box">
                  <span className="spec-k">SPESIFIKASI</span>
                  <span className="spec-v">{selectedToolPreview.speed}</span>
                </div>
                <div className="preview-spec-box">
                  <span className="spec-k">MATERIAL</span>
                  <span className="spec-v">{selectedToolPreview.materials}</span>
                </div>
                <div className="preview-spec-box">
                  <span className="spec-k">TARIF SEWA</span>
                  <span className="spec-v" style={{ color: 'var(--accent-lime)' }}>
                    Rp {selectedToolPreview.hourlyRate.toLocaleString('id-ID')} / jam
                  </span>
                </div>
              </div>

              <div style={{ marginTop: '22px', display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                <button
                  type="button"
                  className="btn-secondary-clean"
                  onClick={() => setSelectedToolPreview(null)}
                >
                  Tutup
                </button>
                <button
                  type="button"
                  className="btn-primary-lime"
                  onClick={() => {
                    const machine = selectedToolPreview;
                    setSelectedToolPreview(null);
                    handleOpenBooking(machine);
                  }}
                >
                  <span>Pesan Slot Alat Ini</span>
                  <ArrowRight size={14} />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================
          MODAL: BOOKING WIZARD (BR-01 THROUGH BR-04)
          ======================================================== */}
      {isBookingModalOpen && (
        <div className="modal-backdrop-overlay" onClick={() => setIsBookingModalOpen(false)}>
          <div className="modal-dialog-box" onClick={(e) => e.stopPropagation()}>
            <div className="modal-head">
              <h3>
                <Calendar size={18} color="var(--accent-lime)" />
                Reservasi Mesin Fabrikasi
              </h3>
              <button
                type="button"
                className="btn-close-modal"
                onClick={() => setIsBookingModalOpen(false)}
              >
                <X size={18} />
              </button>
            </div>

            <div className="modal-body-content">
              {/* Step Indicator */}
              <div className="modal-step-indicator">
                <div className={`step-circle ${bookingStep === 1 ? 'active' : bookingStep > 1 ? 'done' : ''}`}>1</div>
                <div className={`step-circle ${bookingStep === 2 ? 'active' : bookingStep > 2 ? 'done' : ''}`}>2</div>
                <div className={`step-circle ${bookingStep === 3 ? 'active' : bookingStep > 3 ? 'done' : ''}`}>3</div>
                <div className={`step-circle ${bookingStep === 4 ? 'active' : bookingStep > 4 ? 'done' : ''}`}>4</div>
                <div className={`step-circle ${bookingStep === 5 ? 'active' : bookingStep > 5 ? 'done' : ''}`}>5</div>
                <div className={`step-circle ${bookingStep === 6 ? 'active' : ''}`}>Pass</div>
              </div>

              {/* Step 1: Mesin & Level K3 */}
              {bookingStep === 1 && (
                <div>
                  <h4 style={{ color: 'var(--text-white)', marginBottom: '6px' }}>Langkah 1: Pilih Mesin Fabrikasi</h4>
                  <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginBottom: '14px' }}>
                    Sistem mengecek prasyarat keselamatan K3 akun Anda secara otomatis.
                  </p>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '18px' }}>
                    {MACHINES_DATA.map(m => {
                      const isSelected = selectedMachine.id === m.id;
                      const isClearanceMet = m.level <= Math.max(...userProfile.badges);

                      return (
                        <div
                          key={m.id}
                          onClick={() => setSelectedMachine(m)}
                          style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            padding: '10px 14px',
                            background: isSelected ? 'var(--accent-lime-soft)' : 'rgba(255,255,255,0.02)',
                            border: `1px solid ${isSelected ? 'var(--accent-lime)' : 'var(--border-subtle)'}`,
                            borderRadius: 'var(--radius-md)',
                            cursor: 'pointer',
                            transition: 'var(--transition-smooth)'
                          }}
                        >
                          <div>
                            <div style={{ fontWeight: 700, color: 'var(--text-white)', fontSize: '0.9rem' }}>{m.name}</div>
                            <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{m.levelName}</div>
                          </div>
                          <div style={{ textAlign: 'right' }}>
                            <div style={{ fontFamily: 'var(--font-code)', color: 'var(--accent-lime)', fontWeight: 700, fontSize: '0.88rem' }}>
                              Rp {m.hourlyRate.toLocaleString('id-ID')}/jam
                            </div>
                            <span style={{
                              fontSize: '0.68rem',
                              color: isClearanceMet ? '#4ade80' : '#f87171',
                              fontFamily: 'var(--font-code)'
                            }}>
                              {isClearanceMet ? '✓ K3 TERPENUHI' : '✗ BUTUH LISENSI'}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                    <button
                      type="button"
                      className="btn-primary-lime"
                      onClick={() => setBookingStep(2)}
                    >
                      <span>Lanjut Pilih Waktu</span>
                      <ArrowRight size={15} />
                    </button>
                  </div>
                </div>
              )}

              {/* Step 2: Waktu (Slot 30 Menit) */}
              {bookingStep === 2 && (
                <div>
                  <h4 style={{ color: 'var(--text-white)', marginBottom: '6px' }}>Langkah 2: Pilih Tanggal &amp; Slot Waktu (30 Menit)</h4>
                  <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginBottom: '14px' }}>
                    Slot akan dicek dan dikonfirmasi terlebih dahulu oleh admin via WhatsApp. Pilihan waktu ini belum mengunci mesin.
                  </p>

                  <div style={{ marginBottom: '14px' }}>
                    <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '6px' }}>
                      Tanggal Reservasi:
                    </label>
                    <input
                      type="date"
                      value={selectedDate}
                      min={todayDateStr}
                      onChange={(e) => setSelectedDate(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '9px 12px',
                        background: 'rgba(255,255,255,0.04)',
                        border: '1px solid var(--border-subtle)',
                        borderRadius: 'var(--radius-sm)',
                        color: 'var(--text-white)',
                        fontFamily: 'var(--font-code)',
                        fontSize: '0.85rem'
                      }}
                    />
                  </div>

                  <div style={{ marginBottom: '20px' }}>
                    <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '8px' }}>
                      Pilih Slot Waktu Tersedia:
                    </label>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
                      {['09:00 - 09:30', '10:00 - 10:30', '11:00 - 11:30', '13:00 - 13:30', '14:00 - 14:30', '15:30 - 16:00'].map(slot => (
                        <button
                          key={slot}
                          type="button"
                          onClick={() => setSelectedSlot(slot)}
                          style={{
                            padding: '9px 8px',
                            borderRadius: 'var(--radius-sm)',
                            background: selectedSlot === slot ? 'var(--accent-cyan-soft)' : 'rgba(255,255,255,0.03)',
                            border: `1px solid ${selectedSlot === slot ? 'var(--accent-cyan)' : 'var(--border-subtle)'}`,
                            color: selectedSlot === slot ? 'var(--accent-cyan)' : 'var(--text-primary)',
                            fontFamily: 'var(--font-code)',
                            fontSize: '0.78rem',
                            cursor: 'pointer',
                            transition: 'var(--transition-smooth)'
                          }}
                        >
                          {slot}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <button type="button" className="btn-secondary-clean" onClick={() => setBookingStep(1)}>Kembali</button>
                    <button type="button" className="btn-primary-lime" onClick={() => setBookingStep(3)}>Lanjut Estimasi Bahan</button>
                  </div>
                </div>
              )}

              {/* Step 3: Material & Estimasi Konsumabel */}
              {bookingStep === 3 && (
                <div>
                  <h4 style={{ color: 'var(--text-white)', marginBottom: '6px' }}>Langkah 3: Konsumsi Bahan Baku (BR-06)</h4>
                  <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginBottom: '14px' }}>
                    Estimasi berat filamen atau lembaran yang Anda gunakan.
                  </p>

                  <div style={{ background: 'rgba(10, 12, 16, 0.4)', padding: '14px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)', marginBottom: '18px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                      <span style={{ fontSize: '0.82rem', color: 'var(--text-primary)' }}>Estimasi Bahan (Filamen PLA+)</span>
                      <span style={{ fontFamily: 'var(--font-code)', color: 'var(--accent-lime)' }}>{estimatedFilament} gram</span>
                    </div>
                    <input
                      type="range"
                      min="10"
                      max="300"
                      step="10"
                      value={estimatedFilament}
                      onChange={(e) => setEstimatedFilament(parseInt(e.target.value))}
                      className="custom-range-slider"
                      style={{ width: '100%' }}
                    />
                    <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '8px' }}>
                      Tarif per gram: Rp 350. Timbangan aktual dikonfirmasi Lab Assistant di akhir sesi kerja.
                    </div>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <button type="button" className="btn-secondary-clean" onClick={() => setBookingStep(2)}>Kembali</button>
                    <button type="button" className="btn-primary-lime" onClick={() => setBookingStep(4)}>Lanjut Ketentuan K3</button>
                  </div>
                </div>
              )}

              {/* Step 4: Regulasi Anti-Ghosting (BR-03) */}
              {bookingStep === 4 && (
                <div>
                  <h4 style={{ color: 'var(--text-white)', marginBottom: '6px' }}>Langkah 4: Konfirmasi Regulasi Anti-Ghosting</h4>
                  <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginBottom: '14px' }}>
                    Pahami kewajiban check-in agar slot dan saldo Anda tidak dibatalkan otomatis.
                  </p>

                  <div style={{ background: 'var(--accent-amber-soft)', border: '1px solid rgba(245, 158, 11, 0.3)', borderRadius: 'var(--radius-md)', padding: '14px', marginBottom: '18px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--accent-amber)', fontWeight: 700, fontSize: '0.88rem', marginBottom: '6px' }}>
                      <AlertTriangle size={16} /> ATURAN 15 MENIT CHECK-IN (BR-03)
                    </div>
                    <ul style={{ fontSize: '0.8rem', color: 'var(--text-primary)', paddingLeft: '18px', lineHeight: 1.5 }}>
                      <li>Member wajib memindai QR Check-in di lokasi maksimal 15 menit setelah waktu pemesanan dimulai.</li>
                      <li>Jika terlambat tanpa konfirmasi, slot dibatalkan otomatis oleh sistem.</li>
                      <li>Biaya booking dikenakan penalti/hangus demi keadilan antrean member lain.</li>
                    </ul>
                  </div>

                  <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', marginBottom: '22px' }}>
                    <input
                      type="checkbox"
                      checked={agreedAntiGhosting}
                      onChange={(e) => setAgreedAntiGhosting(e.target.checked)}
                      style={{ width: '17px', height: '17px', accentColor: 'var(--accent-lime)' }}
                    />
                    <span style={{ fontSize: '0.82rem', color: 'var(--text-primary)' }}>
                      Saya memahami dan menyetujui ketentuan Anti-Ghosting 15 menit.
                    </span>
                  </label>

                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <button type="button" className="btn-secondary-clean" onClick={() => setBookingStep(3)}>Kembali</button>
                    <button
                      type="button"
                      className="btn-primary-lime"
                      disabled={!agreedAntiGhosting}
                      style={{ opacity: agreedAntiGhosting ? 1 : 0.5, cursor: agreedAntiGhosting ? 'pointer' : 'not-allowed' }}
                      onClick={() => setBookingStep(5)}
                    >
                      Lanjut Konfirmasi Admin
                    </button>
                  </div>
                </div>
              )}

              {/* Step 5: Konfirmasi manual via WhatsApp */}
              {bookingStep === 5 && (
                <div>
                  <h4 style={{ color: 'var(--text-white)', marginBottom: '6px' }}>Langkah 5: Kirim Permintaan ke Admin</h4>
                  <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginBottom: '14px' }}>
                    Tekan tombol di bawah untuk mengirim detail reservasi ke WhatsApp admin. Ketersediaan slot, instruksi pembayaran, dan status booking dikonfirmasi manual oleh admin.
                  </p>

                  <div style={{ background: 'rgba(10, 12, 16, 0.4)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-md)', padding: '14px', marginBottom: '16px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                      <span style={{ color: 'var(--text-muted)', fontSize: '0.82rem' }}>Mesin:</span>
                      <strong style={{ color: 'var(--text-white)', fontSize: '0.88rem' }}>{selectedMachine.name}</strong>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                      <span style={{ color: 'var(--text-muted)', fontSize: '0.82rem' }}>Jadwal:</span>
                      <strong style={{ color: 'var(--text-white)', fontSize: '0.88rem' }}>{selectedDate}, {selectedSlot}</strong>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ color: 'var(--text-muted)', fontSize: '0.82rem' }}>Total Tagihan:</span>
                      <strong style={{ color: 'var(--accent-lime)', fontFamily: 'var(--font-code)', fontSize: '1.05rem' }}>
                        Rp {(selectedMachine.hourlyRate + estimatedFilament * 350).toLocaleString('id-ID')}
                      </strong>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '9px', padding: '12px 14px', marginBottom: '20px', borderRadius: 'var(--radius-md)', background: 'var(--accent-cyan-soft)', border: '1px solid rgba(0, 210, 238, 0.22)', color: 'var(--text-primary)', fontSize: '0.8rem' }}>
                    <MessageCircle size={17} color="var(--accent-cyan)" /> Tidak ada pembayaran otomatis atau saldo yang dipotong dari situs ini.
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <button type="button" className="btn-secondary-clean" onClick={() => setBookingStep(4)}>Kembali</button>
                    <button type="button" className="btn-primary-lime" onClick={handleFinishBooking}>
                      <MessageCircle size={15} /> Kirim ke WhatsApp Admin
                    </button>
                  </div>
                </div>
              )}

              {/* Step 6: Permintaan dikirim, menunggu persetujuan admin */}
              {bookingStep === 6 && generatedTicket && (
                <div>
                  <div className="qr-ticket-result">
                    <span className="card-step-badge" style={{ color: 'var(--accent-cyan)' }}>PERMINTAAN TERKIRIM // MENUNGGU ADMIN</span>

                    <h3 style={{ color: 'var(--text-white)', margin: '8px 0 2px', fontFamily: 'var(--font-heading)', fontSize: '1.1rem' }}>
                      {generatedTicket.machine}
                    </h3>
                    <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '12px' }}>
                      KODE: {generatedTicket.id} | {generatedTicket.date} ({generatedTicket.slot})
                    </div>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.84rem', maxWidth: '400px', margin: '0 auto 16px' }}>
                      Pesan WhatsApp Anda sudah disiapkan. Booking baru aktif setelah admin mengonfirmasi ketersediaan dan pembayaran.
                    </p>
                    <a href={`${WHATSAPP_URL}?text=${encodeURIComponent(`Halo IDN Makerspace, saya ingin menindaklanjuti permintaan ${generatedTicket.id}.`)}`} target="_blank" rel="noreferrer" className="btn-primary-lime" style={{ width: '100%', justifyContent: 'center' }}>
                      <MessageCircle size={15} /> Buka WhatsApp Admin
                    </a>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '14px' }}>
                    <button
                      type="button"
                      className="btn-secondary-clean"
                      onClick={() => setIsBookingModalOpen(false)}
                    >
                      Tutup Pass
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================
          MODAL: K3 SAFETY INDUCTION & QUIZ
          ======================================================== */}
      {isQuizModalOpen && (
        <div className="modal-backdrop-overlay" onClick={() => setIsQuizModalOpen(false)}>
          <div className="modal-dialog-box k3-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-head">
              <h3>
                <ShieldCheck size={18} color="var(--accent-cyan)" />
                Ujian Sertifikasi Keselamatan K3 Digital (BR-02)
              </h3>
              <button
                type="button"
                className="btn-close-modal"
                onClick={() => setIsQuizModalOpen(false)}
              >
                <X size={18} />
              </button>
            </div>

            <div className="modal-body-content">
              {!quizSubmitted ? (
                <form onSubmit={handleQuizSubmit}>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '18px' }}>
                    Jawab 3 pertanyaan induksi keselamatan kerja ini untuk membuka lencana Level 2 &amp; 3 di profil Anda.
                  </p>

                  <div style={{ marginBottom: '14px' }}>
                    <div style={{ fontWeight: 600, color: 'var(--text-white)', fontSize: '0.88rem', marginBottom: '6px' }}>
                      1. Kapan pemindai QR Check-in wajib dilakukan saat sesi reservasi mesin dimulai?
                    </div>
                    <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>
                      <input
                        type="radio"
                        name="q1"
                        value="a"
                        onChange={() => setQuizAnswers({ ...quizAnswers, q1: 'a' })}
                        required
                      /> Maksimal 60 menit setelah mulai.
                    </label>
                    <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                      <input
                        type="radio"
                        name="q1"
                        value="b"
                        onChange={() => setQuizAnswers({ ...quizAnswers, q1: 'b' })}
                      /> Maksimal 15 menit setelah waktu pemesanan (aturan anti-ghosting BR-03).
                    </label>
                  </div>

                  <div style={{ marginBottom: '14px' }}>
                    <div style={{ fontWeight: 600, color: 'var(--text-white)', fontSize: '0.88rem', marginBottom: '6px' }}>
                      2. Apa yang perlu dipastikan sebelum memulai cetak 3D?
                    </div>
                    <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>
                      <input
                        type="radio"
                        name="q2"
                        value="a"
                        onChange={() => setQuizAnswers({ ...quizAnswers, q2: 'a' })}
                        required
                      /> Menyalakan mesin tanpa mengecek material.
                    </label>
                    <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>
                      <input
                        type="radio"
                        name="q2"
                        value="b"
                        onChange={() => setQuizAnswers({ ...quizAnswers, q2: 'b' })}
                      /> Mengabaikan panduan dari Lab Assistant.
                    </label>
                    <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                      <input
                        type="radio"
                        name="q2"
                        value="c"
                        onChange={() => setQuizAnswers({ ...quizAnswers, q2: 'c' })}
                      /> Material sesuai spesifikasi sudah terpasang dan area kerja siap.
                    </label>
                  </div>

                  <div style={{ marginBottom: '22px' }}>
                    <div style={{ fontWeight: 600, color: 'var(--text-white)', fontSize: '0.88rem', marginBottom: '6px' }}>
                      3. Apa langkah pertama jika terjadi api terbuka atau alarm overheating pada mesin?
                    </div>
                    <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>
                      <input
                        type="radio"
                        name="q3"
                        value="a"
                        onChange={() => setQuizAnswers({ ...quizAnswers, q3: 'a' })}
                        required
                      /> Tekan Emergency Stop (E-Stop) merah &amp; panggil Lab Assistant segera.
                    </label>
                    <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                      <input
                        type="radio"
                        name="q3"
                        value="b"
                        onChange={() => setQuizAnswers({ ...quizAnswers, q3: 'b' })}
                      /> Siram air langsung ke dalam panel elektronik mesin.
                    </label>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
                    <button type="button" className="btn-secondary-clean" onClick={() => setIsQuizModalOpen(false)}>
                      Batal
                    </button>
                    <button type="submit" className="btn-primary-lime">
                      Kirim Jawaban Kuis K3
                    </button>
                  </div>
                </form>
              ) : (
                <div style={{ textAlign: 'center', padding: '14px 0' }}>
                  {quizScore === 3 ? (
                    <>
                      <div style={{ width: '54px', height: '54px', background: 'var(--accent-lime-soft)', border: '1px solid var(--accent-lime)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 14px', color: 'var(--accent-lime)' }}>
                        <Award size={28} />
                      </div>
                      <h3 style={{ color: 'var(--text-white)', fontSize: '1.25rem', marginBottom: '6px' }}>
                        Selamat! Skor Sempurna (3/3)
                      </h3>
                      <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: '18px' }}>
                        Lencana keselamatan digital <strong>Level 3 Verified</strong> telah diterbitkan dan ditautkan ke akun Anda.
                      </p>
                      <button
                        type="button"
                        className="btn-primary-lime"
                        onClick={() => {
                          setIsQuizModalOpen(false);
                          setQuizSubmitted(false);
                        }}
                      >
                        Selesai &amp; Buka Booking
                      </button>
                    </>
                  ) : (
                    <>
                      <div style={{ width: '54px', height: '54px', background: 'var(--accent-red-soft)', border: '1px solid var(--accent-red)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 14px', color: 'var(--accent-red)' }}>
                        <AlertTriangle size={28} />
                      </div>
                      <h3 style={{ color: 'var(--text-white)', fontSize: '1.25rem', marginBottom: '6px' }}>
                        Skor Anda: {quizScore}/3
                      </h3>
                      <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: '18px' }}>
                        Untuk menjamin keselamatan kerja, Anda membutuhkan skor 3/3 untuk lisensi mesin berisiko tinggi.
                      </p>
                      <button
                        type="button"
                        className="btn-secondary-clean"
                        onClick={() => setQuizSubmitted(false)}
                      >
                        Ulangi Kuis
                      </button>
                    </>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
