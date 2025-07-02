import React, { useState, useEffect, useRef } from 'react';
import { Wifi, Battery, Volume2 } from 'lucide-react';

interface MenuBarProps {
  onLauncherToggle: () => void;
}

export default function MenuBar({ onLauncherToggle }: MenuBarProps) {
  const [currentTime, setCurrentTime] = useState(new Date());

  // Pil durumu
  const [batteryLevel, setBatteryLevel] = useState<number | null>(null);
  const [isCharging, setIsCharging] = useState<boolean | null>(null);

  // Wi-Fi popup state
  const [showWifi, setShowWifi] = useState(false);
  const [connection, setConnection] = useState<string>("Bağlı");

  // Ses seviyesi state'i ve overlay
  const [volume, setVolume] = useState(60); // 0-100
  const [showVolumeOverlay, setShowVolumeOverlay] = useState(false);
  const volumeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const nav: any = window.navigator;
    if (nav.getBattery) {
      nav.getBattery().then((battery: any) => {
        setBatteryLevel(Math.round(battery.level * 100));
        setIsCharging(battery.charging);
        battery.addEventListener('levelchange', () => setBatteryLevel(Math.round(battery.level * 100)));
        battery.addEventListener('chargingchange', () => setIsCharging(battery.charging));
      });
    }
  }, []);

  // Wi-Fi durumu için (örnek)
  useEffect(() => {
    if (navigator.onLine) {
      setConnection("Bağlı");
    } else {
      setConnection("Bağlantı yok");
    }
    const update = () => setConnection(navigator.onLine ? "Bağlı" : "Bağlantı yok");
    window.addEventListener('online', update);
    window.addEventListener('offline', update);
    return () => {
      window.removeEventListener('online', update);
      window.removeEventListener('offline', update);
    };
  }, []);

  // Wi-Fi popup'ı başka yere tıklayınca kapat
  useEffect(() => {
    if (showWifi) {
      const close = () => setShowWifi(false);
      window.addEventListener('mousedown', close, true);
      return () => window.removeEventListener('mousedown', close, true);
    }
  }, [showWifi]);

  // Ses overlay'ini kısa süreli göster
  const triggerVolumeOverlay = (newVolume: number) => {
    setVolume(newVolume);
    setShowVolumeOverlay(true);
    setTimeout(() => setShowVolumeOverlay(false), 1200);
  };

  // Mouse ses ikonunun üstündeyken yukarı/aşağı ile ses değişimi
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (document.activeElement === volumeRef.current) {
        if (e.key === 'ArrowUp') {
          triggerVolumeOverlay(Math.min(100, volume + 10));
        } else if (e.key === 'ArrowDown') {
          triggerVolumeOverlay(Math.max(0, volume - 10));
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [volume]);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('tr-TR', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    });
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('tr-TR', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <div className="fixed top-0 left-0 right-0 h-6 bg-black/90 backdrop-blur-xl border-b border-white/10 z-50 flex items-center">
      {/* Sol tarafta menü butonları (S ikonu olmadan) */}
      <div className="flex items-center space-x-1 pl-2">
        <button className="text-white/80 hover:text-white hover:bg-white/10 px-1.5 py-0.5 rounded text-[11px] transition-colors">File</button>
        <button className="text-white/80 hover:text-white hover:bg-white/10 px-1.5 py-0.5 rounded text-[11px] transition-colors">Edit</button>
        <button className="text-white/80 hover:text-white hover:bg-white/10 px-1.5 py-0.5 rounded text-[11px] transition-colors">View</button>
        <button className="text-white/80 hover:text-white hover:bg-white/10 px-1.5 py-0.5 rounded text-[11px] transition-colors">Help</button>
      </div>
      {/* Ortada tarih ve saat yan yana */}
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center gap-2 select-none">
        <span className="text-[11px] text-white/80 font-medium tracking-wide" style={{fontFamily:'Inter, Arial, sans-serif'}}>{formatDate(currentTime)}</span>
        <span className="text-[11px] text-white/80 font-normal tracking-wider" style={{fontFamily:'Inter, Arial, sans-serif', letterSpacing: '0.08em'}}>{formatTime(currentTime)}</span>
      </div>
      {/* Sağda sistem ikonları: [Ses] [Wi-Fi] [Pil] */}
      <div className="ml-auto flex items-center space-x-2 pr-2">
        {/* Ses ikonu */}
        <div
          ref={volumeRef}
          tabIndex={0}
          className="flex items-center text-white/80 focus:outline-none cursor-pointer group"
          title="Ses"
          onClick={() => { triggerVolumeOverlay(volume); volumeRef.current?.focus(); }}
        >
          <Volume2 size={14} />
        </div>
        {/* Ses overlay'i */}
        {showVolumeOverlay && (
          <div className="fixed left-1/2 top-16 -translate-x-1/2 bg-black/90 text-white rounded-2xl shadow-2xl px-6 py-3 flex items-center gap-3 z-[9999] animate-fadeIn select-none" style={{backdropFilter:'blur(8px)'}}>
            <Volume2 size={24} />
            <div className="w-32 h-2 bg-white/30 rounded-full overflow-hidden">
              <div
                className="h-2 bg-white rounded-full transition-all duration-200"
                style={{ width: `${Math.max(4, Math.round(volume / 100 * 128))}px` }}
              ></div>
            </div>
            <span className="text-lg font-bold tracking-wider" style={{fontFamily:'Inter, Arial, sans-serif'}}>{volume}</span>
          </div>
        )}
        {/* Wi-Fi butonu ve modern dropdown */}
        <div className="relative">
          <button
            type="button"
            onClick={e => { e.preventDefault(); setShowWifi(v => !v); }}
            onMouseDown={e => e.stopPropagation()}
            className="flex items-center justify-center w-7 h-7 rounded-full hover:bg-white/10 transition-colors text-white/80 focus:outline-none"
            tabIndex={0}
          >
            <Wifi size={14} />
          </button>
          {showWifi && (
            <div
              className="absolute right-0 top-[110%] min-w-[260px] max-w-[320px] bg-neutral-900/95 text-white rounded-2xl shadow-2xl py-2 px-3 animate-fadeIn z-[9999] border border-white/10"
              style={{backdropFilter: 'blur(12px)'}}
              onMouseDown={e => e.stopPropagation()}
            >
              {/* Üstte bağlantı durumu */}
              <div className="flex items-center gap-2 mb-2 px-1 py-1">
                <span className="w-2 h-2 rounded-full bg-green-400 inline-block"></span>
                <span className="text-sm font-medium">{connection}</span>
              </div>
              <div className="text-xs text-gray-300 px-1 mb-1 mt-2">Ağlar</div>
              <ul className="mb-2">
                <li className="flex items-center gap-2 px-2 py-2 rounded-lg hover:bg-white/10 transition-colors cursor-pointer group">
                  <span className="w-2 h-2 rounded-full bg-blue-400 inline-block"></span>
                  <span className="text-sm">Home WiFi</span>
                  <span className="ml-auto text-xs text-green-400 group-hover:underline">Bağlı</span>
                </li>
                <li className="flex items-center gap-2 px-2 py-2 rounded-lg hover:bg-white/10 transition-colors cursor-pointer">
                  <span className="w-2 h-2 rounded-full bg-gray-400 inline-block"></span>
                  <span className="text-sm">Misafir</span>
                </li>
                <li className="flex items-center gap-2 px-2 py-2 rounded-lg hover:bg-white/10 transition-colors cursor-pointer">
                  <span className="w-2 h-2 rounded-full bg-gray-400 inline-block"></span>
                  <span className="text-sm">Mobil Hotspot</span>
                </li>
              </ul>
              <div className="border-t border-white/10 my-2"></div>
              <button className="w-full text-xs text-blue-400 hover:underline py-1 rounded-lg transition-colors text-center">Wi-Fi ayarları…</button>
            </div>
          )}
        </div>
        <div className="flex items-center space-x-0.5">
          {/* Pil - dinamik doluluk, sayı kutu içinde, şarjda şimşek overlay */}
          <div className="relative w-6 h-6 flex items-center justify-center">
            {(() => {
              let fill = '#fff';
              if (isCharging) fill = '#22c55e';
              else if (batteryLevel !== null && batteryLevel <= 20) fill = '#ef4444';
              let level = batteryLevel !== null ? batteryLevel : 100;
              let barWidth = Math.max(2, Math.round((level / 100) * 16));
              return (
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" style={{position:'relative', zIndex:1}}>
                  <rect x="2" y="7" width="16" height="10" rx="3" stroke={fill} strokeWidth="1.7"/>
                  <rect x="20" y="10" width="2" height="4" rx="1" fill={fill} />
                  <rect x="3.5" y="8.5" width={barWidth} height="7" rx="2" fill={fill} />
                  <text x="10" y="15" textAnchor="middle" fontSize="9" fill="#222" fontWeight="bold" fontFamily="Inter, Arial, sans-serif">{level}</text>
                </svg>
              );
            })()}
            {/* Şarjda ise şimşek overlay */}
            {isCharging && (
              <svg width="12" height="12" viewBox="0 0 24 24" className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none" style={{zIndex:2}}>
                <polygon points="12,7 10,13 13,13 11,19" fill="#fff" stroke="#22c55e" strokeWidth="1.2" />
              </svg>
            )}
          </div>
        </div>
      </div>
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}