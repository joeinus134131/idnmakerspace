import { useState, useEffect, useRef } from 'react';
import {
  Cpu,
  Zap,
  Hammer,
  Calendar,
  Wrench,
  Gauge,
  Printer,
  Flame,
  Activity,
  Coffee,
  CheckCircle,
  ArrowRight,
  X,
  RotateCcw,
  Play,
  Shield,
  Wind
} from 'lucide-react';
import './App.css';

// Custom SVG Brand Logo for IDN Maker Space
const BrandLogo = ({ size = 32, glow = true }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 100 100"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    style={{ filter: glow ? 'drop-shadow(0 0 8px rgba(255, 93, 34, 0.4))' : 'none' }}
  >
    <circle cx="50" cy="50" r="38" stroke="url(#logo-grad-orange)" strokeWidth="4" strokeDasharray="6 4" />
    <circle cx="50" cy="50" r="22" stroke="url(#logo-grad-teal)" strokeWidth="2" />
    <path d="M35 35 V65 L45 50 L55 65 V35 M65 35 H55 V65 H65" stroke="var(--text-white)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
    <circle cx="50" cy="50" r="3" fill="var(--accent-teal)" />
    <circle cx="35" cy="35" r="2" fill="var(--accent-orange)" />
    <circle cx="65" cy="35" r="2" fill="var(--accent-orange)" />

    <defs>
      <linearGradient id="logo-grad-orange" x1="0" y1="0" x2="100" y2="100">
        <stop offset="0%" stopColor="#ff5d22" />
        <stop offset="100%" stopColor="#ff8c32" />
      </linearGradient>
      <linearGradient id="logo-grad-teal" x1="0" y1="0" x2="100" y2="100">
        <stop offset="0%" stopColor="#00f5d4" />
        <stop offset="100%" stopColor="#00b4d8" />
      </linearGradient>
    </defs>
  </svg>
);

// Custom Analog Rotary Mechanical Knob
const RotaryKnob = ({ value, onChange, min, max, label, color = 'var(--accent-teal)' }) => {
  const percentage = ((value - min) / (max - min)) * 100;
  const rotationAngle = -135 + (percentage / 100) * 270;

  return (
    <div className="rotary-knob-component">
      <div className="knob-ring">
        <svg className="knob-svg-ring" viewBox="0 0 100 100">
          <circle cx="50" cy="50" r="42" fill="none" stroke="rgba(36, 44, 59, 0.3)" strokeWidth="6" />
          <circle
            cx="50"
            cy="50"
            r="42"
            fill="none"
            stroke={color}
            strokeWidth="6"
            strokeDasharray="264"
            strokeDashoffset={264 - (percentage / 100) * 198}
            transform="rotate(135 50 50)"
            style={{ transition: 'stroke-dashoffset 0.12s ease' }}
          />
        </svg>

        <div
          className="knob-cap"
          style={{
            transform: `rotate(${rotationAngle}deg)`
          }}
        >
          <div className="knob-notch" style={{ color: color }}></div>
        </div>
      </div>

      <div className="knob-controls-row">
        <button
          type="button"
          className="knob-adjust-btn"
          onClick={() => onChange(Math.max(min, value - 1))}
        >
          -
        </button>
        <span className="knob-digital-readout" style={{ color: color }}>
          {value}<span style={{ fontSize: '0.65rem', color: 'var(--text-secondary)' }}>{label}</span>
        </span>
        <button
          type="button"
          className="knob-adjust-btn"
          onClick={() => onChange(Math.min(max, value + 1))}
        >
          +
        </button>
      </div>

      <input
        type="range"
        min={min}
        max={max}
        value={value}
        onChange={(e) => onChange(parseInt(e.target.value))}
        className="dial-slider"
        style={{ marginTop: '4px', width: '100%', opacity: 0.4 }}
      />
    </div>
  );
};

// Generate a unique ticket ID outside App component to maintain pure rendering
const generateTicketId = () => {
  return `IDN-MKS-${Math.floor(100000 + Math.random() * 900000)}`;
};

function App() {
  /* ========================================================
     STATE: TELEMETRY (DYNAMIC TOCK)
     ======================================================== */
  const [telemetry, setTelemetry] = useState({
    roomTemp: 24.8,
    humidity: 52,
    lasersActive: 0,
    powerDraw: 1.2, // kW
    makersCount: 14,
    espressoPulled: 28,
    filamentSpent: 1240, // meters
    decibelLevel: 58
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setTelemetry(prev => {
        // Random slight fluctuations for realism
        const isLaserOn = workbenchState.includes('laser');
        const isPrinterOn = workbenchState.includes('printer');
        const isSolderOn = workbenchState.includes('solder');
        const isOscOn = workbenchState.includes('oscilloscope');

        let powerCalc = 0.8; // base idle
        if (isLaserOn) powerCalc += 2.4;
        if (isPrinterOn) powerCalc += 0.6;
        if (isSolderOn) powerCalc += 0.3;
        if (isOscOn) powerCalc += 0.15;

        return {
          roomTemp: parseFloat((24.0 + Math.random() * 1.5).toFixed(1)),
          humidity: Math.floor(50 + Math.random() * 5),
          lasersActive: isLaserOn ? 1 : 0,
          powerDraw: parseFloat((powerCalc + Math.random() * 0.1).toFixed(2)),
          makersCount: Math.floor(12 + Math.random() * 6),
          espressoPulled: prev.espressoPulled + (Math.random() > 0.85 ? 1 : 0),
          filamentSpent: prev.filamentSpent + (isPrinterOn ? 1 : 0),
          decibelLevel: Math.floor(55 + Math.random() * (isLaserOn ? 15 : 6))
        };
      });
    }, 1500);

    return () => clearInterval(interval);
  }, []);

  /* ========================================================
     STATE: INTERACTIVE STEM WORKBENCH
     ======================================================== */
  const [workbenchState, setWorkbenchState] = useState(['oscilloscope', 'solder']); // default active tools

  // Oscilloscope controls
  const [oscilloscopeFreq, setOscilloscopeFreq] = useState(30);
  const [oscilloscopeAmp, setOscilloscopeAmp] = useState(25);
  const canvasRef = useRef(null);

  // 3D Printer Simulator metrics
  const [printProgress, setPrintProgress] = useState(45);
  const [printX, setPrintX] = useState(80);

  // Laser Cutter CNC metrics
  const [laserProgress, setLaserProgress] = useState(15);

  // Soldering Station heat dial
  const [solderTemp, setSolderTemp] = useState(350);

  // Switch Toggles
  const toggleTool = (toolId) => {
    setWorkbenchState(prev =>
      prev.includes(toolId) ? prev.filter(t => t !== toolId) : [...prev, toolId]
    );
  };

  // Oscilloscope HTML5 Canvas Rendering Loop
  useEffect(() => {
    if (!workbenchState.includes('oscilloscope')) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationId;
    let offset = 0;

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Grid lines
      ctx.strokeStyle = 'rgba(36, 44, 59, 0.4)';
      ctx.lineWidth = 1;
      for (let x = 0; x < canvas.width; x += 20) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();
      }
      for (let y = 0; y < canvas.height; y += 20) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
      }

      // Axis lines
      ctx.strokeStyle = 'rgba(36, 44, 59, 0.8)';
      ctx.beginPath();
      ctx.moveTo(0, canvas.height / 2);
      ctx.lineTo(canvas.width, canvas.height / 2);
      ctx.moveTo(canvas.width / 2, 0);
      ctx.lineTo(canvas.width / 2, canvas.height);
      ctx.stroke();

      // Glowing Sine Wave
      ctx.strokeStyle = '#00f5d4';
      ctx.lineWidth = 2.5;
      ctx.shadowBlur = 8;
      ctx.shadowColor = '#00f5d4';
      ctx.beginPath();

      for (let x = 0; x < canvas.width; x++) {
        // Sine wave formula mapped to states
        const y = canvas.height / 2 + Math.sin(x * (oscilloscopeFreq / 250) + offset) * oscilloscopeAmp;
        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();
      ctx.shadowBlur = 0; // reset glow

      offset += 0.08;
      animationId = requestAnimationFrame(draw);
    };

    draw();
    return () => cancelAnimationFrame(animationId);
  }, [workbenchState, oscilloscopeFreq, oscilloscopeAmp]);

  // 3D Printer Motion Loop
  useEffect(() => {
    if (!workbenchState.includes('printer')) return;
    const interval = setInterval(() => {
      setPrintProgress(prev => (prev >= 100 ? 0 : prev + 1));
      setPrintX(() => Math.floor(40 + Math.random() * 120));
    }, 800);

    return () => clearInterval(interval);
  }, [workbenchState]);

  // Laser CNC Cutter Motion Loop
  useEffect(() => {
    if (!workbenchState.includes('laser')) return;
    const interval = setInterval(() => {
      setLaserProgress(prev => (prev >= 100 ? 0 : prev + 2));
    }, 400);

    return () => clearInterval(interval);
  }, [workbenchState]);

  // Calculations for total workbench power grid capacity
  const activeCount = workbenchState.length;
  const powerPercentage = Math.min((activeCount / 4) * 100, 100);

  /* ========================================================
     STATE: INTERACTIVE CODE SANDBOX
     ======================================================== */
  const projectsPreset = [
    {
      id: 'iot',
      title: 'Smart IoT Hydroponics Hub',
      subtitle: 'Monitoring air/soil conditions & pumping nutrients automatically.',
      difficulty: 'MENENGAH',
      cost: 'Rp 350.000',
      time: '3-4 Jam',
      tools: ['ESP32 microchip', 'Solder Iron', 'DHT22 Sensor', 'Water Pump'],
      code: `// IDN Maker Space IoT Sandbox
#include <WiFi.h>
#include <DHT.h>

#define DHTPIN 4
#define PUMPPIN 12
#define SOILPIN 34

DHT dht(DHTPIN, DHT22);

void setup() {
  Serial.begin(115200);
  dht.begin();
  pinMode(PUMPPIN, OUTPUT);
}

void loop() {
  float hum = dht.readHumidity();
  float temp = dht.readTemperature();
  int soilVal = analogRead(SOILPIN);
  
  Serial.printf("Temp: %.1fC | Moisture: %d\\n", temp, soilVal);
  
  if (soilVal > 3000) { 
    Serial.println("Soil dry! Activating pump...");
    digitalWrite(PUMPPIN, HIGH);
    delay(2000);
    digitalWrite(PUMPPIN, LOW);
  }
  delay(5000);
}`,
      schematicSvg: (
        <svg className="blueprint-svg" viewBox="0 0 200 120">
          <rect width="100%" height="100%" fill="none" />
          {/* Microcontroller */}
          <rect x="20" y="30" width="50" height="60" rx="4" fill="none" stroke="#00b4d8" strokeWidth="1.5" />
          <text x="45" y="65" fill="#00b4d8" fontSize="8" textAnchor="middle" fontFamily="Share Tech Mono">ESP32</text>
          {/* Pin leads */}
          <line x1="70" y1="50" x2="110" y2="50" stroke="#00b4d8" strokeWidth="1.5" strokeDasharray="3,3" />
          <line x1="70" y1="70" x2="110" y2="70" stroke="#00b4d8" strokeWidth="1.5" />
          {/* Sensor block */}
          <rect x="110" y="35" width="40" height="30" rx="3" fill="none" stroke="#00f5d4" strokeWidth="1.5" />
          <text x="130" y="52" fill="#00f5d4" fontSize="7" textAnchor="middle" fontFamily="Share Tech Mono">DHT22</text>
          {/* Actuator block */}
          <rect x="110" y="75" width="40" height="30" rx="3" fill="none" stroke="#ffb703" strokeWidth="1.5" />
          <text x="130" y="92" fill="#ffb703" fontSize="6.5" textAnchor="middle" fontFamily="Share Tech Mono">RELAY PUMP</text>
        </svg>
      )
    },
    {
      id: 'robotics',
      title: 'Hexapod Robotic Crawler',
      subtitle: 'Walking multi-legged mechanical body reacting to ultrasonic radar.',
      difficulty: 'MAHIR',
      cost: 'Rp 750.000',
      time: '6-8 Jam',
      tools: ['Arduino Uno', '12x Servos', 'HC-SR04 Radar', 'Acrylic Chassis'],
      code: `// IDN Maker Space Robotics Sandbox
#include <Servo.h>

Servo legServo[12];
const int triggerPin = 9;
const int echoPin = 8;

void setup() {
  Serial.begin(9600);
  pinMode(triggerPin, OUTPUT);
  pinMode(echoPin, INPUT);
  
  // Attach all 12 legs
  for (int i=0; i<12; i++) {
    legServo[i].attach(i + 2);
  }
}

void loop() {
  long duration, distance;
  digitalWrite(triggerPin, LOW);
  delayMicroseconds(2);
  digitalWrite(triggerPin, HIGH);
  delayMicroseconds(10);
  digitalWrite(triggerPin, LOW);
  
  duration = pulseIn(echoPin, HIGH);
  distance = (duration/2) / 29.1;
  
  if (distance < 15) {
    Serial.println("Obstacle! Evading left...");
    walkBackward();
    turnLeft();
  } else {
    walkForward();
  }
  delay(100);
}`,
      schematicSvg: (
        <svg className="blueprint-svg" viewBox="0 0 200 120">
          <rect width="100%" height="100%" fill="none" />
          {/* Main Core */}
          <rect x="30" y="40" width="50" height="40" rx="4" fill="none" stroke="#00b4d8" strokeWidth="1.5" />
          <text x="55" y="63" fill="#00b4d8" fontSize="8" textAnchor="middle" fontFamily="Share Tech Mono">UNO R3</text>
          {/* Leg linkages */}
          <line x1="55" y1="40" x2="35" y2="15" stroke="#ff5d22" strokeWidth="1.5" />
          <line x1="55" y1="40" x2="75" y2="15" stroke="#ff5d22" strokeWidth="1.5" />
          <line x1="55" y1="80" x2="35" y2="105" stroke="#ff5d22" strokeWidth="1.5" />
          <line x1="55" y1="80" x2="75" y2="105" stroke="#ff5d22" strokeWidth="1.5" />
          {/* Ultrasonic module */}
          <rect x="110" y="45" width="40" height="30" rx="10" fill="none" stroke="#00f5d4" strokeWidth="1.5" />
          <circle cx="120" cy="60" r="6" stroke="#00f5d4" strokeWidth="1" fill="none" />
          <circle cx="140" cy="60" r="6" stroke="#00f5d4" strokeWidth="1" fill="none" />
          <text x="130" y="86" fill="#00f5d4" fontSize="6" textAnchor="middle" fontFamily="Share Tech Mono">RADAR</text>
        </svg>
      )
    },
    {
      id: 'laser-clock',
      title: 'Laser-Cut Mechanical Gearbox',
      subtitle: 'Designing interlocking acrylic cogwheels and pendulum levers.',
      difficulty: 'PEMULA',
      cost: 'Rp 180.000',
      time: '1-2 Jam',
      tools: ['2D CAD Software', 'Laser Cutter CNC', '3mm Acrylic Sheets'],
      code: `<!-- Inkscape Vector Blueprint File -->
<svg width="210mm" height="297mm" viewBox="0 0 210 297">
  <!-- Gear cogwheel path definition -->
  <g id="gear-cogwheel" stroke="#ff5d22" stroke-width="0.1" fill="none">
    <circle cx="105" cy="148" r="50" />
    <!-- 24 interlocking mechanical teeth -->
    <path d="M 105 93 L 102 98 L 98 98 L 95 93 Z" />
    <path d="M 105 203 L 108 198 L 112 198 L 115 203 Z" />
    <!-- central axle node -->
    <circle cx="105" cy="148" r="4.5" />
  </g>
</svg>`,
      schematicSvg: (
        <svg className="blueprint-svg" viewBox="0 0 200 120">
          <rect width="100%" height="100%" fill="none" />
          {/* Main Gears */}
          <circle cx="70" cy="60" r="30" stroke="#00f5d4" strokeWidth="1.5" fill="none" strokeDasharray="3,3" />
          <circle cx="70" cy="60" r="6" stroke="#00f5d4" strokeWidth="1.5" fill="none" />

          <circle cx="120" cy="60" r="20" stroke="#ffb703" strokeWidth="1.5" fill="none" strokeDasharray="3,3" />
          <circle cx="120" cy="60" r="4" stroke="#ffb703" strokeWidth="1.5" fill="none" />

          <line x1="70" y1="60" x2="120" y2="60" stroke="#00b4d8" strokeWidth="1" strokeDasharray="4,4" />
        </svg>
      )
    }
  ];

  const [activeProjectId, setActiveProjectId] = useState('iot');
  const [compilingState, setCompilingState] = useState('idle'); // 'idle' | 'compiling' | 'success'
  const [sandboxLogs, setSandboxLogs] = useState([
    { type: 'system', text: 'SYSTEM DEPLOYED. Waiting for user action...' }
  ]);

  const activeProject = projectsPreset.find(p => p.id === activeProjectId);

  const startCompilation = () => {
    if (compilingState === 'compiling') return;
    setCompilingState('compiling');
    setSandboxLogs([
      { type: 'system', text: 'Initializing GCC-ARM Compiler toolchain...' },
      { type: 'info', text: 'Scanning local target hardware over port /dev/ttyUSB0...' }
    ]);

    setTimeout(() => {
      setSandboxLogs(prev => [
        ...prev,
        { type: 'info', text: `Analyzing source syntax: compiled successfully without memory overflow.` },
        { type: 'warning', text: 'Baudrate sync negotiation: using standard 115200.' }
      ]);
    }, 800);

    setTimeout(() => {
      setSandboxLogs(prev => [
        ...prev,
        { type: 'success', text: 'Flashing sectors: 100% written [512KB written successfully]' },
        { type: 'success', text: 'BOOT OK. Hardware microchip operational!' }
      ]);
      setCompilingState('success');
    }, 1800);
  };

  const resetSandbox = () => {
    setCompilingState('idle');
    setSandboxLogs([{ type: 'system', text: 'Sandbox reset. Waiting for upload...' }]);
  };

  /* ========================================================
     STATE: LAB BOOKING & WORKBENCH SCHEDULER
     ======================================================== */
  const benchOptions = [
    { id: 'electro', name: 'Electronics & IoT Hub', icon: <Cpu />, baseRate: 25000 },
    { id: 'fab', name: 'Heavy CNC & Fab Bed', icon: <Wrench />, baseRate: 45000 },
    { id: 'printer', name: '3D Printer Rack', icon: <Printer />, baseRate: 30000 },
    { id: 'hand', name: 'Handcraft & Wood Station', icon: <Hammer />, baseRate: 20000 }
  ];

  const accessoryOptions = [
    { id: 'caliper', name: 'Digital Calipers', rate: 5000 },
    { id: 'multimeter', name: 'Digital Multimeter', rate: 10000 },
    { id: 'soldering', name: 'Soldering Aid Kit', rate: 15000 },
    { id: 'goggles', name: 'Safety Goggles', rate: 0 }
  ];

  const [bookingForm, setBookingForm] = useState({
    name: '',
    email: '',
    date: '2026-05-20',
    time: '14:00',
    duration: 2,
    benchId: 'electro',
    accessories: ['goggles']
  });

  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [generatedTicket, setGeneratedTicket] = useState(null);

  const toggleAccessory = (accId) => {
    setBookingForm(prev => {
      const isSelected = prev.accessories.includes(accId);
      const newAccs = isSelected
        ? prev.accessories.filter(id => id !== accId)
        : [...prev.accessories, accId];
      return { ...prev, accessories: newAccs };
    });
  };

  const handleBookingSubmit = (e) => {
    e.preventDefault();
    if (!bookingForm.name || !bookingForm.email) {
      alert("Harap lengkapi nama dan email Anda.");
      return;
    }

    const selectedBench = benchOptions.find(b => b.id === bookingForm.benchId);
    const selectedAccObjects = accessoryOptions.filter(a => bookingForm.accessories.includes(a.id));

    // Math
    const baseTotal = selectedBench.baseRate * bookingForm.duration;
    const accTotal = selectedAccObjects.reduce((acc, item) => acc + (item.rate * bookingForm.duration), 0);
    const finalTotal = baseTotal + accTotal;

    const ticket = {
      id: generateTicketId(),
      name: bookingForm.name,
      email: bookingForm.email,
      date: bookingForm.date,
      time: bookingForm.time,
      duration: bookingForm.duration,
      bench: selectedBench.name,
      accessories: selectedAccObjects.map(a => a.name).join(', ') || 'None',
      total: finalTotal
    };

    setGeneratedTicket(ticket);
    setBookingSuccess(true);
  };

  /* ========================================================
     STATE: DIAGNOSTICS CLI faq
     ======================================================== */
  const faqPresets = [
    { cmd: 'help', desc: 'Daftar perintah diagnostic.' },
    { cmd: 'faq', desc: 'Pertanyaan paling populer.' },
    { cmd: 'pricing', desc: 'Tarif sewa alat/ruang.' },
    { cmd: 'location', desc: 'Peta & jam operasional.' },
    { cmd: 'status', desc: 'Diagnostics status lab.' }
  ];

  const [terminalHistory, setTerminalHistory] = useState([
    { type: 'input', text: 'diagnostic --init' },
    {
      type: 'output', text: `IDN Maker Space CLI Diagnostics [v1.0.4]
Atmosfer Garage Maker & Experiential Engineering.
Ketik [help] untuk melihat opsi perintah diagnostic.` }
  ]);

  const [setTerminalInput] = useState('');

  const executeTerminalCommand = (cmdText) => {
    const cleanCmd = cmdText.trim().toLowerCase();
    let responseText = '';

    if (cleanCmd === 'help') {
      responseText = `Tersedia perintah berikut:
 - faq      : Daftar pertanyaan yang sering diajukan.
 - pricing  : Rincian biaya penggunaan tools & space.
 - location : Alamat fisik garasi & jam operasional.
 - status   : Status telemetry & antrian alat.
 - clear    : Membersihkan layar terminal.`;
    } else if (cleanCmd === 'faq') {
      responseText = `Q: Siapa yang bisa berkunjung?
A: Siapa saja! Kami menyambut maker, mahasiswa, anak-anak, hobis, dan engineer profesional.

Q: Apakah saya harus membawa alat sendiri?
A: Tidak perlu! Kami menyediakan full tools: solder, multimeter, CNC, 3D printer, tang, dll.

Q: Apakah ada tutor/mentor pendamping?
A: Ya, Lab Engineer kami selalu standby di garasi untuk membantu mendampingi eksperimen Anda secara cuma-cuma.`;
    } else if (cleanCmd === 'pricing') {
      responseText = `Daftar tarif pemakaian fasilitas per jam:
 - Workbench Elektronik & IoT   : Rp 25.000 / jam
 - Heavy Fabrication & CNC Bed  : Rp 45.000 / jam
 - FDM 3D Printer (Filament Inc): Rp 30.000 / jam
 - Handcraft & Wood Station      : Rp 20.000 / jam
 * Semua penyewaan sudah termasuk alat pelindung diri (goggles/sarung tangan) & bantuan asisten lab.`;
    } else if (cleanCmd === 'location') {
      responseText = `Koordinat Garasi IDN Maker Space:
Alamat : Jl. Silicon Garage No. 42, BSD City, Tangerang
Jam    : Senin - Minggu | 09:00 - 21:00 WIB
Kontak : garage@idnmakerspace.id | +62 812-3456-7890`;
    } else if (cleanCmd === 'status') {
      const isLaserOn = workbenchState.includes('laser');
      const isPrinterOn = workbenchState.includes('printer');
      responseText = `SYSTEM COMPONENT STATUS:
 [POWER OVERALL] : ${telemetry.powerDraw} kW
 [TEMPERATURE]   : ${telemetry.roomTemp}°C
 [LASER CUTTER]  : ${isLaserOn ? 'OPERATIONAL (RUNNING)' : 'STANDBY'}
 [3D PRINTERS]   : ${isPrinterOn ? 'ACTIVE (PRINTING)' : 'STANDBY'}
 [IOT BENCH]     : OPERATIONAL (OK)
 [COFFEE BAR]    : BEANS AT 88% - ESPRESSO ENGINE ACTIVE`;
    } else if (cleanCmd === 'clear') {
      setTerminalHistory([]);
      setTerminalInput('');
      return;
    } else {
      responseText = `Perintah '${cleanCmd}' tidak ditemukan. Ketik [help] untuk daftar perintah.`;
    }

    setTerminalHistory(prev => [
      ...prev,
      { type: 'input', text: cmdText },
      { type: 'output', text: responseText }
    ]);
    setTerminalInput('');
  };

  /* ========================================================
     STATE: EXPERIMENT BLUEPRINT MODAL
     ======================================================== */
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedGalleryProject, setSelectedGalleryProject] = useState(null);

  const galleryProjects = [
    {
      id: 'mirror',
      title: 'Dodecahedron Infinity Mirror',
      tags: ['Laser Cutting', 'LED IoT', 'Electronics'],
      maker: 'Daffa (16, Pelajar SMA)',
      desc: 'Cermin infinity 3D berbentuk dodekahedron dengan LED beralamat (WS2812B) yang sinkron dengan detak suara musik ruangan.',
      bom: ['12x Kaca Satu Arah', 'Chassis Acrylic 3mm (Laser Cut)', 'ESP8266 Microcontroller', 'WS2812B LED strip (60 LED/m)', 'Sound Sensor Module'],
      steps: [
        'Melakukan cutting 12 keping rangka pentagon menggunakan CNC Laser Cutter di space.',
        'Menyusun kerangka pentagon dengan kaca satu arah membentuk dodekahedron.',
        'Memasang baris LED strip beralamat WS2812B di sepanjang rusuk bagian dalam.',
        'Menyolder jalur input tegangan & pin data mikro ESP8266 pada strip.',
        'Mengupload source code FastLED berfitur deteksi ketukan suara ambient garasi.'
      ]
    },
    {
      id: 'maze',
      title: 'Autonomous Maze Solver Robot',
      tags: ['Robotics', '3D Printing', 'Arduino'],
      maker: 'Rian (24, Hobiis / Driver Ojol)',
      desc: 'Robot beroda mikro yang mampu memetakan jalur labirin secara mandiri dan mencari jalan keluar tercepat dalam waktu di bawah 12 detik.',
      bom: ['Chassis Roda (3D Printed)', 'Arduino Nano R3', '3x Sensor Ultrasonic HC-SR04', 'L298D Motor Driver', '2x DC Gearbox Motors', 'Li-Po 7.4V Battery'],
      steps: [
        'Mendesain casing robot di Fusion360 dan mencetaknya menggunakan FDM 3D Printer lab.',
        'Merakit sensor ultrasonik di bagian depan, kiri, dan kanan robot.',
        'Menyolder jalur motor DC ke driver motor L298D agar dapat berbelok presisi.',
        'Memprogram algoritma navigasi Left-Hand Rule pada editor Arduino.',
        'Melakukan kalibrasi kecepatan motor saat mendeteksi dinding penghalang.'
      ]
    },
    {
      id: 'keyb',
      title: 'Custom Ergonomic Mechanical Keyboard',
      tags: ['Woodwork', 'PCB Soldering', 'Handcraft'],
      maker: 'Mutiara (29, UI/UX Designer)',
      desc: 'Keyboard mekanikal ergonomis terpisah (split keyboard) dengan casing kayu walnut premium berdesain lengkung alami jari tangan.',
      bom: ['Casing Kayu Walnut (CNC Router & Polish)', 'Split PCB (Pro Micro Core)', '64x Cherry MX Brown Switches', 'Solder Lead & Flux', 'Dioda 1N4148 & Keycaps'],
      steps: [
        'Memotong papan kayu walnut mentah menggunakan mesin CNC Router sesuai file CAD.',
        'Melakukan sanding halus & coating kayu walnut di Handcraft Workbench.',
        'Menyolder 64 buah dioda penyearah & switch tombol pada sepasang PCB.',
        'Merakit Pro Micro controller sebagai keyboard logic decoder.',
        'Mengonfigurasi layout keymap menggunakan QMK firmware compiler.'
      ]
    }
  ];

  const openProjectModal = (proj) => {
    setSelectedGalleryProject(proj);
    setModalOpen(true);
  };

  return (
    <>
      {/* ========================================================
         NAVIGATION HEADER (GLASSMORPHISM)
         ======================================================== */}
      <header className="header-nav">
        <div className="container nav-container">
          <div className="nav-logo">
            <BrandLogo size={36} />
            <span>IDN <span className="text-gradient-orange">MAKER SPACE</span></span>
          </div>

          <nav>
            <ul className="nav-links">
              <li><a href="#workbench" className="nav-link">Workbench</a></li>
              <li><a href="#toolbox" className="nav-link">STEM Toolbox</a></li>
              <li><a href="#sandbox" className="nav-link">Sandbox</a></li>
              <li><a href="#booking" className="nav-link">Booking</a></li>
              <li><a href="#gallery" className="nav-link">Experiments</a></li>
              <li><a href="#faq" className="nav-link">Diagnostics</a></li>
            </ul>
          </nav>

          <div>
            <a href="#booking" className="btn-secondary" style={{ padding: '8px 18px', fontSize: '0.8rem' }}>
              Sewa Workbench
            </a>
          </div>
        </div>
      </header>

      {/* ========================================================
         HERO SECTION (ENGINEERING TELEMETRY DETAILED OVERLAY)
         ======================================================== */}
      <section className="hero-section">
        <div className="container hero-grid">
          <div>
            <div className="hero-badge">
              <span className="ping"></span>
              <span>IDN MAKER SPACE // GARASI EKSPERIMEN AKTIF</span>
            </div>

            <h1 className="hero-title">
              GARASI <span className="text-gradient-orange">EKSPERIMEN</span> & STEM PLAYGROUND.
            </h1>

            <p className="hero-subtitle">
              Satu-satunya ruang kreatif publik dengan atmosfer garasi engineering otentik. Akses 3D Printer, Laser Cutter, Lab Robotika, hingga mesin perkayuan untuk mewujudkan ide gila Anda.
            </p>

            <div className="hero-actions">
              <a href="#booking" className="btn-primary">
                <Calendar size={18} /> Booking Workbench
              </a>
              <a href="#workbench" className="btn-secondary">
                <Wrench size={18} /> Jelajahi Lab
              </a>
            </div>

            {/* Live micro-telemetry cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
              <div style={{ borderLeft: '3px solid var(--accent-orange)', paddingLeft: '12px' }}>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>POWER DIBUTUHKAN</div>
                <div style={{ fontSize: '1.4rem', fontWeight: 'bold', color: 'var(--text-white)', fontFamily: 'var(--font-mono)' }}>
                  {telemetry.powerDraw} <span style={{ fontSize: '0.9rem', color: 'var(--accent-orange)' }}>kW</span>
                </div>
              </div>
              <div style={{ borderLeft: '3px solid var(--accent-teal)', paddingLeft: '12px' }}>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>MAKERS AKTIF</div>
                <div style={{ fontSize: '1.4rem', fontWeight: 'bold', color: 'var(--text-white)', fontFamily: 'var(--font-mono)' }}>
                  {telemetry.makersCount} <span style={{ fontSize: '0.9rem', color: 'var(--accent-teal)' }}>Orang</span>
                </div>
              </div>
              <div style={{ borderLeft: '3px solid var(--accent-blue)', paddingLeft: '12px' }}>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>KEBISINGAN RUANG</div>
                <div style={{ fontSize: '1.4rem', fontWeight: 'bold', color: 'var(--text-white)', fontFamily: 'var(--font-mono)' }}>
                  {telemetry.decibelLevel} <span style={{ fontSize: '0.9rem', color: 'var(--accent-blue)' }}>dB</span>
                </div>
              </div>
            </div>
          </div>

          {/* High-tech Telemetry terminal HUD panel */}
          <div className="telemetry-panel">
            <div className="terminal-header">
              <div className="terminal-dots">
                <span className="terminal-dot red"></span>
                <span className="terminal-dot yellow"></span>
                <span className="terminal-dot green"></span>
              </div>
              <span className="terminal-title">SYSTEM_TELEMETRY.LOG</span>
            </div>

            <div className="telemetry-row">
              <span className="telemetry-label">[SYSTEM STATUS]</span>
              <span className="telemetry-value status-badge active">
                <span className="indicator"></span> LIVE RUNNING
              </span>
            </div>

            <div className="telemetry-row">
              <span className="telemetry-label">[SUHU GARASI]</span>
              <span className="telemetry-value">{telemetry.roomTemp} °C</span>
            </div>

            <div className="telemetry-row">
              <span className="telemetry-label">[KELEMBABAN]</span>
              <span className="telemetry-value warning">{telemetry.humidity} %</span>
            </div>

            <div className="telemetry-row">
              <span className="telemetry-label">[LASER CNC AKTIF]</span>
              <span className="telemetry-value danger">{telemetry.lasersActive} Mesin</span>
            </div>

            <div className="telemetry-row">
              <span className="telemetry-label">[ESPRESSO DIKONSUMSI]</span>
              <span className="telemetry-value" style={{ color: 'var(--accent-amber)' }}>{telemetry.espressoPulled} Cups</span>
            </div>

            <div className="telemetry-row">
              <span className="telemetry-label">[FILAMENT SPECS]</span>
              <span className="telemetry-value">{telemetry.filamentSpent} m spent</span>
            </div>

            <div style={{ marginTop: '16px', background: 'rgba(36, 44, 59, 0.3)', padding: '10px', borderRadius: '4px', fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
              <span className="text-gradient-orange" style={{ fontWeight: 'bold' }}>INFO:</span> Silakan pesan workbench di bawah untuk mulai menggunakan modul-modul hardware secara langsung.
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================
         INTERACTIVE WORKBENCH SIMULATOR (THE SHOWSTOPPER)
         ======================================================== */}
      <section id="workbench" className="workbench-section">
        <div className="container">
          <div className="section-header">
            <span className="section-tag">// INTERACTIVE STEM WORKSPACE</span>
            <h2 className="section-title">Uji Coba <span className="text-gradient-orange">Alat STEM</span> Garasi Kami</h2>
            <p className="section-subtitle">
              Nyalakan tombol instrumen di panel kontrol di bawah ini untuk melihat cara kerja simulasi mesin laboratorium kami secara interaktif.
            </p>
          </div>

          <div className="workbench-wrapper">
            {/* Control switchboard panel */}
            <div className="workbench-control-panel">
              <div className="panel-section-title">
                <Gauge size={16} /> Saklar Instrumen
              </div>

              <div className="workbench-switches">
                {/* Switch 1: Oscilloscope */}
                <div
                  className={`switch-item ${workbenchState.includes('oscilloscope') ? 'active' : ''}`}
                  onClick={() => toggleTool('oscilloscope')}
                >
                  <div className="switch-label-group">
                    <Activity className="switch-icon" size={20} />
                    <div>
                      <div className="switch-name">Oscilloscope</div>
                      <div className="switch-desc">Sinyal Gelombang</div>
                    </div>
                  </div>
                  <button className="toggle-btn"></button>
                </div>

                {/* Switch 2: 3D Printer */}
                <div
                  className={`switch-item ${workbenchState.includes('printer') ? 'active' : ''}`}
                  onClick={() => toggleTool('printer')}
                >
                  <div className="switch-label-group">
                    <Printer className="switch-icon" size={20} />
                    <div>
                      <div className="switch-name">3D Printer FDM</div>
                      <div className="switch-desc">Pembuat Casing 3D</div>
                    </div>
                  </div>
                  <button className="toggle-btn"></button>
                </div>

                {/* Switch 3: Laser Cutter CNC */}
                <div
                  className={`switch-item ${workbenchState.includes('laser') ? 'active' : ''}`}
                  onClick={() => toggleTool('laser')}
                >
                  <div className="switch-label-group">
                    <Flame className="switch-icon" size={20} />
                    <div>
                      <div className="switch-name">CNC Laser Cutter</div>
                      <div className="switch-desc">Pemotong Acrylic & Plywood</div>
                    </div>
                  </div>
                  <button className="toggle-btn"></button>
                </div>

                {/* Switch 4: Soldering Iron */}
                <div
                  className={`switch-item ${workbenchState.includes('solder') ? 'active' : ''}`}
                  onClick={() => toggleTool('solder')}
                >
                  <div className="switch-label-group">
                    <Zap className="switch-icon" size={20} />
                    <div>
                      <div className="switch-name">Solder Station</div>
                      <div className="switch-desc">Penyolderan Rangkaian</div>
                    </div>
                  </div>
                  <button className="toggle-btn"></button>
                </div>
              </div>

              {/* Power Capacity Grid readout */}
              <div className="power-grid-meter">
                <div className="meter-labels">
                  <span>TOTAL BEBAN KELISTRIKAN</span>
                  <span className={activeCount === 4 ? 'danger' : activeCount >= 2 ? 'warning' : ''}>
                    {(activeCount * 0.75).toFixed(2)} kW / 3.0 kW
                  </span>
                </div>
                <div className="meter-bar-container">
                  <div
                    className="meter-bar"
                    style={{
                      width: `${powerPercentage}%`,
                      background: activeCount === 4 ? 'var(--accent-orange)' : activeCount >= 3 ? 'var(--accent-amber)' : 'var(--accent-teal)'
                    }}
                  ></div>
                </div>
                {activeCount === 4 && (
                  <span className="power-warning">⚠️ BEBAN PUNCAK! Generator cadangan menyala.</span>
                )}
              </div>
            </div>

            {/* The physical grid desk containing responsive simulator nodes */}
            <div className="desk-simulation">
              <span className="desk-grid-label label-top-left">X-04 // WORKBENCH GRID</span>
              <span className="desk-grid-label label-bottom-right">IDN_MAKER_SPACE</span>

              {/* Node 1: Digital Oscilloscope Canvas */}
              <div className={`desk-widget ${workbenchState.includes('oscilloscope') ? 'active' : ''}`}>
                {!workbenchState.includes('oscilloscope') && (
                  <div className="widget-overlay-inactive">
                    <Activity size={32} />
                    <span>Oscilloscope dimatikan</span>
                  </div>
                )}

                <div className="widget-header">
                  <div className="widget-title">
                    <Activity size={16} className="text-gradient-teal" /> Digital Oscilloscope
                  </div>
                  <span className="widget-status">RUNNING</span>
                </div>

                <canvas ref={canvasRef} className="osc-canvas" width="280" height="120"></canvas>

                <div className="osc-controls">
                  <div className="control-dial-group">
                    <div className="dial-label">FREQUENCY</div>
                    <RotaryKnob
                      value={oscilloscopeFreq}
                      onChange={setOscilloscopeFreq}
                      min={10}
                      max={80}
                      label="Hz"
                      color="var(--accent-teal)"
                    />
                  </div>

                  <div className="control-dial-group">
                    <div className="dial-label">AMPLITUDE</div>
                    <RotaryKnob
                      value={oscilloscopeAmp}
                      onChange={setOscilloscopeAmp}
                      min={10}
                      max={50}
                      label="mV"
                      color="var(--accent-teal)"
                    />
                  </div>
                </div>
              </div>

              {/* Node 2: 3D Printer SVG */}
              <div className={`desk-widget ${workbenchState.includes('printer') ? 'active' : ''}`}>
                {!workbenchState.includes('printer') && (
                  <div className="widget-overlay-inactive">
                    <Printer size={32} />
                    <span>3D Printer dimatikan</span>
                  </div>
                )}

                <div className="widget-header">
                  <div className="widget-title">
                    <Printer size={16} style={{ color: 'var(--accent-orange)' }} /> 3D Printer Bed (FDM)
                  </div>
                  <span className="widget-status" style={{ color: 'var(--accent-orange)' }}>PRINTING</span>
                </div>

                <svg className="print-bed-svg" viewBox="0 0 200 120">
                  <rect width="100%" height="100%" fill="#080a0e" />

                  {/* Grid lines in background */}
                  <line x1="0" y1="100" x2="200" y2="100" stroke="#1f242e" strokeWidth="2" />

                  {/* Print object (mock gears or robot building up) */}
                  <rect x="70" y="80" width="60" height="20" rx="3" fill="#ff5d22" opacity="0.3" />
                  <rect x="80" y="60" width="40" height="20" rx="3" fill="#ff5d22" opacity="0.6" style={{ display: printProgress > 30 ? 'block' : 'none' }} />
                  <circle cx="100" cy="50" r="10" fill="#ff5d22" opacity="0.9" style={{ display: printProgress > 70 ? 'block' : 'none' }} />

                  {/* Moving print nozzle */}
                  <g transform={`translate(${printX}, ${90 - (printProgress / 100) * 40})`}>
                    <line x1="0" y1="-20" x2="0" y2="0" stroke="#8d99ae" strokeWidth="2" />
                    <polygon points="-6,0 6,0 0,8" fill="#ffb703" />
                    <circle cx="0" cy="8" r="3" fill="#ff5d22" className="sparkle" />
                  </g>
                </svg>

                <div className="printer-telemetry">
                  <div className="printer-telemetry-item">
                    <span>PROGRESS</span>
                    <span style={{ color: 'var(--accent-orange)' }}>{printProgress}%</span>
                  </div>
                  <div className="printer-telemetry-item">
                    <span>HOTEND</span>
                    <span>215 °C</span>
                  </div>
                </div>
              </div>

              {/* Node 3: Laser Cutter CNC SVG */}
              <div className={`desk-widget ${workbenchState.includes('laser') ? 'active' : ''}`}>
                {!workbenchState.includes('laser') && (
                  <div className="widget-overlay-inactive">
                    <Flame size={32} />
                    <span>CNC Laser dimatikan</span>
                  </div>
                )}

                <div className="widget-header">
                  <div className="widget-title">
                    <Flame size={16} style={{ color: 'var(--accent-amber)' }} /> CNC Laser Engraver
                  </div>
                  <span className="widget-status" style={{ color: 'var(--accent-amber)' }}>CUTTING</span>
                </div>

                <svg className="print-bed-svg" viewBox="0 0 200 120">
                  <rect width="100%" height="100%" fill="#080a0e" />

                  {/* Blueprint plate */}
                  <rect x="50" y="20" width="100" height="80" fill="none" stroke="#242c3b" strokeWidth="1" />

                  {/* Engraving Path */}
                  <circle cx="100" cy="60" r="25" fill="none" stroke="#ffb703" strokeWidth="1.5" strokeDasharray="160" strokeDashoffset={160 - (laserProgress / 100) * 160} />

                  {/* Moving Laser nozzle */}
                  {(() => {
                    const angle = (laserProgress / 100) * Math.PI * 2;
                    const lx = 100 + Math.cos(angle) * 25;
                    const ly = 60 + Math.sin(angle) * 25;
                    return (
                      <g transform={`translate(${lx}, ${ly})`}>
                        <circle cx="0" cy="0" r="4" fill="#ff5d22" className="sparkle" />
                        <line x1="0" y1="-30" x2="0" y2="0" stroke="#ffb703" strokeWidth="1" opacity="0.7" />
                        <circle cx="0" cy="0" r="10" fill="none" stroke="#ffb703" strokeWidth="1" opacity="0.3" className="sparkle" />
                      </g>
                    );
                  })()}
                </svg>

                <div className="printer-telemetry">
                  <div className="printer-telemetry-item">
                    <span>ENGRAVING</span>
                    <span style={{ color: 'var(--accent-amber)' }}>{laserProgress}%</span>
                  </div>
                  <div className="printer-telemetry-item">
                    <span>CO2 LASER</span>
                    <span>40 WATT</span>
                  </div>
                </div>
              </div>

              {/* Node 4: Soldering Station Display */}
              <div className={`desk-widget ${workbenchState.includes('solder') ? 'active' : ''}`}>
                {!workbenchState.includes('solder') && (
                  <div className="widget-overlay-inactive">
                    <Zap size={32} />
                    <span>Solder Iron dimatikan</span>
                  </div>
                )}

                <div className="widget-header">
                  <div className="widget-title">
                    <Zap size={16} style={{ color: '#ff3333' }} /> Soldering Temp Controller
                  </div>
                  <span className="widget-status" style={{ color: '#ff3333' }}>HOT</span>
                </div>

                <div className="soldering-display">
                  <div className="solder-temp-box">
                    {solderTemp}
                  </div>
                  <div className="solder-smoke-sim">
                    {/* Animate rising steam particles */}
                    <div className="smoke-cloud" style={{ animationDelay: '0s' }}></div>
                    <div className="smoke-cloud" style={{ animationDelay: '0.6s' }}></div>
                    <div className="smoke-cloud" style={{ animationDelay: '1.2s' }}></div>
                    <div style={{ position: 'absolute', bottom: '6px', left: '10px', fontSize: '0.65rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>SMOKE EXTRACTOR ACTIVE</div>
                  </div>
                </div>

                <div className="control-dial-group" style={{ marginTop: '8px', alignItems: 'flex-start' }}>
                  <div className="dial-label" style={{ marginBottom: '8px' }}>ATUR SUHU SOLDER</div>
                  <RotaryKnob
                    value={solderTemp}
                    onChange={setSolderTemp}
                    min={200}
                    max={450}
                    label="°C"
                    color="#ff3333"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================
         STEM TOOLBOX SECTION (DETAILED HARDWARE SPECS)
         ======================================================== */}
      <section id="toolbox" className="toolbox-section">
        <div className="container">
          <div className="section-header">
            <span className="section-tag">// LABORATORY SPECIFICATIONS</span>
            <h2 className="section-title">Perpustakaan <span className="text-gradient-orange">STEM Tools</span> Publik</h2>
            <p className="section-subtitle">
              IDN Maker Space dilengkapi dengan deretan mesin industrial berkualitas premium yang siap dioperasikan kapan saja oleh publik.
            </p>
          </div>

          <div className="toolbox-grid">
            {/* Box 1: 3D Printing */}
            <div className="tech-card orange-theme">
              <Printer size={32} className="text-gradient-orange" style={{ marginBottom: '16px' }} />
              <h3>3D Printing & CAD Lab</h3>
              <p style={{ fontSize: '0.9rem', margin: '12px 0' }}>
                Mencetak prototipe tiga dimensi secara presisi menggunakan aneka pilihan material filamen berkualitas tinggi.
              </p>
              <div>
                <span className="tool-badge">PLA</span>
                <span className="tool-badge">PETG</span>
                <span className="tool-badge">ABS/ASA</span>
                <span className="tool-badge">TPU (Flex)</span>
              </div>
              <div className="tool-spec-list">
                <div className="tool-spec">
                  <span>Model Printer</span>
                  <span>Bambu Lab X1-Carbon</span>
                </div>
                <div className="tool-spec">
                  <span>Volume Cetak</span>
                  <span>256 x 256 x 256 mm</span>
                </div>
                <div className="tool-spec">
                  <span>Suhu Maks Hotend</span>
                  <span>300 °C</span>
                </div>
              </div>
            </div>

            {/* Box 2: Laser Cutting & CNC */}
            <div className="tech-card">
              <Flame size={32} className="text-gradient-teal" style={{ marginBottom: '16px' }} />
              <h3>CNC Laser Cutting & Router</h3>
              <p style={{ fontSize: '0.9rem', margin: '12px 0' }}>
                Memotong dan mengukir papan kayu, akrilik, kulit, hingga kertas karton tebal dengan presisi laser hingga 0.01 mm.
              </p>
              <div>
                <span className="tool-badge">Acrylic 1-10mm</span>
                <span className="tool-badge">Plywood</span>
                <span className="tool-badge">MDF Board</span>
                <span className="tool-badge">Leather CNC</span>
              </div>
              <div className="tool-spec-list">
                <div className="tool-spec">
                  <span>Tipe Mesin</span>
                  <span>CO2 Laser Cutter 80W</span>
                </div>
                <div className="tool-spec">
                  <span>Dimensi Bed</span>
                  <span>900 x 600 mm</span>
                </div>
                <div className="tool-spec">
                  <span>Kecepatan Ukir</span>
                  <span>500 mm / detik</span>
                </div>
              </div>
            </div>

            {/* Box 3: Electronics Lab */}
            <div className="tech-card orange-theme">
              <Cpu size={32} className="text-gradient-orange" style={{ marginBottom: '16px' }} />
              <h3>Robotics & Electronics Station</h3>
              <p style={{ fontSize: '0.9rem', margin: '12px 0' }}>
                Merakit sensor, menyolder sirkuit PCB, dan menguji aneka modul mikrokontroler IoT dengan kelengkapan instrumen lengkap.
              </p>
              <div>
                <span className="tool-badge">ESP32/ESP8266</span>
                <span className="tool-badge">Arduino Core</span>
                <span className="tool-badge">Raspberry Pi</span>
                <span className="tool-badge">Sensor Kit</span>
              </div>
              <div className="tool-spec-list">
                <div className="tool-spec">
                  <span>Solder Station</span>
                  <span>TS101 Smart Iron</span>
                </div>
                <div className="tool-spec">
                  <span>Power Supply</span>
                  <span>Digital Variable 30V 5A</span>
                </div>
                <div className="tool-spec">
                  <span>Logic Analyzer</span>
                  <span>8 Channel 24MHz</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================
         INTERACTIVE BLUEPRINT SANDBOX & CODE EDITOR
         ======================================================== */}
      <section id="sandbox" className="sandbox-section">
        <div className="container">
          <div className="section-header">
            <span className="section-tag">// THE MAKER'S PLAYGROUND</span>
            <h2 className="section-title">Laboratorium <span className="text-gradient-orange">Sandbox Proyek</span></h2>
            <p className="section-subtitle">
              Pilih cetak biru ide eksperimen di bawah ini, periksa rancangan kabel listriknya, compile programnya ke modul simulator, dan lihat reaksinya!
            </p>
          </div>

          <div className="sandbox-wrapper">
            {/* Project list switcher */}
            <div className="project-select-panel">
              {projectsPreset.map(proj => (
                <div
                  key={proj.id}
                  className={`project-tab-btn ${activeProjectId === proj.id ? 'active' : ''}`}
                  onClick={() => {
                    setActiveProjectId(proj.id);
                    resetSandbox();
                  }}
                >
                  <div className="project-tab-info">
                    <div className="project-tab-icon">
                      {proj.id === 'iot' ? <Cpu size={24} /> : proj.id === 'robotics' ? <Wrench size={24} /> : <Printer size={24} />}
                    </div>
                    <div className="project-tab-meta">
                      <h4>{proj.title}</h4>
                      <p>{proj.subtitle}</p>
                    </div>
                  </div>
                  <ArrowRight size={18} className="project-tab-arrow" style={{ opacity: activeProjectId === proj.id ? 1 : 0.4 }} />
                </div>
              ))}

              {/* Selected Project Specs table */}
              <div className="tech-card orange-theme" style={{ marginTop: '8px' }}>
                <h4 style={{ fontSize: '0.9rem', textTransform: 'uppercase', color: 'var(--text-white)', marginBottom: '12px' }}>Daftar Peralatan & Spesifikasi</h4>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '16px' }}>
                  {activeProject.tools.map((t, idx) => (
                    <span key={idx} className="tool-badge" style={{ margin: 0 }}>{t}</span>
                  ))}
                </div>
                <div className="project-spec-grid">
                  <div className="project-spec-item">
                    <span>EST. BIAYA</span>
                    <span>{activeProject.cost}</span>
                  </div>
                  <div className="project-spec-item">
                    <span>DURASI RAKIT</span>
                    <span>{activeProject.time}</span>
                  </div>
                  <div className="project-spec-item">
                    <span>DIKATEGORIKAN</span>
                    <span style={{ color: activeProject.difficulty === 'MAHIR' ? 'var(--accent-orange)' : activeProject.difficulty === 'MENENGAH' ? 'var(--accent-amber)' : 'var(--accent-teal)' }}>
                      {activeProject.difficulty}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Simulated interactive blueprint and terminal compiler panel */}
            <div className="blueprint-card">
              <div className="blueprint-header">
                <span className="blueprint-logo">SCHEMATIC.BLUEPRINT // v2.6</span>
                <span className="status-badge" style={{ border: 'none', background: 'none' }}>
                  PROYEK: {activeProject.id.toUpperCase()}
                </span>
              </div>

              {/* Dynamic blueprint SVG preview */}
              <div className="blueprint-screen">
                {activeProject.schematicSvg}
              </div>

              {/* Simulated Code Compiler Console */}
              <div className="ide-console">
                {sandboxLogs.map((log, idx) => (
                  <div key={idx} className={`ide-log-line ${log.type}`}>
                    &gt; {log.text}
                  </div>
                ))}

                {compilingState === 'compiling' && (
                  <div className="compiling-overlay">
                    <span style={{ fontSize: '0.75rem', color: 'var(--accent-teal)', fontFamily: 'var(--font-mono)' }}>COMPILING CORE FIRMWARE...</span>
                    <div className="loading-bar-outer">
                      <div className="loading-bar-inner"></div>
                    </div>
                  </div>
                )}

                {compilingState === 'success' && (
                  <div className="ide-log-line success" style={{ fontWeight: 'bold' }}>
                    [SUCCESS] FIRMWARE UPLOADED TO HARDWARE CHIP BOARD. Robot operational.
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div style={{ display: 'flex', gap: '16px', marginTop: '16px' }}>
                {compilingState !== 'success' ? (
                  <button
                    className="btn-teal"
                    onClick={startCompilation}
                    disabled={compilingState === 'compiling'}
                    style={{ flex: 1, justifyContent: 'center' }}
                  >
                    <Play size={16} /> Compile &amp; Upload
                  </button>
                ) : (
                  <button
                    className="btn-secondary"
                    onClick={resetSandbox}
                    style={{ flex: 1, justifyContent: 'center', borderColor: 'var(--accent-orange)', color: 'var(--accent-orange)' }}
                  >
                    <RotateCcw size={16} /> Reset Hardware Sandbox
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================
         LAB BOOKING & WORKBENCH SCHEDULER (FORM & INVOICE)
         ======================================================== */}
      <section id="booking" className="booking-section">
        <div className="container">
          <div className="section-header">
            <span className="section-tag">// SECURE RESERVATION</span>
            <h2 className="section-title">Reservasi <span className="text-gradient-orange">STEM Workbench</span> Anda</h2>
            <p className="section-subtitle">
              Pilih stasiun kerja garasi, tentukan durasi sewa, tambahkan perlengkapan penunjang, dan reservasi tiket masuk Anda secara online instan.
            </p>
          </div>

          <div className="booking-panel">
            {!bookingSuccess ? (
              <form onSubmit={handleBookingSubmit}>
                {/* Step 1: Choose Workbench */}
                <div className="booking-step-title">
                  <span style={{ color: 'var(--accent-orange)', fontWeight: 'bold' }}>01.</span>
                  PILIH STASIUN WORKBENCH GARASI
                </div>

                <div className="booking-benches-grid">
                  {benchOptions.map(bench => (
                    <div
                      key={bench.id}
                      className={`booking-bench-card ${bookingForm.benchId === bench.id ? 'active' : ''}`}
                      onClick={() => setBookingForm(prev => ({ ...prev, benchId: bench.id }))}
                    >
                      <div className="booking-bench-icon">
                        {bench.icon}
                      </div>
                      <div className="booking-bench-name">{bench.name}</div>
                      <div className="booking-bench-rate">Rp {(bench.baseRate / 1000).toFixed(0)}K / Jam</div>
                    </div>
                  ))}
                </div>

                {/* Step 2: Choose Accessories */}
                <div className="booking-step-title">
                  <span style={{ color: 'var(--accent-orange)', fontWeight: 'bold' }}>02.</span>
                  AKSESORIS &amp; ALAT UKUR TAMBAHAN (OPSIONAL)
                </div>

                <div className="booking-accessories-list">
                  {accessoryOptions.map(acc => {
                    const isChecked = bookingForm.accessories.includes(acc.id);
                    return (
                      <div
                        key={acc.id}
                        className={`booking-accessory-item ${isChecked ? 'active' : ''}`}
                        onClick={() => toggleAccessory(acc.id)}
                      >
                        <input
                          type="checkbox"
                          className="form-checkbox"
                          checked={isChecked}
                          readOnly
                        />
                        <span className="booking-accessory-label">
                          {acc.name} {acc.rate > 0 ? `(+Rp ${acc.rate / 1000}K)` : '(Gratis)'}
                        </span>
                      </div>
                    );
                  })}
                </div>

                {/* Step 3: Date & Time Selector */}
                <div className="booking-step-title">
                  <span style={{ color: 'var(--accent-orange)', fontWeight: 'bold' }}>03.</span>
                  JADWAL KEDATANGAN &amp; WAKTU
                </div>

                <div className="booking-schedule-row">
                  <div className="form-group">
                    <label className="form-label">TANGGAL EKSPERIMEN</label>
                    <input
                      type="date"
                      className="form-input"
                      value={bookingForm.date}
                      onChange={(e) => setBookingForm(prev => ({ ...prev, date: e.target.value }))}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">JAM KEDATANGAN</label>
                    <input
                      type="time"
                      className="form-input"
                      value={bookingForm.time}
                      onChange={(e) => setBookingForm(prev => ({ ...prev, time: e.target.value }))}
                      required
                    />
                  </div>

                  <div className="form-group" style={{ gridColumn: 'span 2' }}>
                    <label className="form-label">DURASI PENGGUNAAN WORKBENCH: <span style={{ color: 'var(--accent-orange)' }}>{bookingForm.duration} Jam</span></label>
                    <input
                      type="range"
                      min="1"
                      max="8"
                      className="dial-slider"
                      value={bookingForm.duration}
                      onChange={(e) => setBookingForm(prev => ({ ...prev, duration: parseInt(e.target.value) }))}
                    />
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                      <span>1 Jam</span>
                      <span>4 Jam</span>
                      <span>8 Jam (Maks)</span>
                    </div>
                  </div>
                </div>

                {/* Step 4: Contact details */}
                <div className="booking-step-title">
                  <span style={{ color: 'var(--accent-orange)', fontWeight: 'bold' }}>04.</span>
                  INFORMASI KONTAK PERSONAL MAKER
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '30px' }}>
                  <div className="form-group">
                    <label className="form-label">NAMA LENGKAP MAKER</label>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="Contoh: Daffa Pratama"
                      value={bookingForm.name}
                      onChange={(e) => setBookingForm(prev => ({ ...prev, name: e.target.value }))}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">ALAMAT EMAIL</label>
                    <input
                      type="email"
                      className="form-input"
                      placeholder="Contoh: daffa@gmail.com"
                      value={bookingForm.email}
                      onChange={(e) => setBookingForm(prev => ({ ...prev, email: e.target.value }))}
                      required
                    />
                  </div>
                </div>

                {/* Pricing Summary Box */}
                <div className="booking-summary-box">
                  <div className="booking-summary-row">
                    <span>Workbench ({benchOptions.find(b => b.id === bookingForm.benchId).name})</span>
                    <span>Rp {(benchOptions.find(b => b.id === bookingForm.benchId).baseRate * bookingForm.duration).toLocaleString('id-ID')}</span>
                  </div>
                  <div className="booking-summary-row">
                    <span>Aksesoris Tambahan</span>
                    <span>
                      Rp {(accessoryOptions
                        .filter(a => bookingForm.accessories.includes(a.id))
                        .reduce((total, a) => total + (a.rate * bookingForm.duration), 0)
                      ).toLocaleString('id-ID')}
                    </span>
                  </div>
                  <div className="booking-summary-row">
                    <span>Total Estimasi Biaya (Bayar di Tempat)</span>
                    <span>
                      Rp {(
                        (benchOptions.find(b => b.id === bookingForm.benchId).baseRate * bookingForm.duration) +
                        (accessoryOptions
                          .filter(a => bookingForm.accessories.includes(a.id))
                          .reduce((total, a) => total + (a.rate * bookingForm.duration), 0)
                        )
                      ).toLocaleString('id-ID')}
                    </span>
                  </div>
                </div>

                <div style={{ textAlign: 'center' }}>
                  <button type="submit" className="btn-primary" style={{ width: '100%', justifyContent: 'center', padding: '16px' }}>
                    Konfirmasi Reservasi Workbench Garasi
                  </button>
                </div>
              </form>
            ) : (
              /* High-fidelity Booking Invoice Ticket receipt */
              <div style={{ textAlign: 'center', animation: 'spark-glow 0.8s ease' }}>
                <div style={{ color: 'var(--accent-teal)', marginBottom: '16px' }}>
                  <CheckCircle size={64} style={{ filter: 'drop-shadow(0 0 10px var(--accent-teal))' }} />
                </div>
                <h3 style={{ fontSize: '1.8rem', marginBottom: '12px' }}>RESERVASI WORKBENCH BERHASIL!</h3>
                <p style={{ color: 'var(--text-secondary)', maxWidth: '500px', margin: '0 auto 30px' }}>
                  Silakan simpan invoice tiket sirkuit di bawah ini dan tunjukkan kepada asisten Lab Engineer kami saat tiba di garasi.
                </p>

                <div style={{ background: '#07090e', border: '2px dashed var(--accent-teal)', borderRadius: '12px', padding: '30px', maxWidth: '500px', margin: '0 auto 30px', textAlign: 'left', position: 'relative', overflow: 'hidden' }}>
                  {/* Decorative circuit path */}
                  <div style={{ position: 'absolute', top: 0, right: 0, width: '80px', height: '80px', opacity: 0.15, border: '4px solid var(--accent-teal)', borderRadius: '50%', transform: 'translate(30px, -30px)' }}></div>

                  <div style={{ borderBottom: '1px solid #1f242e', paddingBottom: '12px', marginBottom: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem', color: 'var(--text-muted)' }}>IDN MAKER SPACE CIRCUIT TICKET</span>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.9rem', color: 'var(--accent-teal)', fontWeight: 'bold' }}>{generatedTicket.id}</span>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px', fontSize: '0.85rem' }}>
                    <div>
                      <div style={{ color: 'var(--text-muted)', fontSize: '0.75rem', marginBottom: '4px' }}>NAMA MAKER</div>
                      <div style={{ color: 'var(--text-white)', fontWeight: 'bold' }}>{generatedTicket.name}</div>
                    </div>
                    <div>
                      <div style={{ color: 'var(--text-muted)', fontSize: '0.75rem', marginBottom: '4px' }}>STASIUN KERJA</div>
                      <div style={{ color: 'var(--text-white)', fontWeight: 'bold' }}>{generatedTicket.bench}</div>
                    </div>
                    <div>
                      <div style={{ color: 'var(--text-muted)', fontSize: '0.75rem', marginBottom: '4px' }}>JADWAL RESEVASI</div>
                      <div style={{ color: 'var(--text-white)', fontWeight: 'bold' }}>{generatedTicket.date} @ {generatedTicket.time}</div>
                    </div>
                    <div>
                      <div style={{ color: 'var(--text-muted)', fontSize: '0.75rem', marginBottom: '4px' }}>DURASI SEWA</div>
                      <div style={{ color: 'var(--text-white)', fontWeight: 'bold' }}>{generatedTicket.duration} Jam</div>
                    </div>
                    <div style={{ gridColumn: 'span 2' }}>
                      <div style={{ color: 'var(--text-muted)', fontSize: '0.75rem', marginBottom: '4px' }}>ALAT AKSESORIS</div>
                      <div style={{ color: 'var(--text-white)', fontStyle: 'italic' }}>{generatedTicket.accessories}</div>
                    </div>
                  </div>

                  <div style={{ borderTop: '1px dashed #1f242e', marginTop: '20px', paddingTop: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <div style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>TOTAL TAGIHAN (DI TEMPAT)</div>
                      <div style={{ color: 'var(--accent-orange)', fontSize: '1.4rem', fontWeight: 'bold', fontFamily: 'var(--font-mono)' }}>
                        Rp {generatedTicket.total.toLocaleString('id-ID')}
                      </div>
                    </div>
                    {/* Simulated barcode */}
                    <div style={{ display: 'flex', gap: '3px', background: 'var(--text-white)', padding: '6px 12px', borderRadius: '4px', border: '1px solid var(--accent-teal)', boxShadow: '0 0 10px rgba(0, 245, 212, 0.2)' }}>
                      <div style={{ width: '2px', height: '24px', background: '#000' }}></div>
                      <div style={{ width: '4px', height: '24px', background: '#000' }}></div>
                      <div style={{ width: '1px', height: '24px', background: '#000' }}></div>
                      <div style={{ width: '3px', height: '24px', background: '#000' }}></div>
                      <div style={{ width: '1px', height: '24px', background: '#000' }}></div>
                      <div style={{ width: '4px', height: '24px', background: '#000' }}></div>
                      <div style={{ width: '2px', height: '24px', background: '#000' }}></div>
                      <div style={{ width: '1px', height: '24px', background: '#000' }}></div>
                      <div style={{ width: '3px', height: '24px', background: '#000' }}></div>
                      <div style={{ width: '1px', height: '24px', background: '#000' }}></div>
                      <div style={{ width: '4px', height: '24px', background: '#000' }}></div>
                    </div>
                  </div>
                </div>

                <div style={{ marginTop: '20px' }}>
                  <button
                    className="btn-secondary"
                    onClick={() => {
                      setBookingSuccess(false);
                      setBookingForm({
                        name: '',
                        email: '',
                        date: '2026-05-20',
                        time: '14:00',
                        duration: 2,
                        benchId: 'electro',
                        accessories: ['goggles']
                      });
                    }}
                  >
                    Buat Reservasi Baru
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ========================================================
         PUBLIC EXPERIMENTS GALLERY (THE PROJECT PORTFOLIO)
         ======================================================== */}
      <section id="gallery" className="gallery-section">
        <div className="container">
          <div className="section-header">
            <span className="section-tag">// PUBLIC BUILD ARCHIVES</span>
            <h2 className="section-title">Galeri <span className="text-gradient-orange">Karya Kreatif</span> Publik</h2>
            <p className="section-subtitle">
              Intip proyek buatan para pemula dan engineer yang lahir langsung dari workbench garasi laboratorium IDN Maker Space.
            </p>
          </div>

          <div className="gallery-grid">
            {galleryProjects.map((proj) => (
              <div
                key={proj.id}
                className="tech-card project-card"
                onClick={() => openProjectModal(proj)}
              >
                {/* Vector illustration representations of projects */}
                <div className="project-card-image" style={{ background: 'linear-gradient(135deg, #161c28 0%, #0d1117 100%)', display: 'flex', alignItems: 'center', justifyItems: 'center', justifyContent: 'center' }}>
                  {proj.id === 'mirror' && (
                    <svg width="80" height="80" viewBox="0 0 100 100">
                      {/* Dodecahedron pentagonal path */}
                      <polygon points="50,5 95,38 78,90 22,90 5,38" fill="none" stroke="var(--accent-teal)" strokeWidth="1.5" />
                      <polygon points="50,20 80,42 68,76 32,76 20,42" fill="none" stroke="var(--accent-blue)" strokeWidth="1" strokeDasharray="3,3" />
                      <circle cx="50" cy="53" r="10" fill="none" stroke="var(--accent-orange)" strokeWidth="1" />
                    </svg>
                  )}
                  {proj.id === 'maze' && (
                    <svg width="80" height="80" viewBox="0 0 100 100">
                      <rect x="25" y="25" width="50" height="50" rx="6" fill="none" stroke="var(--accent-orange)" strokeWidth="1.5" />
                      {/* wheels */}
                      <rect x="15" y="32" width="10" height="15" rx="2" fill="none" stroke="var(--text-secondary)" strokeWidth="1" />
                      <rect x="75" y="32" width="10" height="15" rx="2" fill="none" stroke="var(--text-secondary)" strokeWidth="1" />
                      <circle cx="50" cy="50" r="12" fill="none" stroke="var(--accent-teal)" strokeWidth="1" strokeDasharray="4,4" />
                    </svg>
                  )}
                  {proj.id === 'keyb' && (
                    <svg width="80" height="80" viewBox="0 0 100 100">
                      {/* split board keycaps */}
                      <rect x="10" y="30" width="35" height="40" rx="3" fill="none" stroke="var(--accent-blue)" strokeWidth="1.5" />
                      <rect x="55" y="30" width="35" height="40" rx="3" fill="none" stroke="var(--accent-blue)" strokeWidth="1.5" />
                      {/* tiny keys */}
                      <rect x="15" y="36" width="6" height="6" fill="none" stroke="var(--accent-amber)" strokeWidth="1" />
                      <rect x="24" y="36" width="6" height="6" fill="none" stroke="var(--accent-amber)" strokeWidth="1" />
                      <rect x="33" y="36" width="6" height="6" fill="none" stroke="var(--accent-amber)" strokeWidth="1" />
                      <rect x="61" y="36" width="6" height="6" fill="none" stroke="var(--accent-amber)" strokeWidth="1" />
                      <rect x="70" y="36" width="6" height="6" fill="none" stroke="var(--accent-amber)" strokeWidth="1" />
                      <rect x="79" y="36" width="6" height="6" fill="none" stroke="var(--accent-amber)" strokeWidth="1" />
                    </svg>
                  )}
                </div>

                <div className="project-card-tags">
                  {proj.tags.map((t, i) => (
                    <span key={i} className="tool-badge" style={{ margin: 0, padding: '2px 8px', fontSize: '0.7rem' }}>{t}</span>
                  ))}
                </div>

                <h3 style={{ fontSize: '1.2rem', marginBottom: '8px' }}>{proj.title}</h3>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '16px' }}>{proj.desc}</p>

                <div style={{ display: 'flex', justifyItems: 'center', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.75rem', color: 'var(--text-muted)', borderTop: '1px solid var(--border-color)', paddingTop: '12px' }}>
                  <span>Maker: <strong>{proj.maker}</strong></span>
                  <span style={{ color: 'var(--accent-teal)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    Buka Cetak Biru <ArrowRight size={12} />
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========================================================
         FAQ & CLINICAL TELEMETRY DIAGNOSTICS TERMINAL
         ======================================================== */}
      <section id="faq" className="faq-section">
        <div className="container">
          <div className="section-header">
            <span className="section-tag">// FAQ COMMAND LINE INTERFACE</span>
            <h2 className="section-title">Diagnostics &amp; <span className="text-gradient-orange">FAQ Console</span></h2>
            <p className="section-subtitle">
              Klik tombol pintasan diagnostic di bawah terminal atau ketik perintah Anda untuk mendiagnosis informasi garasi IDN Maker Space secara realtime.
            </p>
          </div>

          <div className="faq-terminal-card">
            {/* Window header */}
            <div className="terminal-header" style={{ background: '#0a0c10', padding: '12px 20px', borderBottom: '1px solid var(--border-color)', margin: 0 }}>
              <div className="terminal-dots">
                <span className="terminal-dot red"></span>
                <span className="terminal-dot yellow"></span>
                <span className="terminal-dot green"></span>
              </div>
              <span className="terminal-title">IDN_MAKER_SPACE_DIAGNOSTICS.SH</span>
              <span style={{ fontSize: '0.7rem', color: 'var(--accent-teal)', fontFamily: 'var(--font-mono)' }}>PORT_ACTIVE</span>
            </div>

            {/* Terminal Body content */}
            <div className="faq-terminal-body">
              {terminalHistory.map((hist, idx) => (
                <div key={idx}>
                  {hist.type === 'input' ? (
                    <div className="terminal-prompt-line">
                      <span>guest@idnmakerspace:~$</span>
                      <span className="terminal-input-simulate">{hist.text}</span>
                    </div>
                  ) : (
                    <div className="terminal-response">
                      {hist.text}
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Badges command buttons for interactive execution */}
            <div className="terminal-commands-list">
              <span className="terminal-title" style={{ marginRight: '12px', alignSelf: 'center' }}>COMMAND QUICK BUTTONS:</span>
              {faqPresets.map((preset, idx) => (
                <button
                  key={idx}
                  className="terminal-cmd-badge"
                  onClick={() => executeTerminalCommand(preset.cmd)}
                  title={preset.desc}
                >
                  ./{preset.cmd}
                </button>
              ))}
              <button
                className="terminal-cmd-badge"
                onClick={() => executeTerminalCommand('clear')}
                style={{ borderColor: 'var(--accent-orange)', color: 'var(--accent-orange)' }}
              >
                ./clear
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================
         MODAL BLUEPRINT VIEWPOPUP GALLERY
         ======================================================== */}
      {modalOpen && selectedGalleryProject && (
        <div className="modal-overlay" onClick={() => setModalOpen(false)}>
          <div className="modal-content-panel" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close-btn" onClick={() => setModalOpen(false)}>
              <X size={20} />
            </button>

            <div style={{ borderBottom: '1px solid rgba(0, 180, 216, 0.3)', paddingBottom: '16px', marginBottom: '24px' }}>
              <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--accent-blue)', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '1px' }}>
                DETAILED BLUEPRINT // SPECIFICATION ARCHIVE
              </span>
              <h2 style={{ fontSize: '1.8rem', marginTop: '6px' }}>{selectedGalleryProject.title}</h2>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Dibuat oleh: <strong>{selectedGalleryProject.maker}</strong></p>
            </div>

            <div style={{ marginBottom: '24px' }}>
              <h4 style={{ color: 'var(--text-white)', marginBottom: '8px', fontFamily: 'var(--font-heading)' }}>DESKRIPSI PROYEK</h4>
              <p style={{ fontSize: '0.95rem' }}>{selectedGalleryProject.desc}</p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.2fr', gap: '24px' }}>
              <div>
                <h4 style={{ color: 'var(--text-white)', marginBottom: '12px', fontSize: '0.95rem', borderBottom: '1px dashed var(--border-color)', paddingBottom: '6px' }}>
                  BILL OF MATERIALS (BOM)
                </h4>
                <ul style={{ paddingLeft: '20px', fontSize: '0.85rem', color: 'var(--text-secondary)', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {selectedGalleryProject.bom.map((material, i) => (
                    <li key={i}>{material}</li>
                  ))}
                </ul>
              </div>

              <div>
                <h4 style={{ color: 'var(--text-white)', marginBottom: '12px', fontSize: '0.95rem', borderBottom: '1px dashed var(--border-color)', paddingBottom: '6px' }}>
                  LANGKAH-LANGKAH MERAKIT DI WORKBENCH
                </h4>
                <ol style={{ paddingLeft: '20px', fontSize: '0.85rem', color: 'var(--text-secondary)', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {selectedGalleryProject.steps.map((step, i) => (
                    <li key={i}>{step}</li>
                  ))}
                </ol>
              </div>
            </div>

            <div style={{ marginTop: '30px', background: 'rgba(0, 180, 216, 0.05)', border: '1px solid rgba(0, 180, 216, 0.2)', padding: '16px', borderRadius: '8px', display: 'flex', justifyItems: 'center', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                Tertarik merakit proyek ini sendiri? Kunjungi garasi kami dan dapatkan semua bahan di atas!
              </div>
              <a
                href="#booking"
                className="btn-teal"
                style={{ padding: '8px 16px', fontSize: '0.75rem' }}
                onClick={() => setModalOpen(false)}
              >
                Pesan Workbench
              </a>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================
         FOOTER SECTION (TECH SPECS, COORDINATES & SAFETIES)
         ======================================================== */}
      <footer className="footer-section">
        <div className="container">
          <div className="footer-grid">
            <div className="footer-logo-desc">
              <div className="nav-logo" style={{ marginBottom: '16px' }}>
                <BrandLogo size={36} />
                <span>IDN <span className="text-gradient-orange">MAKER SPACE</span></span>
              </div>
              <p style={{ fontSize: '0.85rem', maxWidth: '400px' }}>
                Laboratorium eksperimental modern berbasis STEM (Science, Technology, Engineering, Math) dengan atmosfer garasi engineering yang inklusif untuk seluruh elemen publik.
              </p>
            </div>

            <div>
              <div className="footer-title">Navigasi</div>
              <ul className="footer-links">
                <li><a href="#workbench" className="footer-link">Simulasi Workbench</a></li>
                <li><a href="#toolbox" className="footer-link">STEM Toolbox</a></li>
                <li><a href="#sandbox" className="footer-link">Code Sandbox</a></li>
                <li><a href="#booking" className="footer-link">Sewa Space</a></li>
              </ul>
            </div>

            <div>
              <div className="footer-title">Keamanan Lab</div>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <li style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '28px', height: '28px', borderRadius: '6px', background: 'rgba(0, 245, 212, 0.08)', border: '1px solid rgba(0, 245, 212, 0.2)', color: 'var(--accent-teal)', boxShadow: '0 0 8px rgba(0, 245, 212, 0.05)' }}>
                    <Shield size={14} />
                  </div>
                  <span>ANSI Z87.1 Goggles Enforced</span>
                </li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '28px', height: '28px', borderRadius: '6px', background: 'rgba(255, 93, 34, 0.08)', border: '1px solid rgba(255, 93, 34, 0.2)', color: 'var(--accent-orange)', boxShadow: '0 0 8px rgba(255, 93, 34, 0.05)' }}>
                    <Wind size={14} />
                  </div>
                  <span>Laser Exhaust Ventilated</span>
                </li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '28px', height: '28px', borderRadius: '6px', background: 'rgba(0, 180, 216, 0.08)', border: '1px solid rgba(0, 180, 216, 0.2)', color: 'var(--accent-blue)', boxShadow: '0 0 8px rgba(0, 180, 216, 0.05)' }}>
                    <Zap size={14} />
                  </div>
                  <span>220V ESD Safe Protection</span>
                </li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '28px', height: '28px', borderRadius: '6px', background: 'rgba(255, 215, 0, 0.08)', border: '1px solid rgba(255, 215, 0, 0.2)', color: 'var(--accent-amber)', boxShadow: '0 0 8px rgba(255, 215, 0, 0.05)' }}>
                    <Coffee size={14} />
                  </div>
                  <span>Free Espresso Refill</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="footer-meta-row">
            <div>
              IDN MAKER SPACE CORPORATION © 2026 // BSD CITY, TANGERANG, INDONESIA
            </div>
            <div>
              LAT_COORD: -6.3024 // LNG_COORD: 106.6522 // GRID_ACTIVE
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}

export default App;
