import React, { useState } from 'react';

interface MobilePorteriaViewProps {
  onBackToDesktop?: () => void;
}

export const MobilePorteriaView: React.FC<MobilePorteriaViewProps> = ({ onBackToDesktop }) => {
  const [torchOn, setTorchOn] = useState(false);
  const [cameraFlipped, setCameraFlipped] = useState(false);
  const [showIncidentModal, setShowIncidentModal] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const [shiftStats, setShiftStats] = useState({
    ingresos: 412,
    salidas: 180,
    novedades: 1,
  });

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2800);
  };

  const handleConfirmAccess = (action: 'Ingreso' | 'Salida', point: string) => {
    if (action === 'Ingreso') {
      setShiftStats((prev) => ({ ...prev, ingresos: prev.ingresos + 1 }));
    } else {
      setShiftStats((prev) => ({ ...prev, salidas: prev.salidas + 1 }));
    }
    showToast(`${action} validado exitosamente en ${point}. Torniquete habilitado.`);
  };

  return (
    <div className="w-full max-w-[420px] mx-auto bg-surface min-h-[844px] flex flex-col shadow-2xl rounded-3xl overflow-hidden border border-surface-container relative select-none">
      {/* Toast */}
      {toastMessage && (
        <div className="fixed bottom-24 left-6 right-6 z-50 bg-inverse-surface text-inverse-on-surface px-4 py-3 rounded-xl shadow-2xl flex items-center justify-between text-xs font-semibold border border-secondary animate-bounce">
          <span className="flex items-center gap-2">
            <span className="material-symbols-outlined text-secondary-fixed text-[18px]">check_circle</span>
            {toastMessage}
          </span>
          <span className="text-secondary-fixed text-[10px] uppercase font-bold">Listo</span>
        </div>
      )}

      {/* Top Header */}
      <header className="sticky top-0 z-40 bg-surface/90 backdrop-blur-md px-4 py-3 flex items-center justify-between border-b border-surface-container">
        <div className="flex items-center gap-2">
          {onBackToDesktop ? (
            <button
              onClick={onBackToDesktop}
              className="w-9 h-9 -ml-1 flex items-center justify-center rounded-full text-on-surface hover:bg-surface-container-high transition-colors"
              title="Volver"
            >
              <span className="material-symbols-outlined text-[22px]">arrow_back</span>
            </button>
          ) : (
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-on-primary font-bold shadow-xs">
              S
            </div>
          )}
          <div className="flex items-center gap-2">
            <span className="font-bold text-sm text-on-surface truncate max-w-[190px]">
              Registro De Incidencia...
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {onBackToDesktop && (
            <button
              onClick={onBackToDesktop}
              className="text-[11px] font-bold text-primary bg-primary-fixed px-2 py-1 rounded-md hover:bg-primary hover:text-on-primary transition-all"
            >
              Escritorio
            </button>
          )}
          <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-on-primary">
            <span className="material-symbols-outlined text-[18px]">person</span>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 p-4 flex flex-col gap-3.5 pb-8 overflow-y-auto">
        {/* Viewfinder Scanner Card */}
        <div className="relative w-full rounded-2xl bg-inverse-surface text-inverse-on-surface p-4 shadow-md overflow-hidden flex flex-col justify-between h-72 border border-surface-container">
          {/* Ambient Video Background Simulation */}
          <div
            className={`absolute inset-0 opacity-25 bg-cover bg-center transition-transform duration-500 ${
              cameraFlipped ? 'scale-x-[-1]' : ''
            }`}
            style={{
              backgroundImage: `url('https://lh3.googleusercontent.com/aida-public/AB6AXuC2WEmsmCT2-HZQ1LjzhWD5lnpJ22vkyaQ2B7zd63fxJZjRG4OTpyvWE2EwTmlh4ZitpQTIbGHGubWOxVA9ojAPw8YGFrLxeXDADdgSzr1O4fVQ1WBb4xljkV-3_lMqgeocMKvFC-zu2RhqVuILZQLY1HhhULw5IcMpKIRKrcP1HBiR6VTrpCD6W_lHPhJphoa0cxB_5mhEABgCHMNDVu6_WYl-zsMDLt3v4zKZbBD2miTGSE2xyh1_eA')`,
            }}
          />
          {torchOn && <div className="absolute inset-0 bg-yellow-100/25 mix-blend-screen pointer-events-none" />}

          {/* Scanner Top Bar Utilities */}
          <div className="relative z-10 flex items-center justify-between">
            <div className="flex items-center gap-2 bg-inverse-surface/80 backdrop-blur-md px-3 py-1.5 rounded-full">
              <span className="w-2 h-2 rounded-full bg-secondary-fixed animate-ping" />
              <span className="text-[11px] font-bold text-secondary-fixed uppercase tracking-wider">
                Cámara Activa
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setTorchOn(!torchOn)}
                type="button"
                className={`w-9 h-9 rounded-full transition flex items-center justify-center ${
                  torchOn
                    ? 'bg-secondary-fixed text-on-secondary-fixed'
                    : 'bg-surface-container-highest/20 text-inverse-on-surface hover:bg-surface-container-highest/30'
                }`}
                title="Linterna"
              >
                <span className="material-symbols-outlined text-[20px]">
                  {torchOn ? 'flash_off' : 'flash_on'}
                </span>
              </button>
              <button
                onClick={() => setCameraFlipped(!cameraFlipped)}
                type="button"
                className="w-9 h-9 rounded-full bg-surface-container-highest/20 hover:bg-surface-container-highest/30 transition flex items-center justify-center text-inverse-on-surface"
                title="Cambiar Cámara"
              >
                <span className="material-symbols-outlined text-[20px]">flip_camera_ios</span>
              </button>
            </div>
          </div>

          {/* Targeting Reticle & Laser Sweep */}
          <div className="relative z-10 flex-1 flex items-center justify-center my-2">
            <div className="relative w-48 h-48 rounded-xl flex items-center justify-center">
              <span className="absolute top-0 left-0 w-6 h-6 border-t-4 border-l-4 border-secondary-fixed rounded-tl-lg" />
              <span className="absolute top-0 right-0 w-6 h-6 border-t-4 border-r-4 border-secondary-fixed rounded-tr-lg" />
              <span className="absolute bottom-0 left-0 w-6 h-6 border-b-4 border-l-4 border-secondary-fixed rounded-bl-lg" />
              <span className="absolute bottom-0 right-0 w-6 h-6 border-b-4 border-r-4 border-secondary-fixed rounded-br-lg" />

              <div className="absolute w-full h-1 bg-gradient-to-r from-transparent via-secondary-fixed to-transparent shadow-[0_0_12px_#4edea3] animate-scan-laser" />

              <div className="w-16 h-16 rounded-full border border-secondary-fixed/40 flex items-center justify-center">
                <span className="material-symbols-outlined text-secondary-fixed/70 text-[32px] animate-pulse">
                  qr_code_scanner
                </span>
              </div>
            </div>
          </div>

          {/* Scanner Instructional Footer */}
          <div className="relative z-10 flex items-center justify-center">
            <span className="text-[11px] text-inverse-on-surface/90 bg-inverse-surface/90 px-3.5 py-1 rounded-full backdrop-blur-xs font-semibold">
              Apunta al código QR o carnet institucional
            </span>
          </div>
        </div>

        {/* Quick Feedback Notification Banner */}
        <div className="w-full bg-secondary-container rounded-xl p-3 flex items-center justify-between shadow-xs border border-secondary-container">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-full bg-secondary flex items-center justify-center text-on-secondary shrink-0">
              <span className="material-symbols-outlined text-[18px]">verified</span>
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] text-on-secondary-container font-bold tracking-wider uppercase">
                Último Escaneo
              </span>
              <span className="text-xs font-bold text-on-secondary-container leading-none">
                ACCESO APROBADO
              </span>
            </div>
          </div>
          <span className="text-[11px] text-on-secondary-container font-semibold opacity-90">
            Hace 4s
          </span>
        </div>

        {/* Scanned User Preview Card (Checkpoint Status Visual) */}
        <div className="w-full bg-surface-container-lowest rounded-2xl p-4 shadow-xs border border-surface-container flex flex-col gap-3.5">
          {/* User Profile Header */}
          <div className="flex items-start gap-3">
            <div className="relative shrink-0">
              <img
                alt="Valentina Restrepo"
                className="w-16 h-16 rounded-xl object-cover shadow-xs bg-surface-container ring-1 ring-surface-container"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuA_u-casSKbZE-FhzttBso9nXLpYdxWhMEzGo8XKSHcwHhHlZXT3BkMguRKmnyRabhWwmBIefeSu6EHBIAMmB2txyzlncFWgGE8wkAW8YYCMrWxkpEvF2mgNZzXz7_bzJz_IlDn5RN3uDcJLqC5SaI2yN28hA4fk3XU7cOrUXP_zxGauZ_oEmwqdTpxSBfrLAQ5_KgUxZJzK3Xu21ytHzS8Xi3s74_mg8CWCqxix8r644EvMiaJgGnRSQ"
              />
              <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-secondary flex items-center justify-center text-on-secondary shadow-xs">
                <span className="material-symbols-outlined text-[13px]">check</span>
              </div>
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="text-[10px] bg-surface-container-high text-primary font-bold px-2 py-0.5 rounded-full">
                  Estudiante
                </span>
                <span className="text-[11px] text-on-surface-variant flex items-center gap-0.5 font-medium">
                  <span className="material-symbols-outlined text-[13px]">pin_drop</span> Sede Central
                </span>
              </div>

              <h3 className="text-sm font-bold text-on-surface truncate mt-1">
                Valentina Restrepo Giraldo
              </h3>
              <p className="text-xs text-on-surface-variant">
                Doc: <span className="font-mono text-on-surface font-semibold">CC 1.037.649.201</span> • Semestre VI
              </p>
            </div>
          </div>

          {/* Equipment Declaration Alert Pill */}
          <div className="w-full bg-surface-container-low rounded-xl p-3 flex items-center justify-between border border-surface-container">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-8 h-8 rounded-lg bg-surface-container-high flex items-center justify-center text-primary shrink-0">
                <span className="material-symbols-outlined text-[18px]">laptop_mac</span>
              </div>
              <div className="min-w-0">
                <span className="text-[11px] text-primary font-bold block">1 Equipo Declarado</span>
                <span className="text-xs text-on-surface font-medium truncate block">
                  Portátil Lenovo ThinkPad (SN #92A-44B)
                </span>
              </div>
            </div>
            <span className="text-[10px] bg-secondary-fixed text-on-secondary-fixed font-bold px-2 py-0.5 rounded-full">
              Verificado
            </span>
          </div>

          {/* Quick Action Buttons */}
          <div className="grid grid-cols-1 gap-2 pt-1">
            <button
              onClick={() => handleConfirmAccess('Ingreso', 'Torniquete 02')}
              type="button"
              className="w-full h-12 bg-primary hover:bg-primary-container active:scale-[0.99] text-on-primary rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-sm transition-all"
            >
              <span className="material-symbols-outlined text-[20px]">door_sliding</span>
              <span>CONFIRMAR INGRESO (Torniquete 02)</span>
            </button>

            <button
              onClick={() => handleConfirmAccess('Salida', 'Portal Principal')}
              type="button"
              className="w-full h-11 bg-surface-container-high hover:bg-surface-variant active:scale-[0.99] text-on-surface text-xs font-bold rounded-xl flex items-center justify-center gap-2 transition border border-surface-container"
            >
              <span className="material-symbols-outlined text-[20px] text-on-surface-variant">
                logout
              </span>
              <span>REGISTRAR SALIDA</span>
            </button>
          </div>
        </div>

        {/* Daily Portería Quick Stats Bar */}
        <div className="w-full bg-surface-container-low rounded-2xl p-4 shadow-xs border border-surface-container">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] text-on-surface-variant uppercase font-bold tracking-wider">
              Resumen Turno Actual
            </span>
            <span className="text-xs text-primary font-bold">T-Mañana 06:00 - 14:00</span>
          </div>

          <div className="grid grid-cols-3 gap-2 text-center">
            <div className="bg-surface-container-lowest rounded-xl p-2.5 shadow-xs border border-surface-container">
              <span className="text-[10px] text-on-surface-variant block mb-0.5 font-medium">Ingresos</span>
              <span className="text-base text-primary font-bold font-mono">{shiftStats.ingresos}</span>
            </div>
            <div className="bg-surface-container-lowest rounded-xl p-2.5 shadow-xs border border-surface-container">
              <span className="text-[10px] text-on-surface-variant block mb-0.5 font-medium">Salidas</span>
              <span className="text-base text-on-surface font-bold font-mono">{shiftStats.salidas}</span>
            </div>
            <div className="bg-surface-container-lowest rounded-xl p-2.5 shadow-xs border border-surface-container">
              <span className="text-[10px] text-on-surface-variant block mb-0.5 font-medium">Novedades</span>
              <span className="text-base text-error font-bold font-mono">{shiftStats.novedades}</span>
            </div>
          </div>
        </div>

        {/* Security Protocol & Emergency Action */}
        <div className="w-full pt-1">
          <button
            onClick={() => setShowIncidentModal(true)}
            type="button"
            className="w-full h-12 bg-error text-on-error hover:bg-on-error-container active:scale-[0.99] rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-sm transition"
          >
            <span className="material-symbols-outlined text-[20px]">shield_lock</span>
            <span>Bloqueo Preventivo / Registrar Novedad</span>
          </button>
        </div>
      </main>

      {/* Incident / Lockdown Modal */}
      {showIncidentModal && (
        <div className="fixed inset-0 z-50 bg-inverse-surface/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-surface rounded-2xl p-5 max-w-sm w-full shadow-2xl border border-surface-container space-y-4 animate-in fade-in">
            <div className="flex items-center gap-3 text-error">
              <span className="material-symbols-outlined text-[32px]">warning</span>
              <h4 className="text-base font-bold text-on-surface">Reportar Novedad de Guardia</h4>
            </div>
            <p className="text-xs text-on-surface-variant leading-relaxed">
              ¿Deseas levantar una alerta preventiva, registrar retención de credencial o suspender temporalmente el torniquete asignado?
            </p>
            <div className="flex items-center justify-end gap-2 pt-2 border-t border-surface-container">
              <button
                type="button"
                onClick={() => setShowIncidentModal(false)}
                className="px-4 py-2 rounded-lg text-xs font-semibold bg-surface-container text-on-surface"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={() => {
                  setShiftStats((prev) => ({ ...prev, novedades: prev.novedades + 1 }));
                  setShowIncidentModal(false);
                  showToast('Alerta de seguridad radicada con el Centro de Control.');
                }}
                className="px-4 py-2 rounded-lg text-xs font-bold bg-error text-on-error shadow-xs"
              >
                Confirmar Alerta
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
