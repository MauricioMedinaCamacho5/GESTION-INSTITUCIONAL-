import React, { useState } from 'react';
import { TRAINING_ENVIRONMENTS } from '../../data/mockData';

export const AmbientesView: React.FC = () => {
  const [activeViewMode, setActiveViewMode] = useState<'grid' | 'timeline' | 'list'>('grid');
  const [selectedBuilding, setSelectedBuilding] = useState('Bloque A - Tecnologías TIC');
  const [searchQuery, setSearchQuery] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [verifyMessage, setVerifyMessage] = useState('0 detectados');
  const [showNewEnvModal, setShowNewEnvModal] = useState(false);
  const [showReserveModal, setShowReserveModal] = useState<string | null>(null);

  const handleVerifyConflicts = () => {
    setIsVerifying(true);
    setVerifyMessage('Analizando 42 ambientes...');
    setTimeout(() => {
      setIsVerifying(false);
      setVerifyMessage('¡Sin Cruces! (0 detectados)');
      setTimeout(() => {
        setVerifyMessage('0 detectados');
      }, 3000);
    }, 900);
  };

  const filteredEnvironments = TRAINING_ENVIRONMENTS.filter((env) => {
    return (
      env.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      env.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      env.equipmentTags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()))
    );
  });

  return (
    <div className="w-full max-w-[1536px] mx-auto px-6 py-6 flex flex-col gap-6">
      {/* Top Breadcrumb & Institutional Status Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-on-surface-variant text-xs font-semibold">
          <span className="material-symbols-outlined text-[18px] text-primary">domain_verification</span>
          <span className="hover:text-primary transition-colors cursor-pointer">SGI Campus Central</span>
          <span>/</span>
          <span className="text-on-surface font-bold">Infraestructura Frecuente</span>
          <span>/</span>
          <span className="bg-surface-container-high px-2 py-0.5 rounded text-primary font-bold">
            Bloque A &amp; Talleres
          </span>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 bg-secondary-container/40 text-on-secondary-container px-3 py-1 rounded-full text-xs font-bold">
            <span className="h-2 w-2 rounded-full bg-secondary animate-pulse" />
            <span className="uppercase tracking-wider">Cero Cruces Activos (SLA 99.98%)</span>
          </div>
          <div className="text-on-surface-variant text-xs flex items-center gap-1 font-mono">
            <span className="material-symbols-outlined text-[16px]">sync</span>
            <span>Sinc: Hace 12s</span>
          </div>
        </div>
      </div>

      {/* Section Header Block */}
      <div className="flex flex-col xl:flex-row xl:items-end justify-between gap-4 bg-surface-container-lowest p-6 rounded-xl shadow-xs border border-surface-container relative overflow-hidden">
        <div className="absolute -right-8 -top-8 w-44 h-44 rounded-full bg-gradient-to-br from-primary-fixed/20 to-secondary-fixed/20 blur-2xl pointer-events-none" />
        <div className="flex flex-col max-w-3xl">
          <div className="flex items-center gap-2 mb-1.5">
            <span className="bg-primary/10 text-primary text-[11px] px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider">
              Gestión Fiduciaria de Espacios
            </span>
            <span className="text-outline text-xs">•</span>
            <span className="text-on-surface-variant text-xs font-semibold">Periodo Lectivo 2024-II</span>
          </div>
          <h1 className="text-2xl lg:text-3xl font-bold text-on-surface tracking-tight">
            Administración de Ambientes de Formación y Espacios Físicos
          </h1>
          <p className="text-sm text-on-surface-variant mt-1 max-w-2xl">
            Monitoreo de ocupación, detección automática de cruces pedagógicos y asignación de reservas de infraestructura institucional en tiempo real.
          </p>
        </div>

        {/* Header Action Buttons */}
        <div className="flex flex-wrap items-center gap-2.5 shrink-0">
          <button
            onClick={handleVerifyConflicts}
            type="button"
            className="flex items-center gap-2 bg-surface-container-lowest hover:bg-surface-container text-on-surface font-semibold text-xs px-4 py-2.5 rounded-lg border border-surface-container shadow-xs transition-all"
          >
            <span
              className={`material-symbols-outlined text-[18px] text-secondary ${
                isVerifying ? 'animate-spin' : ''
              }`}
            >
              {isVerifying ? 'refresh' : 'verified_user'}
            </span>
            <span>Verificar Conflictos</span>
            <span className="bg-secondary-container text-on-secondary-container text-[11px] px-2 py-0.5 rounded-full font-bold">
              {verifyMessage}
            </span>
          </button>

          <button
            onClick={() => setShowNewEnvModal(true)}
            type="button"
            className="flex items-center gap-1.5 bg-primary-container hover:bg-primary text-on-primary font-bold text-xs px-4 py-2.5 rounded-lg shadow-sm transition-all active:scale-[0.98]"
          >
            <span className="material-symbols-outlined text-[18px]">add_business</span>
            <span>+ Registrar Nuevo Ambiente</span>
          </button>
        </div>
      </div>

      {/* KPI Metrics Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {/* Total Ambientes */}
        <div className="bg-surface-container-lowest p-4 rounded-xl shadow-xs border border-surface-container flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-[11px] text-on-surface-variant uppercase font-bold tracking-wider">
              Total Ambientes
            </span>
            <div className="flex items-baseline gap-1 mt-1">
              <span className="text-2xl font-bold text-on-surface font-mono">42</span>
              <span className="text-xs text-on-surface-variant">espacios</span>
            </div>
            <span className="text-[11px] text-on-surface-variant mt-1">Capacidad: 1,480 pupitres</span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-surface-container-high flex items-center justify-center text-primary shrink-0">
            <span className="material-symbols-outlined text-[26px]">domain</span>
          </div>
        </div>

        {/* Disponibles Ahora */}
        <div className="bg-surface-container-lowest p-4 rounded-xl shadow-xs border border-surface-container flex items-center justify-between">
          <div className="flex flex-col">
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-secondary" />
              <span className="text-[11px] text-secondary uppercase font-bold tracking-wider">
                Disponibles Ahora
              </span>
            </div>
            <div className="flex items-baseline gap-1 mt-1">
              <span className="text-2xl font-bold text-secondary font-mono">14</span>
              <span className="text-xs text-on-secondary-container font-semibold">33.3% libre</span>
            </div>
            <span className="text-[11px] text-on-surface-variant mt-1">Listos para asignación exprés</span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-secondary-container/40 flex items-center justify-center text-secondary shrink-0">
            <span className="material-symbols-outlined text-[26px]">door_front</span>
          </div>
        </div>

        {/* En Clase Activa */}
        <div className="bg-surface-container-lowest p-4 rounded-xl shadow-xs border border-surface-container flex items-center justify-between">
          <div className="flex flex-col">
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              <span className="text-[11px] text-primary uppercase font-bold tracking-wider">
                En Clase Activa
              </span>
            </div>
            <div className="flex items-baseline gap-1 mt-1">
              <span className="text-2xl font-bold text-primary font-mono">24</span>
              <span className="text-xs text-primary font-bold">57.1% uso</span>
            </div>
            <span className="text-[11px] text-on-surface-variant mt-1">782 estudiantes presentes</span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-primary-fixed flex items-center justify-center text-primary shrink-0">
            <span className="material-symbols-outlined text-[26px]">school</span>
          </div>
        </div>

        {/* En Mantenimiento */}
        <div className="bg-surface-container-lowest p-4 rounded-xl shadow-xs border border-surface-container flex items-center justify-between">
          <div className="flex flex-col">
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-tertiary" />
              <span className="text-[11px] text-tertiary uppercase font-bold tracking-wider">
                En Mantenimiento
              </span>
            </div>
            <div className="flex items-baseline gap-1 mt-1">
              <span className="text-2xl font-bold text-tertiary font-mono">4</span>
              <span className="text-xs text-tertiary font-bold">9.5% bloqueo</span>
            </div>
            <span className="text-[11px] text-on-surface-variant mt-1">2 con finalización hoy</span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-tertiary-fixed flex items-center justify-center text-tertiary shrink-0">
            <span className="material-symbols-outlined text-[26px]">build</span>
          </div>
        </div>
      </div>

      {/* Filter & Workspace Toolbar */}
      <div className="bg-surface-container-lowest p-3.5 rounded-xl shadow-xs border border-surface-container flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
        {/* Left Filters */}
        <div className="flex flex-wrap items-center gap-2.5 flex-1">
          {/* Building Selector */}
          <div className="relative min-w-[240px]">
            <select
              value={selectedBuilding}
              onChange={(e) => setSelectedBuilding(e.target.value)}
              className="w-full bg-surface text-on-surface text-xs font-semibold pl-9 pr-8 py-2 rounded-lg border border-surface-container focus:outline-none focus:ring-1 focus:ring-primary appearance-none cursor-pointer"
            >
              <option>Bloque A - Tecnologías TIC</option>
              <option>Bloque B - Ciencias Básicas</option>
              <option>Bloque C - Talleres Especiales</option>
              <option>Auditorios y Salas Magistrales</option>
            </select>
            <span className="material-symbols-outlined text-[18px] text-on-surface-variant absolute left-2.5 top-2 pointer-events-none">
              apartment
            </span>
            <span className="material-symbols-outlined text-[18px] text-on-surface-variant absolute right-2.5 top-2 pointer-events-none">
              arrow_drop_down
            </span>
          </div>

          {/* Date Picker Representation */}
          <div className="flex items-center bg-surface px-3 py-2 rounded-lg gap-2 border border-surface-container">
            <span className="material-symbols-outlined text-[18px] text-primary">calendar_month</span>
            <span className="text-xs text-on-surface font-semibold">Jueves, 24 de Octubre</span>
            <span className="bg-surface-container-high text-[10px] text-on-surface px-1.5 py-0.5 rounded font-bold">
              HOY
            </span>
          </div>

          {/* Search Input */}
          <div className="relative flex-1 min-w-[260px]">
            <input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-surface text-on-surface placeholder-on-surface-variant text-xs pl-9 pr-3 py-2 rounded-lg border border-surface-container focus:outline-none focus:ring-1 focus:ring-primary"
              placeholder="Buscar por código de ambiente, capacidad o equipamiento..."
              type="text"
            />
            <span className="material-symbols-outlined text-[18px] text-on-surface-variant absolute left-2.5 top-2">
              search
            </span>
          </div>
        </div>

        {/* Right View Mode Switches */}
        <div className="flex items-center gap-1 bg-surface-container-low p-1 rounded-lg border border-surface-container">
          <button
            onClick={() => setActiveViewMode('grid')}
            type="button"
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-bold transition-all ${
              activeViewMode === 'grid'
                ? 'bg-surface-container-lowest text-primary shadow-xs'
                : 'text-on-surface-variant hover:text-on-surface'
            }`}
          >
            <span className="material-symbols-outlined text-[18px]">grid_view</span>
            <span>Cuadrícula</span>
          </button>
          <button
            onClick={() => setActiveViewMode('timeline')}
            type="button"
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-bold transition-all ${
              activeViewMode === 'timeline'
                ? 'bg-surface-container-lowest text-primary shadow-xs'
                : 'text-on-surface-variant hover:text-on-surface'
            }`}
          >
            <span className="material-symbols-outlined text-[18px]">view_timeline</span>
            <span>Matriz Horaria</span>
          </button>
          <button
            onClick={() => setActiveViewMode('list')}
            type="button"
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-bold transition-all ${
              activeViewMode === 'list'
                ? 'bg-surface-container-lowest text-primary shadow-xs'
                : 'text-on-surface-variant hover:text-on-surface'
            }`}
          >
            <span className="material-symbols-outlined text-[18px]">view_list</span>
            <span>Lista Ambientes</span>
          </button>
        </div>
      </div>

      {/* Main Ambientes Grid (6 Distinct Context Cards) */}
      {(activeViewMode === 'grid' || activeViewMode === 'list') && (
        <div
          className={
            activeViewMode === 'grid'
              ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
              : 'flex flex-col gap-4'
          }
        >
          {filteredEnvironments.map((env) => {
            const isClass = env.status === 'EN CLASE ACTIVA';
            const isAvailable = env.status === 'DISPONIBLE';
            const isMaint = env.status === 'EN MANTENIMIENTO';
            const isReserved = env.status === 'RESERVADO';

            return (
              <div
                key={env.id}
                className="bg-surface-container-lowest rounded-xl shadow-xs border border-surface-container hover:shadow-md transition-all flex flex-col justify-between overflow-hidden relative group"
              >
                {/* Colored edge indicator */}
                <div
                  className={`absolute left-0 top-0 bottom-0 w-1.5 ${
                    isClass
                      ? 'bg-primary'
                      : isAvailable
                      ? 'bg-secondary'
                      : isMaint
                      ? 'bg-tertiary'
                      : 'bg-primary-container'
                  }`}
                />

                <div className="p-5 pl-6 flex flex-col gap-3">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex flex-col">
                      <span className="text-[11px] text-on-surface-variant font-bold uppercase tracking-wider">
                        {env.location}
                      </span>
                      <h2 className="text-base font-bold text-on-surface group-hover:text-primary transition-colors">
                        {env.name}
                      </h2>
                    </div>

                    <span
                      className={`text-[10px] font-bold px-2.5 py-1 rounded-full flex items-center gap-1.5 ${
                        isClass
                          ? 'bg-primary-fixed text-on-primary-fixed'
                          : isAvailable
                          ? 'bg-secondary-container text-on-secondary-container'
                          : isMaint
                          ? 'bg-tertiary-fixed text-on-tertiary-fixed'
                          : 'bg-surface-container-highest text-primary'
                      }`}
                    >
                      <span
                        className={`h-2 w-2 rounded-full ${
                          isClass
                            ? 'bg-primary animate-pulse'
                            : isAvailable
                            ? 'bg-secondary'
                            : isMaint
                            ? 'bg-tertiary'
                            : 'bg-primary'
                        }`}
                      />
                      {env.status}
                    </span>
                  </div>

                  {/* Capacity and quick metrics */}
                  <div className="flex items-center gap-4 py-0.5 text-xs">
                    <div className="flex items-center gap-1 text-on-surface-variant">
                      <span className="material-symbols-outlined text-[16px] text-primary">groups</span>
                      <span>
                        Capacidad: <strong className="text-on-surface">{env.capacity} estudiantes</strong>
                      </span>
                    </div>
                    {env.currentAttendance && (
                      <div className="flex items-center gap-1 text-on-surface-variant">
                        <span className="material-symbols-outlined text-[16px] text-secondary">sensors</span>
                        <span>
                          Aforo: <strong className="text-secondary">{env.currentAttendance} / {env.capacity}</strong>
                        </span>
                      </div>
                    )}
                    {isAvailable && (
                      <span className="bg-secondary-fixed/50 text-on-secondary-fixed text-[10px] px-2 py-0.5 rounded font-bold">
                        Desocupada 45m
                      </span>
                    )}
                    {isMaint && (
                      <span className="bg-tertiary-container/20 text-tertiary-container text-[10px] px-2 py-0.5 rounded font-bold">
                        Bloqueo OT-994
                      </span>
                    )}
                  </div>

                  {/* Academic Session / Details Block */}
                  <div className="bg-surface-container-low p-3 rounded-lg flex flex-col gap-1 border border-surface-container">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] text-on-surface-variant font-bold uppercase">
                        {isMaint ? 'Novedad Técnica' : isReserved ? 'Evento Magistral' : 'Materia / Ficha'}
                      </span>
                      {env.scheduleTime && (
                        <span className="text-[11px] text-primary font-bold flex items-center gap-1">
                          <span className="material-symbols-outlined text-[13px]">schedule</span>
                          {env.scheduleTime}
                        </span>
                      )}
                      {env.nextSubjectTime && (
                        <span className="text-[11px] text-on-surface-variant font-semibold">
                          {env.nextSubjectTime}
                        </span>
                      )}
                    </div>

                    <span className="text-xs font-bold text-on-surface">
                      {env.currentSubject || env.nextSubjectNotice || env.eventTitle || env.maintenanceReason}
                    </span>

                    {env.instructor && (
                      <div className="flex items-center gap-1.5 mt-1 text-on-surface-variant text-[11px]">
                        <span className="material-symbols-outlined text-[15px]">person</span>
                        <span>
                          Responsable: <strong className="text-on-surface font-medium">{env.instructor}</strong>
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Equipment Tags */}
                  <div className="flex flex-wrap items-center gap-1.5 pt-1">
                    {env.equipmentTags.map((tag, idx) => (
                      <span
                        key={idx}
                        className="bg-surface-container px-2 py-0.5 rounded text-on-surface-variant text-[10px] font-medium"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Footer Card Operations */}
                <div className="bg-surface-container-lowest px-5 pl-6 py-3 border-t border-surface-container flex items-center justify-between text-xs">
                  {isAvailable ? (
                    <>
                      <span className="text-[11px] text-secondary font-bold flex items-center gap-1">
                        <span className="material-symbols-outlined text-[15px]">lock_open</span>
                        {env.doorStatus || 'Puerta Desbloqueada'}
                      </span>
                      <button
                        onClick={() => setShowReserveModal(env.name)}
                        type="button"
                        className="bg-secondary-container hover:bg-secondary hover:text-on-secondary text-on-secondary-container text-xs font-bold px-3 py-1.5 rounded-lg transition-all flex items-center gap-1"
                      >
                        <span className="material-symbols-outlined text-[16px]">flash_on</span>
                        <span>Asignar Reserva Inmediata</span>
                      </button>
                    </>
                  ) : isMaint ? (
                    <>
                      <span className="text-[11px] text-tertiary font-bold">{env.maintenanceEnd}</span>
                      <button
                        onClick={() => alert(`Detalle técnico de OT-994 en ${env.name}`)}
                        type="button"
                        className="text-on-surface hover:bg-surface-container font-bold px-2.5 py-1 rounded transition-colors flex items-center gap-1 text-[11px]"
                      >
                        <span>Ver Novedad</span>
                        <span className="material-symbols-outlined text-[15px]">open_in_new</span>
                      </button>
                    </>
                  ) : (
                    <>
                      <span className="text-[11px] text-on-surface-variant truncate max-w-[200px]">
                        {env.nextSubjectNotice || 'Sesión en desarrollo'}
                      </span>
                      <button
                        onClick={() => alert(`Bitácora de aforo y torniquetes para ${env.name}`)}
                        type="button"
                        className="text-primary hover:bg-surface-container font-bold px-2.5 py-1 rounded transition-colors flex items-center gap-1 text-xs"
                      >
                        <span>Bitácora</span>
                        <span className="material-symbols-outlined text-[16px]">chevron_right</span>
                      </button>
                    </>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Interactive Timeline & Weekly Schedule Matrix (06:00 to 22:00) */}
      {(activeViewMode === 'timeline' || activeViewMode === 'grid') && (
        <div className="bg-surface-container-lowest p-6 rounded-xl shadow-xs border border-surface-container flex flex-col gap-4">
          {/* Timeline Header & Controls */}
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-primary-fixed flex items-center justify-center text-primary shrink-0">
                <span className="material-symbols-outlined text-[24px]">view_timeline</span>
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-2">
                  <h2 className="text-base font-bold text-on-surface">
                    Matriz Horaria Semanal &amp; Bloqueador de Cruces
                  </h2>
                  <span className="bg-secondary-container text-on-secondary-container text-[11px] px-2 py-0.5 rounded font-bold">
                    Tiempo Real
                  </span>
                </div>
                <p className="text-xs text-on-surface-variant">
                  Franja horaria académica continua (06:00 - 22:00) con resolución de colisiones y validación de doble asignación docente.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {/* Conflict Guard badge */}
              <div className="bg-surface-container-low px-3 py-1.5 rounded-lg flex items-center gap-2 text-on-surface-variant text-xs border border-surface-container">
                <span className="material-symbols-outlined text-[16px] text-secondary">shield_lock</span>
                <span className="font-bold text-on-surface">Algoritmo Anti-Cruce:</span>
                <span className="text-secondary font-bold">ACTIVO</span>
              </div>

              {/* Legend */}
              <div className="hidden xl:flex items-center gap-3 text-xs text-on-surface-variant pl-2 font-medium">
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-sm bg-primary" /> Clase Activa
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-sm bg-secondary" /> Libre
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-sm bg-tertiary" /> Mantto.
                </span>
              </div>
            </div>
          </div>

          {/* Schedule Visualizer Container with Horizontal Scroll */}
          <div className="overflow-x-auto pb-2">
            <div className="min-w-[1100px] flex flex-col">
              {/* Hours Header Bar */}
              <div className="grid grid-cols-17 gap-1 text-center bg-surface-container-low py-2 px-2 rounded-lg text-[11px] text-on-surface-variant font-bold border border-surface-container font-mono">
                <div className="text-left pl-2 font-sans font-semibold">Ambiente / Franja</div>
                <div>06:00</div>
                <div>07:00</div>
                <div>08:00</div>
                <div>09:00</div>
                <div>10:00</div>
                <div>11:00</div>
                <div>12:00</div>
                <div>13:00</div>
                <div>14:00</div>
                <div>15:00</div>
                <div>16:00</div>
                <div>17:00</div>
                <div>18:00</div>
                <div>19:00</div>
                <div>20:00</div>
                <div>21:00</div>
              </div>

              {/* Schedule Rows */}
              <div className="relative w-full flex flex-col gap-2 mt-2">
                {/* Row 1: Lab TIC 302 */}
                <div className="grid grid-cols-17 gap-1 items-center bg-surface-container-lowest hover:bg-surface-container-low/50 transition-colors p-1 rounded-lg border border-surface-container">
                  <div className="flex flex-col pl-2">
                    <span className="text-xs text-on-surface font-bold">TIC 302</span>
                    <span className="text-[10px] text-on-surface-variant font-mono">Cap. 35</span>
                  </div>
                  <div className="col-span-1 h-8 rounded bg-surface-container flex items-center justify-center text-[10px] text-on-surface-variant font-medium">
                    Libre
                  </div>
                  <div className="col-span-3 h-8 rounded bg-primary-container text-on-primary flex items-center justify-between px-2 text-[10px] font-bold truncate shadow-xs">
                    <span className="truncate">MySQL 258901</span>
                    <span className="material-symbols-outlined text-[13px]">lock</span>
                  </div>
                  <div className="col-span-3 h-8 rounded bg-primary text-on-primary flex items-center justify-between px-2 text-[10px] font-bold truncate shadow-xs">
                    <span className="truncate">Redes Distribuidas</span>
                  </div>
                  <div className="col-span-2 h-8 rounded bg-secondary-container/40 text-on-secondary-container flex items-center justify-center text-[10px] font-bold">
                    Disponible
                  </div>
                  <div className="col-span-4 h-8 rounded bg-primary-container/90 text-on-primary flex items-center justify-center px-2 text-[10px] font-bold truncate">
                    Arquitectura Cloud (Ficha 259012)
                  </div>
                  <div className="col-span-3 h-8 rounded bg-surface-container flex items-center justify-center text-[10px] text-on-surface-variant font-medium">
                    Sin Asignar
                  </div>
                </div>

                {/* Row 2: Aula Polivalente 204 */}
                <div className="grid grid-cols-17 gap-1 items-center bg-surface-container-lowest hover:bg-surface-container-low/50 transition-colors p-1 rounded-lg border border-surface-container">
                  <div className="flex flex-col pl-2">
                    <span className="text-xs text-on-surface font-bold">Aula 204</span>
                    <span className="text-[10px] text-on-surface-variant font-mono">Cap. 40</span>
                  </div>
                  <div className="col-span-4 h-8 rounded bg-secondary-container text-on-secondary-container flex items-center justify-center text-[10px] font-bold shadow-xs">
                    Disponible (Reserva Rápida)
                  </div>
                  <div className="col-span-3 h-8 rounded bg-primary text-on-primary flex items-center justify-between px-2 text-[10px] font-bold truncate shadow-xs">
                    <span className="truncate">Redes Com. (10-13)</span>
                  </div>
                  <div className="col-span-2 h-8 rounded bg-surface-container flex items-center justify-center text-[10px] text-on-surface-variant font-medium">
                    Almuerzo
                  </div>
                  <div className="col-span-4 h-8 rounded bg-primary-container text-on-primary flex items-center justify-center px-2 text-[10px] font-bold truncate">
                    Seminario Big Data
                  </div>
                  <div className="col-span-3 h-8 rounded bg-secondary-container/30 text-on-secondary-container flex items-center justify-center text-[10px] font-bold">
                    Disponible
                  </div>
                </div>

                {/* Row 3: Taller de Electrónica 101 */}
                <div className="grid grid-cols-17 gap-1 items-center bg-surface-container-lowest hover:bg-surface-container-low/50 transition-colors p-1 rounded-lg border border-surface-container">
                  <div className="flex flex-col pl-2">
                    <span className="text-xs text-on-surface font-bold">Taller 101</span>
                    <span className="text-[10px] text-on-surface-variant font-mono">Cap. 25</span>
                  </div>
                  <div className="col-span-8 h-8 rounded bg-tertiary-fixed text-on-tertiary-fixed flex items-center justify-between px-3 text-[10px] font-bold shadow-xs">
                    <span className="flex items-center gap-1.5 truncate">
                      <span className="material-symbols-outlined text-[15px] text-tertiary">build</span>
                      Mantenimiento Preventivo (OT-994)
                    </span>
                    <span className="bg-tertiary text-on-tertiary text-[9px] px-1.5 py-0.5 rounded font-bold">
                      BLOQUEADO
                    </span>
                  </div>
                  <div className="col-span-1 h-8 rounded bg-secondary-container/40 text-on-secondary-container flex items-center justify-center text-[10px] font-bold">
                    Entrega
                  </div>
                  <div className="col-span-4 h-8 rounded bg-primary-container text-on-primary flex items-center justify-center px-2 text-[10px] font-bold truncate">
                    Circuitos Digitales II
                  </div>
                  <div className="col-span-3 h-8 rounded bg-primary text-on-primary flex items-center justify-center px-2 text-[10px] font-bold truncate">
                    Robótica Básica
                  </div>
                </div>

                {/* Row 4: Lab Móvil 305 */}
                <div className="grid grid-cols-17 gap-1 items-center bg-surface-container-lowest hover:bg-surface-container-low/50 transition-colors p-1 rounded-lg border border-surface-container">
                  <div className="flex flex-col pl-2">
                    <span className="text-xs text-on-surface font-bold">Móvil 305</span>
                    <span className="text-[10px] text-on-surface-variant font-mono">Cap. 30</span>
                  </div>
                  <div className="col-span-2 h-8 rounded bg-surface-container flex items-center justify-center text-[10px] text-on-surface-variant font-medium">
                    Libre
                  </div>
                  <div className="col-span-3 h-8 rounded bg-primary-container text-on-primary flex items-center justify-between px-2 text-[10px] font-bold truncate shadow-xs">
                    <span className="truncate">React Native 267014</span>
                  </div>
                  <div className="col-span-1 h-8 rounded bg-secondary-container/40 text-on-secondary-container flex items-center justify-center text-[10px] font-bold">
                    Libre
                  </div>
                  <div className="col-span-3 h-8 rounded bg-primary text-on-primary flex items-center justify-center px-2 text-[10px] font-bold truncate">
                    UI/UX Figma Lab
                  </div>
                  <div className="col-span-4 h-8 rounded bg-primary-container/80 text-on-primary flex items-center justify-center px-2 text-[10px] font-bold truncate">
                    Testing Automatizado Móvil
                  </div>
                  <div className="col-span-3 h-8 rounded bg-surface-container flex items-center justify-center text-[10px] text-on-surface-variant font-medium">
                    Disponible
                  </div>
                </div>

                {/* Row 5: Auditorio Principal */}
                <div className="grid grid-cols-17 gap-1 items-center bg-surface-container-lowest hover:bg-surface-container-low/50 transition-colors p-1 rounded-lg border border-surface-container">
                  <div className="flex flex-col pl-2">
                    <span className="text-xs text-on-surface font-bold">Auditorio A</span>
                    <span className="text-[10px] text-on-surface-variant font-mono">Cap. 180</span>
                  </div>
                  <div className="col-span-4 h-8 rounded bg-surface-container-highest text-primary flex items-center justify-center text-[10px] font-bold">
                    Montaje Técnico
                  </div>
                  <div className="col-span-2 h-8 rounded bg-surface-container flex items-center justify-center text-[10px] text-on-surface-variant font-medium">
                    Pruebas Sonido
                  </div>
                  <div className="col-span-6 h-8 rounded bg-primary text-on-primary flex items-center justify-between px-3 text-[10px] font-bold shadow-xs">
                    <span className="truncate">Jornada Institucional de Ciberseguridad (14:00 - 20:00)</span>
                    <span className="material-symbols-outlined text-[15px]">podium</span>
                  </div>
                  <div className="col-span-4 h-8 rounded bg-surface-container flex items-center justify-center text-[10px] text-on-surface-variant font-medium">
                    Cierre Protocolario
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Schedule Action bar and Conflict Checker Info */}
          <div className="bg-surface-container-low p-4 rounded-xl flex flex-col md:flex-row items-center justify-between gap-3 border border-surface-container mt-1">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-secondary-container text-on-secondary-container flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-[20px]">check_circle</span>
              </div>
              <div className="flex flex-col">
                <span className="text-xs text-on-surface font-bold">
                  Validación de Cruces Académicos Satisfactoria
                </span>
                <span className="text-[11px] text-on-surface-variant">
                  No existen cruces de fichas pedagógicas, instructores duplicados ni bloqueos físicos en la programación actual.
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => alert('Generando archivo PDF con la matriz horaria completa institucional...')}
                type="button"
                className="bg-surface-container-lowest hover:bg-surface-container text-on-surface text-xs font-semibold px-4 py-2 rounded-lg border border-surface-container transition-colors"
              >
                Descargar PDF Matriz
              </button>
              <button
                onClick={() => alert('Programación publicada exitosamente para todas las fichas y porterías.')}
                type="button"
                className="bg-primary hover:bg-primary-container text-on-primary text-xs font-bold px-4 py-2 rounded-lg transition-colors flex items-center gap-1.5 shadow-xs"
              >
                <span className="material-symbols-outlined text-[18px]">publish</span>
                <span>Publicar Programación</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Asignar Reserva Inmediata */}
      {showReserveModal && (
        <div className="fixed inset-0 z-50 bg-inverse-surface/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-surface-container-lowest rounded-2xl max-w-md w-full p-6 shadow-2xl border border-surface-container flex flex-col gap-4 animate-in fade-in">
            <div className="flex items-center justify-between border-b border-surface-container pb-3">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-[24px]">flash_on</span>
                <h3 className="text-base font-bold text-on-surface">Reserva Inmediata: {showReserveModal}</h3>
              </div>
              <button
                onClick={() => setShowReserveModal(null)}
                className="text-on-surface-variant hover:text-on-surface"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>
            <p className="text-xs text-on-surface-variant">
              Asignación exprés por contingencia o clase extraordinaria autorizada por coordinación.
            </p>
            <div className="flex flex-col gap-2">
              <label className="text-[11px] font-bold text-on-surface-variant uppercase">
                Instructor Solicitante
              </label>
              <input
                className="px-3 py-2 bg-surface rounded-lg text-xs border border-surface-container font-medium"
                defaultValue="Ing. Carlos Mendoza (Admin / Operaciones)"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-[11px] font-bold text-on-surface-variant uppercase">
                Ficha Académica / Actividad
              </label>
              <input
                className="px-3 py-2 bg-surface rounded-lg text-xs border border-surface-container font-medium"
                placeholder="Ej. Ficha 267014 - Práctica Especial"
              />
            </div>
            <div className="flex items-center justify-end gap-2 pt-2 border-t border-surface-container">
              <button
                onClick={() => setShowReserveModal(null)}
                className="px-4 py-2 rounded-lg bg-surface-container text-xs font-semibold hover:bg-surface-container-high"
              >
                Cancelar
              </button>
              <button
                onClick={() => {
                  alert(`Reserva de ${showReserveModal} confirmada.`);
                  setShowReserveModal(null);
                }}
                className="px-4 py-2 rounded-lg bg-secondary text-on-secondary text-xs font-bold shadow-xs hover:bg-secondary/90"
              >
                Confirmar Reserva
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Registrar Nuevo Ambiente */}
      {showNewEnvModal && (
        <div className="fixed inset-0 z-50 bg-inverse-surface/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-surface-container-lowest rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-surface-container flex flex-col gap-4 animate-in fade-in">
            <div className="flex items-center justify-between border-b border-surface-container pb-3">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-[24px]">add_business</span>
                <h3 className="text-base font-bold text-on-surface">Registrar Nuevo Ambiente de Formación</h3>
              </div>
              <button
                onClick={() => setShowNewEnvModal(false)}
                className="text-on-surface-variant hover:text-on-surface"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="flex flex-col gap-1">
                <label className="text-[11px] font-bold text-on-surface-variant uppercase">Nombre Ambiente</label>
                <input
                  className="px-3 py-2 bg-surface rounded-lg text-xs border border-surface-container"
                  placeholder="Ej. Laboratorio de IA 401"
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-[11px] font-bold text-on-surface-variant uppercase">Código Corto</label>
                <input
                  className="px-3 py-2 bg-surface rounded-lg text-xs border border-surface-container font-mono"
                  placeholder="Ej. LAB-IA-401"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="flex flex-col gap-1">
                <label className="text-[11px] font-bold text-on-surface-variant uppercase">Ubicación / Piso</label>
                <input
                  className="px-3 py-2 bg-surface rounded-lg text-xs border border-surface-container"
                  placeholder="Bloque A • Piso 4"
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-[11px] font-bold text-on-surface-variant uppercase">Capacidad Máxima</label>
                <input
                  className="px-3 py-2 bg-surface rounded-lg text-xs border border-surface-container"
                  placeholder="30 pupitres"
                  type="number"
                />
              </div>
            </div>
            <div className="flex items-center justify-end gap-2 pt-2 border-t border-surface-container">
              <button
                onClick={() => setShowNewEnvModal(false)}
                className="px-4 py-2 rounded-lg bg-surface-container text-xs font-semibold hover:bg-surface-container-high"
              >
                Cancelar
              </button>
              <button
                onClick={() => {
                  alert('Nuevo ambiente registrado e indexado en el algoritmo anti-cruces.');
                  setShowNewEnvModal(false);
                }}
                className="px-4 py-2 rounded-lg bg-primary text-on-primary text-xs font-bold shadow-xs hover:bg-primary-container"
              >
                Guardar Ambiente
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
