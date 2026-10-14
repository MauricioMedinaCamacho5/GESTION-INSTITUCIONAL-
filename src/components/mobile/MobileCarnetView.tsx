import React, { useState, useEffect } from 'react';

interface MobileCarnetViewProps {
  onBackToDesktop?: () => void;
}

export const MobileCarnetView: React.FC<MobileCarnetViewProps> = ({ onBackToDesktop }) => {
  const [timeLeft, setTimeLeft] = useState(28);
  const [activeTab, setActiveTab] = useState<'carnet' | 'horarios' | 'asistencias' | 'perfil'>('carnet');
  const [nfcFeedback, setNfcFeedback] = useState(false);
  const maxTime = 30;
  const perimeter = 88; // 2 * pi * 14

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 1 ? prev - 1 : maxTime));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const resetToken = () => {
    setTimeLeft(maxTime);
  };

  const handleNfcTap = () => {
    setNfcFeedback(true);
    setTimeout(() => setNfcFeedback(false), 2400);
  };

  const strokeDashoffset = perimeter - (timeLeft / maxTime) * perimeter;
  const isExpiringSoon = timeLeft <= 5;

  return (
    <div className="w-full max-w-[420px] mx-auto bg-surface min-h-[844px] flex flex-col shadow-2xl rounded-3xl overflow-hidden border border-surface-container relative select-none">
      {/* Top Mobile App Header */}
      <header className="sticky top-0 z-40 bg-surface/90 backdrop-blur-md px-4 py-3 flex items-center justify-between border-b border-surface-container">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-on-primary font-bold shadow-xs">
            S
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-sm text-primary leading-tight">SGI Móvil</span>
            <span className="text-[10px] text-on-surface-variant font-bold uppercase tracking-wider">
              Mi Carnet QR
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {onBackToDesktop && (
            <button
              onClick={onBackToDesktop}
              type="button"
              className="text-[11px] font-bold text-primary bg-primary-fixed px-2 py-1 rounded-md hover:bg-primary hover:text-on-primary transition-all"
              title="Volver a la vista completa de escritorio"
            >
              Escritorio
            </button>
          )}
          <button
            type="button"
            className="w-8 h-8 rounded-full hover:bg-surface-container flex items-center justify-center text-on-surface-variant"
          >
            <span className="material-symbols-outlined text-[20px]">notifications</span>
          </button>
          <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-on-primary">
            <span className="material-symbols-outlined text-[18px]">person</span>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 px-4 py-4 flex flex-col gap-3 pb-24 overflow-y-auto">
        {/* Dynamic QR Security Status Banner */}
        <div className="w-full bg-surface-container-high rounded-xl p-3 flex items-center justify-between shadow-xs border border-surface-container">
          <div className="flex items-center gap-3 min-w-0">
            <div className="relative w-9 h-9 flex items-center justify-center shrink-0">
              <svg className="w-9 h-9 -rotate-90 transform" viewBox="0 0 36 36">
                <circle
                  className="stroke-surface-container-highest"
                  cx="18"
                  cy="18"
                  fill="none"
                  r="14"
                  strokeWidth="3"
                />
                <circle
                  className={`transition-all duration-1000 ease-linear ${
                    isExpiringSoon ? 'stroke-error' : 'stroke-primary'
                  }`}
                  cx="18"
                  cy="18"
                  fill="none"
                  r="14"
                  strokeDasharray="88"
                  strokeDashoffset={strokeDashoffset}
                  strokeLinecap="round"
                  strokeWidth="3"
                />
              </svg>
              <span
                className={`absolute text-[11px] font-bold font-mono ${
                  isExpiringSoon ? 'text-error animate-pulse' : 'text-primary'
                }`}
              >
                {timeLeft}s
              </span>
            </div>

            <div className="flex flex-col min-w-0">
              <span className="text-xs font-bold text-on-surface truncate">
                Código QR Dinámico
              </span>
              <span className="text-[10px] text-on-surface-variant flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-secondary inline-block animate-pulse" />
                Token anti-captura activo
              </span>
            </div>
          </div>

          <button
            onClick={resetToken}
            type="button"
            className="h-8 px-2.5 rounded-lg bg-surface-container-lowest text-primary text-xs font-bold flex items-center gap-1 hover:bg-surface transition-colors shadow-xs active:scale-95 border border-surface-container shrink-0"
          >
            <span className="material-symbols-outlined text-[16px]">refresh</span>
            <span>Renovar</span>
          </button>
        </div>

        {/* Digital Credential Main Card */}
        <div className="relative w-full rounded-2xl bg-surface-container-lowest shadow-md overflow-hidden flex flex-col border border-surface-container">
          {/* Card Top Header with Institution Gradient & Logo Strip */}
          <div className="w-full bg-gradient-to-r from-primary to-primary-container p-4 text-on-primary flex items-center justify-between relative overflow-hidden">
            {/* Watermark shield */}
            <svg
              className="absolute -right-6 -bottom-6 w-32 h-32 opacity-10 text-on-primary pointer-events-none"
              fill="currentColor"
              viewBox="0 0 100 100"
            >
              <path d="M50 5 L88 22 V50 C88 72 50 95 50 95 C50 95 12 72 12 50 V22 Z" />
            </svg>

            <div className="flex items-center gap-2.5 z-10">
              <div className="w-9 h-9 rounded-lg bg-white/15 backdrop-blur-xs p-1.5 flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-[22px] text-secondary-container">
                  verified_user
                </span>
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] tracking-wider uppercase text-secondary-container font-bold">
                  Carnet Digital Oficial
                </span>
                <span className="text-sm font-bold text-on-primary tracking-tight leading-tight">
                  Instituto Tecnológico SGI
                </span>
              </div>
            </div>

            <span className="z-10 px-2.5 py-0.5 rounded-full bg-secondary-container text-on-secondary-container text-[10px] font-bold tracking-wide uppercase shadow-xs">
              Válido 2025-1
            </span>
          </div>

          {/* Student Bio Section */}
          <div className="p-4 flex gap-3.5 items-start">
            <div className="relative shrink-0">
              <img
                alt="Valentina Restrepo"
                className="w-20 h-24 rounded-xl object-cover shadow-xs bg-surface-container ring-1 ring-surface-container"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuC9gtWVUxS8DKMIXBIULROymlW0y-_cmWHjjdgj0DTELAMg9jJR1RVB3PPl6uPUZkfxByy_uIXBsk0JqrdobQzrvh_UEnhzKLymfPh7LoF_A07aLVtO86_VsByx1jVg2H6lyVPYITTocm9JiQsLWAplSTbuHzTgEIkZBQ3WPxlKcyUk6pZHlGOKwobbRAPJU7ppewssauU_Gook4a09eCXkJSe5F1aEBnkt_x8px76xeosCRBfTl3ROog"
              />
              <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-secondary text-on-secondary flex items-center justify-center shadow-xs">
                <span className="material-symbols-outlined text-[13px]">check</span>
              </div>
            </div>

            <div className="flex flex-col flex-1 min-w-0">
              <div className="flex items-center gap-1.5 mb-1">
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-secondary-container text-on-secondary-container text-[10px] font-bold">
                  <span className="w-1.5 h-1.5 rounded-full bg-secondary animate-pulse" />
                  ESTUDIANTE ACTIVO
                </span>
              </div>

              <h2 className="text-base font-bold text-on-surface leading-tight truncate">
                Valentina Restrepo Giraldo
              </h2>
              <span className="text-[11px] text-primary font-bold truncate mt-0.5">
                Tecnología en Desarrollo de Software
              </span>

              <div className="mt-2 grid grid-cols-2 gap-2 pt-1.5 bg-surface-container-low rounded-lg p-2 border border-surface-container">
                <div className="flex flex-col min-w-0">
                  <span className="text-[10px] text-on-surface-variant uppercase font-bold">Documento</span>
                  <span className="text-xs text-on-surface font-mono font-bold truncate">
                    CC 1.036.982.410
                  </span>
                </div>
                <div className="flex flex-col min-w-0">
                  <span className="text-[10px] text-on-surface-variant uppercase font-bold">Ficha</span>
                  <span className="text-xs text-on-surface font-mono font-bold truncate">
                    #267014
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Dynamic Interactive QR Display */}
          <div className="px-4 pb-4 flex flex-col items-center">
            <div className="relative w-full max-w-[270px] aspect-square p-4 rounded-xl bg-surface-container-low flex flex-col items-center justify-center shadow-inner border border-surface-container overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/5 to-transparent pointer-events-none animate-pulse" />

              <div className="relative z-10 w-full h-full bg-surface-container-lowest rounded-lg p-3 flex flex-col items-center justify-center shadow-sm">
                <svg className="w-full h-full text-primary" fill="currentColor" viewBox="0 0 140 140">
                  {/* Position Detection Patterns Top-Left */}
                  <rect fill="currentColor" height="35" rx="4" width="35" x="10" y="10" />
                  <rect fill="#ffffff" height="23" rx="2" width="23" x="16" y="16" />
                  <rect fill="currentColor" height="11" rx="1" width="11" x="22" y="22" />

                  {/* Position Detection Patterns Top-Right */}
                  <rect fill="currentColor" height="35" rx="4" width="35" x="95" y="10" />
                  <rect fill="#ffffff" height="23" rx="2" width="23" x="101" y="16" />
                  <rect fill="currentColor" height="11" rx="1" width="11" x="107" y="22" />

                  {/* Position Detection Patterns Bottom-Left */}
                  <rect fill="currentColor" height="35" rx="4" width="35" x="10" y="95" />
                  <rect fill="#ffffff" height="23" rx="2" width="23" x="16" y="101" />
                  <rect fill="currentColor" height="11" rx="1" width="11" x="22" y="107" />

                  {/* Modules */}
                  <rect height="6" rx="1" width="6" x="52" y="12" />
                  <rect height="6" rx="1" width="6" x="64" y="12" />
                  <rect height="6" rx="1" width="10" x="76" y="12" />
                  <rect height="6" rx="1" width="18" x="52" y="24" />
                  <rect height="6" rx="1" width="6" x="76" y="24" />
                  <rect height="10" rx="1" width="6" x="52" y="36" />
                  <rect height="6" rx="1" width="18" x="64" y="36" />
                  <rect height="18" rx="1" width="6" x="12" y="52" />
                  <rect height="6" rx="1" width="12" x="24" y="52" />
                  <rect height="6" rx="1" width="6" x="42" y="52" />
                  <rect height="6" rx="1" width="18" x="12" y="76" />
                  <rect height="12" rx="1" width="12" x="36" y="76" />

                  {/* Center Emblem */}
                  <rect fill="#ffffff" height="38" rx="8" width="38" x="51" y="51" />
                  <rect fill="#00288e" height="30" rx="6" width="30" x="55" y="55" />
                  <path
                    d="M68 64 L75 71 L65 81 L61 77"
                    fill="none"
                    stroke="#6cf8bb"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="3.5"
                  />

                  <rect height="6" rx="1" width="18" x="96" y="52" />
                  <rect height="18" rx="1" width="8" x="120" y="52" />
                  <rect height="12" rx="1" width="6" x="96" y="64" />
                  <rect height="6" rx="1" width="12" x="108" y="70" />
                  <rect height="6" rx="1" width="18" x="96" y="82" />
                  <rect height="6" rx="1" width="12" x="52" y="96" />
                  <rect height="18" rx="1" width="6" x="70" y="96" />
                  <rect height="6" rx="1" width="14" x="82" y="96" />
                  <rect height="12" rx="1" width="6" x="52" y="108" />
                  <rect height="6" rx="1" width="20" x="64" y="114" />
                  <rect height="18" rx="1" width="8" x="88" y="108" />
                  <rect height="6" rx="1" width="30" x="52" y="122" />
                  <rect height="6" rx="1" width="6" x="102" y="96" />
                  <rect height="6" rx="1" width="14" x="114" y="96" />
                  <rect height="6" rx="1" width="18" x="102" y="108" />
                  <rect height="8" rx="1" width="6" x="102" y="120" />
                  <rect height="8" rx="1" width="14" x="114" y="120" />
                </svg>

                <div className="mt-1 flex items-center justify-between w-full px-1">
                  <span className="text-[10px] font-mono text-outline font-bold tracking-wider">
                    #8F90-SEC-VAL
                  </span>
                  <span className="text-[10px] font-mono text-primary font-bold">10:42:18</span>
                </div>
              </div>
            </div>

            <div className="w-full max-w-[270px] mt-2 flex items-center justify-between px-1">
              <span className="text-xs text-on-surface-variant flex items-center gap-1">
                <span className="material-symbols-outlined text-[15px] text-secondary">security</span>
                Torniquetes Campus Central
              </span>
              <span className="text-xs text-primary font-bold">Torniquete #04</span>
            </div>
          </div>
        </div>

        {/* Primary NFC Tap Shortcut Action */}
        <button
          onClick={handleNfcTap}
          type="button"
          className="w-full h-12 bg-primary text-on-primary rounded-xl text-xs font-bold shadow-md flex items-center justify-center gap-2 active:scale-[0.98] hover:bg-primary-container transition-all"
        >
          <span className="material-symbols-outlined text-[20px] animate-pulse">contactless</span>
          <span>
            {nfcFeedback ? '¡Emulando Tarjeta NFC (Pase Autorizado)!' : 'Aproximar a Torniquete (NFC Activo)'}
          </span>
        </button>

        {/* Authorized Gear Badge */}
        <div className="w-full rounded-xl bg-surface-container-lowest p-3.5 shadow-xs border border-surface-container flex items-start gap-3">
          <div className="w-9 h-9 rounded-lg bg-secondary-container text-on-secondary-container flex items-center justify-center shrink-0">
            <span className="material-symbols-outlined text-[20px]">laptop_mac</span>
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between gap-1">
              <span className="text-xs font-bold text-on-surface truncate">1 Equipo Autorizado</span>
              <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded bg-secondary-container text-on-secondary-container text-[10px] font-bold">
                <span className="material-symbols-outlined text-[12px]">check</span>
                Permitido
              </span>
            </div>
            <p className="text-xs text-on-surface-variant mt-0.5">Lenovo ThinkPad E14 Gen 4</p>
            <div className="mt-1 flex items-center gap-2">
              <span className="text-[10px] font-mono text-outline bg-surface-container px-1.5 py-0.5 rounded font-bold">
                ID: #LNV-99214
              </span>
              <span className="text-[10px] text-secondary font-bold">Revisado en Portería Norte</span>
            </div>
          </div>
        </div>

        {/* Next Scheduled Session */}
        <div className="w-full rounded-xl bg-surface-container-lowest p-3.5 shadow-xs border border-surface-container flex items-start gap-3">
          <div className="w-9 h-9 rounded-lg bg-surface-container-high text-primary flex items-center justify-center shrink-0">
            <span className="material-symbols-outlined text-[20px]">school</span>
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between gap-1">
              <span className="text-xs font-bold text-on-surface truncate">
                Próxima Clase Programada
              </span>
              <span className="px-2 py-0.5 rounded bg-primary-fixed text-on-primary-fixed-variant text-[10px] font-bold">
                08:00 AM
              </span>
            </div>
            <p className="text-xs font-bold text-on-surface truncate mt-0.5">Bases de Datos MySQL</p>
            <div className="mt-1 flex items-center gap-1.5 text-on-surface-variant text-[11px]">
              <span className="material-symbols-outlined text-[15px] text-primary">meeting_room</span>
              <span>Edificio B · Laboratorio TIC 302</span>
            </div>
          </div>
        </div>

        {/* Offline Security Cache Banner */}
        <div className="w-full rounded-xl bg-surface-container-low p-2.5 flex items-center justify-between border border-surface-container text-xs">
          <div className="flex items-center gap-1.5 text-on-surface-variant">
            <span className="material-symbols-outlined text-[16px] text-secondary">cloud_done</span>
            <span className="font-medium">Modo Offline: Credencial en caché segura</span>
          </div>
          <span className="text-[10px] text-outline font-mono font-bold">Sinc. 10:40 AM</span>
        </div>
      </main>

      {/* Mobile Bottom Tab Navigation */}
      <nav className="fixed bottom-0 max-w-[420px] w-full bg-surface/90 backdrop-blur-xl border-t border-surface-container py-2 px-2 flex items-center justify-around z-50">
        <button
          onClick={() => setActiveTab('carnet')}
          type="button"
          className={`flex flex-col items-center justify-center gap-0.5 min-w-[64px] ${
            activeTab === 'carnet' ? 'text-primary font-bold' : 'text-on-surface-variant'
          }`}
        >
          <span className="material-symbols-outlined text-[22px]">qr_code_scanner</span>
          <span className="text-[10px]">Mi Carnet</span>
        </button>
        <button
          onClick={() => setActiveTab('horarios')}
          type="button"
          className={`flex flex-col items-center justify-center gap-0.5 min-w-[64px] ${
            activeTab === 'horarios' ? 'text-primary font-bold' : 'text-on-surface-variant'
          }`}
        >
          <span className="material-symbols-outlined text-[22px]">calendar_month</span>
          <span className="text-[10px]">Horarios</span>
        </button>
        <button
          onClick={() => setActiveTab('asistencias')}
          type="button"
          className={`flex flex-col items-center justify-center gap-0.5 min-w-[64px] ${
            activeTab === 'asistencias' ? 'text-primary font-bold' : 'text-on-surface-variant'
          }`}
        >
          <span className="material-symbols-outlined text-[22px]">checklist</span>
          <span className="text-[10px]">Asistencias</span>
        </button>
        <button
          onClick={() => setActiveTab('perfil')}
          type="button"
          className={`flex flex-col items-center justify-center gap-0.5 min-w-[64px] ${
            activeTab === 'perfil' ? 'text-primary font-bold' : 'text-on-surface-variant'
          }`}
        >
          <span className="material-symbols-outlined text-[22px]">account_circle</span>
          <span className="text-[10px]">Perfil</span>
        </button>
      </nav>
    </div>
  );
};
