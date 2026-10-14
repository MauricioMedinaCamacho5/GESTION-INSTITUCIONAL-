import React, { useState } from 'react';

export type AppViewMode = 'desktop' | 'mobile-carnet' | 'mobile-guard';

interface HeaderProps {
  currentView: AppViewMode;
  onChangeView: (mode: AppViewMode) => void;
  userRole?: string;
  userName?: string;
}

export const Header: React.FC<HeaderProps> = ({
  currentView,
  onChangeView,
  userRole = 'Admin / Operaciones',
  userName = 'Ing. Carlos Mendoza',
}) => {
  const [showRoleMenu, setShowRoleMenu] = useState(false);
  const [selectedRole, setSelectedRole] = useState(userRole);
  const [showNotifications, setShowNotifications] = useState(false);

  const notifications = [
    { id: 1, text: 'Devolución vencida: Proyector Epson #0045 en Auditorio 1', time: 'Hace 5m', type: 'error' },
    { id: 2, text: 'Torniquete #02 sincronizado con lectura de 412 pases', time: 'Hace 12m', type: 'success' },
    { id: 3, text: 'Alerta de Aforo: Lab TIC 302 al 91% de ocupación', time: 'Hace 24m', type: 'warning' },
  ];

  return (
    <header className="fixed top-0 left-64 right-0 h-16 bg-surface/85 backdrop-blur-xl border-b border-surface-container shadow-[0_1px_8px_rgba(0,0,0,0.03)] z-40 flex items-center justify-between px-6">
      {/* Left sync & campus location indicator */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 bg-surface-container px-3 py-1.5 rounded-full shadow-xs">
          <span className="w-2 h-2 rounded-full bg-secondary animate-pulse" />
          <span className="text-xs text-on-surface font-semibold tracking-wide">
            Sincronizado 99.8% - WebSocket Activo
          </span>
        </div>

        <div className="hidden lg:flex items-center gap-1.5 text-on-surface-variant text-xs">
          <span className="material-symbols-outlined text-[18px]">corporate_fare</span>
          <span className="font-medium">Campus Central: Puerta Principal</span>
        </div>
      </div>

      {/* Center/Right controls */}
      <div className="flex items-center gap-3">
        {/* Device View Switcher Pills */}
        <div className="hidden md:flex items-center bg-surface-container-low p-1 rounded-lg border border-surface-container">
          <button
            onClick={() => onChangeView('desktop')}
            type="button"
            className={`flex items-center gap-1.5 px-3 py-1 rounded text-xs font-semibold transition-all ${
              currentView === 'desktop'
                ? 'bg-primary text-on-primary shadow-xs'
                : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container'
            }`}
          >
            <span className="material-symbols-outlined text-[16px]">desktop_windows</span>
            <span>Escritorio</span>
          </button>
          <button
            onClick={() => onChangeView('mobile-carnet')}
            type="button"
            className={`flex items-center gap-1.5 px-3 py-1 rounded text-xs font-semibold transition-all ${
              currentView === 'mobile-carnet'
                ? 'bg-primary text-on-primary shadow-xs'
                : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container'
            }`}
          >
            <span className="material-symbols-outlined text-[16px]">phone_android</span>
            <span>Mi Carnet QR</span>
          </button>
          <button
            onClick={() => onChangeView('mobile-guard')}
            type="button"
            className={`flex items-center gap-1.5 px-3 py-1 rounded text-xs font-semibold transition-all ${
              currentView === 'mobile-guard'
                ? 'bg-primary text-on-primary shadow-xs'
                : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container'
            }`}
          >
            <span className="material-symbols-outlined text-[16px]">security</span>
            <span>Portería Móvil</span>
          </button>
        </div>

        {/* Role Selector Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowRoleMenu(!showRoleMenu)}
            type="button"
            className="flex items-center gap-1.5 bg-surface-container-low px-3 py-1.5 rounded-lg hover:bg-surface-container transition-colors text-xs font-semibold text-on-surface border border-surface-container"
          >
            <span className="material-symbols-outlined text-[18px] text-on-surface-variant">
              switch_account
            </span>
            <span className="truncate max-w-[130px]">{selectedRole}</span>
            <span className="material-symbols-outlined text-[16px] text-on-surface-variant">
              arrow_drop_down
            </span>
          </button>

          {showRoleMenu && (
            <div className="absolute right-0 mt-1 w-56 bg-surface-container-lowest rounded-xl shadow-xl border border-surface-container py-1 z-50 animate-in fade-in">
              <div className="px-3 py-1.5 text-[10px] font-bold text-outline uppercase tracking-wider">
                Cambiar Rol de Sesión
              </div>
              {['Admin / Operaciones', 'Instructor / Supervisor', 'Oficial de Seguridad / Guardia'].map((role) => (
                <button
                  key={role}
                  type="button"
                  onClick={() => {
                    setSelectedRole(role);
                    setShowRoleMenu(false);
                  }}
                  className={`w-full text-left px-3.5 py-2 text-xs font-medium hover:bg-surface-container transition-colors flex items-center justify-between ${
                    selectedRole === role ? 'text-primary font-bold bg-primary-fixed/30' : 'text-on-surface'
                  }`}
                >
                  <span>{role}</span>
                  {selectedRole === role && (
                    <span className="material-symbols-outlined text-[16px] text-primary">check</span>
                  )}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Notifications Button */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            type="button"
            className="w-9 h-9 rounded-lg hover:bg-surface-container transition-colors relative flex items-center justify-center text-on-surface-variant"
            aria-label="Notificaciones"
          >
            <span className="material-symbols-outlined text-[20px]">notifications</span>
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-error rounded-full ring-2 ring-surface" />
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 bg-surface-container-lowest rounded-xl shadow-xl border border-surface-container p-3 z-50">
              <div className="flex items-center justify-between pb-2 mb-2 border-b border-surface-container">
                <span className="text-xs font-bold text-on-surface">Notificaciones del Sistema</span>
                <span className="text-[10px] bg-error-container text-on-error-container px-2 py-0.5 rounded-full font-bold">
                  3 Nuevas
                </span>
              </div>
              <div className="flex flex-col gap-2">
                {notifications.map((n) => (
                  <div key={n.id} className="p-2 rounded-lg bg-surface-container-low text-xs flex flex-col gap-0.5">
                    <span className="text-on-surface font-medium leading-snug">{n.text}</span>
                    <span className="text-[10px] text-on-surface-variant font-mono">{n.time}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="h-6 w-px bg-outline-variant/60" />

        {/* User Profile */}
        <div className="flex items-center gap-2.5 pl-1">
          <div className="flex flex-col text-right">
            <span className="text-xs font-bold text-on-surface leading-tight">
              {userName}
            </span>
            <span className="text-[11px] text-on-surface-variant leading-tight">
              {selectedRole}
            </span>
          </div>
          <div className="relative">
            <img
              alt="Perfil"
              className="w-9 h-9 rounded-full object-cover shadow-sm ring-1 ring-primary/20"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuDyNtfsgx2nphNnCUmn5GhaMsaPDUMoSetkO0RJPRNHZ-eqFXEnosW850fAHmh6uwKMkXcCSlI1ZnIRG1rL_2VQ-h6ZgZimi63Q7axX21Ba2xRdJ5_qC3oy4BHD8K_Ihr9mqf0mL2wh4I67DJMhvn8za4LnYM10KcXNqpFOxQgjUSZL2EOpx2MIcW1Xz6mR9ase9Qc93SwfJ0zXJs22voB9ONyvmtIX3BtDRcLfLtRB7Y7fCm76-_rW_Q"
            />
            <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-secondary ring-1.5 ring-surface" />
          </div>
        </div>
      </div>
    </header>
  );
};
