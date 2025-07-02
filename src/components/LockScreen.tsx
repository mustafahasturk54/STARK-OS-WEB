import React, { useState, useEffect, useRef } from "react";

const CORRECT_PASSWORD = "1234";

function getTime() {
  const now = new Date();
  return now.toLocaleTimeString("tr-TR", { hour: "2-digit", minute: "2-digit" });
}
function getDate() {
  const now = new Date();
  return now.toLocaleDateString("tr-TR", { weekday: "long", month: "long", day: "numeric" });
}

const LockScreen: React.FC<{ onUnlock: () => void }> = ({ onUnlock }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [time, setTime] = useState(getTime());
  const [date, setDate] = useState(getDate());
  const [shake, setShake] = useState(false);
  const [fadeOut, setFadeOut] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const [showWifi, setShowWifi] = useState(false);
  const [showBattery, setShowBattery] = useState(false);
  const [showAccessibility, setShowAccessibility] = useState(false);
  const [batteryLevel, setBatteryLevel] = useState<number | null>(null);
  const [isCharging, setIsCharging] = useState<boolean | null>(null);
  const [connection, setConnection] = useState<string>("Bağlı");

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(getTime());
      setDate(getDate());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (showPassword && inputRef.current) {
      inputRef.current.focus();
    }
  }, [showPassword]);

  // Ekrana tıklama veya tuşa basma ile şifre ekranını aç
  useEffect(() => {
    if (!showPassword) {
      const open = () => setShowPassword(true);
      window.addEventListener("mousedown", open);
      window.addEventListener("keydown", open);
      return () => {
        window.removeEventListener("mousedown", open);
        window.removeEventListener("keydown", open);
      };
    }
  }, [showPassword]);

  // Pil durumu için (destekliyorsa)
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

  // Popup'ları ekranda herhangi bir yere tıklayınca kapat
  useEffect(() => {
    if (showWifi || showBattery || showAccessibility) {
      const closeAll = () => {
        setShowWifi(false);
        setShowBattery(false);
        setShowAccessibility(false);
      };
      window.addEventListener('mousedown', closeAll);
      return () => window.removeEventListener('mousedown', closeAll);
    }
  }, [showWifi, showBattery, showAccessibility]);

  // Şifre ekranı açıldığında input'a focus'u garanti et
  useEffect(() => {
    if (showPassword && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 10);
    }
  }, [showPassword]);

  const handleUnlock = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === CORRECT_PASSWORD) {
      setError("");
      setFadeOut(true);
      setTimeout(() => onUnlock(), 700);
    } else {
      setError("Şifre yanlış!");
      setShake(true);
      setTimeout(() => setShake(false), 500);
    }
  };

  return (
    <div className={`fixed inset-0 z-50 flex flex-col items-center justify-center select-none transition-opacity duration-700 ${fadeOut ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
      {/* Arka plan görseli */}
      <div className="absolute inset-0 bg-cover bg-center bg-[url('https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1500&q=80')] scale-105 brightness-75 transition-all duration-700" style={{ filter: showPassword ? 'blur(8px)' : 'none', opacity: fadeOut ? 0 : 1 }}></div>
      {/* Şifre ekranında ek olarak koyu overlay ve blur */}
      {showPassword && (
        <div className="absolute inset-0 bg-gradient-to-br from-black/60 via-black/30 to-blue-900/40 backdrop-blur-2xl transition-all duration-700" style={{ opacity: fadeOut ? 0 : 1 }}></div>
      )}
      {/* İçerik */}
      <div className="relative z-10 w-full h-full">
        {/* Saat ve tarih */}
        <div
          className={`fixed left-1/2 top-[28%] -translate-x-1/2 -translate-y-1/2 flex flex-col items-center transition-all duration-700 ${showPassword ? 'opacity-0 scale-95 pointer-events-none' : 'opacity-100 scale-100'} `}
          style={{zIndex: 21}}
        >
          <span className="text-[7rem] font-thin tracking-tight drop-shadow-lg mb-2 select-none text-white" style={{fontFamily:'SF Pro Display, Arial, sans-serif', letterSpacing: '-0.04em'}}>{time}</span>
          <span className="text-2xl font-light text-gray-200 drop-shadow mb-8 select-none" style={{fontFamily:'SF Pro Display, Arial, sans-serif'}}>{date}</span>
        </div>
        {/* Şifre ekranı ve profil dairesi */}
        <form
          onSubmit={handleUnlock}
          className={`fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center w-full max-w-xs transition-all duration-700 ${showPassword ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'} ${shake ? 'animate-shake' : ''}`}
          style={{zIndex: 22}}
        >
          {/* Büyük daire şeklinde kullanıcı ikonu */}
          <div className="relative flex flex-col items-center mb-4">
            <div className="w-32 h-32 rounded-full bg-gradient-to-br from-blue-400 to-blue-700 flex items-center justify-center shadow-2xl mb-2 transition-all duration-300">
              <svg width="64" height="64" fill="none" viewBox="0 0 24 24"><circle cx="12" cy="8.5" r="4" fill="#fff"/><path d="M12 14c-3.31 0-6 1.34-6 3v1h12v-1c0-1.66-2.69-3-6-3z" fill="#fff"/></svg>
            </div>
          </div>
          <input
            ref={inputRef}
            type="password"
            className="w-56 px-4 py-1.5 rounded-full bg-white/20 border border-gray-400 focus:outline-none text-center text-base tracking-widest mb-3 text-white placeholder-gray-300 transition-all duration-300 backdrop-blur-md shadow-xl font-light placeholder:font-normal placeholder:text-base placeholder:opacity-80"
            placeholder="Enter password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            autoFocus={showPassword}
            disabled={!showPassword}
            style={{fontFamily:'Inter, Arial, sans-serif', letterSpacing: '0.2em'}}
            inputMode="numeric"
          />
          {error && <div className="text-red-400 mt-3 text-base font-medium">{error}</div>}
        </form>
      </div>
      {/* Animasyon için shake keyframes ve placeholder font ayarı */}
      <style>{`
        @keyframes shake {
          0% { transform: translateX(0); }
          20% { transform: translateX(-8px); }
          40% { transform: translateX(8px); }
          60% { transform: translateX(-8px); }
          80% { transform: translateX(8px); }
          100% { transform: translateX(0); }
        }
        .animate-shake { animation: shake 0.5s; }
        input[type='password']::-ms-reveal, input[type='password']::-ms-clear { display: none; }
        input::placeholder {
          font-family: Inter, Arial, sans-serif;
          font-size: 1rem;
          opacity: 0.8;
          font-weight: 400;
        }
      `}</style>
      {/* Sağ alt köşede Windows lock screen tarzı ikonlar */}
      <div className="fixed bottom-6 right-8 flex gap-4 z-30 select-none">
        {/* Wi-Fi */}
        <div className="relative">
          <button onClick={() => { setShowWifi(v => !v); setShowBattery(false); setShowAccessibility(false); }} className="w-9 h-9 flex items-center justify-center rounded-full bg-black/40 hover:bg-black/60 transition-colors duration-200 text-white/80 hover:text-white shadow-lg focus:outline-none">
            <svg width="22" height="22" fill="none" viewBox="0 0 24 24"><path d="M2 8.82C6.06 5.6 11.94 5.6 16 8.82M5.5 12.5c2.48-1.98 6.52-1.98 9 0M9 16.5a2 2 0 0 1 2.83 0" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </button>
          {showWifi && (
            <div className="absolute bottom-12 right-0 min-w-[180px] bg-black/80 text-white rounded-xl shadow-xl p-4 text-sm animate-fadeIn">
              <div className="mb-2 font-semibold">Wi-Fi</div>
              <div className="flex items-center gap-2 mb-1"><span className="w-2 h-2 rounded-full bg-green-400 inline-block"></span> {connection}</div>
              <div className="mt-2 text-gray-300">Ağlar:</div>
              <ul className="mt-1 space-y-1">
                <li className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-blue-400 inline-block"></span> Home WiFi <span className="ml-auto text-xs text-green-400">Bağlı</span></li>
                <li className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-gray-400 inline-block"></span> Misafir</li>
                <li className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-gray-400 inline-block"></span> Mobil Hotspot</li>
              </ul>
            </div>
          )}
        </div>
        {/* Pil - dinamik doluluk, sayı yok */}
        <div className="w-9 h-9 flex items-center justify-center rounded-full bg-black/40 shadow-lg relative">
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
                <text x="10" y="15" textAnchor="middle" fontSize="7" fill="#222" fontWeight="bold" fontFamily="Inter, Arial, sans-serif">{level}</text>
              </svg>
            );
          })()}
          {/* Şarjda ise şimşek overlay */}
          {isCharging && (
            <svg width="14" height="14" viewBox="0 0 24 24" className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none" style={{zIndex:2}}>
              <polygon points="12,7 10,13 13,13 11,19" fill="#fff" stroke="#22c55e" strokeWidth="1.2" />
            </svg>
          )}
        </div>
        {/* Erişilebilirlik */}
        <div className="relative">
          <button onClick={() => { setShowAccessibility(v => !v); setShowWifi(false); setShowBattery(false); }} className="w-9 h-9 flex items-center justify-center rounded-full bg-black/40 hover:bg-black/60 transition-colors duration-200 text-white/80 hover:text-white shadow-lg focus:outline-none">
            <svg width="22" height="22" fill="none" viewBox="0 0 24 24"><circle cx="12" cy="7" r="2" stroke="currentColor" strokeWidth="1.7"/><path d="M4 10.5c2.5-1 13.5-1 16 0M12 9.5v7M12 16.5l-3 4M12 16.5l3 4" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round"/></svg>
          </button>
          {showAccessibility && (
            <div className="absolute bottom-12 right-0 min-w-[160px] bg-black/80 text-white rounded-xl shadow-xl p-4 text-sm animate-fadeIn">
              <div className="mb-2 font-semibold">Erişilebilirlik</div>
              <ul className="space-y-1">
                <li><button className="hover:underline">Büyütme</button></li>
                <li><button className="hover:underline">Yüksek Kontrast</button></li>
                <li><button className="hover:underline">Ekran Okuyucu</button></li>
              </ul>
            </div>
          )}
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
};

export default LockScreen; 