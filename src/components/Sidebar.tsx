import React from 'react';

export type ActiveModule =
  | 'porteria'
  | 'ambientes'
  | 'asistencia'
  | 'usuarios'
  | 'equipos'
  | 'reportes';

interface SidebarProps {
  activeModule: ActiveModule;
  onSelectModule: (module: ActiveModule) => void;
  turnstilesOk?: boolean;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeModule,
  onSelectModule,
  turnstilesOk = true,
}) => {
  const navItems = [
    {
      id: 'porteria' as ActiveModule,
      label: 'Control de Portería & QR',
      icon: 'qr_code_scanner',
      badge: 'ACTIVO',
      badgeColor: 'bg-secondary-container text-on-secondary-container',
    },
    {
      id: 'ambientes' as ActiveModule,
      label: 'Gestión de Ambientes',
      icon: 'meeting_room',
      badge: '24',
      badgeColor: 'bg-surface-container-highest text-on-surface',
    },
    {
      id: 'asistencia' as ActiveModule,
      label: 'Control de Asistencia',
      icon: 'badge',
      sublabel: 'Sesión Activa',
    },
    {
      id: 'usuarios' as ActiveModule,
      label: 'Usuarios y Carnets',
      icon: 'id_card',
    },
    {
      id: 'equipos' as ActiveModule,
      label: 'Novedades y Equipos',
      icon: 'devices',
      badge: '3',
      badgeColor: 'bg-error-container text-on-error-container',
    },
    {
      id: 'reportes' as ActiveModule,
      label: 'Reportes y Auditoría',
      icon: 'summarize',
    },
  ];

  return (
    <aside className="fixed left-0 top-0 h-full w-64 bg-surface-container-low shadow-[0_1px_8px_rgba(0,0,0,0.04)] z-50 flex flex-col justify-between select-none">
      <div className="flex flex-col">
        {/* Brand Header */}
        <div className="h-16 flex items-center gap-2.5 px-5 bg-surface-container-low border-b border-surface-container">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-on-primary font-bold text-lg shadow-sm">
            S
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-base text-primary leading-tight tracking-tight">
              SGI Acceso
            </span>
            <span className="text-[11px] text-on-surface-variant uppercase tracking-wider font-semibold">
              Control Institucional
            </span>
          </div>
        </div>

        {/* Security Level Pill */}
        <div className="px-4 py-3">
          <div className="bg-surface-container px-3 py-1.5 rounded-lg flex items-center justify-between">
            <span className="text-[11px] text-on-surface-variant font-bold uppercase tracking-wider">
              Nivel de Seguridad
            </span>
            <span className="text-[11px] bg-secondary-container text-on-secondary-container px-2 py-0.5 rounded font-bold">
              NORMAL
            </span>
          </div>
        </div>

        {/* Navigation Category Label */}
        <div className="px-5 py-1">
          <span className="text-[11px] uppercase text-outline tracking-wider font-semibold">
            Módulos Operativos
          </span>
        </div>

        {/* Nav Links */}
        <nav className="flex flex-col gap-1 px-3 mt-1">
          {navItems.map((item) => {
            const isActive = activeModule === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onSelectModule(item.id)}
                type="button"
                className={`flex items-center justify-between px-3.5 py-2.5 rounded-lg text-sm font-semibold transition-all text-left ${
                  isActive
                    ? 'bg-primary text-on-primary shadow-sm'
                    : 'text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface'
                }`}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <span
                    className={`material-symbols-outlined text-[20px] shrink-0 ${
                      isActive ? 'text-on-primary' : 'text-on-surface-variant'
                    }`}
                  >
                    {item.icon}
                  </span>
                  <span className="truncate">{item.label}</span>
                </div>
                {item.badge && (
                  <span
                    className={`text-[11px] px-2 py-0.5 rounded-full font-bold shrink-0 ml-1.5 ${
                      isActive ? 'bg-white/20 text-white' : item.badgeColor
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Footer Hardware Status Widgets */}
      <div className="p-4 bg-surface-container-low flex flex-col gap-2 border-t border-surface-container">
        {/* RFID/NFC Reader Status */}
        <div className="bg-surface-container p-2.5 rounded-lg flex flex-col gap-1">
          <div className="flex items-center justify-between">
            <span className="text-[11px] text-on-surface-variant uppercase font-semibold">
              Lector RFID/NFC
            </span>
            <span className="text-[11px] text-secondary font-bold flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-secondary animate-pulse" />
              Listo
            </span>
          </div>
          <div className="text-[12px] text-on-surface-variant truncate font-mono">
            Puerto COM3: Conectado
          </div>
        </div>

        {/* Gateway Central Status */}
        <div className="p-2.5 rounded-lg bg-surface-container-lowest flex items-center gap-2.5 shadow-xs">
          <span className="material-symbols-outlined text-secondary text-[20px]">
            hub
          </span>
          <div className="flex flex-col min-w-0">
            <span className="text-[11px] text-on-surface font-bold">
              Gateway Central
            </span>
            <span className="text-[11px] text-on-surface-variant truncate font-mono">
              {turnstilesOk ? 'Torniquetes V-04: OK' : 'Bloqueo Preventivo'}
            </span>
          </div>
        </div>
      </div>
    </aside>
  );
};
