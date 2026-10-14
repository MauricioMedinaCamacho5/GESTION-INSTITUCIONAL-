import React, { useState } from 'react';
import { Sidebar, ActiveModule } from './components/Sidebar';
import { Header, AppViewMode } from './components/Header';
import { PorteriaView } from './components/views/PorteriaView';
import { AmbientesView } from './components/views/AmbientesView';
import { AsistenciaView } from './components/views/AsistenciaView';
import { EquiposView } from './components/views/EquiposView';
import { UsuariosCarnetsView } from './components/views/UsuariosCarnetsView';
import { ReportesView } from './components/views/ReportesView';
import { MobileCarnetView } from './components/mobile/MobileCarnetView';
import { MobilePorteriaView } from './components/mobile/MobilePorteriaView';

export default function App() {
  const [activeModule, setActiveModule] = useState<ActiveModule>('porteria');
  const [viewMode, setViewMode] = useState<AppViewMode>('desktop');
  const [showPhoneFrame, setShowPhoneFrame] = useState(true);

  return (
    <div className="min-h-screen bg-background text-on-surface flex flex-col font-sans antialiased">
      {/* Quick Interactive Switcher Banner on Desktop Top (discreet, professional floating ribbon) */}
      <div className="bg-primary-container text-on-primary px-4 py-2 flex flex-wrap items-center justify-between text-xs font-semibold z-50 shadow-sm border-b border-white/10">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-secondary-container animate-pulse" />
          <span className="font-bold tracking-wide">SGI ACCESO INSTITUCIONAL</span>
          <span className="text-white/60 hidden sm:inline">|</span>
          <span className="text-white/80 hidden sm:inline">
            Sistema Unificado de Control de Acceso, Asistencia y Trazabilidad de Activos
          </span>
        </div>

        {/* View Switchers */}
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-white/70 text-[11px] mr-1">Vistas Disponibles:</span>
          <button
            onClick={() => setViewMode('desktop')}
            type="button"
            className={`px-2.5 py-1 rounded-md text-[11px] font-bold transition-all flex items-center gap-1 ${
              viewMode === 'desktop'
                ? 'bg-white text-primary shadow-xs'
                : 'bg-white/15 text-white hover:bg-white/25'
            }`}
          >
            <span className="material-symbols-outlined text-[15px]">desktop_windows</span>
            <span>Escritorio</span>
          </button>

          <button
            onClick={() => setViewMode('mobile-carnet')}
            type="button"
            className={`px-2.5 py-1 rounded-md text-[11px] font-bold transition-all flex items-center gap-1 ${
              viewMode === 'mobile-carnet'
                ? 'bg-white text-primary shadow-xs'
                : 'bg-white/15 text-white hover:bg-white/25'
            }`}
          >
            <span className="material-symbols-outlined text-[15px]">qr_code_2</span>
            <span>App: Carnet Estudiante</span>
          </button>

          <button
            onClick={() => setViewMode('mobile-guard')}
            type="button"
            className={`px-2.5 py-1 rounded-md text-[11px] font-bold transition-all flex items-center gap-1 ${
              viewMode === 'mobile-guard'
                ? 'bg-white text-primary shadow-xs'
                : 'bg-white/15 text-white hover:bg-white/25'
            }`}
          >
            <span className="material-symbols-outlined text-[15px]">security</span>
            <span>App: Portería Móvil</span>
          </button>

          {viewMode !== 'desktop' && (
            <button
              onClick={() => setShowPhoneFrame(!showPhoneFrame)}
              type="button"
              className="ml-2 px-2 py-1 rounded bg-black/30 hover:bg-black/50 text-[10px] text-white flex items-center gap-1"
              title="Alternar marco de celular"
            >
              <span className="material-symbols-outlined text-[13px]">
                {showPhoneFrame ? 'fullscreen' : 'smartphone'}
              </span>
              <span>{showPhoneFrame ? 'Pantalla Completa' : 'Marco Celular'}</span>
            </button>
          )}
        </div>
      </div>

      {/* RENDER DESKTOP SUITE */}
      {viewMode === 'desktop' && (
        <div className="relative min-h-screen">
          <Sidebar activeModule={activeModule} onSelectModule={setActiveModule} />

          <div className="pl-64 flex flex-col min-h-screen">
            <Header currentView={viewMode} onChangeView={setViewMode} />

            <main className="w-full pt-16 pb-12 flex-1">
              {activeModule === 'porteria' && <PorteriaView />}
              {activeModule === 'ambientes' && <AmbientesView />}
              {activeModule === 'asistencia' && <AsistenciaView />}
              {activeModule === 'equipos' && <EquiposView />}
              {activeModule === 'usuarios' && <UsuariosCarnetsView />}
              {activeModule === 'reportes' && <ReportesView />}
            </main>
          </div>
        </div>
      )}

      {/* RENDER MOBILE CARNET APP */}
      {viewMode === 'mobile-carnet' && (
        <div
          className={`flex-1 flex items-center justify-center ${
            showPhoneFrame ? 'py-8 px-4 bg-surface-dim/40' : 'p-0 bg-surface'
          }`}
        >
          <div className={showPhoneFrame ? 'shadow-2xl ring-12 ring-black rounded-[36px]' : 'w-full'}>
            <MobileCarnetView onBackToDesktop={() => setViewMode('desktop')} />
          </div>
        </div>
      )}

      {/* RENDER MOBILE GUARD SCANNER APP */}
      {viewMode === 'mobile-guard' && (
        <div
          className={`flex-1 flex items-center justify-center ${
            showPhoneFrame ? 'py-8 px-4 bg-surface-dim/40' : 'p-0 bg-surface'
          }`}
        >
          <div className={showPhoneFrame ? 'shadow-2xl ring-12 ring-black rounded-[36px]' : 'w-full'}>
            <MobilePorteriaView onBackToDesktop={() => setViewMode('desktop')} />
          </div>
        </div>
      )}
    </div>
  );
}
