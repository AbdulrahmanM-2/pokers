import React, { useState, useEffect, useRef } from 'react';
import { 
  Battery, Wifi, Signal, Lock, Camera, Calculator, 
  CloudLightning, Settings, MessageSquare, Phone, Mail, Globe, 
  Map, Clock, ChevronRight, Fingerprint, Zap, Bell, Search, 
  User, Activity, Bluetooth, Moon, Sun, Volume2, Maximize, 
  Power, Shield, ShoppingBag, Spade, Music, FileText, Download, 
  Image as ImageIcon, Play, Pause, SkipForward, SkipBack, RefreshCw,
  Calendar as CalendarIcon
} from 'lucide-react';
import { format } from 'date-fns';


// --- Helpers ---
const vibrate = (pattern: number | number[] = 50) => {
  if (typeof navigator !== 'undefined' && navigator.vibrate) {
    navigator.vibrate(pattern);
  }
};

// --- App Registry ---
const APP_REGISTRY: Record<string, { name: string, icon: any, gradient: string, secure?: boolean, desc?: string }> = {
  Comms: { name: 'Comms', icon: MessageSquare, gradient: 'from-blue-500 to-cyan-400', secure: true },
  Optics: { name: 'Optics', icon: Camera, gradient: 'from-pink-500 to-rose-500' },
  Gallery: { name: 'Gallery', icon: ImageIcon, gradient: 'from-purple-400 to-pink-600' },
  Atmosphere: { name: 'Atmosphere', icon: CloudLightning, gradient: 'from-cyan-500 to-emerald-400' },
  Time: { name: 'Time', icon: Clock, gradient: 'from-gray-700 to-gray-900' },
  Calendar: { name: 'Calendar', icon: CalendarIcon, gradient: 'from-indigo-400 to-purple-600' },
  Nav: { name: 'Nav', icon: Map, gradient: 'from-emerald-500 to-teal-400' },
  Compute: { name: 'Compute', icon: Calculator, gradient: 'from-orange-500 to-rose-500' },
  System: { name: 'System', icon: Settings, gradient: 'from-gray-600 to-gray-800', secure: true },
  Net: { name: 'Net', icon: Globe, gradient: 'from-indigo-500 to-blue-500', secure: true },
  Vault: { name: 'Vault', icon: ShoppingBag, gradient: 'from-purple-500 to-fuchsia-500', secure: true },
  Mail: { name: 'Mail', icon: Mail, gradient: 'from-rose-400 to-orange-500', secure: true },
  // Downloadable Apps
  Poker: { name: 'Texas Holdem', icon: Spade, gradient: 'from-red-600 to-rose-800', desc: 'High-stakes secure poker client.' },
  Music: { name: 'Audio', icon: Music, gradient: 'from-yellow-400 to-orange-500', desc: 'Lossless encrypted audio player.' },
  Notes: { name: 'Secure Notes', icon: FileText, gradient: 'from-emerald-400 to-green-600', secure: true, desc: 'End-to-end encrypted text vault.' }
};

const DEFAULT_APPS = ['Comms', 'Optics', 'Gallery', 'Atmosphere', 'Time', 'Calendar', 'Compute', 'System', 'Net', 'Vault', 'Mail'];
const STORE_APPS = ['Poker', 'Music', 'Notes'];

const WALLPAPERS = [
  'https://images.unsplash.com/photo-1614850523459-c2f4c699c52e?q=80&w=2564&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2564&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?q=80&w=2564&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?q=80&w=2564&auto=format&fit=crop'
];

// --- Components ---

const StatusBar = ({ time, onRightClick, onLeftClick, wifiOn, batteryPct }: { time: Date, onRightClick: () => void, onLeftClick: () => void, wifiOn: boolean, batteryPct: number }) => (
  <div className="absolute top-0 w-full h-[40px] flex justify-between items-center px-5 text-xs font-medium z-50 text-white/90">
    <div className="flex items-center space-x-2 w-1/3 cursor-pointer active:opacity-50" onClick={onLeftClick}>
      <span>{format(time, 'h:mm')}</span>
      <Shield size={10} className="text-emerald-400 drop-shadow-[0_0_5px_#34d399]" />
    </div>
    <div className="w-1/3 flex justify-center"></div>
    <div 
      className="flex items-center justify-end space-x-1.5 w-1/3 cursor-pointer active:opacity-50"
      onClick={onRightClick}
    >
      {wifiOn && <Signal size={14} />}
      {wifiOn && <Wifi size={14} />}
      <span className="text-[10px] ml-1">{batteryPct}%</span>
      <Battery size={16} className="text-aura-primary drop-shadow-[0_0_5px_#8b5cf6]" />
    </div>
  </div>
);

const AppIcon = ({ id, onClick }: { id: string, onClick?: () => void }) => {
  const app = APP_REGISTRY[id];
  return (
    <div className="flex flex-col items-center space-y-2 cursor-pointer group relative animate-in zoom-in duration-300" onClick={() => { vibrate(30); onClick?.(); }}>
      <div className={`absolute top-0 w-[60px] h-[60px] rounded-[18px] bg-gradient-to-br ${app.gradient} blur-xl opacity-0 group-hover:opacity-70 transition-opacity duration-500`}></div>
      <div className={`relative w-[60px] h-[60px] rounded-[18px] bg-gradient-to-br ${app.gradient} p-[1px] group-active:scale-90 transition-all duration-300 shadow-[0_10px_20px_rgba(0,0,0,0.5)] group-hover:-translate-y-1`}>
        <div className="w-full h-full bg-aura-dark/80 backdrop-blur-xl rounded-[17px] flex justify-center items-center relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-white/20 to-transparent opacity-50"></div>
          <app.icon size={28} className="text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.6)] relative z-10 transition-transform duration-300 group-hover:scale-110" strokeWidth={1.5} />
          {app.secure && (
            <div className="absolute bottom-1.5 right-1.5 w-3.5 h-3.5 bg-emerald-500 rounded-full flex items-center justify-center shadow-[0_0_8px_#10b981] z-20 border border-aura-dark">
              <Shield size={8} className="text-white" strokeWidth={3} />
            </div>
          )}
        </div>
      </div>
      <span className="text-white/90 text-[10px] font-medium tracking-widest uppercase drop-shadow-md transition-colors group-hover:text-white">{id}</span>
    </div>
  );
};

const DockIcon = ({ icon: Icon, gradient, onClick }: { icon: any, gradient: string, onClick?: () => void }) => (
  <div className="relative group cursor-pointer" onClick={() => { vibrate(30); onClick?.(); }}>
    <div className={`absolute inset-0 bg-gradient-to-br ${gradient} blur-lg opacity-40 group-hover:opacity-80 transition-opacity duration-300 rounded-[16px]`}></div>
    <div className={`relative w-[54px] h-[54px] rounded-[16px] bg-gradient-to-br ${gradient} p-[1px] group-active:scale-90 transition-all duration-300 shadow-lg group-hover:-translate-y-1`}>
      <div className="w-full h-full bg-aura-dark/60 backdrop-blur-md rounded-[15px] flex justify-center items-center relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-white/30 to-transparent opacity-40"></div>
        <Icon size={26} className="text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.8)] relative z-10 transition-transform duration-300 group-hover:scale-110" strokeWidth={1.5} />
      </div>
    </div>
  </div>
);

// --- Main App ---

export default function App() {
  const [isBooting, setIsBooting] = useState(true);
  const [time, setTime] = useState(new Date());
  const [isLocked, setIsLocked] = useState(true);
  const [openedApp, setOpenedApp] = useState<string | null>(null);
  const [showControlCenter, setShowControlCenter] = useState(false);
  const [notification, setNotification] = useState<{title: string, msg: string, app: string} | null>(null);
  const [nodeExpanded, setNodeExpanded] = useState(false);
  
  // New iOS-competitive features
  const [recentApps, setRecentApps] = useState<string[]>([]);
  const [showSwitcher, setShowSwitcher] = useState(false);
  const [showAssistant, setShowAssistant] = useState(false);
  const [assistantText, setAssistantText] = useState('');
  const [showNotifications, setShowNotifications] = useState(false);

  const homeClickCount = useRef(0);
  const homeClickTimer = useRef<any>(null);
  const homePressTimer = useRef<any>(null);

  // Persistent OS State
  const [installedApps, setInstalledApps] = useState<string[]>(() => {
    const saved = localStorage.getItem('pokers_apps');
    return saved ? JSON.parse(saved) : DEFAULT_APPS;
  });
  const [wallpaper, setWallpaper] = useState(() => localStorage.getItem('pokers_wp') || WALLPAPERS[0]);
  const [noteText, setNoteText] = useState(() => localStorage.getItem('pokers_notes') || 'Meeting at coordinates 44.2. Bring the package.');
  const [downloading, setDownloading] = useState<string | null>(null);
  const [photos, setPhotos] = useState<string[]>([]);

  // Music State
  const [isPlaying, setIsPlaying] = useState(false);
  const [musicProgress, setMusicProgress] = useState(0);

  // Hardware State
  const [wifiOn, setWifiOn] = useState(true);
  const [btOn, setBtOn] = useState(true);
  const [flashlightOn, setFlashlightOn] = useState(false);
  const [batteryPct, setBatteryPct] = useState(100);
  const [isScanning, setIsScanning] = useState(false);

  // Browser State
  const [browserInput, setBrowserInput] = useState('https://en.wikipedia.org/wiki/Main_Page');
  const [activeUrl, setActiveUrl] = useState('https://en.wikipedia.org/wiki/Main_Page');

  // Phone State
  const [dialerInput, setDialerInput] = useState('');

  // Mail & Gallery State
  const [activeEmail, setActiveEmail] = useState<number | null>(null);
  const [activePhoto, setActivePhoto] = useState<number | null>(null);

  // Comms State
  const [activeChat, setActiveChat] = useState<number | null>(null);
  const [chatInput, setChatInput] = useState('');
  const [chatMessages, setChatMessages] = useState<Record<number, any[]>>({
    0: [{ sender: 'Cipher', msg: 'Data transfer complete.', time: '09:41', isMe: false }],
    1: [{ sender: 'Nexus Team', msg: 'Meeting at coordinates 44.2.', time: 'Yesterday', isMe: false }],
    2: [{ sender: 'Echo', msg: 'System update required.', time: 'Cycle 4', isMe: false }]
  });

  // Time State
  const [alarms, setAlarms] = useState([
    { id: 1, time: '07:00', label: 'Wake Up', active: true },
    { id: 2, time: '08:30', label: 'Daily Standup', active: false }
  ]);

  // Calendar State
  const [selectedDate, setSelectedDate] = useState(new Date().getDate());
  const [calendarEvents, setCalendarEvents] = useState<Record<number, any[]>>({
    [new Date().getDate()]: [
      { title: 'Sync with Nexus Team', time: '10:00 AM - 11:30 AM', color: 'bg-purple-500', shadow: 'shadow-[0_0_8px_rgba(168,85,247,0.8)]' },
      { title: 'System Maintenance', time: '2:00 PM - 4:00 PM', color: 'bg-cyan-500', shadow: 'shadow-[0_0_8px_rgba(6,182,212,0.8)]' }
    ]
  });

  // Calculator State
  const [calcDisplay, setCalcDisplay] = useState('0');
  const [calcPrev, setCalcPrev] = useState<number | null>(null);
  const [calcOp, setCalcOp] = useState<string | null>(null);
  const [calcWaiting, setCalcWaiting] = useState(false);

  // Camera State
  const videoRef = useRef<HTMLVideoElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [flash, setFlash] = useState(false);

  // Poker State
  const [pokerPhase, setPokerPhase] = useState(0);
  const [pokerHand, setPokerHand] = useState<any[]>([]);
  const [pokerTable, setPokerTable] = useState<any[]>([]);
  const [chips, setChips] = useState(10000);
  const [pot, setPot] = useState(0);

  // Boot Sequence
  useEffect(() => {
    const bootTimer = setTimeout(() => {
      setIsBooting(false);
    }, 2500);
    return () => clearTimeout(bootTimer);
  }, []);

  // Timers & Effects
  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const timer = setInterval(() => setBatteryPct(p => Math.max(1, p - 1)), 60000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    localStorage.setItem('pokers_apps', JSON.stringify(installedApps));
  }, [installedApps]);

  useEffect(() => {
    localStorage.setItem('pokers_wp', wallpaper);
  }, [wallpaper]);

  useEffect(() => {
    localStorage.setItem('pokers_notes', noteText);
  }, [noteText]);

  // Music Progress
  useEffect(() => {
    let interval: any;
    if (isPlaying) {
      interval = setInterval(() => {
        setMusicProgress(p => (p >= 100 ? 0 : p + 1));
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isPlaying]);

  // Fake Notification Trigger
  useEffect(() => {
    if (!isBooting && !isLocked && !openedApp) {
      const timer = setTimeout(() => {
        setNotification({ title: 'Cipher', msg: 'Data transfer complete.', app: 'Comms' });
        setTimeout(() => setNotification(null), 4000);
      }, 6000);
      return () => clearTimeout(timer);
    }
  }, [isBooting, isLocked, openedApp]);

  // Camera Lifecycle
  useEffect(() => {
    if (openedApp === 'Optics') {
      navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } })
        .then(mediaStream => {
          setStream(mediaStream);
          if (videoRef.current) videoRef.current.srcObject = mediaStream;
        })
        .catch(err => console.error("Camera access denied:", err));
    } else {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
        setStream(null);
      }
    }
  }, [openedApp]);

  const handleUnlock = () => {
    vibrate([30, 50, 30]);
    setIsScanning(true);
    setTimeout(() => {
      setIsScanning(false);
      setIsLocked(false);
      vibrate(50);
    }, 1200);
  };

  const launchApp = (appId: string) => {
    vibrate(20);
    setOpenedApp(appId);
    setRecentApps(prev => {
      const newRecent = prev.filter(id => id !== appId);
      return [appId, ...newRecent].slice(0, 5);
    });
  };

  const handleHomeSwipe = () => {
    vibrate(40);
    if (showAssistant) { setShowAssistant(false); return; }
    if (showSwitcher) { setShowSwitcher(false); return; }
    if (showNotifications) { setShowNotifications(false); return; }
    if (nodeExpanded) { setNodeExpanded(false); return; }
    if (showControlCenter) { setShowControlCenter(false); return; }
    if (openedApp) {
      setOpenedApp(null);
      setActiveEmail(null);
      setActivePhoto(null);
      setActiveChat(null);
    } else if (isLocked) {
      setIsLocked(false);
    }
  };

  const onHomePointerDown = () => {
    homePressTimer.current = setTimeout(() => {
      vibrate([50, 50]);
      setShowAssistant(true);
      setAssistantText("Listening...");
      setTimeout(() => setAssistantText("I'm sorry, I cannot connect to the network right now."), 2000);
      homeClickCount.current = -1;
    }, 500);
  };

  const onHomePointerUp = () => {
    if (homePressTimer.current) clearTimeout(homePressTimer.current);
    if (homeClickCount.current === -1) {
      homeClickCount.current = 0;
      return;
    }
    homeClickCount.current++;
    if (homeClickCount.current === 1) {
      homeClickTimer.current = setTimeout(() => {
        if (homeClickCount.current === 1) handleHomeSwipe();
        homeClickCount.current = 0;
      }, 250);
    } else if (homeClickCount.current === 2) {
      clearTimeout(homeClickTimer.current);
      vibrate([20, 20]);
      if (!isLocked) {
        setShowSwitcher(true);
        setOpenedApp(null);
      }
      homeClickCount.current = 0;
    }
  };

  const handleDownload = (appId: string) => {
    setDownloading(appId);
    setTimeout(() => {
      setInstalledApps(prev => [...prev, appId]);
      setDownloading(null);
    }, 1500);
  };

  const takePhoto = () => {
    if (videoRef.current) {
      setFlash(true);
      setTimeout(() => setFlash(false), 150);
      const canvas = document.createElement('canvas');
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(videoRef.current, 0, 0);
        const dataUrl = canvas.toDataURL('image/jpeg');
        setPhotos(prev => [dataUrl, ...prev]);
      }
    }
  };

  const playPoker = () => {
    const suits = ['♠', '♥', '♦', '♣'];
    const values = ['2','3','4','5','6','7','8','9','10','J','Q','K','A'];
    const getCard = () => {
      const suit = suits[Math.floor(Math.random() * suits.length)];
      const value = values[Math.floor(Math.random() * values.length)];
      const color = (suit === '♥' || suit === '♦') ? 'text-red-600' : 'text-black';
      return { suit, value, color };
    };

    if (pokerPhase === 0 || pokerPhase === 4) {
      setChips(prev => prev - 100); setPot(100);
      setPokerHand([getCard(), getCard()]); setPokerTable([]); setPokerPhase(1);
    } else if (pokerPhase === 1) {
      setChips(prev => prev - 200); setPot(prev => prev + 200);
      setPokerTable([getCard(), getCard(), getCard()]); setPokerPhase(2);
    } else if (pokerPhase === 2) {
      setChips(prev => prev - 200); setPot(prev => prev + 200);
      setPokerTable(prev => [...prev, getCard()]); setPokerPhase(3);
    } else if (pokerPhase === 3) {
      setChips(prev => prev - 200); setPot(prev => prev + 200);
      setPokerTable(prev => [...prev, getCard()]); setPokerPhase(4);
      setTimeout(() => {
        if (Math.random() > 0.5) { setChips(prev => prev + pot * 2); setPot(0); } 
        else { setPot(0); }
      }, 2000);
    }
  };

  const handleCalcClick = (btn: string) => {
    if (/[0-9]/.test(btn)) {
      if (calcWaiting) { setCalcDisplay(btn); setCalcWaiting(false); } 
      else { setCalcDisplay(calcDisplay === '0' ? btn : calcDisplay + btn); }
    } else if (btn === 'C') {
      setCalcDisplay('0'); setCalcPrev(null); setCalcOp(null); setCalcWaiting(false);
    } else if (btn === '±') {
      setCalcDisplay((parseFloat(calcDisplay) * -1).toString());
    } else if (btn === '%') {
      setCalcDisplay((parseFloat(calcDisplay) / 100).toString());
    } else if (btn === '.') {
      if (!calcDisplay.includes('.')) setCalcDisplay(calcDisplay + '.');
    } else if (['+', '-', '×', '÷'].includes(btn)) {
      setCalcOp(btn); setCalcPrev(parseFloat(calcDisplay)); setCalcWaiting(true);
    } else if (btn === '=') {
      if (calcOp && calcPrev !== null) {
        const current = parseFloat(calcDisplay);
        let result = 0;
        if (calcOp === '+') result = calcPrev + current;
        if (calcOp === '-') result = calcPrev - current;
        if (calcOp === '×') result = calcPrev * current;
        if (calcOp === '÷') result = calcPrev / current;
        setCalcDisplay(parseFloat(result.toFixed(8)).toString());
        setCalcPrev(null); setCalcOp(null); setCalcWaiting(true);
      }
    }
  };

  const handleBrowserSubmit = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      let url = browserInput;
      if (!url.startsWith('http://') && !url.startsWith('https://')) {
        url = 'https://' + url;
      }
      setActiveUrl(url);
      setBrowserInput(url);
    }
  };

  const renderAppContent = () => {
    switch (openedApp) {
      case 'Calendar':
        const dayEvents = calendarEvents[selectedDate] || [];
        return (
          <div className="w-full h-full bg-aura-dark text-white pt-14 flex flex-col">
            <div className="px-6 mb-6">
              <h1 className="text-2xl font-light tracking-widest uppercase text-purple-400">Calendar</h1>
              <h2 className="text-4xl font-thin mt-2">{format(time, 'MMMM yyyy')}</h2>
            </div>
            <div className="px-6 grid grid-cols-7 gap-2 text-center text-xs text-white/50 mb-2 font-medium">
              {['S','M','T','W','T','F','S'].map(d => <div key={d}>{d}</div>)}
            </div>
            <div className="px-6 grid grid-cols-7 gap-2 text-center">
              {Array.from({length: 31}).map((_, i) => {
                const day = i + 1;
                const isToday = day === parseInt(format(time, 'd'));
                const isSelected = day === selectedDate;
                const hasEvents = !!calendarEvents[day];
                return (
                  <div key={i} onClick={() => { vibrate(20); setSelectedDate(day); }} className={`w-8 h-8 flex flex-col items-center justify-center rounded-full mx-auto text-sm cursor-pointer transition-all ${isSelected ? 'bg-purple-500 text-white shadow-[0_0_15px_rgba(168,85,247,0.6)] font-bold scale-110' : isToday ? 'border border-purple-500 text-purple-400' : 'text-white/80 hover:bg-white/10'}`}>
                    <span>{day}</span>
                    {hasEvents && !isSelected && <div className="w-1 h-1 bg-purple-400 rounded-full mt-0.5"></div>}
                  </div>
                );
              })}
            </div>
            <div className="mt-8 px-6 flex-1 bg-aura-card rounded-t-[32px] pt-6 border-t border-white/10 shadow-[0_-10px_30px_rgba(0,0,0,0.5)] overflow-y-auto hide-scrollbar pb-10">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xs font-bold tracking-widest text-white/50 uppercase">Events for {format(time, 'MMM')} {selectedDate}</h3>
                <div className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center cursor-pointer active:scale-90" onClick={() => {
                  vibrate(20);
                  setCalendarEvents(prev => ({
                    ...prev,
                    [selectedDate]: [...(prev[selectedDate] || []), { title: 'New Secure Meeting', time: 'TBD', color: 'bg-emerald-500', shadow: 'shadow-[0_0_8px_rgba(16,185,129,0.8)]' }]
                  }));
                }}>
                  <span className="text-white font-bold leading-none mb-0.5">+</span>
                </div>
              </div>
              <div className="space-y-4">
                {dayEvents.length > 0 ? dayEvents.map((ev: any, i: number) => (
                  <div key={i} className="flex items-center space-x-4 bg-white/5 p-3 rounded-2xl border border-white/5 animate-in slide-in-from-bottom-2">
                    <div className={`w-1 h-10 ${ev.color} rounded-full ${ev.shadow}`}></div>
                    <div>
                      <p className="text-sm font-medium tracking-wide">{ev.title}</p>
                      <p className="text-xs text-white/50 mt-0.5">{ev.time}</p>
                    </div>
                  </div>
                )) : (
                  <div className="text-center text-white/30 text-sm py-6 font-mono">No events scheduled.</div>
                )}
              </div>
            </div>
          </div>
        );
      case 'Time':
        return (
          <div className="w-full h-full bg-aura-dark text-white pt-14 flex flex-col items-center">
            <h1 className="text-2xl font-light tracking-widest uppercase text-gray-400 w-full px-6 mb-10">Time</h1>
            <div className="w-56 h-56 rounded-full border border-white/10 bg-gradient-to-br from-white/5 to-transparent flex items-center justify-center relative shadow-[0_0_40px_rgba(255,255,255,0.05)]">
              <div className="absolute inset-2 rounded-full border border-white/5"></div>
              <div className="text-6xl font-thin tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white to-white/50">{format(time, 'HH:mm')}</div>
              <div className="absolute bottom-10 text-sm text-aura-secondary font-mono tracking-widest">{format(time, 'ss')}</div>
            </div>
            <div className="w-full px-6 mt-12 space-y-4">
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-xs font-bold tracking-widest text-white/50 uppercase">Alarms</h3>
                <div className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center cursor-pointer active:scale-90" onClick={() => {
                  vibrate(20);
                  setAlarms(prev => [...prev, { id: Date.now(), time: '12:00', label: 'New Alarm', active: true }]);
                }}>
                  <span className="text-white font-bold leading-none mb-0.5">+</span>
                </div>
              </div>
              <div className="space-y-4 overflow-y-auto hide-scrollbar max-h-[240px] pb-10">
                {alarms.map((alarm) => (
                  <div key={alarm.id} className="bg-aura-card rounded-2xl p-4 flex items-center justify-between border border-white/5">
                    <div>
                      <div className={`text-3xl font-light tracking-tight ${alarm.active ? 'text-white' : 'text-white/40'}`}>{alarm.time}</div>
                      <div className={`text-xs tracking-wide mt-1 ${alarm.active ? 'text-aura-secondary' : 'text-white/30'}`}>{alarm.label}</div>
                    </div>
                    <div 
                      className={`w-12 h-7 rounded-full relative transition-colors duration-300 cursor-pointer ${alarm.active ? 'bg-aura-primary shadow-[0_0_10px_rgba(139,92,246,0.5)]' : 'bg-white/10'}`}
                      onClick={() => {
                        vibrate(20);
                        setAlarms(prev => prev.map(a => a.id === alarm.id ? { ...a, active: !a.active } : a));
                      }}
                    >
                      <div className={`w-6 h-6 bg-white rounded-full absolute top-[2px] transition-all duration-300 ${alarm.active ? 'left-[22px]' : 'left-[2px]'}`}></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );
      case 'Mail':
        const emails = [
          { sender: 'Aura Security', subject: 'Login Attempt Blocked', preview: 'An unauthorized access attempt was prevented at 10:42 AM...', body: 'Security Alert:\n\nAn unauthorized access attempt was prevented at 10:42 AM from IP 192.168.1.44.\n\nYour Pokers Secure Enclave successfully blocked the intrusion. No further action is required, but we recommend reviewing your access logs.', time: '10:42 AM', unread: true },
          { sender: 'Vanguard', subject: 'Mission Briefing', preview: 'The coordinates for the next drop are attached in the secure file.', body: 'Agent,\n\nThe coordinates for the next drop are attached in the secure file. Proceed to Sector 7G at midnight.\n\nEnsure you are not followed. The package contains the new optics module.', time: 'Yesterday', unread: false },
          { sender: 'System', subject: 'Weekly Report', preview: 'Your screen time is down 12% this week. System performance is optimal.', body: 'Weekly Diagnostics:\n\n- Screen time: Down 12%\n- Battery Health: 98%\n- Storage: 42% Used\n- Security: 0 Breaches\n\nSystem performance is optimal. Have a great week.', time: 'Monday', unread: false },
        ];
        return (
          <div className="w-full h-full bg-aura-dark text-white pt-14 flex flex-col relative">
            {activeEmail !== null ? (
              <div className="absolute inset-0 bg-aura-dark z-20 flex flex-col pt-14 px-6 animate-in slide-in-from-right duration-300">
                <div className="flex items-center mb-6 cursor-pointer active:opacity-50" onClick={() => setActiveEmail(null)}>
                  <ChevronRight size={20} className="rotate-180 text-rose-400 mr-2" />
                  <span className="text-rose-400 font-medium tracking-wide">Back</span>
                </div>
                <h2 className="text-2xl font-light mb-2">{emails[activeEmail].subject}</h2>
                <div className="flex justify-between items-center border-b border-white/10 pb-4 mb-4">
                  <span className="font-medium text-white/80">{emails[activeEmail].sender}</span>
                  <span className="text-xs text-white/40 font-mono">{emails[activeEmail].time}</span>
                </div>
                <div className="text-sm text-white/70 leading-relaxed whitespace-pre-wrap">
                  {emails[activeEmail].body}
                </div>
              </div>
            ) : (
              <>
                <div className="flex items-center justify-between px-6 mb-6">
                  <h1 className="text-2xl font-light tracking-widest uppercase text-rose-400">Mail</h1>
                  <Shield size={20} className="text-emerald-400 drop-shadow-[0_0_8px_#34d399]" />
                </div>
                <div className="px-6 mb-4 flex space-x-6 border-b border-white/10 pb-3 text-sm tracking-wide">
                  <span className="text-rose-400 font-medium relative">
                    Inbox
                    <div className="absolute -bottom-[13px] left-0 w-full h-[2px] bg-rose-400 shadow-[0_0_8px_rgba(251,113,133,0.8)]"></div>
                  </span>
                  <span className="text-white/40 hover:text-white/70 cursor-pointer transition-colors">Sent</span>
                  <span className="text-white/40 hover:text-white/70 cursor-pointer transition-colors">Encrypted</span>
                </div>
                <div className="flex-1 overflow-y-auto hide-scrollbar px-4 space-y-3 pb-10">
                  {emails.map((email, i) => (
                    <div key={i} onClick={() => setActiveEmail(i)} className="bg-aura-card rounded-2xl p-4 border border-white/5 cursor-pointer active:scale-[0.98] transition-transform relative overflow-hidden">
                      {email.unread && <div className="absolute left-0 top-0 bottom-0 w-1 bg-rose-400 shadow-[0_0_10px_rgba(251,113,133,0.8)]"></div>}
                      <div className="flex justify-between items-baseline mb-1">
                        <h3 className={`font-medium tracking-wide ${email.unread ? 'text-white' : 'text-white/70'}`}>{email.sender}</h3>
                        <span className="text-[10px] text-white/40 font-mono">{email.time}</span>
                      </div>
                      <h4 className={`text-sm mb-1 tracking-wide ${email.unread ? 'text-rose-400' : 'text-white/60'}`}>{email.subject}</h4>
                      <p className="text-xs text-white/40 truncate">{email.preview}</p>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        );
      case 'Vault':
        return (
          <div className="w-full h-full bg-aura-dark text-white pt-14 flex flex-col overflow-y-auto hide-scrollbar">
            <div className="flex items-center justify-between px-6 mb-6">
              <h1 className="text-2xl font-light tracking-widest uppercase text-fuchsia-400">Vault Store</h1>
              <ShoppingBag size={20} className="text-fuchsia-400 drop-shadow-[0_0_8px_#d946ef]" />
            </div>
            <div className="px-6 mb-4">
              <div className="bg-white/5 rounded-xl h-10 flex items-center px-4 border border-white/10">
                <Search size={16} className="text-white/40 mr-3" />
                <span className="text-white/40 text-sm">Search secure apps...</span>
              </div>
            </div>
            <div className="px-6 space-y-6 pb-10">
              {STORE_APPS.map(appId => {
                const app = APP_REGISTRY[appId];
                const isInstalled = installedApps.includes(appId);
                const isDownloading = downloading === appId;
                
                return (
                  <div key={appId} className="bg-aura-card rounded-2xl p-4 flex items-center border border-white/5 shadow-lg">
                    <div className={`w-14 h-14 rounded-[14px] bg-gradient-to-br ${app.gradient} flex items-center justify-center shadow-lg relative`}>
                      <app.icon size={24} className="text-white" />
                      {app.secure && (
                        <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full flex items-center justify-center border-2 border-aura-card">
                          <Shield size={8} className="text-white" />
                        </div>
                      )}
                    </div>
                    <div className="ml-4 flex-1">
                      <h3 className="font-medium text-white tracking-wide">{app.name}</h3>
                      <p className="text-[10px] text-white/50 mt-1 leading-tight">{app.desc}</p>
                    </div>
                    <div className="ml-2">
                      {isInstalled ? (
                        <button onClick={() => launchApp(appId)} className="px-4 py-1.5 bg-white/10 rounded-full text-xs font-medium text-white border border-white/20 active:scale-95 transition-transform">OPEN</button>
                      ) : isDownloading ? (
                        <div className="w-8 h-8 rounded-full border-2 border-white/20 border-t-fuchsia-400 animate-spin"></div>
                      ) : (
                        <button onClick={() => handleDownload(appId)} className="px-4 py-1.5 bg-fuchsia-500/20 rounded-full text-xs font-medium text-fuchsia-300 border border-fuchsia-500/50 active:scale-95 transition-transform flex items-center space-x-1">
                          <Download size={12} /><span>GET</span>
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        );
      case 'Poker':
        return (
          <div className="w-full h-full bg-[#0a3a2a] text-white pt-12 flex flex-col items-center relative overflow-hidden">
            <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-green-400 to-transparent"></div>
            <div className="w-full px-6 flex justify-between items-center z-10 mt-2">
              <div className="bg-black/40 px-4 py-1.5 rounded-full border border-white/10 flex items-center space-x-2">
                <div className="w-4 h-4 rounded-full bg-yellow-500 border-2 border-yellow-300"></div>
                <span className="font-mono font-bold text-yellow-400">${chips.toLocaleString()}</span>
              </div>
              <div className="text-white/50 font-mono text-sm">POT: ${pot.toLocaleString()}</div>
            </div>
            <h1 className="text-2xl font-serif tracking-widest text-yellow-400 drop-shadow-md mt-6 z-10">POKERS HOLD'EM</h1>
            <div className="h-24 mt-8 flex space-x-2 z-10">
              {pokerTable.map((card, i) => (
                <div key={i} className="w-16 h-24 bg-white rounded-lg shadow-xl border border-gray-300 flex flex-col items-center justify-center animate-in zoom-in duration-300">
                  <span className={`text-lg font-bold absolute top-1 left-1.5 ${card.color}`}>{card.value}</span>
                  <span className={`text-3xl ${card.color}`}>{card.suit}</span>
                </div>
              ))}
              {pokerTable.length === 0 && pokerPhase > 0 && <div className="text-white/30 font-mono text-sm flex items-center h-full">Awaiting Flop...</div>}
            </div>
            <div className="flex-1 flex items-end justify-center z-10 w-full px-6 pb-24">
              <div className="relative w-full h-40 flex justify-center">
                {pokerHand.length > 0 ? (
                  <>
                    <div className="absolute w-24 h-36 bg-white rounded-xl shadow-2xl transform -rotate-6 -translate-x-6 border border-gray-200 flex flex-col items-center justify-center animate-in slide-in-from-bottom duration-500">
                      <span className={`text-2xl font-bold absolute top-2 left-2 ${pokerHand[0].color}`}>{pokerHand[0].value}</span>
                      <span className={`text-4xl ${pokerHand[0].color}`}>{pokerHand[0].suit}</span>
                    </div>
                    <div className="absolute w-24 h-36 bg-white rounded-xl shadow-2xl transform rotate-6 translate-x-6 border border-gray-200 flex flex-col items-center justify-center animate-in slide-in-from-bottom duration-500 delay-100">
                      <span className={`text-2xl font-bold absolute top-2 left-2 ${pokerHand[1].color}`}>{pokerHand[1].value}</span>
                      <span className={`text-4xl ${pokerHand[1].color}`}>{pokerHand[1].suit}</span>
                    </div>
                  </>
                ) : <div className="text-white/30 font-mono text-sm flex items-center">Cards not dealt</div>}
              </div>
            </div>
            <div className="mb-16 z-10">
              <button onClick={playPoker} className="px-8 py-3 bg-gradient-to-r from-yellow-600 to-yellow-400 rounded-full text-black font-bold tracking-widest shadow-[0_0_20px_rgba(250,204,21,0.4)] active:scale-95 transition-transform flex items-center space-x-2">
                {pokerPhase === 0 || pokerPhase === 4 ? <><Play size={18} /><span>DEAL HAND ($100)</span></> : 
                 pokerPhase === 1 ? <><RefreshCw size={18} /><span>FLOP ($200)</span></> :
                 pokerPhase === 2 ? <><RefreshCw size={18} /><span>TURN ($200)</span></> :
                 <><RefreshCw size={18} /><span>RIVER ($200)</span></>}
              </button>
            </div>
          </div>
        );
      case 'Music':
        return (
          <div className="w-full h-full bg-gradient-to-b from-orange-900 to-aura-dark text-white pt-16 px-6 flex flex-col items-center">
            <div className={`w-64 h-64 bg-gradient-to-br from-yellow-400 to-orange-600 rounded-full shadow-[0_0_40px_rgba(249,115,22,0.4)] mb-8 flex items-center justify-center border-4 border-white/10 transition-transform duration-[3000ms] ease-linear ${isPlaying ? 'rotate-180' : ''}`}>
              <div className="w-16 h-16 bg-aura-dark rounded-full border-4 border-orange-900 flex items-center justify-center">
                <Music size={20} className="text-orange-500" />
              </div>
            </div>
            <h2 className="text-2xl font-bold tracking-wide">Neon Nights</h2>
            <p className="text-orange-300 mt-1">Pokers Exclusive Audio</p>
            
            <div className="w-full mt-10">
              <div className="w-full h-1.5 bg-white/20 rounded-full overflow-hidden">
                <div className="h-full bg-orange-400 rounded-full transition-all duration-1000" style={{ width: `${musicProgress}%` }}></div>
              </div>
              <div className="flex justify-between text-xs text-white/50 mt-2 font-mono">
                <span>0:{musicProgress.toString().padStart(2, '0')}</span>
                <span>1:40</span>
              </div>
            </div>

            <div className="flex items-center justify-center space-x-8 mt-10">
              <SkipBack size={32} className="text-white/70 cursor-pointer active:scale-90" />
              <div 
                className="w-16 h-16 bg-white rounded-full flex items-center justify-center cursor-pointer active:scale-90 transition-transform shadow-[0_0_20px_rgba(255,255,255,0.3)]"
                onClick={() => setIsPlaying(!isPlaying)}
              >
                {isPlaying ? <Pause size={28} className="text-orange-600 fill-current" /> : <Play size={28} className="text-orange-600 fill-current ml-1" />}
              </div>
              <SkipForward size={32} className="text-white/70 cursor-pointer active:scale-90" />
            </div>
          </div>
        );
      case 'Notes':
        return (
          <div className="w-full h-full bg-[#1a1a1a] text-emerald-400 pt-14 px-6 flex flex-col font-mono">
            <div className="flex items-center justify-between mb-6 border-b border-emerald-900 pb-4">
              <h1 className="text-xl tracking-widest uppercase">Secure Notes</h1>
              <Shield size={18} />
            </div>
            <div className="flex-1 flex flex-col">
              <p className="mb-2">{'>'} Encrypted vault initialized.</p>
              <p className="mb-2">{'>'} Auto-saving to local storage...</p>
              <textarea 
                className="flex-1 w-full bg-black/50 border border-emerald-900/50 rounded-lg p-4 mt-4 text-emerald-300/70 focus:outline-none focus:border-emerald-500 transition-colors resize-none"
                value={noteText}
                onChange={(e) => setNoteText(e.target.value)}
                spellCheck={false}
              />
            </div>
          </div>
        );
      case 'Gallery':
        return (
          <div className="w-full h-full bg-aura-dark text-white pt-14 flex flex-col relative">
            {activePhoto !== null ? (
              <div className="absolute inset-0 bg-black z-20 flex flex-col animate-in zoom-in-95 duration-300">
                <div className="absolute top-14 left-6 z-30 w-10 h-10 bg-black/50 backdrop-blur-md rounded-full flex items-center justify-center cursor-pointer active:scale-90" onClick={() => setActivePhoto(null)}>
                  <ChevronRight size={24} className="rotate-180 text-white" />
                </div>
                <div className="absolute top-14 right-6 z-30 w-10 h-10 bg-rose-500/20 backdrop-blur-md rounded-full flex items-center justify-center cursor-pointer active:scale-90 border border-rose-500/50" onClick={() => {
                  setPhotos(prev => prev.filter((_, i) => i !== activePhoto));
                  setActivePhoto(null);
                }}>
                  <span className="text-rose-500 font-bold text-sm">X</span>
                </div>
                <img src={photos[activePhoto]} alt="Full screen" className="w-full h-full object-contain" />
              </div>
            ) : (
              <>
                <div className="flex items-center justify-between px-6 mb-6">
                  <h1 className="text-2xl font-light tracking-widest uppercase text-pink-400">Gallery</h1>
                  <ImageIcon size={20} className="text-pink-400 drop-shadow-[0_0_8px_#f472b6]" />
                </div>
                <div className="px-4 grid grid-cols-3 gap-2 pb-10 overflow-y-auto hide-scrollbar">
                  {photos.length > 0 ? photos.map((photo, i) => (
                    <div key={i} onClick={() => setActivePhoto(i)} className="aspect-square bg-aura-card rounded-xl overflow-hidden border border-white/10 shadow-lg animate-in zoom-in duration-300 cursor-pointer active:scale-95 transition-transform">
                      <img src={photo} alt={`Captured ${i}`} className="w-full h-full object-cover" />
                    </div>
                  )) : (
                    <div className="col-span-3 flex flex-col items-center justify-center py-20 text-white/30">
                      <ImageIcon size={48} className="mb-4 opacity-50" />
                      <p className="font-mono text-sm">No captures found.</p>
                      <p className="font-mono text-xs mt-2">Use Optics to capture images.</p>
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        );
      case 'Optics':
        return (
          <div className="w-full h-full bg-black text-white flex flex-col relative">
            {flash && <div className="absolute inset-0 bg-white z-50"></div>}
            <div className="h-24 bg-black/80 backdrop-blur-md flex justify-between items-center px-6 z-10">
              <Zap size={24} className="text-white/50" />
              <ChevronRight size={24} className="text-white/50 rotate-90" />
              <Maximize size={24} className="text-white/50" />
            </div>
            <div className="flex-1 relative bg-gray-900 flex items-center justify-center overflow-hidden">
              {stream ? (
                <video ref={videoRef} autoPlay playsInline muted className="absolute inset-0 w-full h-full object-cover" />
              ) : (
                <div className="text-white/50 text-sm animate-pulse">Initializing Optics...</div>
              )}
              <div className="absolute inset-0 grid grid-cols-3 grid-rows-3 pointer-events-none opacity-30">
                <div className="border-r border-b border-white"></div>
                <div className="border-r border-b border-white"></div>
                <div className="border-b border-white"></div>
                <div className="border-r border-b border-white"></div>
                <div className="border-r border-b border-white flex items-center justify-center">
                  <div className="w-2 h-2 border border-aura-primary rounded-full"></div>
                </div>
                <div className="border-b border-white"></div>
                <div className="border-r border-white"></div>
                <div className="border-r border-white"></div>
                <div></div>
              </div>
            </div>
            <div className="h-40 bg-black/80 backdrop-blur-md flex flex-col items-center justify-center pb-6 z-10 relative">
              <div className="flex space-x-6 mb-4 text-xs font-medium tracking-widest text-white/50 uppercase">
                <span>Video</span>
                <span className="text-aura-primary">Photo</span>
                <span>Portrait</span>
              </div>
              <div className="absolute left-6 bottom-10 w-12 h-12 rounded-xl bg-aura-card border border-white/20 overflow-hidden cursor-pointer active:scale-90 transition-transform" onClick={() => setOpenedApp('Gallery')}>
                {photos.length > 0 ? <img src={photos[0]} alt="Latest" className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-white/20"><ImageIcon size={20} /></div>}
              </div>
              <div className="w-16 h-16 rounded-full border-4 border-white/20 flex items-center justify-center cursor-pointer active:scale-90 transition-transform" onClick={takePhoto}>
                <div className="w-12 h-12 bg-white rounded-full"></div>
              </div>
            </div>
          </div>
        );
      case 'System':
        return (
          <div className="w-full h-full bg-aura-dark text-white pt-14 flex flex-col overflow-y-auto hide-scrollbar">
            <div className="flex items-center justify-between px-6 mb-6">
              <h1 className="text-2xl font-light tracking-widest uppercase text-aura-secondary">System</h1>
              <Shield size={20} className="text-emerald-400 drop-shadow-[0_0_8px_#34d399]" />
            </div>
            <div className="px-4 mb-6">
              <div className="bg-aura-card rounded-3xl p-4 flex items-center space-x-4 border border-white/5">
                <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-aura-primary to-aura-secondary p-[2px]">
                  <div className="w-full h-full bg-aura-dark rounded-full flex items-center justify-center">
                    <User size={24} className="text-white/80" />
                  </div>
                </div>
                <div>
                  <h2 className="text-lg font-medium tracking-wide">Admin_01</h2>
                  <p className="text-xs text-aura-primary font-mono mt-1">ID: POKERS-77X-9</p>
                </div>
              </div>
            </div>
            <div className="px-4 mb-6">
              <h3 className="text-xs font-bold tracking-widest text-white/50 uppercase mb-3 ml-2">Appearance</h3>
              <div className="flex space-x-3 overflow-x-auto hide-scrollbar pb-2">
                {WALLPAPERS.map((wp, i) => (
                  <div key={i} onClick={() => { vibrate(20); setWallpaper(wp); }} className={`flex-shrink-0 w-20 h-32 rounded-xl bg-cover bg-center cursor-pointer transition-all ${wallpaper === wp ? 'ring-2 ring-aura-primary scale-105 shadow-[0_0_15px_rgba(139,92,246,0.5)]' : 'opacity-50 hover:opacity-100'}`} style={{ backgroundImage: `url(${wp})` }}></div>
                ))}
              </div>
            </div>
            <div className="space-y-4 px-4 pb-10">
              <div className="bg-aura-card rounded-2xl p-4 flex items-center justify-between border border-white/5">
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center mr-4">
                    <Wifi size={20} className="text-cyan-400" />
                  </div>
                  <div>
                    <div className="text-sm font-medium tracking-wide">Wi-Fi</div>
                    <div className="text-xs text-white/40 mt-0.5">{wifiOn ? 'Pokers_Net' : 'Disconnected'}</div>
                  </div>
                </div>
                <div 
                  className={`w-12 h-7 rounded-full relative transition-colors duration-300 cursor-pointer ${wifiOn ? 'bg-cyan-500 shadow-[0_0_10px_rgba(6,182,212,0.5)]' : 'bg-white/10'}`}
                  onClick={() => { vibrate(20); setWifiOn(!wifiOn); }}
                >
                  <div className={`w-6 h-6 bg-white rounded-full absolute top-[2px] transition-all duration-300 ${wifiOn ? 'left-[22px]' : 'left-[2px]'}`}></div>
                </div>
              </div>
              <div className="bg-aura-card rounded-2xl p-4 flex items-center justify-between border border-white/5">
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center mr-4">
                    <Bluetooth size={20} className="text-aura-primary" />
                  </div>
                  <div>
                    <div className="text-sm font-medium tracking-wide">Bluetooth</div>
                    <div className="text-xs text-white/40 mt-0.5">{btOn ? 'Discoverable' : 'Off'}</div>
                  </div>
                </div>
                <div 
                  className={`w-12 h-7 rounded-full relative transition-colors duration-300 cursor-pointer ${btOn ? 'bg-aura-primary shadow-[0_0_10px_rgba(139,92,246,0.5)]' : 'bg-white/10'}`}
                  onClick={() => { vibrate(20); setBtOn(!btOn); }}
                >
                  <div className={`w-6 h-6 bg-white rounded-full absolute top-[2px] transition-all duration-300 ${btOn ? 'left-[22px]' : 'left-[2px]'}`}></div>
                </div>
              </div>
              <div className="bg-aura-card rounded-2xl p-4 flex items-center border border-white/5 active:scale-[0.98] transition-transform cursor-pointer">
                <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center mr-4">
                  <Fingerprint size={20} className="text-emerald-400" />
                </div>
                <div className="flex-1">
                  <div className="text-sm font-medium tracking-wide">Security & Biometrics</div>
                  <div className="text-xs text-white/40 mt-0.5">Aura Enclave Active</div>
                </div>
                <ChevronRight size={18} className="text-white/20" />
              </div>
            </div>
          </div>
        );
      case 'Compute':
        return (
          <div className="w-full h-full bg-aura-dark text-white pt-12 px-5 flex flex-col font-mono">
            <div className="flex-1 flex flex-col items-end justify-end pb-6">
              <div className="text-aura-secondary/50 text-xl mb-2 h-6">{calcPrev !== null ? `${calcPrev} ${calcOp}` : ''}</div>
              <div className="text-6xl font-light overflow-hidden break-all text-right text-transparent bg-clip-text bg-gradient-to-r from-aura-secondary to-aura-primary">{calcDisplay}</div>
            </div>
            <div className="grid grid-cols-4 gap-4 pb-12">
              {['C', '±', '%', '÷', '7', '8', '9', '×', '4', '5', '6', '-', '1', '2', '3', '+', '0', '.', '='].map((btn, i) => (
                <div key={i} onClick={() => handleCalcClick(btn)} className={`h-16 rounded-2xl flex items-center justify-center text-2xl cursor-pointer active:scale-90 transition-all ${btn === '0' ? 'col-span-2 px-6 justify-start' : ''} ${['÷', '×', '-', '+'].includes(btn) ? 'bg-aura-card text-aura-secondary border border-aura-secondary/30' : btn === '=' ? 'bg-gradient-to-r from-aura-primary to-aura-secondary text-white shadow-lg shadow-aura-primary/30' : ['C', '±', '%'].includes(btn) ? 'bg-aura-card text-aura-accent border border-aura-accent/30' : 'bg-white/5 text-white hover:bg-white/10'} ${calcOp === btn && calcWaiting ? 'ring-2 ring-aura-secondary inset-0' : ''}`}>{btn}</div>
              ))}
            </div>
          </div>
        );
      case 'Atmosphere':
        return (
          <div className="w-full h-full bg-aura-dark text-white pt-16 px-6 flex flex-col items-center relative overflow-hidden">
            <div className="absolute top-20 left-10 w-40 h-40 bg-aura-primary/30 rounded-full blur-3xl"></div>
            <div className="absolute bottom-40 right-10 w-48 h-48 bg-aura-secondary/20 rounded-full blur-3xl"></div>
            <div className="relative z-10 flex flex-col items-center w-full">
              <h1 className="text-2xl font-light tracking-widest uppercase text-white/70">Neo Tokyo</h1>
              <div className="text-8xl font-thin my-4 text-transparent bg-clip-text bg-gradient-to-b from-white to-white/40">72°</div>
              <div className="flex items-center space-x-2 text-aura-secondary">
                <CloudLightning size={20} />
                <p className="text-lg tracking-wide">Electric Storm</p>
              </div>
              <div className="mt-12 w-full bg-aura-card/60 rounded-3xl p-5 backdrop-blur-xl border border-white/5">
                <div className="flex justify-between items-center mb-6">
                  <span className="text-xs font-bold tracking-widest text-white/50 uppercase">Hourly</span>
                  <Activity size={14} className="text-aura-primary" />
                </div>
                <div className="flex justify-between">
                  {[1, 2, 3, 4, 5].map(i => (
                    <div key={i} className="flex flex-col items-center space-y-3">
                      <span className="text-xs text-white/60">{i === 1 ? 'NOW' : `0${i}00`}</span>
                      <div className={`w-2 h-2 rounded-full ${i % 2 === 0 ? 'bg-aura-secondary' : 'bg-aura-primary'} shadow-[0_0_10px_rgba(139,92,246,0.8)]`}></div>
                      <span className="text-sm font-medium">7{i}°</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );
      case 'Comms':
        const chats = [
          { name: 'Cipher', time: '09:41', msg: 'Data transfer complete.', unread: true },
          { name: 'Nexus Team', time: 'Yesterday', msg: 'Meeting at coordinates 44.2.', unread: false },
          { name: 'Echo', time: 'Cycle 4', msg: 'System update required.', unread: false },
        ];
        return (
          <div className="w-full h-full bg-aura-dark text-white pt-12 flex flex-col relative">
            {activeChat !== null ? (
              <div className="absolute inset-0 bg-aura-dark z-20 flex flex-col pt-12 animate-in slide-in-from-right duration-300">
                <div className="flex items-center justify-between px-4 pb-4 border-b border-white/10">
                  <div className="flex items-center cursor-pointer active:opacity-50" onClick={() => setActiveChat(null)}>
                    <ChevronRight size={24} className="rotate-180 text-aura-primary mr-1" />
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-aura-primary to-aura-secondary flex items-center justify-center text-sm font-bold mr-3">
                      {chats[activeChat].name[0]}
                    </div>
                    <span className="font-medium tracking-wide">{chats[activeChat].name}</span>
                  </div>
                  <Phone size={20} className="text-aura-primary" />
                </div>
                <div className="flex-1 overflow-y-auto hide-scrollbar p-4 space-y-4 flex flex-col">
                  {chatMessages[activeChat]?.map((msg, i) => (
                    <div key={i} className={`flex flex-col max-w-[80%] ${msg.isMe ? 'self-end items-end' : 'self-start items-start'}`}>
                      <div className={`p-3 rounded-2xl ${msg.isMe ? 'bg-aura-primary text-white rounded-tr-sm' : 'bg-white/10 text-white/90 rounded-tl-sm'}`}>
                        <p className="text-sm">{msg.msg}</p>
                      </div>
                      <span className="text-[10px] text-white/40 mt-1 font-mono">{msg.time}</span>
                    </div>
                  ))}
                </div>
                <div className="p-4 border-t border-white/10 bg-aura-dark">
                  <div className="flex items-center bg-white/5 rounded-full border border-white/10 p-1 pl-4">
                    <input 
                      type="text" 
                      value={chatInput}
                      onChange={(e) => setChatInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && chatInput.trim()) {
                          setChatMessages(prev => ({
                            ...prev,
                            [activeChat]: [...(prev[activeChat] || []), { sender: 'Me', msg: chatInput, time: format(new Date(), 'HH:mm'), isMe: true }]
                          }));
                          setChatInput('');
                        }
                      }}
                      placeholder="Secure message..."
                      className="flex-1 bg-transparent border-none outline-none text-sm text-white placeholder-white/30"
                    />
                    <div 
                      className="w-8 h-8 rounded-full bg-aura-primary flex items-center justify-center cursor-pointer active:scale-90 transition-transform ml-2"
                      onClick={() => {
                        if (chatInput.trim()) {
                          setChatMessages(prev => ({
                            ...prev,
                            [activeChat]: [...(prev[activeChat] || []), { sender: 'Me', msg: chatInput, time: format(new Date(), 'HH:mm'), isMe: true }]
                          }));
                          setChatInput('');
                        }
                      }}
                    >
                      <ChevronRight size={16} className="text-white" />
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <>
                <div className="flex justify-between items-center px-6 mb-6">
                  <div className="flex items-center space-x-3">
                    <h1 className="text-2xl font-light tracking-widest uppercase text-aura-primary">Comms</h1>
                    <Shield size={16} className="text-emerald-400 drop-shadow-[0_0_8px_#34d399]" />
                  </div>
                  <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">
                    <Search size={16} />
                  </div>
                </div>
                <div className="flex-1 overflow-y-auto hide-scrollbar px-4 space-y-3 pb-10">
                  {chats.map((chat, i) => {
                    const msgs = chatMessages[i];
                    const lastMsg = msgs && msgs.length > 0 ? msgs[msgs.length - 1] : chat;
                    return (
                      <div key={i} onClick={() => setActiveChat(i)} className="bg-aura-card rounded-2xl p-4 flex items-center border border-white/5 cursor-pointer active:scale-[0.98] transition-transform">
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center text-lg font-bold ${chat.unread ? 'bg-gradient-to-br from-aura-primary to-aura-secondary text-white shadow-[0_0_15px_rgba(139,92,246,0.4)]' : 'bg-white/10 text-white/50'}`}>
                          {chat.name[0]}
                        </div>
                        <div className="ml-4 flex-1">
                          <div className="flex justify-between items-baseline mb-1">
                            <h3 className={`font-medium tracking-wide ${chat.unread ? 'text-white' : 'text-white/70'}`}>{chat.name}</h3>
                            <span className="text-[10px] text-aura-secondary font-mono">{lastMsg.time}</span>
                          </div>
                          <p className={`text-xs truncate w-48 ${chat.unread ? 'text-white/90' : 'text-white/40'}`}>{lastMsg.msg}</p>
                        </div>
                        {chat.unread && <div className="w-2 h-2 bg-aura-secondary rounded-full ml-2 shadow-[0_0_8px_rgba(6,182,212,0.8)]"></div>}
                      </div>
                    );
                  })}
                </div>
              </>
            )}
          </div>
        );
      case 'Net':
        return (
          <div className="w-full h-full bg-white flex flex-col">
            <div className="h-24 bg-aura-dark border-b border-white/10 flex flex-col justify-end px-4 pb-3">
              <div className="bg-white/10 rounded-xl h-10 flex items-center px-3 border border-white/10">
                <Lock size={14} className="text-emerald-400 mr-2 drop-shadow-[0_0_5px_#34d399]" />
                <input 
                  type="text" 
                  value={browserInput}
                  onChange={(e) => setBrowserInput(e.target.value)}
                  onKeyDown={handleBrowserSubmit}
                  className="bg-transparent border-none outline-none text-white/90 text-sm font-mono flex-1"
                />
              </div>
            </div>
            <div className="flex-1 bg-white relative">
              <iframe src={activeUrl} className="absolute inset-0 w-full h-full border-none" title="Browser" sandbox="allow-scripts allow-same-origin" />
            </div>
          </div>
        );
      case 'Phone':
        return (
          <div className="w-full h-full bg-aura-dark text-white pt-14 flex flex-col items-center">
            <div className="flex-1 flex flex-col items-center justify-center w-full px-8">
              <div className="text-4xl font-light tracking-widest h-12 mb-8 text-emerald-400">{dialerInput || ' '}</div>
              <div className="grid grid-cols-3 gap-6 w-full max-w-[260px]">
                {['1','2','3','4','5','6','7','8','9','*','0','#'].map(num => (
                  <div key={num} onClick={() => setDialerInput(prev => prev.length < 15 ? prev + num : prev)} className="w-16 h-16 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-2xl font-light cursor-pointer active:bg-white/20 active:scale-90 transition-all">
                    {num}
                  </div>
                ))}
              </div>
              <div className="mt-10 flex space-x-6">
                <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-500/50 flex items-center justify-center cursor-pointer active:scale-90 transition-all shadow-[0_0_20px_rgba(16,185,129,0.4)]">
                  <Phone size={28} className="text-emerald-400 fill-current" />
                </div>
                <div onClick={() => setDialerInput(prev => prev.slice(0, -1))} className="w-16 h-16 rounded-full bg-rose-500/10 border border-rose-500/30 flex items-center justify-center cursor-pointer active:scale-90 transition-all">
                  <ChevronRight size={28} className="text-rose-400 rotate-180" />
                </div>
              </div>
            </div>
          </div>
        );
      case 'Nav':
        return (
          <div className="w-full h-full bg-[#021015] text-emerald-400 pt-14 flex flex-col relative overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-emerald-900/20 to-transparent"></div>
            <div className="flex items-center justify-between px-6 mb-6 z-10">
              <h1 className="text-2xl font-light tracking-widest uppercase text-emerald-400">Nav</h1>
              <Map size={20} className="text-emerald-400 drop-shadow-[0_0_8px_#34d399]" />
            </div>
            <div className="flex-1 relative flex items-center justify-center">
              <div className="absolute w-64 h-64 rounded-full border border-emerald-500/30"></div>
              <div className="absolute w-48 h-48 rounded-full border border-emerald-500/30"></div>
              <div className="absolute w-32 h-32 rounded-full border border-emerald-500/30"></div>
              <div className="absolute w-16 h-16 rounded-full border border-emerald-500/30"></div>
              <div className="absolute w-full h-[1px] bg-emerald-500/20"></div>
              <div className="absolute h-full w-[1px] bg-emerald-500/20"></div>
              <div className="absolute w-32 h-32 origin-bottom-right right-1/2 bottom-1/2 bg-gradient-to-tr from-emerald-500/40 to-transparent animate-[spin_4s_linear_infinite]"></div>
              <div className="absolute w-2 h-2 bg-emerald-400 rounded-full top-1/3 left-1/3 shadow-[0_0_10px_#34d399] animate-pulse"></div>
              <div className="absolute w-2 h-2 bg-emerald-400 rounded-full bottom-1/3 right-1/4 shadow-[0_0_10px_#34d399] animate-pulse delay-75"></div>
              <div className="absolute w-3 h-3 bg-white rounded-full shadow-[0_0_15px_#fff]"></div>
            </div>
            <div className="h-32 bg-black/60 backdrop-blur-md border-t border-emerald-500/20 z-10 p-6">
              <div className="text-xs font-mono text-emerald-500/70 mb-1">CURRENT LOCATION</div>
              <div className="text-lg tracking-widest">SECURE SECTOR 7G</div>
              <div className="text-xs font-mono text-emerald-500/50 mt-2">LAT: 44.2019 | LNG: -12.4921</div>
            </div>
          </div>
        );
      default:
        return (
          <div className="w-full h-full bg-aura-dark flex items-center justify-center">
            <h1 className="text-xl font-light tracking-widest uppercase text-aura-primary">{openedApp}</h1>
          </div>
        );
    }
  };

  return (
    <div className="relative w-[380px] h-[820px] bg-black rounded-[44px] border-[8px] border-[#2a2a35] shadow-[0_0_50px_rgba(139,92,246,0.15)] overflow-hidden ring-1 ring-white/10">
      {/* Hardware Buttons */}
      <div className="absolute -left-[10px] top-[140px] w-[2px] h-[40px] bg-[#4a4a5a] rounded-l-md"></div>
      <div className="absolute -left-[10px] top-[200px] w-[2px] h-[40px] bg-[#4a4a5a] rounded-l-md"></div>
      <div className="absolute -right-[10px] top-[160px] w-[2px] h-[60px] bg-[#4a4a5a] rounded-r-md"></div>

      {/* Dynamic Aura Node (Punch-hole) */}
      <div 
        className={`absolute top-3 left-1/2 -translate-x-1/2 bg-black z-50 shadow-[inset_0_0_4px_rgba(255,255,255,0.2)] flex items-center justify-center transition-all duration-500 ease-spring overflow-hidden cursor-pointer
        ${nodeExpanded ? 'w-[340px] h-[140px] rounded-[36px] px-6 py-5 flex-col items-start justify-between' :
          notification && !isLocked ? 'w-[220px] h-[36px] rounded-full px-3 justify-between' : 
          isPlaying ? 'w-[120px] h-[28px] rounded-full px-3 justify-between' : 
          'w-[14px] h-[14px] rounded-full'}`}
        onClick={() => {
          if (isPlaying || notification) {
            setNodeExpanded(!nodeExpanded);
            vibrate(20);
          }
        }}
      >
        {nodeExpanded ? (
          <div className="w-full h-full flex flex-col justify-between animate-in fade-in duration-300">
            <div className="flex justify-between items-center w-full">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-orange-600 rounded-full animate-[spin_4s_linear_infinite] shadow-[0_0_15px_rgba(249,115,22,0.5)]"></div>
                <div>
                  <div className="text-white text-base font-medium tracking-wide">Neon Nights</div>
                  <div className="text-orange-400 text-xs mt-0.5">Pokers Audio</div>
                </div>
              </div>
              <div className="flex space-x-1.5 items-end h-5">
                <div className="w-1.5 bg-orange-500 rounded-full animate-audio-bounce" style={{ animationDelay: '0.1s' }}></div>
                <div className="w-1.5 bg-orange-500 rounded-full animate-audio-bounce" style={{ animationDelay: '0.3s' }}></div>
                <div className="w-1.5 bg-orange-500 rounded-full animate-audio-bounce" style={{ animationDelay: '0.2s' }}></div>
              </div>
            </div>
            <div className="flex justify-center items-center space-x-10 w-full mt-2">
              <SkipBack size={24} className="text-white/70 cursor-pointer active:scale-90" onClick={(e) => { e.stopPropagation(); vibrate(20); }} />
              <div className="cursor-pointer active:scale-90" onClick={(e) => { e.stopPropagation(); setIsPlaying(!isPlaying); vibrate(20); }}>
                {isPlaying ? <Pause size={32} className="text-white fill-current" /> : <Play size={32} className="text-white fill-current" />}
              </div>
              <SkipForward size={24} className="text-white/70 cursor-pointer active:scale-90" onClick={(e) => { e.stopPropagation(); vibrate(20); }} />
            </div>
          </div>
        ) : notification && !isLocked ? (
          <>
            <div className="w-5 h-5 rounded-full bg-aura-primary flex items-center justify-center"><MessageSquare size={10} color="white" /></div>
            <span className="text-white text-[10px] font-medium truncate mx-2">{notification.title}</span>
            <ChevronRight size={14} className="text-white/50" />
          </>
        ) : isPlaying ? (
          <>
            <div className="flex space-x-1 items-end h-3">
              <div className="w-1 bg-orange-500 rounded-full animate-audio-bounce" style={{ animationDelay: '0.1s' }}></div>
              <div className="w-1 bg-orange-500 rounded-full animate-audio-bounce" style={{ animationDelay: '0.3s' }}></div>
              <div className="w-1 bg-orange-500 rounded-full animate-audio-bounce" style={{ animationDelay: '0.2s' }}></div>
            </div>
            <span className="text-orange-400 text-[10px] font-mono">Neon Nights</span>
          </>
        ) : (
          <div className="w-[4px] h-[4px] bg-blue-900/50 rounded-full"></div>
        )}
      </div>

      {/* Screen Content */}
      <div 
        className="relative w-full h-full bg-cover bg-center overflow-hidden transition-all duration-700"
        style={{ backgroundImage: `url(${wallpaper})` }}
      >
        <div className="absolute inset-0 bg-white/40"></div>

        {/* Boot Sequence */}
        {isBooting && (
          <div className="absolute inset-0 z-[100] bg-black flex flex-col items-center justify-center animate-in fade-out duration-1000 delay-1500 fill-mode-forwards">
            <div className="w-32 h-32 flex items-center justify-center animate-pulse-glow">
            </div>
            <h1 className="text-black mt-6 text-2xl font-light tracking-[0.3em] uppercase">Poker</h1>
            <div className="w-32 h-1 bg-white/10 rounded-full mt-8 overflow-hidden">
              <div className="h-full bg-white rounded-full animate-[scan_1.5s_ease-in-out_forwards]"></div>
            </div>
          </div>
        )}

        {/* Flashlight Overlay */}
        {flashlightOn && <div className="absolute inset-0 z-[60] pointer-events-none bg-white/20 mix-blend-overlay shadow-[inset_0_0_150px_rgba(255,255,255,0.8)]"></div>}

        <StatusBar time={time} onRightClick={() => setShowControlCenter(!showControlCenter)} onLeftClick={() => setShowNotifications(!showNotifications)} wifiOn={wifiOn} batteryPct={batteryPct} />

        {/* Notification Center Overlay */}
        {showNotifications && (
          <div className="absolute inset-0 z-40 bg-black/60 backdrop-blur-2xl animate-in slide-in-from-top duration-300 pt-16 px-4">
            <h2 className="text-white text-2xl font-light tracking-widest mb-6 px-2">Notifications</h2>
            <div className="space-y-3">
              {notification ? (
                <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/10">
                  <div className="flex justify-between items-center mb-2">
                    <div className="flex items-center space-x-2">
                      <div className="w-6 h-6 rounded-full bg-aura-primary flex items-center justify-center"><MessageSquare size={12} color="white"/></div>
                      <span className="text-white/70 text-xs uppercase tracking-wider">{notification.app}</span>
                    </div>
                    <span className="text-white/40 text-xs">Now</span>
                  </div>
                  <h4 className="text-white font-medium">{notification.title}</h4>
                  <p className="text-white/70 text-sm mt-1">{notification.msg}</p>
                </div>
              ) : (
                <div className="text-center text-white/40 mt-10 font-medium">No new notifications</div>
              )}
            </div>
          </div>
        )}

        {/* App Switcher Overlay */}
        {showSwitcher && (
          <div className="absolute inset-0 z-40 bg-black/40 backdrop-blur-md flex items-center overflow-x-auto hide-scrollbar px-10 space-x-6 snap-x snap-mandatory animate-in zoom-in-95 duration-300">
            {recentApps.length === 0 ? (
              <div className="w-full text-center text-white/50 font-medium">No Recent Apps</div>
            ) : (
              recentApps.map(appId => {
                const app = APP_REGISTRY[appId] || { name: appId, icon: Settings, gradient: 'from-gray-500 to-gray-700' };
                return (
                  <div key={appId} className="snap-center shrink-0 flex flex-col items-center cursor-pointer active:scale-95 transition-transform" onClick={() => { setShowSwitcher(false); launchApp(appId); }}>
                    <div className="w-[220px] h-[450px] bg-aura-dark rounded-3xl border border-white/20 shadow-2xl overflow-hidden mb-4 relative flex items-center justify-center">
                      <div className={`absolute inset-0 bg-gradient-to-br ${app.gradient} opacity-20`}></div>
                      <app.icon size={64} className="text-white/50" />
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className={`w-6 h-6 rounded-md bg-gradient-to-br ${app.gradient} flex items-center justify-center`}>
                        <app.icon size={12} className="text-white" />
                      </div>
                      <span className="text-white font-medium">{app.name}</span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        )}

        {/* Aura Assistant Overlay */}
        {showAssistant && (
          <div className="absolute inset-0 z-50 bg-black/40 backdrop-blur-sm flex flex-col justify-end items-center pb-24 animate-in fade-in duration-300" onClick={() => setShowAssistant(false)}>
            <div className="text-white/90 text-xl font-light mb-12 tracking-wide text-center px-6 animate-in slide-in-from-bottom-4">
              {assistantText}
            </div>
            <div className="relative w-32 h-32 flex items-center justify-center">
              <div className="absolute inset-0 bg-gradient-to-r from-aura-primary to-cyan-500 rounded-full blur-xl animate-pulse-glow opacity-70"></div>
              <div className="absolute inset-2 bg-gradient-to-tr from-fuchsia-500 to-aura-primary rounded-full blur-md animate-[spin_3s_linear_infinite]"></div>
              <div className="absolute inset-4 bg-black rounded-full"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-10 h-10 bg-white/20 rounded-full backdrop-blur-md border border-white/30"></div>
              </div>
            </div>
          </div>
        )}

        {/* Control Center Overlay */}
        {showControlCenter && (
          <div className="absolute inset-0 z-40 bg-black/60 backdrop-blur-2xl animate-in slide-in-from-top duration-300 pt-16 px-6">
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="bg-white/10 rounded-3xl p-4 flex flex-col space-y-4 border border-white/10">
                <div className="flex items-center space-x-3 cursor-pointer active:scale-95 transition-transform" onClick={() => setWifiOn(!wifiOn)}>
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${wifiOn ? 'bg-aura-secondary shadow-[0_0_15px_rgba(6,182,212,0.5)]' : 'bg-white/20'}`}>
                    <Wifi size={18} color="white" />
                  </div>
                  <span className="text-white text-sm font-medium">{wifiOn ? 'Pokers_Net' : 'Off'}</span>
                </div>
                <div className="flex items-center space-x-3 cursor-pointer active:scale-95 transition-transform" onClick={() => setBtOn(!btOn)}>
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${btOn ? 'bg-aura-primary shadow-[0_0_15px_rgba(139,92,246,0.5)]' : 'bg-white/20'}`}>
                    <Bluetooth size={18} color="white" />
                  </div>
                  <span className="text-white text-sm font-medium">{btOn ? 'On' : 'Off'}</span>
                </div>
              </div>
              <div className="grid grid-rows-2 gap-4">
                <div className="bg-white/10 rounded-3xl flex items-center justify-center border border-white/10 cursor-pointer active:scale-95 transition-transform">
                  <Moon size={24} className="text-aura-primary" />
                </div>
                <div className={`rounded-3xl flex items-center justify-center border border-white/10 cursor-pointer active:scale-95 transition-all ${flashlightOn ? 'bg-white text-black shadow-[0_0_20px_rgba(255,255,255,0.8)]' : 'bg-white/10 text-aura-accent'}`} onClick={() => setFlashlightOn(!flashlightOn)}>
                  <Power size={24} />
                </div>
              </div>
            </div>
            <div className="space-y-4">
              <div className="h-16 bg-white/10 rounded-3xl flex items-center px-4 border border-white/10 relative overflow-hidden">
                <Sun size={20} className="text-white/50 z-10" />
                <div className="absolute left-0 top-0 bottom-0 w-3/4 bg-white/20"></div>
              </div>
              <div className="h-16 bg-white/10 rounded-3xl flex items-center px-4 border border-white/10 relative overflow-hidden">
                <Volume2 size={20} className="text-white/50 z-10" />
                <div className="absolute left-0 top-0 bottom-0 w-1/2 bg-white/20"></div>
              </div>
            </div>
          </div>
        )}

        {openedApp ? (
          <div className="absolute inset-0 z-30 bg-aura-dark animate-in fade-in zoom-in-95 duration-300 origin-bottom">
            {renderAppContent()}
          </div>
        ) : isLocked ? (
          /* Lock Screen */
          <div className="absolute inset-0 z-20 flex flex-col items-center pt-24 pb-10 animate-in fade-in duration-500">
            <Lock size={18} className="text-aura-secondary mb-6" />
            <div className="flex flex-col items-center">
              <div className="text-white/80 text-sm font-medium tracking-[0.2em] uppercase mb-2">
                {format(time, 'MMM dd, yyyy')}
              </div>
              <div className="text-transparent bg-clip-text bg-gradient-to-b from-white to-white/50 text-[90px] font-light leading-none tracking-tighter">
                {format(time, 'HH:mm')}
              </div>
            </div>
            <div className="mt-auto flex flex-col items-center w-full px-10">
              <div className="flex justify-between w-full mb-8">
                <div className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/10 cursor-pointer active:bg-white/20">
                  <Zap size={20} className="text-white" />
                </div>
                <div 
                  className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/10 cursor-pointer active:bg-white/20"
                  onClick={() => { setIsLocked(false); setOpenedApp('Optics'); }}
                >
                  <Camera size={20} className="text-white" />
                </div>
              </div>
              <div className={`relative w-20 h-20 rounded-full border-2 flex items-center justify-center mb-4 cursor-pointer group overflow-hidden transition-all duration-500 ${isScanning ? 'border-emerald-400 shadow-[0_0_30px_rgba(52,211,153,0.6)] scale-110' : 'border-aura-primary/30 shadow-[0_0_20px_rgba(139,92,246,0.2)]'}`} onClick={handleUnlock}>
                <div className={`absolute inset-0 transition-colors duration-300 ${isScanning ? 'bg-emerald-400/20' : 'bg-aura-primary/10 group-hover:bg-aura-primary/30'}`}></div>
                <div className={`absolute left-0 w-full h-[2px] shadow-[0_0_15px_#06b6d4] ${isScanning ? 'bg-emerald-400 shadow-[0_0_20px_#34d399] animate-[scan_0.5s_ease-in-out_infinite]' : 'bg-aura-secondary top-0 animate-scan'}`}></div>
                <Fingerprint size={36} className={`transition-colors duration-300 drop-shadow-[0_0_10px_rgba(139,92,246,0.8)] ${isScanning ? 'text-emerald-400' : 'text-aura-primary group-hover:text-white'}`} />
              </div>
              <div className="flex items-center space-x-2 text-emerald-400 text-[10px] tracking-widest uppercase font-mono bg-emerald-400/10 px-3 py-1.5 rounded-full border border-emerald-400/20">
                <Shield size={12} />
                <span>Pokers Secure Enclave</span>
              </div>
            </div>
          </div>
        ) : (
          /* Home Screen */
          <div className="absolute inset-0 z-20 pt-16 px-6 pb-8 flex flex-col animate-in fade-in zoom-in-95 duration-400">
            <div className="w-full h-28 bg-gradient-to-br from-aura-card/80 to-black/40 backdrop-blur-md rounded-3xl border border-white/10 mb-6 p-5 flex flex-col justify-between shadow-lg">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-white/90 font-medium tracking-wide">Pokers</h3>
                  <p className="text-aura-secondary text-xs font-mono mt-1">System Optimal</p>
                </div>
                <Activity size={20} className="text-aura-primary" />
              </div>
              <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
                <div className="w-3/4 h-full bg-gradient-to-r from-aura-secondary to-aura-primary rounded-full"></div>
              </div>
            </div>

            {/* Dynamic App Grid */}
            <div className="grid grid-cols-4 gap-y-6 gap-x-4 content-start flex-1 overflow-y-auto hide-scrollbar pb-20">
              {/* Weather Widget */}
              <div className="col-span-2 row-span-2 bg-gradient-to-br from-cyan-500/20 to-blue-600/20 backdrop-blur-xl rounded-[28px] border border-white/10 p-4 flex flex-col justify-between cursor-pointer active:scale-95 transition-transform shadow-lg" onClick={() => launchApp('Atmosphere')}>
                <div className="flex justify-between items-start">
                  <div className="text-white/90 text-sm font-medium tracking-wide">Neo Tokyo</div>
                  <CloudLightning size={20} className="text-cyan-400 drop-shadow-[0_0_8px_#22d3ee]" />
                </div>
                <div>
                  <div className="text-5xl font-light text-white tracking-tighter">72°</div>
                  <div className="text-xs text-cyan-100/70 mt-1 font-medium tracking-wide">Electric Storm</div>
                </div>
              </div>
              {installedApps.map(appId => (
                <AppIcon key={appId} id={appId} onClick={() => launchApp(appId)} />
              ))}
            </div>

            {/* Floating Dock */}
            <div className="absolute bottom-8 left-0 right-0 mx-auto w-[90%] h-[76px] bg-aura-card/40 backdrop-blur-2xl rounded-[24px] border border-white/10 flex justify-around items-center px-2 shadow-[0_10px_40px_rgba(0,0,0,0.5)]">
              <DockIcon icon={Phone} gradient="from-emerald-400 to-cyan-400" onClick={() => launchApp('Phone')} />
              <DockIcon icon={Globe} gradient="from-blue-500 to-indigo-500" onClick={() => launchApp('Net')} />
              <DockIcon icon={Mail} gradient="from-rose-400 to-orange-500" onClick={() => launchApp('Mail')} />
              <DockIcon icon={ShoppingBag} gradient="from-fuchsia-500 to-purple-600" onClick={() => launchApp('Vault')} />
            </div>
          </div>
        )}

        {/* Glowing Navigation Pill */}
        <div 
          className="absolute bottom-3 left-1/2 -translate-x-1/2 w-[100px] h-[4px] rounded-full z-50 cursor-pointer transition-all duration-300 bg-white/50 hover:bg-white shadow-[0_0_10px_rgba(255,255,255,0.5)]"
          onPointerDown={onHomePointerDown}
          onPointerUp={onHomePointerUp}
        ></div>
      </div>
    </div>
  );
}
