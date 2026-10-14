import React, { useState, useEffect } from 'react';
import { INITIAL_ACCESS_LOGS, AccessEvent } from '../../data/mockData';

export const PorteriaView: React.FC = () => {
  const [accessLogs, setAccessLogs] = useState<AccessEvent[]>(INITIAL_ACCESS_LOGS);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDoor, setSelectedDoor] = useState('Principal Norte');
  const [selectedRole, setSelectedRole] = useState('Todos');
  const [docQuery, setDocQuery] = useState('1036982410');
  const [emergencyLock, setEmergencyLock] = useState(false);
  const [actionFeedback, setActionFeedback] = useState<string | null>(null);
  const [flashlight, setFlashlight] = useState(false);
  const [cameraFlipped, setCameraFlipped] = useState(false);

  // Active user previewed
  const [currentUser, setCurrentUser] = useState({
    name: 'Valentina Restrepo Giraldo',
    doc: '1.036.982.410',
    role: 'ESTUDIANTE',
    program: 'Tecnología en Desarrollo de Software - Ficha 267014 (Jornada Mañana)',
    photo: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAW2bl7t4zaAY0z7mG0kX3fZ49i7-Rd7RBeGYYFccDuMsXvl9OLCOQe9SAOng69jf12jxTx1lkSbGFt9xX7JywGZAjLMBcBVNltme7BgWrWK-keJ4Ej1BPX3qgkblN_oMOR8LQ5j0RWJwUxp_MMVMfsuTqqN5SyK7GDIzDYv2RmM9yrrZdyaEGo3AwwCNb8P47EGebWfjC8scg_XVKO8WpyNX9MwSbuzp4fOYL0P3ls5QQwmObaLNg9vw',
    academicStatus: 'Matrícula Vigente 2025-1',
    lastEvent: 'Ayer 18:22 (Salida)',
    laptopModel: 'Lenovo ThinkPad E14 Gen 4',
    laptopSerial: '#LNV-99214',
    laptopVerified: true,
    authCode: '#892-04',
  });

  const handleRegisterAccess = (type: 'Ingreso' | 'Salida') => {
    if (emergencyLock) {
      alert('¡ALERTA DE SEGURIDAD! Los torniquetes se encuentran en BLOQUEO PREVENTIVO. Debe desactivar el bloqueo para habilitar el paso.');
      return;
    }

    const now = new Date();
    const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });

    const newLog: AccessEvent = {
      id: 'ev-' + Date.now(),
      time: timeStr,
      userName: currentUser.name,
      userDoc: `CC ${currentUser.doc}`,
      role: currentUser.role as any,
      programOrDept: 'Tecnología en Software',
      destination: 'Lab TIC 302',
      equipment: currentUser.laptopModel,
      avatarUrl: currentUser.photo,
      result: type === 'Ingreso' ? 'INGRESO EXITOSO' : 'SALIDA VERIFICADA',
    };

    setAccessLogs([newLog, ...accessLogs]);
    setActionFeedback(`${type} registrado con éxito. Torniquete desbloqueado para ${currentUser.name}`);
    setTimeout(() => setActionFeedback(null), 3500);
  };

  const handleConsultar = () => {
    if (docQuery.includes('71') || docQuery.toLowerCase().includes('camilo')) {
      setCurrentUser({
        name: 'Camilo Andrés Torres',
        doc: '71.394.021',
        role: 'INSTRUCTOR',
        program: 'Coordinación Académica - Redes y Datos',
        photo: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDdfwl4UT_p5W5ojP8tOZ1gTksXhD6F_KTWGUUAuDofxVj5AOFQJKmTCD2rFqhePwr3I7cua4A15krrg-KOs04C6oOn5U6gRrJ53YiApYD3amLHJghCt64zHRQU0mJyX42mWcxHVQ38moTB2aJP0hgkl20ieSBWgJ0Os446FFMLopR7eRvDCmFC66CxE8HQ0QEGKJWotz-n1YOVo5Prx5sqDQhXAvIV5b3Ijt7gNgQ1VcXYPK0phvwXRg',
        academicStatus: 'Planta Docente Activa',
        lastEvent: 'Hoy 07:45 (Ingreso)',
        laptopModel: 'Dell Latitude 5530',
        laptopSerial: '#DLL-44091',
        laptopVerified: true,
        authCode: '#892-05',
      });
    } else {
      setCurrentUser({
        name: 'Valentina Restrepo Giraldo',
        doc: '1.036.982.410',
        role: 'ESTUDIANTE',
        program: 'Tecnología en Desarrollo de Software - Ficha 267014 (Jornada Mañana)',
        photo: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAW2bl7t4zaAY0z7mG0kX3fZ49i7-Rd7RBeGYYFccDuMsXvl9OLCOQe9SAOng69jf12jxTx1lkSbGFt9xX7JywGZAjLMBcBVNltme7BgWrWK-keJ4Ej1BPX3qgkblN_oMOR8LQ5j0RWJwUxp_MMVMfsuTqqN5SyK7GDIzDYv2RmM9yrrZdyaEGo3AwwCNb8P47EGebWfjC8scg_XVKO8WpyNX9MwSbuzp4fOYL0P3ls5QQwmObaLNg9vw',
        academicStatus: 'Matrícula Vigente 2025-1',
        lastEvent: 'Ayer 18:22 (Salida)',
        laptopModel: 'Lenovo ThinkPad E14 Gen 4',
        laptopSerial: '#LNV-99214',
        laptopVerified: true,
        authCode: '#892-04',
      });
    }
  };

  // Keyboard shortcut listener for Enter
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Enter' && (e.target as HTMLElement).tagName !== 'INPUT') {
        handleRegisterAccess('Ingreso');
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentUser, emergencyLock]);

  const filteredLogs = accessLogs.filter((log) => {
    const matchesSearch =
      log.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.userDoc.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.destination.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = selectedRole === 'Todos' || log.role === selectedRole;
    return matchesSearch && matchesRole;
  });

  return (
    <div className="flex flex-col w-full max-w-[1536px] mx-auto px-6 py-6 gap-6">
      {/* Toast Notification */}
      {actionFeedback && (
        <div className="fixed top-20 right-8 z-50 bg-inverse-surface text-inverse-on-surface px-4 py-3 rounded-xl shadow-2xl flex items-center gap-3 border border-secondary animate-in fade-in slide-in-from-top-2">
          <span className="material-symbols-outlined text-secondary-fixed text-[22px]">check_circle</span>
          <span className="text-xs font-semibold">{actionFeedback}</span>
        </div>
      )}

      {/* Top Action / Context Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <span className="text-[11px] bg-primary-fixed text-on-primary-fixed px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider">
              Terminal Operativo V-4.2
            </span>
            <span className="text-[11px] text-on-surface-variant flex items-center gap-1 font-semibold">
              <span className="material-symbols-outlined text-[15px] text-secondary">verified</span>
              Cifrado TLS v1.3
            </span>
          </div>
          <h1 className="text-2xl lg:text-3xl font-bold text-primary tracking-tight">
            Módulo de Portería y Control de Acceso
          </h1>
          <p className="text-sm text-on-surface-variant">
            Validación biométrica/QR, control de equipos portátiles y bitácora institucional en tiempo real.
          </p>
        </div>

        {/* Emergency & Terminal Mode Bar */}
        <div className="flex items-center gap-3 flex-wrap">
          <div className="flex items-center bg-surface-container-low px-4 py-2 rounded-lg gap-3 shadow-xs border border-surface-container">
            <span className="material-symbols-outlined text-secondary text-[20px]">door_sliding</span>
            <div className="flex flex-col">
              <span className="text-[10px] text-on-surface-variant uppercase font-semibold">
                Torniquete #1
              </span>
              <span className="text-xs text-on-surface font-bold">
                {emergencyLock ? 'BLOQUEADO' : 'Desbloqueo Auto'}
              </span>
            </div>
          </div>

          <button
            onClick={() => setEmergencyLock(!emergencyLock)}
            type="button"
            className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs font-bold transition-all shadow-sm ${
              emergencyLock
                ? 'bg-on-error-container text-white ring-2 ring-error'
                : 'bg-error text-on-error hover:bg-error/90'
            }`}
          >
            <span className="material-symbols-outlined text-[18px]">
              {emergencyLock ? 'lock_open' : 'lock'}
            </span>
            <span>{emergencyLock ? 'Restablecer Paso' : 'Bloqueo Preventivo'}</span>
          </button>
        </div>
      </div>

      {/* Main 12-Column Responsive Split */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* LEFT COLUMN: Terminal Scanner & Active Verification Result (5 cols) */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          {/* Interactive Scanner Card */}
          <div className="bg-surface-container-lowest rounded-xl shadow-xs border border-surface-container p-4 flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-secondary animate-pulse" />
                <span className="text-base font-bold text-on-surface">Lector Óptico QR</span>
                <span className="text-[11px] bg-surface-container-high text-on-surface-variant px-2 py-0.5 rounded font-mono font-bold">
                  1080p 60fps
                </span>
              </div>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setCameraFlipped(!cameraFlipped)}
                  type="button"
                  className={`p-1.5 rounded-lg hover:bg-surface-container transition-colors text-on-surface-variant ${
                    cameraFlipped ? 'rotate-180 text-primary' : ''
                  }`}
                  title="Cambiar Cámara"
                >
                  <span className="material-symbols-outlined text-[18px]">flip_camera_ios</span>
                </button>
                <button
                  onClick={() => setFlashlight(!flashlight)}
                  type="button"
                  className={`p-1.5 rounded-lg hover:bg-surface-container transition-colors ${
                    flashlight ? 'bg-tertiary-fixed text-on-tertiary-fixed' : 'text-on-surface-variant'
                  }`}
                  title="Iluminación Flash"
                >
                  <span className="material-symbols-outlined text-[18px]">
                    {flashlight ? 'flashlight_off' : 'flashlight_on'}
                  </span>
                </button>
              </div>
            </div>

            {/* Video Viewport Mockup */}
            <div className="relative w-full aspect-[4/3] bg-inverse-surface rounded-xl overflow-hidden flex items-center justify-center shadow-inner group">
              {/* Simulated Camera Feed Background with High-Tech Grid */}
              <div
                className={`absolute inset-0 opacity-30 bg-cover bg-center transition-all duration-500 ${
                  cameraFlipped ? 'scale-x-[-1]' : ''
                }`}
                style={{
                  backgroundImage: `url('https://lh3.googleusercontent.com/aida-public/AB6AXuC2WEmsmCT2-HZQ1LjzhWD5lnpJ22vkyaQ2B7zd63fxJZjRG4OTpyvWE2EwTmlh4ZitpQTIbGHGubWOxVA9ojAPw8YGFrLxeXDADdgSzr1O4fVQ1WBb4xljkV-3_lMqgeocMKvFC-zu2RhqVuILZQLY1HhhULw5IcMpKIRKrcP1HBiR6VTrpCD6W_lHPhJphoa0cxB_5mhEABgCHMNDVu6_WYl-zsMDLt3v4zKZbBD2miTGSE2xyh1_eA')`,
                }}
              />
              <div className="absolute inset-0 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:16px_16px] opacity-20 pointer-events-none" />

              {/* Flashlight Overlay */}
              {flashlight && (
                <div className="absolute inset-0 bg-yellow-100/20 mix-blend-screen pointer-events-none animate-pulse" />
              )}

              {/* Scanning Reticle & Corners */}
              <div className="relative w-56 h-56 flex items-center justify-center">
                <div className="absolute top-0 left-0 w-8 h-8 rounded-tl-lg border-t-4 border-l-4 border-secondary-fixed" />
                <div className="absolute top-0 right-0 w-8 h-8 rounded-tr-lg border-t-4 border-r-4 border-secondary-fixed" />
                <div className="absolute bottom-0 left-0 w-8 h-8 rounded-bl-lg border-b-4 border-l-4 border-secondary-fixed" />
                <div className="absolute bottom-0 right-0 w-8 h-8 rounded-br-lg border-b-4 border-r-4 border-secondary-fixed" />

                {/* Animated Scan Bar */}
                <div className="absolute left-2 right-2 h-0.5 bg-secondary-fixed shadow-[0_0_12px_#4edea3] animate-scan-laser" />

                {/* Hologram Central Mark */}
                <div className="flex flex-col items-center justify-center text-center p-4">
                  <span className="material-symbols-outlined text-secondary-fixed text-[44px] opacity-80 animate-pulse">
                    qr_code_2
                  </span>
                  <span className="text-[11px] text-surface-container-low font-mono mt-2 font-bold tracking-wider">
                    APROXIME CÓDIGO QR O CARNET
                  </span>
                </div>
              </div>

              {/* Scanner Status Overlay Badges */}
              <div className="absolute bottom-3 left-3 bg-inverse-surface/85 backdrop-blur-md px-3 py-1 rounded-md text-surface-container-low flex items-center gap-1.5 text-xs font-semibold">
                <span className="material-symbols-outlined text-[15px] text-secondary">sync</span>
                <span>Listo para captura</span>
              </div>
              <div className="absolute bottom-3 right-3 bg-inverse-surface/85 backdrop-blur-md px-2.5 py-1 rounded-md text-surface-container-low font-mono text-[11px]">
                ID: CAM-PORTAL-A
              </div>
            </div>

            {/* Manual Verification Input */}
            <div className="flex flex-col gap-1.5 pt-1">
              <label className="text-[11px] text-on-surface-variant font-bold uppercase tracking-wider">
                Búsqueda Directa por Cédula / Carnet
              </label>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-[18px]">
                    badge
                  </span>
                  <input
                    value={docQuery}
                    onChange={(e) => setDocQuery(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleConsultar()}
                    className="w-full pl-9 pr-3 py-2 bg-surface text-on-surface placeholder:text-outline text-sm font-mono rounded-lg border border-surface-container focus:outline-none focus:ring-2 focus:ring-primary/20 focus:bg-surface-container-lowest"
                    placeholder="Ej. 1036982410 o 71394021..."
                    type="text"
                  />
                </div>
                <button
                  onClick={handleConsultar}
                  type="button"
                  className="bg-primary text-on-primary px-4 py-2 rounded-lg text-xs font-bold hover:bg-primary-container transition-colors shadow-xs flex items-center gap-1.5"
                >
                  <span className="material-symbols-outlined text-[18px]">search</span>
                  <span>Consultar</span>
                </button>
              </div>
            </div>
          </div>

          {/* Verified Access Decision Card */}
          <div className="bg-surface-container-lowest rounded-xl shadow-xs border border-surface-container p-5 flex flex-col gap-4">
            {/* Access Status Headline Banner */}
            <div className="bg-secondary text-on-secondary px-4 py-2.5 rounded-lg flex items-center justify-between shadow-xs">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center">
                  <span className="material-symbols-outlined text-[16px]">check_circle</span>
                </div>
                <span className="font-bold text-sm tracking-wide">ACCESO CONCEDIDO</span>
              </div>
              <span className="text-xs font-mono font-bold opacity-90">
                AUT: {currentUser.authCode}
              </span>
            </div>

            {/* User Details Layout */}
            <div className="flex items-start gap-4">
              <div className="relative shrink-0">
                <img
                  alt="Retrato de carnet institucional"
                  className="w-20 h-20 rounded-xl object-cover shadow-sm ring-1 ring-surface-container"
                  src={currentUser.photo}
                />
                <span className="absolute -bottom-1 -right-1 bg-secondary text-on-secondary text-[10px] font-bold px-1.5 py-0.5 rounded-full ring-2 ring-surface-container-lowest shadow-xs">
                  ACTIVO
                </span>
              </div>
              <div className="flex flex-col flex-1 min-w-0">
                <span className="text-lg font-bold text-on-surface leading-tight truncate">
                  {currentUser.name}
                </span>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-xs text-on-surface-variant font-mono font-medium">
                    CC: {currentUser.doc}
                  </span>
                  <span className="h-1 w-1 rounded-full bg-outline" />
                  <span className="text-[11px] bg-surface-container-highest text-primary font-bold px-2 py-0.5 rounded">
                    {currentUser.role}
                  </span>
                </div>
                <p className="text-xs text-on-surface-variant mt-1.5 leading-snug">
                  {currentUser.program}
                </p>
              </div>
            </div>

            {/* Verification Metrics Pill Row */}
            <div className="grid grid-cols-2 gap-2 bg-surface-container-low p-3 rounded-lg border border-surface-container">
              <div className="flex flex-col">
                <span className="text-[10px] text-on-surface-variant uppercase font-semibold">
                  Estado Académico
                </span>
                <span className="text-xs text-secondary font-bold flex items-center gap-1 mt-0.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-secondary" />
                  {currentUser.academicStatus}
                </span>
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] text-on-surface-variant uppercase font-semibold">
                  Último Evento
                </span>
                <span className="text-xs text-on-surface font-medium mt-0.5">
                  {currentUser.lastEvent}
                </span>
              </div>
            </div>

            {/* Registered Equipment Subcard */}
            <div className="bg-surface-container-low rounded-lg p-3 flex flex-col gap-1.5 border border-surface-container">
              <div className="flex items-center justify-between">
                <span className="text-[11px] text-on-surface-variant uppercase font-bold flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[16px] text-primary">laptop_mac</span>
                  Equipo Declarado
                </span>
                <span className="text-[10px] bg-secondary-container text-on-secondary-container px-2 py-0.5 rounded font-bold">
                  VERIFICADO
                </span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-on-surface font-semibold">{currentUser.laptopModel}</span>
                <span className="font-mono text-on-surface-variant font-medium">
                  S/N: {currentUser.laptopSerial}
                </span>
              </div>
              <span className="text-[11px] text-on-surface-variant">
                Registrado en BD de Activos Institucionales el 12-Feb-2025
              </span>
            </div>

            {/* Primary Control Actions */}
            <div className="grid grid-cols-2 gap-2 pt-1">
              <button
                onClick={() => handleRegisterAccess('Ingreso')}
                type="button"
                className="bg-primary hover:bg-primary-container text-on-primary py-3 px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-2 shadow-sm active:scale-[0.98]"
              >
                <span className="material-symbols-outlined text-[18px]">login</span>
                <span>Registrar Ingreso (Enter)</span>
              </button>
              <button
                onClick={() => handleRegisterAccess('Salida')}
                type="button"
                className="bg-surface-container-high hover:bg-surface-variant text-on-surface py-3 px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-2 active:scale-[0.98]"
              >
                <span className="material-symbols-outlined text-[18px] text-on-surface-variant">
                  logout
                </span>
                <span>Registrar Salida</span>
              </button>
            </div>

            {/* Auxiliary Actions */}
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => alert('Modal para asociar visitante o acudiente acompañante abierto')}
                className="bg-surface-container hover:bg-surface-container-high text-on-surface-variant py-2 px-3 rounded-lg text-xs font-semibold transition-colors flex items-center justify-center gap-1.5"
              >
                <span className="material-symbols-outlined text-[16px]">group_add</span>
                <span>Acompañante</span>
              </button>
              <button
                type="button"
                onClick={() => alert('Alerta de Novedad generada: el oficial de guardia ha registrado observación sobre el pase')}
                className="bg-surface-container hover:bg-error-container text-error hover:text-on-error-container py-2 px-3 rounded-lg text-xs font-semibold transition-colors flex items-center justify-center gap-1.5"
              >
                <span className="material-symbols-outlined text-[16px]">report_problem</span>
                <span>Novedad de Guardia</span>
              </button>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: KPIs, Real-Time Flow & Audit Stream (7 cols) */}
        <div className="lg:col-span-7 flex flex-col gap-6">
          {/* 4 Top KPI Metric Cards Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="bg-surface-container-lowest rounded-xl p-4 shadow-xs border border-surface-container flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <span className="text-[11px] text-on-surface-variant uppercase font-bold tracking-wider">
                  Accesos Hoy
                </span>
                <span className="material-symbols-outlined text-primary text-[20px]">fact_check</span>
              </div>
              <div className="mt-2">
                <span className="text-2xl font-bold text-on-surface font-mono">1,428</span>
                <div className="flex items-center gap-1 mt-0.5">
                  <span className="material-symbols-outlined text-secondary text-[14px]">
                    trending_up
                  </span>
                  <span className="text-[11px] text-secondary font-bold">+18% vs ayer</span>
                </div>
              </div>
            </div>

            <div className="bg-surface-container-lowest rounded-xl p-4 shadow-xs border border-surface-container flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <span className="text-[11px] text-on-surface-variant uppercase font-bold tracking-wider">
                  En Campus
                </span>
                <span className="material-symbols-outlined text-secondary text-[20px]">groups</span>
              </div>
              <div className="mt-2">
                <span className="text-2xl font-bold text-on-surface font-mono">894</span>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-secondary animate-pulse" />
                  <span className="text-[11px] text-on-surface-variant font-medium">
                    Capacidad 74%
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-surface-container-lowest rounded-xl p-4 shadow-xs border border-surface-container flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <span className="text-[11px] text-on-surface-variant uppercase font-bold tracking-wider">
                  Equipos Activos
                </span>
                <span className="material-symbols-outlined text-tertiary-container text-[20px]">
                  devices
                </span>
              </div>
              <div className="mt-2">
                <span className="text-2xl font-bold text-on-surface font-mono">312</span>
                <div className="flex items-center gap-1 mt-0.5">
                  <span className="text-[11px] text-on-surface-variant">Laptops & Kits</span>
                </div>
              </div>
            </div>

            <div className="bg-surface-container-lowest rounded-xl p-4 shadow-xs border border-surface-container flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <span className="text-[11px] text-error uppercase font-bold tracking-wider">
                  Denegados
                </span>
                <span className="material-symbols-outlined text-error text-[20px]">fmd_bad</span>
              </div>
              <div className="mt-2">
                <span className="text-2xl font-bold text-error font-mono">2</span>
                <div className="flex items-center gap-1 mt-0.5">
                  <span className="text-[11px] text-error font-semibold">QRs vencidos</span>
                </div>
              </div>
            </div>
          </div>

          {/* Filter Bar & Control Strip */}
          <div className="bg-surface-container-lowest rounded-xl p-3.5 shadow-xs border border-surface-container flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
            <div className="flex items-center gap-2 flex-1">
              <div className="relative flex-1">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-[18px]">
                  filter_list
                </span>
                <input
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-9 pr-3 py-1.5 bg-surface text-on-surface placeholder:text-outline text-xs rounded-lg border border-surface-container focus:outline-none focus:ring-1 focus:ring-primary"
                  placeholder="Filtrar por nombre, ID o ambiente..."
                  type="text"
                />
              </div>
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              {/* Door selector */}
              <div className="flex items-center bg-surface-container-low border border-surface-container rounded-lg px-2.5 py-1">
                <span className="text-[11px] text-on-surface-variant mr-1.5 font-medium">Puerta:</span>
                <select
                  value={selectedDoor}
                  onChange={(e) => setSelectedDoor(e.target.value)}
                  className="bg-transparent text-xs text-on-surface font-semibold focus:outline-none cursor-pointer"
                >
                  <option>Principal Norte</option>
                  <option>Peatonal Sur</option>
                  <option>Acceso Vehicular</option>
                </select>
              </div>

              {/* Role selector */}
              <div className="flex items-center bg-surface-container-low border border-surface-container rounded-lg px-2.5 py-1">
                <span className="text-[11px] text-on-surface-variant mr-1.5 font-medium">Rol:</span>
                <select
                  value={selectedRole}
                  onChange={(e) => setSelectedRole(e.target.value)}
                  className="bg-transparent text-xs text-on-surface font-semibold focus:outline-none cursor-pointer"
                >
                  <option>Todos</option>
                  <option value="ESTUDIANTE">Estudiantes</option>
                  <option value="INSTRUCTOR">Instructores</option>
                  <option value="ADMINISTRATIVO">Administrativos</option>
                  <option value="PROVEEDOR">Proveedores</option>
                </select>
              </div>

              <button
                type="button"
                onClick={() => alert('Exportando bitácora de portería a CSV...')}
                className="p-2 rounded-lg bg-surface-container-low hover:bg-surface-container text-on-surface-variant transition-colors border border-surface-container"
                title="Exportar CSV"
              >
                <span className="material-symbols-outlined text-[18px]">download</span>
              </button>
            </div>
          </div>

          {/* Real-Time Event Audit Table */}
          <div className="bg-surface-container-lowest rounded-xl shadow-xs border border-surface-container overflow-hidden flex flex-col">
            <div className="px-5 py-3.5 bg-surface-container-lowest flex items-center justify-between border-b border-surface-container">
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-on-surface">Bitácora de Accesos en Vivo</span>
                <span className="w-2 h-2 rounded-full bg-secondary animate-ping" />
              </div>
              <span className="text-[11px] text-on-surface-variant font-mono">Actualizado hace 2s</span>
            </div>

            <div className="overflow-x-auto w-full">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-surface-container-low text-[11px] text-on-surface-variant uppercase font-bold tracking-wider">
                    <th className="py-2.5 px-4">Hora</th>
                    <th className="py-2.5 px-4">Usuario</th>
                    <th className="py-2.5 px-4">Rol / Programa</th>
                    <th className="py-2.5 px-4">Destino</th>
                    <th className="py-2.5 px-4">Equipos</th>
                    <th className="py-2.5 px-4 text-right">Resultado</th>
                  </tr>
                </thead>
                <tbody className="text-xs divide-y divide-surface-container font-body-sm">
                  {filteredLogs.map((log) => {
                    const isDenied = log.isDenied || log.result.includes('DENEGADO');
                    return (
                      <tr
                        key={log.id}
                        className={`transition-colors ${
                          isDenied
                            ? 'bg-error-container/20 hover:bg-error-container/30'
                            : 'hover:bg-surface-container-low/60'
                        }`}
                      >
                        <td className="py-3 px-4 font-mono font-bold text-on-surface whitespace-nowrap">
                          {log.time}
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2.5">
                            {log.avatarUrl ? (
                              <img
                                alt={log.userName}
                                className="w-7 h-7 rounded-full object-cover shrink-0"
                                src={log.avatarUrl}
                              />
                            ) : (
                              <div className="w-7 h-7 rounded-full bg-tertiary-fixed text-on-tertiary-fixed flex items-center justify-center font-bold text-[10px] shrink-0">
                                {log.initials || 'QR'}
                              </div>
                            )}
                            <div className="flex flex-col min-w-0">
                              <span className="font-semibold text-on-surface truncate">
                                {log.userName}
                              </span>
                              <span className="text-[10px] text-on-surface-variant font-mono">
                                {log.userDoc}
                              </span>
                            </div>
                          </div>
                        </td>
                        <td className="py-3 px-4 whitespace-nowrap">
                          <span
                            className={`text-[10px] px-2 py-0.5 rounded font-bold ${
                              log.role === 'INSTRUCTOR'
                                ? 'bg-primary-fixed text-on-primary-fixed'
                                : log.role === 'ESTUDIANTE'
                                ? 'bg-surface-container-highest text-primary'
                                : log.role === 'PROVEEDOR'
                                ? 'bg-tertiary-fixed text-on-tertiary-fixed-variant'
                                : log.role === 'ADMINISTRATIVO'
                                ? 'bg-surface-container-high text-on-surface'
                                : 'bg-error-container text-on-error-container'
                            }`}
                          >
                            {log.role}
                          </span>
                        </td>
                        <td className="py-3 px-4 whitespace-nowrap text-on-surface font-medium">
                          {log.destination}
                        </td>
                        <td className="py-3 px-4 whitespace-nowrap">
                          {log.equipment === 'Sin equipos' || log.equipment === 'N/A' ? (
                            <span className="text-[11px] text-on-surface-variant">{log.equipment}</span>
                          ) : (
                            <span className="text-[10px] bg-surface-container-high px-2 py-0.5 rounded text-on-surface font-medium inline-flex items-center gap-1">
                              <span className="material-symbols-outlined text-[13px]">devices</span>
                              {log.equipment}
                            </span>
                          )}
                        </td>
                        <td className="py-3 px-4 text-right whitespace-nowrap">
                          <span
                            className={`text-[10px] px-2.5 py-1 rounded-full font-bold inline-flex items-center gap-1 ${
                              isDenied
                                ? 'bg-error text-on-error'
                                : log.result === 'SALIDA VERIFICADA'
                                ? 'bg-surface-container-highest text-primary-container'
                                : log.result === 'PASE TEMPORAL'
                                ? 'bg-surface-container-highest text-primary'
                                : 'bg-secondary-container text-on-secondary-container'
                            }`}
                          >
                            <span
                              className={`w-1.5 h-1.5 rounded-full ${
                                isDenied ? 'bg-white' : 'bg-secondary'
                              }`}
                            />
                            {log.result}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Table Footer Pagination */}
            <div className="p-3.5 bg-surface-container-low flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-on-surface-variant border-t border-surface-container">
              <span>
                Mostrando {filteredLogs.length} de 1,428 eventos registrados durante el turno matutino
              </span>
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  disabled
                  className="px-2.5 py-1 bg-surface-container rounded text-on-surface text-[11px] font-semibold opacity-40 cursor-not-allowed"
                >
                  Anterior
                </button>
                <button
                  type="button"
                  className="px-2.5 py-1 bg-primary text-on-primary rounded text-[11px] font-bold shadow-xs"
                >
                  1
                </button>
                <button
                  type="button"
                  className="px-2.5 py-1 bg-surface-container hover:bg-surface-container-high rounded text-on-surface text-[11px] font-semibold transition-colors"
                >
                  2
                </button>
                <button
                  type="button"
                  className="px-2.5 py-1 bg-surface-container hover:bg-surface-container-high rounded text-on-surface text-[11px] font-semibold transition-colors"
                >
                  3
                </button>
                <button
                  type="button"
                  className="px-2.5 py-1 bg-surface-container hover:bg-surface-container-high rounded text-on-surface text-[11px] font-semibold transition-colors"
                >
                  Siguiente
                </button>
              </div>
            </div>
          </div>

          {/* Checkpoint Equipment Quick Auditing Widget */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-surface-container-lowest rounded-xl p-4 shadow-xs border border-surface-container flex items-start gap-3">
              <div className="w-10 h-10 rounded-lg bg-surface-container-highest text-primary flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-[22px]">lock_reset</span>
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-bold text-on-surface">Pases de Visitante Activos</span>
                <p className="text-xs text-on-surface-variant mt-0.5">
                  14 tarjetas de proximidad asignadas hoy. 2 con entrega pendiente al salir.
                </p>
                <button
                  onClick={() => alert('Abriendo registro detallado de pases temporales de visitantes')}
                  type="button"
                  className="text-xs text-primary font-bold mt-2 inline-flex items-center gap-1 hover:underline text-left"
                >
                  Revisar Registro de Pases
                  <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
                </button>
              </div>
            </div>

            <div className="bg-surface-container-lowest rounded-xl p-4 shadow-xs border border-surface-container flex items-start gap-3">
              <div className="w-10 h-10 rounded-lg bg-secondary-container text-on-secondary-container flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-[22px]">sync_alt</span>
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-bold text-on-surface">Sincronización Periféricos</span>
                <p className="text-xs text-on-surface-variant mt-0.5">
                  Torniquetes V-04 y Lector QR Láser HoneyWell operando con latencia &lt; 40ms.
                </p>
                <span className="text-xs text-secondary font-bold mt-2 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-secondary" />
                  Hardware Óptimo
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
