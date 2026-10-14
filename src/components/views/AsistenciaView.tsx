import React, { useState } from 'react';
import { INITIAL_STUDENTS, UNREGISTERED_STUDENTS, StudentAttendance } from '../../data/mockData';

export const AsistenciaView: React.FC = () => {
  const [subView, setSubView] = useState<'scanner' | 'sheet'>('scanner');
  const [students, setStudents] = useState<StudentAttendance[]>(INITIAL_STUDENTS);
  const [unregistered, setUnregistered] = useState(UNREGISTERED_STUDENTS);
  const [filterMode, setFilterMode] = useState<'all' | 'present' | 'issues'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [scanMode, setScanMode] = useState<'camera' | 'gun'>('camera');
  const [isTorchOn, setIsTorchOn] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [showManualModal, setShowManualModal] = useState(false);
  const [manualDoc, setManualDoc] = useState('');
  const [manualReason, setManualReason] = useState('Carnet deteriorado / Código ilegible');
  const [signedActa, setSignedActa] = useState(false);
  const [showSignModal, setShowSignModal] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Active student in scanner view
  const [lastScanned, setLastScanned] = useState({
    name: 'Valentina Restrepo Giraldo',
    doc: '1.094.882.310',
    time: '08:04:12 AM',
    pass: '#24 / 28',
    device: 'PORTATIL-HP-TIC302-09',
    photo: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAZ1yIZWofpF1Ym_DKfHhC7voEUQIrScfq8MGVSotDkkgnWJTBfhMDrWutlOTAc6xHBeJQ7vzHLuXyuysRTyLmBmsz8cX7XSFugwuxwv-jYh1wm5LtPB8Bo1N-9lKnQfn6ySqmyzhdd26GLvkxOiOwrTF26dFGPahD7-nPOHkA68Ox3Vq4VIJ7-ZOsCCmXGWeLf9l_KhYGQqO9hfiI8U1hAYK2JEh4Xha9VvKlfhZDXOYLBkivA8QT31w',
  });

  // Calculate live counts
  const totalStudents = students.length + unregistered.length;
  const presentCount = students.filter((s) => s.status === 'P').length;
  const delayCount = students.filter((s) => s.status === 'R').length;
  const justifiedCount = students.filter((s) => s.status === 'J').length;
  const faultCount = students.filter((s) => s.status === 'F').length;
  const pendingCount = unregistered.length;

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleStatusChange = (id: string, newStatus: 'P' | 'R' | 'J' | 'F') => {
    setStudents(
      students.map((s) => {
        if (s.id === id) {
          return {
            ...s,
            status: newStatus,
            checkTime: newStatus === 'P' || newStatus === 'R' ? s.checkTime || '08:15 AM' : '--:--',
          };
        }
        return s;
      })
    );
  };

  const handleSimulateScan = () => {
    if (isPaused) {
      showToast('El escáner está en pausa temporal. Reanude para escanear.');
      return;
    }

    if (unregistered.length > 0) {
      const nextStudent = unregistered[0];
      const now = new Date();
      const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
      const newNum = String(students.length + 1).padStart(2, '0');

      const newStudentEntry: StudentAttendance = {
        id: 'std-' + Date.now(),
        number: newNum,
        name: nextStudent.name,
        email: `${nextStudent.name.toLowerCase().replace(/ /g, '.')}@instituto.edu.co`,
        doc: nextStudent.doc,
        status: 'P',
        checkTime: timeStr,
        deviceType: 'Lector Óptico QR Dinámico',
        notes: 'Marcación validada con éxito',
        avatarUrl:
          'https://lh3.googleusercontent.com/aida-public/AB6AXuCIK0mlwvezyI-DqjPcOamayHoZ2I2G3FV2TB-Ycu9aX1nbZLGdKGLU2TK_vQVvN88s5EDXYjYe9VEVt8M9RV-8g3Abfb5EFqvZE9_gbf3lGHzSvv4tXuV8NG5RZUZIQZk-Y7UHxMCvgqGJbfENEoSPfuqoh5NE5v8x2ABSOX9I22n7WTAzA3BUCAKuixgwypi20YsaCd4nwALcmpoukbikoBfPHFrjvuU1HsWox1r0jwNEuJ90wK9yuw',
        linkedDevice: 'DELL-LATITUDE-TIC302-18',
      };

      setStudents([newStudentEntry, ...students]);
      setUnregistered(unregistered.slice(1));
      setLastScanned({
        name: nextStudent.name,
        doc: nextStudent.doc,
        time: timeStr,
        pass: `#${students.length + 1} / ${totalStudents}`,
        device: 'DELL-LATITUDE-TIC302-18',
        photo: newStudentEntry.avatarUrl,
      });

      showToast(`¡Asistencia confirmada! ${nextStudent.name} (Pase #${students.length + 1})`);
    } else {
      showToast('Todos los aprendices de la ficha han registrado asistencia.');
    }
  };

  const handleManualRegister = () => {
    if (!manualDoc.trim()) return;
    const now = new Date();
    const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });

    const newStudentEntry: StudentAttendance = {
      id: 'std-' + Date.now(),
      number: String(students.length + 1).padStart(2, '0'),
      name: 'Registro Manual Contingente',
      email: `aprendiz.${manualDoc}@instituto.edu.co`,
      doc: manualDoc,
      status: 'P',
      checkTime: timeStr,
      deviceType: 'Registro Manual en Aula',
      notes: manualReason,
      avatarUrl:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuDE-d7XtZq2D5OHajZ6cGv40ai3MArI3rAPhpRmmjfU7eUNWM_OSbwhCjjrbHFtanUX_kcodNYElsyfbBcorUj6S48E_N2vgNPckxJtlQdZR0YxYClXVV85EE2LzkV6seraF_tuZpPQyNq6Qo8kQ2SEG0r2LZ64Khk_jP2JgDgIaDRLpUV6OY8zWMvDHvG-G9xUDGCE1hHl71cGRcYq-IjqCip_rmteie9KdRpLw-sI0Qs2tkbQm91SWQ',
      linkedDevice: 'EQUIPO-AULA-ASIGNADO',
    };

    setStudents([newStudentEntry, ...students]);
    setShowManualModal(false);
    setManualDoc('');
    showToast(`Aprendiz ${manualDoc} marcado manualmente.`);
  };

  const handleMarkAllPresent = () => {
    setStudents(
      students.map((s) => ({
        ...s,
        status: 'P',
        checkTime: s.checkTime && s.checkTime !== '--:--' ? s.checkTime : '08:00 AM',
      }))
    );
    showToast('Todos los aprendices en lista han sido marcados como Presentes (P).');
  };

  const filteredStudents = students.filter((s) => {
    const matchesSearch =
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.doc.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.email.toLowerCase().includes(searchQuery.toLowerCase());

    if (filterMode === 'all') return matchesSearch;
    if (filterMode === 'present') return matchesSearch && s.status === 'P';
    if (filterMode === 'issues') return matchesSearch && s.status !== 'P';
    return matchesSearch;
  });

  return (
    <div className="w-full max-w-[1536px] mx-auto px-6 py-6 flex flex-col gap-6">
      {/* Toast */}
      {toastMessage && (
        <div className="fixed top-20 right-8 z-50 bg-inverse-surface text-inverse-on-surface px-4 py-3 rounded-xl shadow-2xl flex items-center gap-3 border border-secondary animate-in fade-in slide-in-from-top-2">
          <span className="material-symbols-outlined text-secondary-fixed text-[20px]">check_circle</span>
          <span className="text-xs font-semibold">{toastMessage}</span>
        </div>
      )}

      {/* Top Navigation between Scanner Mode and Sheet Mode */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-surface-container">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center text-on-primary shadow-xs">
            <span className="material-symbols-outlined text-[24px]">checklist_rtl</span>
          </div>
          <div className="flex flex-col">
            <h1 className="text-xl lg:text-2xl font-bold text-on-surface">Control de Asistencia Institucional</h1>
            <span className="text-xs text-on-surface-variant font-medium">
              Ficha 267014 • Módulo: Arquitectura Web y APIs RESTful (Lab TIC 302)
            </span>
          </div>
        </div>

        {/* View Switcher Tabs */}
        <div className="flex items-center bg-surface-container-low p-1 rounded-xl border border-surface-container">
          <button
            onClick={() => setSubView('scanner')}
            type="button"
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all ${
              subView === 'scanner'
                ? 'bg-primary text-on-primary shadow-xs'
                : 'text-on-surface-variant hover:text-on-surface'
            }`}
          >
            <span className="material-symbols-outlined text-[18px]">qr_code_scanner</span>
            <span>Toma de Lista Asistida (Escáner)</span>
          </button>
          <button
            onClick={() => setSubView('sheet')}
            type="button"
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all ${
              subView === 'sheet'
                ? 'bg-primary text-on-primary shadow-xs'
                : 'text-on-surface-variant hover:text-on-surface'
            }`}
          >
            <span className="material-symbols-outlined text-[18px]">table_chart</span>
            <span>Planilla y Firma de Acta</span>
          </button>
        </div>
      </div>

      {/* SUBVIEW 1: TOMA DE LISTA ASISTIDA (SCANNER VIEW) */}
      {subView === 'scanner' && (
        <div className="flex flex-col gap-6">
          {/* Top Ambient Banner & Context Strip */}
          <div className="relative overflow-hidden rounded-xl bg-surface-container p-6 shadow-xs border border-surface-container">
            <div className="absolute -right-16 -top-16 w-80 h-80 rounded-full bg-primary/5 blur-3xl pointer-events-none" />
            <div className="absolute -left-10 -bottom-10 w-64 h-64 rounded-full bg-secondary/10 blur-2xl pointer-events-none" />
            <div className="relative flex flex-col lg:flex-row lg:items-center justify-between gap-4">
              <div className="flex flex-col gap-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full bg-primary text-on-primary text-[10px] uppercase font-bold tracking-wider">
                    Sesión Activa
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full bg-surface-container-highest text-on-surface-variant text-[11px] font-bold">
                    Ficha 267014
                  </span>
                  <span className="text-outline text-xs">•</span>
                  <span className="text-xs text-on-surface-variant flex items-center gap-1 font-semibold">
                    <span className="material-symbols-outlined text-[16px] text-secondary">sensors</span>
                    Toma de Lista Asistida
                  </span>
                </div>
                <h2 className="text-2xl font-bold text-on-surface tracking-tight mt-1">
                  Arquitectura Web y APIs RESTful
                </h2>
                <div className="flex flex-wrap items-center gap-3 text-on-surface-variant text-xs pt-1">
                  <span className="flex items-center gap-1 font-semibold text-on-surface">
                    <span className="material-symbols-outlined text-[18px] text-primary">meeting_room</span>
                    Laboratorio TIC 302 (Edificio I+D)
                  </span>
                  <span className="text-outline">•</span>
                  <span className="flex items-center gap-1 font-medium">
                    <span className="material-symbols-outlined text-[18px] text-outline">badge</span>
                    Instructor: Carlos Mendoza
                  </span>
                  <span className="text-outline">•</span>
                  <span className="flex items-center gap-1 font-medium">
                    <span className="material-symbols-outlined text-[18px] text-secondary">schedule</span>
                    Jornada: 07:00 - 13:00 (Bloque Matutino)
                  </span>
                </div>
              </div>

              {/* Live Counters */}
              <div className="grid grid-cols-3 gap-2 bg-surface-container-lowest p-2 rounded-xl shadow-xs border border-surface-container min-w-[320px]">
                <div className="flex flex-col items-center justify-center p-2 rounded-lg bg-surface-container-low text-center">
                  <span className="text-[10px] text-on-surface-variant uppercase font-bold">Total Ficha</span>
                  <span className="text-xl font-bold text-on-surface font-mono">{totalStudents}</span>
                </div>
                <div className="flex flex-col items-center justify-center p-2 rounded-lg bg-secondary-fixed/40 text-center">
                  <div className="flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-secondary animate-pulse" />
                    <span className="text-[10px] text-on-secondary-fixed-variant uppercase font-bold">
                      Presentes
                    </span>
                  </div>
                  <span className="text-xl font-bold text-secondary font-mono">{presentCount}</span>
                </div>
                <div className="flex flex-col items-center justify-center p-2 rounded-lg bg-surface-container-highest text-center">
                  <span className="text-[10px] text-on-surface-variant uppercase font-bold">Pendientes</span>
                  <span className="text-xl font-bold text-error font-mono">{pendingCount}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Primary Layout: Scanner Terminal (Left) & Real-Time Feed (Right) */}
          <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
            {/* Left Column: Vision/Hardware Hub & Verified Student Preview (7 cols) */}
            <div className="xl:col-span-7 flex flex-col gap-6">
              {/* Scanner Core Card */}
              <div className="bg-surface-container-lowest rounded-xl p-5 shadow-xs border border-surface-container flex flex-col gap-4">
                {/* Mode Switcher Toolbar */}
                <div className="flex flex-wrap items-center justify-between gap-2 bg-surface-container-low p-1.5 rounded-lg border border-surface-container">
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => setScanMode('camera')}
                      type="button"
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                        scanMode === 'camera'
                          ? 'bg-primary text-on-primary shadow-xs'
                          : 'text-on-surface-variant hover:bg-surface-container'
                      }`}
                    >
                      <span className="material-symbols-outlined text-[18px]">videocam</span>
                      <span>Cámara Web Integrada</span>
                    </button>
                    <button
                      onClick={() => setScanMode('gun')}
                      type="button"
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                        scanMode === 'gun'
                          ? 'bg-primary text-on-primary shadow-xs'
                          : 'text-on-surface-variant hover:bg-surface-container'
                      }`}
                    >
                      <span className="material-symbols-outlined text-[18px]">barcode_scanner</span>
                      <span>Lector Óptico USB / Pistola</span>
                    </button>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => setIsTorchOn(!isTorchOn)}
                      type="button"
                      className={`p-1.5 rounded-lg hover:bg-surface-container transition-colors ${
                        isTorchOn ? 'bg-tertiary-fixed text-on-tertiary-fixed' : 'text-on-surface-variant'
                      }`}
                      title="Luz de Enfoque"
                    >
                      <span className="material-symbols-outlined text-[18px]">
                        {isTorchOn ? 'flash_off' : 'flash_on'}
                      </span>
                    </button>
                    <button
                      onClick={() => setIsMuted(!isMuted)}
                      type="button"
                      className={`p-1.5 rounded-lg hover:bg-surface-container transition-colors ${
                        isMuted ? 'text-outline' : 'text-secondary'
                      }`}
                      title="Feedback Sonoro"
                    >
                      <span className="material-symbols-outlined text-[18px]">
                        {isMuted ? 'volume_off' : 'volume_up'}
                      </span>
                    </button>
                  </div>
                </div>

                {/* Camera Viewport / Scanner Target Area */}
                <div className="relative w-full aspect-video md:aspect-[16/10] bg-inverse-surface rounded-xl overflow-hidden flex items-center justify-center group shadow-inner">
                  {/* Background Feed Simulation (Clean Tech Lab) */}
                  <div
                    className="absolute inset-0 bg-cover bg-center opacity-40 scale-105 transition-transform duration-700 group-hover:scale-100"
                    style={{
                      backgroundImage: `url('https://lh3.googleusercontent.com/aida-public/AB6AXuC2WEmsmCT2-HZQ1LjzhWD5lnpJ22vkyaQ2B7zd63fxJZjRG4OTpyvWE2EwTmlh4ZitpQTIbGHGubWOxVA9ojAPw8YGFrLxeXDADdgSzr1O4fVQ1WBb4xljkV-3_lMqgeocMKvFC-zu2RhqVuILZQLY1HhhULw5IcMpKIRKrcP1HBiR6VTrpCD6W_lHPhJphoa0cxB_5mhEABgCHMNDVu6_WYl-zsMDLt3v4zKZbBD2miTGSE2xyh1_eA')`,
                    }}
                  />

                  {/* Laser Line */}
                  <div className="absolute inset-x-0 h-1 bg-gradient-to-r from-transparent via-secondary-fixed to-transparent shadow-[0_0_15px_#4edea3] animate-scan-laser" />

                  {/* HUD Framing & Corners */}
                  <div className="absolute inset-0 flex items-center justify-center p-8 pointer-events-none">
                    <div className="relative w-64 h-64 md:w-80 md:h-80 max-w-full flex items-center justify-center">
                      <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-secondary-fixed rounded-tl-lg" />
                      <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-secondary-fixed rounded-tr-lg" />
                      <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-secondary-fixed rounded-bl-lg" />
                      <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-secondary-fixed rounded-br-lg" />

                      <div className="w-full h-full rounded-lg bg-secondary/5 flex flex-col items-center justify-center p-4">
                        <span className="material-symbols-outlined text-secondary-fixed/70 text-[48px] animate-pulse">
                          qr_code_scanner
                        </span>
                        <span className="text-[11px] text-secondary-fixed tracking-wider uppercase mt-2 font-bold bg-inverse-surface/80 px-2.5 py-1 rounded">
                          Alinee código QR o Carnet
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Live Diagnostic Overlay (Top-Left) */}
                  <div className="absolute top-3 left-3 flex items-center gap-2 bg-inverse-surface/85 backdrop-blur-md px-3 py-1 rounded-md text-inverse-on-surface text-xs font-semibold">
                    <span className="w-2 h-2 rounded-full bg-secondary animate-ping" />
                    <span>FPS: 60</span>
                    <span className="text-outline">•</span>
                    <span>Sensor HD 1080p</span>
                  </div>

                  {/* Gun mode banner if selected */}
                  {scanMode === 'gun' && (
                    <div className="absolute inset-0 bg-inverse-surface/95 flex flex-col items-center justify-center gap-4 p-6 text-center z-20">
                      <div className="w-16 h-16 rounded-full bg-primary-container flex items-center justify-center text-on-primary shadow-lg animate-pulse">
                        <span className="material-symbols-outlined text-[36px]">barcode_reader</span>
                      </div>
                      <div className="flex flex-col gap-1 max-w-sm">
                        <h3 className="text-base text-inverse-on-surface font-bold">
                          Modo Pistola Óptica / USB Activo
                        </h3>
                        <p className="text-xs text-surface-variant">
                          Listo para recibir disparos del escáner láser. No requiere enfoque de cámara.
                        </p>
                      </div>
                      <input
                        className="w-full max-w-xs px-4 py-2 rounded-lg bg-inverse-surface text-surface-bright font-mono text-sm tracking-widest text-center shadow-inner focus:outline-none ring-2 ring-primary border border-white/20"
                        placeholder="Esperando lectura de carnet..."
                        type="text"
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            handleSimulateScan();
                            (e.target as HTMLInputElement).value = '';
                          }
                        }}
                      />
                      <span className="text-xs text-secondary-fixed flex items-center gap-1 font-bold">
                        <span className="material-symbols-outlined text-[16px]">check_circle</span> Dispositivo HID conectado (COM3)
                      </span>
                    </div>
                  )}

                  {/* Simulator button */}
                  <div className="absolute bottom-3 right-3 z-10">
                    <button
                      onClick={handleSimulateScan}
                      type="button"
                      className="flex items-center gap-1.5 bg-surface-container-lowest/95 hover:bg-surface-container-lowest text-primary px-3.5 py-1.5 rounded-lg text-xs font-bold shadow-md transition-transform active:scale-95"
                    >
                      <span className="material-symbols-outlined text-[18px]">autorenew</span>
                      <span>Simular Escaneo</span>
                    </button>
                  </div>
                </div>

                {/* Contingency & Quick Form Row */}
                <div className="flex flex-col md:flex-row items-center justify-between gap-3 pt-1">
                  <button
                    onClick={() => setShowManualModal(true)}
                    type="button"
                    className="flex items-center gap-2 px-4 py-2 rounded-lg bg-surface-container-low hover:bg-surface-container text-on-surface text-xs font-bold transition-colors w-full md:w-auto justify-center border border-surface-container"
                  >
                    <span className="material-symbols-outlined text-[18px] text-primary">keyboard</span>
                    <span>Búsqueda Manual por Documento</span>
                  </button>

                  <div className="flex items-center gap-2 w-full md:w-auto justify-end">
                    <button
                      onClick={() => setIsPaused(!isPaused)}
                      type="button"
                      className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-surface-container-low hover:bg-surface-container text-on-surface text-xs font-bold transition-colors border border-surface-container"
                    >
                      <span className="material-symbols-outlined text-[18px]">
                        {isPaused ? 'play_arrow' : 'pause'}
                      </span>
                      <span>{isPaused ? 'Reanudar Escáner' : 'Pausar Escáner'}</span>
                    </button>

                    <button
                      onClick={() => setSubView('sheet')}
                      type="button"
                      className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-primary hover:bg-primary-container text-on-primary text-xs font-bold transition-all shadow-xs"
                    >
                      <span className="material-symbols-outlined text-[18px]">verified</span>
                      <span>Finalizar Lista</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Last Scanned Student Detailed Card (Prominent Feedback) */}
              <div className="bg-surface-container-lowest rounded-xl p-5 shadow-xs border border-surface-container relative overflow-hidden">
                <div className="absolute left-0 top-0 bottom-0 w-2 bg-secondary" />
                <div className="flex items-center justify-between mb-4 pb-1 pl-2">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-secondary" />
                    <span className="text-xs uppercase tracking-wider text-secondary font-bold">
                      Último Aprendiz Escaneado
                    </span>
                  </div>
                  <span className="px-3 py-1 rounded-full bg-secondary-fixed/50 text-on-secondary-fixed-variant text-xs font-bold flex items-center gap-1">
                    <span className="material-symbols-outlined text-[16px]">check_circle</span>
                    PRESENTE - REGISTRO EXITOSO
                  </span>
                </div>

                <div className="flex flex-col md:flex-row items-center gap-5 pl-2">
                  {/* Photo */}
                  <div className="relative shrink-0">
                    <img
                      alt={lastScanned.name}
                      className="w-24 h-24 md:w-28 md:h-28 rounded-xl object-cover shadow-sm bg-surface-container ring-1 ring-surface-container"
                      src={lastScanned.photo}
                    />
                    <div className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full bg-secondary text-on-secondary flex items-center justify-center shadow-md">
                      <span className="material-symbols-outlined text-[18px]">done_all</span>
                    </div>
                  </div>

                  {/* Attributes */}
                  <div className="flex flex-col gap-2 flex-1 text-center md:text-left">
                    <div className="flex flex-col">
                      <span className="text-[11px] text-outline uppercase font-bold">Aprendiz</span>
                      <h3 className="text-lg font-bold text-on-surface leading-tight">
                        {lastScanned.name}
                      </h3>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-1">
                      <div className="flex flex-col">
                        <span className="text-[11px] text-on-surface-variant font-medium">Documento CC</span>
                        <span className="text-xs font-mono font-bold text-on-surface">{lastScanned.doc}</span>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-[11px] text-on-surface-variant font-medium">Hora de Ingreso</span>
                        <span className="text-xs font-mono font-bold text-secondary">{lastScanned.time}</span>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-[11px] text-on-surface-variant font-medium">Pase Consecutivo</span>
                        <span className="text-xs font-mono font-bold text-primary">{lastScanned.pass}</span>
                      </div>
                    </div>

                    {/* Linked Device */}
                    <div className="mt-1 p-2 px-3 rounded-lg bg-surface-container flex items-center justify-between flex-wrap gap-2">
                      <div className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-[18px] text-primary">laptop_mac</span>
                        <span className="text-xs text-on-surface-variant font-medium">Equipo Vinculado:</span>
                        <span className="text-xs font-mono font-bold text-on-surface">{lastScanned.device}</span>
                      </div>
                      <span className="px-2 py-0.5 rounded bg-secondary-fixed/60 text-on-secondary-fixed-variant text-[10px] font-bold flex items-center gap-1">
                        <span className="material-symbols-outlined text-[13px]">verified</span> Serial Verificado
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Real-Time Attendance Stream & Pending Roster (5 cols) */}
            <div className="xl:col-span-5 flex flex-col gap-6">
              {/* Live Stream Card */}
              <div className="bg-surface-container-lowest rounded-xl p-5 shadow-xs border border-surface-container flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-[20px] text-primary">history</span>
                    <h3 className="text-sm font-bold text-on-surface">Bitácora en Tiempo Real</h3>
                  </div>
                  <span className="text-xs text-on-surface-variant">Hoy, Lab TIC 302</span>
                </div>

                <div className="relative">
                  <span className="material-symbols-outlined absolute left-3 top-2.5 text-outline text-[18px]">
                    search
                  </span>
                  <input
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-9 pr-3 py-1.5 rounded-lg bg-surface-container-low text-on-surface placeholder:text-outline text-xs focus:outline-none border border-surface-container"
                    placeholder="Filtrar por nombre o documento..."
                    type="text"
                  />
                </div>

                {/* Real-time rows */}
                <div className="flex flex-col gap-1.5 max-h-[380px] overflow-y-auto pr-1">
                  {students.slice(0, 6).map((student) => {
                    const initials = student.name
                      .split(' ')
                      .map((n) => n[0])
                      .slice(0, 2)
                      .join('');

                    return (
                      <div
                        key={student.id}
                        className="flex items-center justify-between p-2.5 rounded-lg bg-surface-container-low hover:bg-surface-container transition-colors border border-surface-container"
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <div className="w-8 h-8 rounded-full bg-secondary-fixed/50 flex items-center justify-center text-on-secondary-fixed font-bold text-xs shrink-0">
                            {initials}
                          </div>
                          <div className="flex flex-col min-w-0">
                            <span className="text-xs font-semibold text-on-surface truncate">
                              {student.name}
                            </span>
                            <span className="text-[10px] text-on-surface-variant font-mono">
                              CC {student.doc} • {student.deviceType}
                            </span>
                          </div>
                        </div>

                        <div className="flex flex-col items-end shrink-0 pl-2">
                          <span className="text-xs font-mono font-bold text-secondary">
                            {student.checkTime}
                          </span>
                          <span className="text-[10px] text-outline font-mono">Pase #{student.number}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-surface-container text-xs text-on-surface-variant">
                  <div className="flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-[16px] text-secondary">sync</span>
                    <span>Sincronizando con Campus Cloud</span>
                  </div>
                  <button
                    onClick={() => setSubView('sheet')}
                    className="text-primary font-bold hover:underline"
                  >
                    Ver todos ({students.length})
                  </button>
                </div>
              </div>

              {/* Remaining / Unscanned Panel */}
              <div className="bg-surface-container-lowest rounded-xl p-5 shadow-xs border border-surface-container flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-[20px] text-error">person_alert</span>
                    <h3 className="text-sm font-bold text-on-surface">
                      Pendientes por Registrar ({unregistered.length})
                    </h3>
                  </div>
                  <span className="px-2 py-0.5 rounded-full bg-error-container text-on-error-container text-[10px] font-bold">
                    Sin marcar
                  </span>
                </div>
                <p className="text-xs text-on-surface-variant">
                  Aprendices matriculados en Ficha 267014 sin lectura biométrica u óptica hoy:
                </p>

                <div className="flex flex-col gap-1.5 mt-1">
                  {unregistered.map((unreg, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between p-2.5 rounded-lg bg-surface-container-low border border-surface-container"
                    >
                      <div className="flex flex-col">
                        <span className="text-xs font-semibold text-on-surface">{unreg.name}</span>
                        <span className="text-[10px] text-on-surface-variant font-mono">
                          CC {unreg.doc}
                        </span>
                      </div>
                      <button
                        onClick={() => {
                          setManualDoc(unreg.doc);
                          setShowManualModal(true);
                        }}
                        type="button"
                        className="px-2.5 py-1 rounded-md bg-surface-container hover:bg-primary hover:text-on-primary text-primary text-[11px] font-bold transition-colors"
                      >
                        Marcar Manual
                      </button>
                    </div>
                  ))}

                  {unregistered.length === 0 && (
                    <div className="p-4 text-center text-xs text-secondary font-bold bg-secondary-container/20 rounded-lg">
                      ¡Todos los aprendices han sido marcados con éxito!
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SUBVIEW 2: PLANILLA Y FIRMA DE ACTA INSTITUCIONAL */}
      {subView === 'sheet' && (
        <div className="flex flex-col gap-6">
          {/* Class Information Hero Banner */}
          <div className="bg-surface-container-lowest rounded-xl p-6 shadow-xs border border-surface-container flex flex-col xl:flex-row xl:items-center justify-between gap-6 relative overflow-hidden">
            <div className="flex flex-col md:flex-row md:items-center gap-5 relative z-10">
              <div className="w-14 h-14 rounded-xl bg-primary flex items-center justify-center text-on-primary shadow-sm shrink-0">
                <span className="material-symbols-outlined text-[32px]">terminal</span>
              </div>
              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-[11px] bg-primary-fixed text-on-primary-fixed px-2.5 py-0.5 rounded font-bold">
                    FICHA 267014
                  </span>
                  <span className="text-xs text-on-surface-variant font-medium">
                    Jornada Mañana (08:00 - 12:00)
                  </span>
                  <span className="text-xs text-secondary font-bold flex items-center gap-1">
                    <span className="material-symbols-outlined text-[14px]">sensors</span>
                    Torniquete Activo
                  </span>
                </div>
                <h2 className="text-xl font-bold text-on-surface">Tecnología en Desarrollo de Software</h2>
                <div className="flex flex-wrap items-center gap-3 text-xs text-on-surface-variant mt-0.5">
                  <span className="flex items-center gap-1 font-semibold text-on-surface">
                    <span className="material-symbols-outlined text-primary text-[16px]">menu_book</span>
                    Módulo: Arquitectura Web y APIs RESTful con Node.js
                  </span>
                  <span className="text-outline-variant">•</span>
                  <span className="flex items-center gap-1">
                    <span className="material-symbols-outlined text-[16px]">calendar_today</span>
                    24 de Octubre
                  </span>
                  <span className="text-outline-variant">•</span>
                  <span className="flex items-center gap-1 font-bold text-primary">
                    <span className="material-symbols-outlined text-[16px]">meeting_room</span>
                    Lab TIC 302
                  </span>
                </div>
              </div>
            </div>

            {/* Quick Metrics Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 relative z-10">
              <div className="bg-surface-container-low p-3 rounded-lg flex flex-col items-center justify-center text-center border border-surface-container">
                <span className="text-[10px] uppercase text-on-surface-variant font-bold tracking-wider">
                  Matriculados
                </span>
                <span className="text-xl font-bold text-on-surface font-mono mt-0.5">{totalStudents}</span>
                <span className="text-[10px] text-on-surface-variant">100% grupo</span>
              </div>
              <div className="bg-secondary-container/40 p-3 rounded-lg flex flex-col items-center justify-center text-center border border-secondary-container">
                <span className="text-[10px] uppercase text-secondary font-bold tracking-wider flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-secondary" />
                  Presentes
                </span>
                <span className="text-xl font-bold text-on-surface font-mono mt-0.5">{presentCount}</span>
                <span className="text-[10px] text-secondary font-bold">
                  {Math.round((presentCount / totalStudents) * 100)}%
                </span>
              </div>
              <div className="bg-surface-container p-3 rounded-lg flex flex-col items-center justify-center text-center border border-surface-container">
                <span className="text-[10px] uppercase text-tertiary-container font-bold tracking-wider flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-tertiary-container" />
                  Retardos
                </span>
                <span className="text-xl font-bold text-on-surface font-mono mt-0.5">{delayCount}</span>
                <span className="text-[10px] text-on-surface-variant font-medium">
                  {Math.round((delayCount / totalStudents) * 100)}%
                </span>
              </div>
              <div className="bg-surface-container-high p-3 rounded-lg flex flex-col items-center justify-center text-center border border-surface-container">
                <span className="text-[10px] uppercase text-primary font-bold tracking-wider flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                  Justificadas
                </span>
                <span className="text-xl font-bold text-on-surface font-mono mt-0.5">{justifiedCount}</span>
                <span className="text-[10px] text-on-surface-variant font-medium">
                  {Math.round((justifiedCount / totalStudents) * 100)}%
                </span>
              </div>
              <div className="bg-error-container/40 p-3 rounded-lg flex flex-col items-center justify-center text-center border border-error-container col-span-2 sm:col-span-1">
                <span className="text-[10px] uppercase text-error font-bold tracking-wider flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-error" />
                  Injustificadas
                </span>
                <span className="text-xl font-bold text-error font-mono mt-0.5">{faultCount}</span>
                <span className="text-[10px] text-error font-bold">
                  {Math.round((faultCount / totalStudents) * 100)}%
                </span>
              </div>
            </div>
          </div>

          {/* Toolbar: Search, Filters & Bulk Operations */}
          <div className="bg-surface-container-lowest rounded-xl p-3.5 shadow-xs border border-surface-container flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
            <div className="flex flex-col md:flex-row items-stretch md:items-center gap-3 flex-1">
              <div className="relative min-w-[260px] max-w-md flex-1">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-[18px]">
                  search
                </span>
                <input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full h-9 pl-9 pr-3 bg-surface text-xs text-on-surface placeholder:text-outline rounded-lg border border-surface-container focus:outline-none focus:ring-1 focus:ring-primary"
                  placeholder="Buscar por aprendiz, cédula o ID..."
                  type="text"
                />
              </div>

              {/* Filter Tabs */}
              <div className="flex items-center gap-1 bg-surface-container-low p-1 rounded-lg border border-surface-container">
                <button
                  onClick={() => setFilterMode('all')}
                  type="button"
                  className={`px-3 py-1.5 rounded text-xs font-bold transition-all ${
                    filterMode === 'all'
                      ? 'bg-surface-container-lowest text-primary shadow-xs'
                      : 'text-on-surface-variant hover:text-on-surface'
                  }`}
                >
                  Todos ({students.length})
                </button>
                <button
                  onClick={() => setFilterMode('present')}
                  type="button"
                  className={`px-3 py-1.5 rounded text-xs font-bold transition-all ${
                    filterMode === 'present'
                      ? 'bg-surface-container-lowest text-primary shadow-xs'
                      : 'text-on-surface-variant hover:text-on-surface'
                  }`}
                >
                  Presentes ({presentCount})
                </button>
                <button
                  onClick={() => setFilterMode('issues')}
                  type="button"
                  className={`px-3 py-1.5 rounded text-xs font-bold transition-all flex items-center gap-1.5 ${
                    filterMode === 'issues'
                      ? 'bg-surface-container-lowest text-primary shadow-xs'
                      : 'text-on-surface-variant hover:text-on-surface'
                  }`}
                >
                  <span>Novedades / Faltas</span>
                  <span className="w-4 h-4 rounded-full bg-error-container text-on-error-container text-[10px] font-bold flex items-center justify-center">
                    {delayCount + justifiedCount + faultCount}
                  </span>
                </button>
              </div>
            </div>

            {/* Bulk Actions */}
            <div className="flex items-center gap-2 flex-wrap">
              <button
                onClick={handleMarkAllPresent}
                type="button"
                className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-surface-container-low hover:bg-surface-container text-on-surface text-xs font-bold transition-colors border border-surface-container"
              >
                <span className="material-symbols-outlined text-[16px] text-secondary">done_all</span>
                <span>Marcar Todos Presentes</span>
              </button>
              <button
                onClick={handleSimulateScan}
                type="button"
                className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-primary-container hover:bg-primary text-on-primary text-xs font-bold transition-colors shadow-xs"
              >
                <span className="material-symbols-outlined text-[16px]">qr_code_scanner</span>
                <span>Importar Marcación QR</span>
              </button>
              <button
                onClick={() => alert('Descargando Acta Oficial en PDF con firmas y marcas criptográficas...')}
                type="button"
                className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-surface-container-low hover:bg-surface-container text-on-surface text-xs font-semibold border border-surface-container"
              >
                <span className="material-symbols-outlined text-[16px]">download</span>
                <span>Descargar Acta</span>
              </button>
            </div>
          </div>

          {/* Student Attendance Data Table */}
          <div className="bg-surface-container-lowest rounded-xl shadow-xs border border-surface-container overflow-hidden flex flex-col">
            <div className="overflow-x-auto w-full">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-surface-container-low text-[11px] text-on-surface-variant uppercase font-bold tracking-wider">
                    <th className="py-3 px-4 w-12 text-center">#</th>
                    <th className="py-3 px-4">Aprendiz / Estudiante</th>
                    <th className="py-3 px-4">Documento ID</th>
                    <th className="py-3 px-4 text-center min-w-[240px]">Estado de Asistencia</th>
                    <th className="py-3 px-4">Hora Marcación</th>
                    <th className="py-3 px-4">Dispositivo / Validación</th>
                    <th className="py-3 px-4 min-w-[200px]">Novedad / Observación</th>
                    <th className="py-3 px-4 text-right w-16">Acción</th>
                  </tr>
                </thead>
                <tbody className="text-xs divide-y divide-surface-container">
                  {filteredStudents.map((std) => (
                    <tr
                      key={std.id}
                      className={`transition-colors ${
                        std.status === 'F'
                          ? 'bg-error-container/20 hover:bg-error-container/30'
                          : std.status === 'R'
                          ? 'bg-tertiary-fixed/15 hover:bg-tertiary-fixed/25'
                          : std.status === 'J'
                          ? 'bg-surface-container-low/50 hover:bg-surface-container-low/80'
                          : 'hover:bg-surface-container-low/60'
                      }`}
                    >
                      <td className="py-3 px-4 text-center font-mono text-[11px] text-on-surface-variant font-bold">
                        {std.number}
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <div className="relative shrink-0">
                            <img
                              alt={std.name}
                              className="w-9 h-9 rounded-full object-cover shadow-xs bg-surface-container"
                              src={std.avatarUrl}
                            />
                            <span
                              className={`absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full ring-2 ring-surface-container-lowest ${
                                std.status === 'P'
                                  ? 'bg-secondary'
                                  : std.status === 'R'
                                  ? 'bg-tertiary-container'
                                  : std.status === 'J'
                                  ? 'bg-primary'
                                  : 'bg-error'
                              }`}
                            />
                          </div>
                          <div className="flex flex-col min-w-0">
                            <span className="font-bold text-on-surface truncate">{std.name}</span>
                            <span className="text-[11px] text-on-surface-variant truncate font-mono">
                              {std.email}
                            </span>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4 font-mono font-medium text-on-surface-variant whitespace-nowrap">
                        {std.doc}
                      </td>
                      <td className="py-3 px-4">
                        {/* Segmented Control Buttons [P] [R] [J] [F] */}
                        <div className="flex items-center justify-center p-1 bg-surface-container rounded-lg gap-1 max-w-[220px] mx-auto border border-surface-container">
                          <button
                            onClick={() => handleStatusChange(std.id, 'P')}
                            type="button"
                            className={`flex-1 py-1 rounded text-[11px] font-bold transition-all ${
                              std.status === 'P'
                                ? 'bg-secondary text-on-secondary shadow-xs'
                                : 'text-on-surface-variant hover:text-on-surface'
                            }`}
                          >
                            P
                          </button>
                          <button
                            onClick={() => handleStatusChange(std.id, 'R')}
                            type="button"
                            className={`flex-1 py-1 rounded text-[11px] font-bold transition-all ${
                              std.status === 'R'
                                ? 'bg-tertiary-container text-on-tertiary-container shadow-xs'
                                : 'text-on-surface-variant hover:text-on-surface'
                            }`}
                          >
                            R
                          </button>
                          <button
                            onClick={() => handleStatusChange(std.id, 'J')}
                            type="button"
                            className={`flex-1 py-1 rounded text-[11px] font-bold transition-all ${
                              std.status === 'J'
                                ? 'bg-primary text-on-primary shadow-xs'
                                : 'text-on-surface-variant hover:text-on-surface'
                            }`}
                          >
                            J
                          </button>
                          <button
                            onClick={() => handleStatusChange(std.id, 'F')}
                            type="button"
                            className={`flex-1 py-1 rounded text-[11px] font-bold transition-all ${
                              std.status === 'F'
                                ? 'bg-error text-on-error shadow-xs'
                                : 'text-on-surface-variant hover:text-on-surface'
                            }`}
                          >
                            F
                          </button>
                        </div>
                      </td>
                      <td className="py-3 px-4 whitespace-nowrap font-mono text-[11px]">
                        {std.checkTime ? (
                          <div className="flex items-center gap-1 font-bold text-on-surface">
                            <span
                              className={`material-symbols-outlined text-[15px] ${
                                std.status === 'P'
                                  ? 'text-secondary'
                                  : std.status === 'R'
                                  ? 'text-tertiary-container'
                                  : 'text-outline'
                              }`}
                            >
                              {std.status === 'R' ? 'alarm' : 'check_circle'}
                            </span>
                            <span>{std.checkTime}</span>
                            {std.delayMinutes && (
                              <span className="text-tertiary-container text-[10px]">
                                (+{std.delayMinutes}m)
                              </span>
                            )}
                          </div>
                        ) : (
                          <span className="text-error font-bold">Sin ingreso</span>
                        )}
                      </td>
                      <td className="py-3 px-4 whitespace-nowrap">
                        <span className="text-[10px] bg-surface-container px-2 py-0.5 rounded text-on-surface font-mono font-medium">
                          {std.deviceType}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`text-[11px] ${
                            std.status === 'F'
                              ? 'text-error font-bold'
                              : std.status === 'R'
                              ? 'text-tertiary-container font-medium'
                              : 'text-on-surface-variant'
                          }`}
                        >
                          {std.notes}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <button
                          onClick={() => alert(`Observaciones y bitácora del aprendiz ${std.name}`)}
                          type="button"
                          className="p-1 rounded hover:bg-surface-container text-on-surface-variant"
                          title="Editar observación"
                        >
                          <span className="material-symbols-outlined text-[18px]">edit_note</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="p-3.5 bg-surface-container-low flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-on-surface-variant border-t border-surface-container">
              <span>Mostrando {filteredStudents.length} de {students.length} aprendices registrados</span>
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  disabled
                  className="px-2.5 py-1 bg-surface-container rounded text-on-surface text-[11px] font-semibold opacity-40 cursor-not-allowed"
                >
                  Anterior
                </button>
                <span className="px-2.5 py-1 font-bold text-primary text-[11px]">Pág. 1 de 1</span>
                <button
                  type="button"
                  className="px-2.5 py-1 bg-surface-container hover:bg-surface-container-high rounded text-on-surface text-[11px] font-semibold transition-colors"
                >
                  Siguiente
                </button>
              </div>
            </div>
          </div>

          {/* Context Verification Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-surface-container-lowest p-4 rounded-xl shadow-xs border border-surface-container flex items-start gap-3">
              <div className="p-2.5 rounded-lg bg-surface-container text-primary shrink-0">
                <span className="material-symbols-outlined text-[24px]">verified_user</span>
              </div>
              <div className="flex flex-col">
                <span className="text-xs font-bold text-on-surface">Validación Criptográfica QR</span>
                <p className="text-[11px] text-on-surface-variant mt-0.5 leading-relaxed">
                  Cada escaneo genera un token efímero de 30 segundos. El 91.7% de accesos se realizaron vía carnet digital con autenticación biométrica.
                </p>
              </div>
            </div>

            <div className="bg-surface-container-lowest p-4 rounded-xl shadow-xs border border-surface-container flex items-start gap-3">
              <div className="p-2.5 rounded-lg bg-surface-container text-secondary shrink-0">
                <span className="material-symbols-outlined text-[24px]">gavel</span>
              </div>
              <div className="flex flex-col">
                <span className="text-xs font-bold text-on-surface">Reglamento del Aprendiz</span>
                <p className="text-[11px] text-on-surface-variant mt-0.5 leading-relaxed">
                  Más de 3 faltas injustificadas en la misma competencia activan automáticamente el Comité de Seguimiento y Evaluación.
                </p>
              </div>
            </div>

            <div className="bg-surface-container-lowest p-4 rounded-xl shadow-xs border border-surface-container flex items-start gap-3">
              <div className="p-2.5 rounded-lg bg-surface-container text-on-tertiary-container shrink-0">
                <span className="material-symbols-outlined text-[24px]">emergency_share</span>
              </div>
              <div className="flex flex-col">
                <span className="text-xs font-bold text-on-surface">Evacuación y Aforo de Aula</span>
                <p className="text-[11px] text-on-surface-variant mt-0.5 leading-relaxed">
                  Lab TIC 302 cuenta actualmente con 26 personas registradas adentro (incluyendo docente y monitor de apoyo).
                </p>
              </div>
            </div>
          </div>

          {/* Bottom Sticky Action & Signature Bar */}
          <div className="sticky bottom-0 z-30 bg-surface-container-lowest/95 backdrop-blur-md shadow-xl py-3 px-6 rounded-xl border border-surface-container">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-4 flex-wrap text-xs">
                <div className="flex items-center gap-1.5">
                  <span className="h-3 w-3 rounded-full bg-secondary" />
                  <span className="font-bold text-on-surface">{presentCount} Asistieron</span>
                </div>
                <span className="text-outline-variant">•</span>
                <div className="flex items-center gap-1.5">
                  <span className="h-3 w-3 rounded-full bg-tertiary-container" />
                  <span className="font-medium text-on-surface">{delayCount} Retardos</span>
                </div>
                <span className="text-outline-variant">•</span>
                <div className="flex items-center gap-1.5">
                  <span className="h-3 w-3 rounded-full bg-error" />
                  <span className="font-medium text-on-surface">{faultCount} Ausencias</span>
                </div>
                <span className="text-outline-variant hidden sm:inline">•</span>
                <div className="hidden sm:flex items-center gap-1 bg-surface-container px-2.5 py-0.5 rounded-full">
                  <span className="text-[10px] text-on-surface-variant font-bold">Índice:</span>
                  <span className="text-xs text-secondary font-bold font-mono">
                    {Math.round(((presentCount + delayCount) / totalStudents) * 100)}%
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2.5 w-full md:w-auto justify-end">
                <button
                  onClick={() => showToast('Borrador guardado exitosamente.')}
                  type="button"
                  className="px-4 h-10 rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface text-xs font-bold transition-all flex items-center gap-1.5 border border-surface-container"
                >
                  <span className="material-symbols-outlined text-[18px]">save</span>
                  <span>Guardar Borrador</span>
                </button>
                <button
                  onClick={() => setShowSignModal(true)}
                  type="button"
                  disabled={signedActa}
                  className={`px-5 h-10 rounded-lg text-xs font-bold transition-all shadow-md flex items-center gap-2 ${
                    signedActa
                      ? 'bg-secondary text-on-secondary'
                      : 'bg-primary hover:bg-primary-container text-on-primary'
                  }`}
                >
                  <span className="material-symbols-outlined text-[18px]">
                    {signedActa ? 'verified' : 'draw'}
                  </span>
                  <span>
                    {signedActa ? 'Acta Firmada Digitalmente' : 'Cerrar y Firmar Acta de Asistencia'}
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Búsqueda Manual */}
      {showManualModal && (
        <div className="fixed inset-0 bg-inverse-surface/40 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-surface-container-lowest rounded-2xl max-w-md w-full p-6 shadow-2xl border border-surface-container flex flex-col gap-4 animate-in fade-in">
            <div className="flex items-center justify-between pb-2 border-b border-surface-container">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-[24px]">pin</span>
                <h3 className="text-base font-bold text-on-surface">Marcación Manual por Contingencia</h3>
              </div>
              <button
                onClick={() => setShowManualModal(false)}
                className="text-on-surface-variant hover:text-on-surface"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>
            <p className="text-xs text-on-surface-variant">
              Use esta opción si el aprendiz presenta daño en código QR o extravío temporal del carnet físico.
            </p>
            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] font-bold text-on-surface-variant uppercase">
                Número de Documento / Cédula
              </label>
              <input
                value={manualDoc}
                onChange={(e) => setManualDoc(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-surface text-on-surface font-mono text-sm border border-surface-container focus:outline-none focus:ring-1 focus:ring-primary"
                placeholder="Ej. 1094882310"
                type="text"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] font-bold text-on-surface-variant uppercase">
                Causal de Registro Manual
              </label>
              <select
                value={manualReason}
                onChange={(e) => setManualReason(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-surface text-on-surface text-xs border border-surface-container focus:outline-none"
              >
                <option>Carnet deteriorado / Código ilegible</option>
                <option>Olvido de carnet físico (Excepción autorizada)</option>
                <option>Dispositivo móvil descargado (QR digital no disponible)</option>
                <option>Falla de hardware en lector</option>
              </select>
            </div>
            <div className="flex items-center justify-end gap-2 pt-2 border-t border-surface-container">
              <button
                onClick={() => setShowManualModal(false)}
                className="px-4 py-2 rounded-lg bg-surface-container text-xs font-semibold hover:bg-surface-container-high"
              >
                Cancelar
              </button>
              <button
                onClick={handleManualRegister}
                className="px-4 py-2 rounded-lg bg-primary hover:bg-primary-container text-on-primary text-xs font-bold shadow-xs"
              >
                Registrar Asistencia
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Firma Digital del Acta */}
      {showSignModal && (
        <div className="fixed inset-0 bg-inverse-surface/50 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-surface-container-lowest rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-surface-container flex flex-col gap-4 animate-in fade-in">
            <div className="flex items-center justify-between pb-2 border-b border-surface-container">
              <div className="flex items-center gap-2 text-primary">
                <span className="material-symbols-outlined text-[24px]">verified</span>
                <h3 className="text-base font-bold text-on-surface">Cierre y Firma Digital de Acta</h3>
              </div>
              <button
                onClick={() => setShowSignModal(false)}
                className="text-on-surface-variant hover:text-on-surface"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            <p className="text-xs text-on-surface-variant">
              Al confirmar, el acta de asistencia de la <strong>Ficha 267014</strong> quedará consolidada, cifrada con hash criptográfico institucional y sincronizada con el sistema SOFIA Plus y bienestar estudiantil.
            </p>

            <div className="bg-surface-container-low p-3.5 rounded-xl border border-surface-container flex flex-col gap-2 font-mono text-xs">
              <div className="flex justify-between">
                <span className="text-on-surface-variant">Hash de Cierre:</span>
                <span className="font-bold text-primary">SHA256: 9f8a...2e4b</span>
              </div>
              <div className="flex justify-between">
                <span className="text-on-surface-variant">Firmante:</span>
                <span className="font-bold text-on-surface">Ing. Carlos Mendoza</span>
              </div>
              <div className="flex justify-between">
                <span className="text-on-surface-variant">Total Asistentes:</span>
                <span className="font-bold text-secondary">{presentCount} de {totalStudents}</span>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-surface-container">
              <button
                onClick={() => setShowSignModal(false)}
                className="px-4 py-2 rounded-lg bg-surface-container text-xs font-semibold hover:bg-surface-container-high"
              >
                Cancelar
              </button>
              <button
                onClick={() => {
                  setSignedActa(true);
                  setShowSignModal(false);
                  showToast('¡Acta cerrada y firmada digitalmente con éxito!');
                }}
                className="px-5 py-2 rounded-lg bg-primary hover:bg-primary-container text-on-primary text-xs font-bold shadow-md"
              >
                Firmar y Transmitir
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
