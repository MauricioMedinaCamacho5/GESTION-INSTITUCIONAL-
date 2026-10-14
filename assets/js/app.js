/**
 * SGI ACCESO INSTITUCIONAL - CONTROLADOR JAVASCRIPT PRINCIPAL
 * Integrado con PHP y Supabase API
 */

// Estado global de la aplicación
const AppState = {
  viewMode: 'desktop', // 'desktop' | 'mobile-carnet' | 'mobile-guard'
  activeModule: 'porteria', // 'porteria' | 'ambientes' | 'asistencia' | 'equipos' | 'usuarios' | 'reportes'
  emergencyLock: false,
  flashlight: false,
  cameraFacingFront: false,
  carnetCountdown: 30,
  carnetTimerInterval: null,
  currentPerson: {
    name: 'Valentina Restrepo Giraldo',
    doc: '1.036.982.410',
    role: 'ESTUDIANTE',
    program: 'Tecnología en Desarrollo de Software - Ficha 267014 (Jornada Mañana)',
    photo: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAW2bl7t4zaAY0z7mG0kX3fZ49i7-Rd7RBeGYYFccDuMsXvl9OLCOQe9SAOng69jf12jxTx1lkSbGFt9xX7JywGZAjLMBcBVNltme7BgWrWK-keJ4Ej1BPX3qgkblN_oMOR8LQ5j0RWJwUxp_MMVMfsuTqqN5SyK7GDIzDYv2RmM9yrrZdyaEGo3AwwCNb8P47EGebWfjC8scg_XVKO8WpyNX9MwSbuzp4fOYL0P3ls5QQwmObaLNg9vw',
    academicStatus: 'Matrícula Vigente 2025-1',
    laptopModel: 'Lenovo ThinkPad E14 Gen 4',
    laptopSerial: '#LNV-99214',
    authCode: '#892-04'
  }
};

// ==============================================================================
// SINTETIZADOR DE AUDIO (Web Audio API)
// ==============================================================================
const AudioSynth = {
  ctx: null,
  init() {
    if (!this.ctx && (window.AudioContext || window.webkitAudioContext)) {
      this.ctx = new (window.AudioContext || window.webkitAudioContext)();
    }
  },
  playSuccess() {
    try {
      this.init();
      if (!this.ctx) return;
      if (this.ctx.state === 'suspended') this.ctx.resume();
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(880, this.ctx.currentTime); // A5
      osc.frequency.exponentialRampToValueAtTime(1320, this.ctx.currentTime + 0.12); // E6
      gain.gain.setValueAtTime(0.15, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.18);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.18);
    } catch (e) {
      console.warn('Audio no disponible', e);
    }
  },
  playDenied() {
    try {
      this.init();
      if (!this.ctx) return;
      if (this.ctx.state === 'suspended') this.ctx.resume();
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(220, this.ctx.currentTime);
      osc.frequency.setValueAtTime(150, this.ctx.currentTime + 0.15);
      gain.gain.setValueAtTime(0.2, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.35);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.35);
    } catch (e) {
      console.warn('Audio no disponible', e);
    }
  }
};

// ==============================================================================
// GESTOR DE NOTIFICACIONES TOAST
// ==============================================================================
function showToast(message, type = 'success') {
  const container = document.getElementById('toast-container');
  if (!container) return;

  const toast = document.createElement('div');
  const bg = type === 'success' ? 'bg-slate-900 text-white border-emerald-500' : 'bg-red-950 text-white border-red-500';
  const icon = type === 'success' ? 'check_circle' : 'warning';
  const iconColor = type === 'success' ? 'text-emerald-400' : 'text-red-400';

  toast.className = `flex items-center gap-3 px-4 py-3 rounded-xl shadow-2xl border text-xs font-semibold transform transition-all duration-300 translate-y-2 opacity-0 ${bg}`;
  toast.innerHTML = `
    <span class="material-symbols-outlined ${iconColor} text-[20px]">${icon}</span>
    <span>${message}</span>
  `;

  container.appendChild(toast);
  setTimeout(() => {
    toast.classList.remove('translate-y-2', 'opacity-0');
  }, 10);

  setTimeout(() => {
    toast.classList.add('opacity-0', '-translate-y-2');
    setTimeout(() => toast.remove(), 300);
  }, 3500);
}

// ==============================================================================
// NAVEGACIÓN Y CAMBIO DE VISTAS
// ==============================================================================
function switchViewMode(mode) {
  AppState.viewMode = mode;

  // Actualizar botones de vista
  document.querySelectorAll('[data-view-mode]').forEach(btn => {
    const isCurrent = btn.getAttribute('data-view-mode') === mode;
    if (isCurrent) {
      btn.classList.add('bg-white', 'text-blue-900', 'shadow-xs');
      btn.classList.remove('bg-white/15', 'text-white');
    } else {
      btn.classList.remove('bg-white', 'text-blue-900', 'shadow-xs');
      btn.classList.add('bg-white/15', 'text-white');
    }
  });

  const desktopContainer = document.getElementById('view-desktop');
  const mobileCarnetContainer = document.getElementById('view-mobile-carnet');
  const mobileGuardContainer = document.getElementById('view-mobile-guard');

  if (desktopContainer) desktopContainer.style.display = mode === 'desktop' ? 'block' : 'none';
  if (mobileCarnetContainer) mobileCarnetContainer.style.display = mode === 'mobile-carnet' ? 'flex' : 'none';
  if (mobileGuardContainer) mobileGuardContainer.style.display = mode === 'mobile-guard' ? 'flex' : 'none';

  if (mode === 'mobile-carnet') {
    startCarnetTimer();
  } else {
    clearInterval(AppState.carnetTimerInterval);
  }
}

function switchModule(moduleId) {
  AppState.activeModule = moduleId;

  // Actualizar clases activas en sidebar
  document.querySelectorAll('.sidebar-link').forEach(link => {
    const isTarget = link.getAttribute('data-module') === moduleId;
    if (isTarget) {
      link.classList.add('bg-blue-900', 'text-white', 'shadow-sm');
      link.classList.remove('text-slate-700', 'hover:bg-slate-100');
    } else {
      link.classList.remove('bg-blue-900', 'text-white', 'shadow-sm');
      link.classList.add('text-slate-700', 'hover:bg-slate-100');
    }
  });

  // Mostrar tab activa
  document.querySelectorAll('.tab-content').forEach(tab => {
    tab.classList.remove('active');
  });

  const targetTab = document.getElementById(`tab-${moduleId}`);
  if (targetTab) {
    targetTab.classList.add('active');
  }

  // Cargar datos correspondientes si es necesario
  if (moduleId === 'porteria') loadAccessLogs();
  else if (moduleId === 'asistencia') loadAttendance();
  else if (moduleId === 'ambientes') loadEnvironments();
  else if (moduleId === 'equipos') loadAssets();
  else if (moduleId === 'usuarios') loadUsers();
  else if (moduleId === 'reportes') loadReports();
}

// ==============================================================================
// MÓDULO 1: CONTROL DE PORTERÍA & QR
// ==============================================================================
async function loadAccessLogs(searchTerm = '', roleFilter = 'Todos') {
  try {
    let url = 'api/access.php?';
    if (searchTerm) url += `search=${encodeURIComponent(searchTerm)}&`;
    if (roleFilter && roleFilter !== 'Todos') url += `role=${encodeURIComponent(roleFilter)}`;

    const res = await fetch(url);
    const json = await res.json();
    if (!json.error && Array.isArray(json.data)) {
      renderAccessTable(json.data);
    }
  } catch (err) {
    console.error('Error cargando accesos:', err);
  }
}

function renderAccessTable(logs) {
  const tbody = document.getElementById('access-logs-tbody');
  if (!tbody) return;

  if (logs.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="7" class="py-8 text-center text-xs text-slate-500">
          No se encontraron registros de acceso con los filtros aplicados.
        </td>
      </tr>
    `;
    return;
  }

  tbody.innerHTML = logs.map(log => {
    const isDenied = log.isDenied || log.result.includes('DENEGADO');
    const resultColor = isDenied 
      ? 'bg-red-100 text-red-700 border-red-200' 
      : (log.result.includes('SALIDA') ? 'bg-amber-100 text-amber-800 border-amber-200' : 'bg-emerald-100 text-emerald-800 border-emerald-200');

    const roleBadge = log.role === 'INSTRUCTOR' ? 'bg-indigo-100 text-indigo-700' :
                      log.role === 'ESTUDIANTE' ? 'bg-blue-100 text-blue-700' :
                      log.role === 'ADMINISTRATIVO' ? 'bg-purple-100 text-purple-700' : 'bg-slate-100 text-slate-700';

    const avatarHtml = log.avatarUrl 
      ? `<img src="${log.avatarUrl}" alt="${log.userName}" class="w-8 h-8 rounded-full object-cover ring-1 ring-slate-200">`
      : `<div class="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center font-bold text-xs text-slate-600">${log.initials || log.userName.substring(0, 2).toUpperCase()}</div>`;

    return `
      <tr class="hover:bg-slate-50/70 border-b border-slate-100 transition-colors text-xs">
        <td class="py-3 px-4 font-mono font-bold text-slate-600">${log.time}</td>
        <td class="py-3 px-4">
          <div class="flex items-center gap-2.5">
            ${avatarHtml}
            <div>
              <p class="font-bold text-slate-900 leading-tight">${log.userName}</p>
              <p class="text-[11px] font-mono text-slate-500">${log.userDoc}</p>
            </div>
          </div>
        </td>
        <td class="py-3 px-4">
          <span class="px-2 py-0.5 rounded text-[10px] font-bold tracking-wider ${roleBadge}">${log.role}</span>
        </td>
        <td class="py-3 px-4 text-slate-600 hidden md:table-cell">${log.destination || 'Campus General'}</td>
        <td class="py-3 px-4 text-slate-600 hidden lg:table-cell">
          <span class="flex items-center gap-1 font-mono text-[11px]">
            <span class="material-symbols-outlined text-[15px] text-slate-400">laptop_chromebook</span>
            ${log.equipment}
          </span>
        </td>
        <td class="py-3 px-4">
          <span class="px-2.5 py-1 rounded-full text-[10px] font-bold border ${resultColor}">
            ${log.result}
          </span>
        </td>
        <td class="py-3 px-4 text-right">
          <button onclick="inspectPerson('${log.userDoc}')" class="text-blue-700 hover:text-blue-900 p-1 rounded hover:bg-blue-50" title="Ver Ficha">
            <span class="material-symbols-outlined text-[18px]">badge</span>
          </button>
        </td>
      </tr>
    `;
  }).join('');
}

async function registerAccess(type = 'Ingreso') {
  if (AppState.emergencyLock) {
    AudioSynth.playDenied();
    alert('¡ALERTA DE SEGURIDAD! Torniquetes en BLOQUEO DE EMERGENCIA. Desactívelo para registrar accesos.');
    return;
  }

  const p = AppState.currentPerson;
  const resultText = type === 'Ingreso' ? 'INGRESO EXITOSO' : 'SALIDA VERIFICADA';

  try {
    const res = await fetch('api/access.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userName: p.name,
        userDoc: `CC ${p.doc}`,
        role: p.role,
        programOrDept: p.program,
        destination: 'Lab TIC 302',
        equipment: p.laptopModel,
        avatarUrl: p.photo,
        result: resultText,
        isDenied: false
      })
    });

    const json = await res.json();
    if (!json.error) {
      AudioSynth.playSuccess();
      showToast(`${type} registrado: ${p.name}`);
      loadAccessLogs();
      updateMetricCounters();
    } else {
      AudioSynth.playDenied();
      showToast(json.message, 'error');
    }
  } catch (err) {
    console.error('Error registrando acceso:', err);
  }
}

function toggleEmergencyLock() {
  AppState.emergencyLock = !AppState.emergencyLock;
  const btn = document.getElementById('btn-emergency-lock');
  const banner = document.getElementById('emergency-lock-banner');

  if (AppState.emergencyLock) {
    AudioSynth.playDenied();
    if (btn) {
      btn.classList.add('bg-red-700', 'text-white', 'animate-pulse');
      btn.innerHTML = `<span class="material-symbols-outlined text-[18px]">lock</span><span>BLOQUEO ACTIVO</span>`;
    }
    if (banner) banner.style.display = 'flex';
    showToast('¡BLOQUEO DE EMERGENCIA ACTIVADO!', 'error');
  } else {
    AudioSynth.playSuccess();
    if (btn) {
      btn.classList.remove('bg-red-700', 'text-white', 'animate-pulse');
      btn.innerHTML = `<span class="material-symbols-outlined text-[18px]">emergency</span><span>Bloqueo Preventivo</span>`;
    }
    if (banner) banner.style.display = 'none';
    showToast('Torniquetes desbloqueados');
  }
}

function queryPersonByDoc(docQuery) {
  const query = (docQuery || document.getElementById('input-doc-query')?.value || '').toLowerCase();
  
  if (query.includes('71') || query.includes('camilo') || query.includes('torres')) {
    AppState.currentPerson = {
      name: 'Camilo Andrés Torres',
      doc: '71.394.021',
      role: 'INSTRUCTOR',
      program: 'Coordinación Académica - Redes y Datos',
      photo: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDdfwl4UT_p5W5ojP8tOZ1gTksXhD6F_KTWGUUAuDofxVj5AOFQJKmTCD2rFqhePwr3I7cua4A15krrg-KOs04C6oOn5U6gRrJ53YiApYD3amLHJghCt64zHRQU0mJyX42mWcxHVQ38moTB2aJP0hgkl20ieSBWgJ0Os446FFMLopR7eRvDCmFC66CxE8HQ0QEGKJWotz-n1YOVo5Prx5sqDQhXAvIV5b3Ijt7gNgQ1VcXYPK0phvwXRg',
      academicStatus: 'Planta Docente Activa',
      laptopModel: 'Dell Latitude 5530',
      laptopSerial: '#DLL-44091',
      authCode: '#892-05'
    };
  } else {
    AppState.currentPerson = {
      name: 'Valentina Restrepo Giraldo',
      doc: '1.036.982.410',
      role: 'ESTUDIANTE',
      program: 'Tecnología en Desarrollo de Software - Ficha 267014 (Jornada Mañana)',
      photo: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAW2bl7t4zaAY0z7mG0kX3fZ49i7-Rd7RBeGYYFccDuMsXvl9OLCOQe9SAOng69jf12jxTx1lkSbGFt9xX7JywGZAjLMBcBVNltme7BgWrWK-keJ4Ej1BPX3qgkblN_oMOR8LQ5j0RWJwUxp_MMVMfsuTqqN5SyK7GDIzDYv2RmM9yrrZdyaEGo3AwwCNb8P47EGebWfjC8scg_XVKO8WpyNX9MwSbuzp4fOYL0P3ls5QQwmObaLNg9vw',
      academicStatus: 'Matrícula Vigente 2025-1',
      laptopModel: 'Lenovo ThinkPad E14 Gen 4',
      laptopSerial: '#LNV-99214',
      authCode: '#892-04'
    };
  }

  updatePersonPreviewCard();
  AudioSynth.playSuccess();
  showToast(`Datos cargados: ${AppState.currentPerson.name}`);
}

function updatePersonPreviewCard() {
  const p = AppState.currentPerson;
  const nameEl = document.getElementById('preview-name');
  const docEl = document.getElementById('preview-doc');
  const roleEl = document.getElementById('preview-role');
  const progEl = document.getElementById('preview-program');
  const photoEl = document.getElementById('preview-photo');
  const laptopEl = document.getElementById('preview-laptop');
  const serialEl = document.getElementById('preview-serial');

  if (nameEl) nameEl.textContent = p.name;
  if (docEl) docEl.textContent = `CC ${p.doc}`;
  if (roleEl) roleEl.textContent = p.role;
  if (progEl) progEl.textContent = p.program;
  if (photoEl) photoEl.src = p.photo;
  if (laptopEl) laptopEl.textContent = p.laptopModel;
  if (serialEl) serialEl.textContent = p.laptopSerial;
}

function toggleFlashlight() {
  AppState.flashlight = !AppState.flashlight;
  const overlay = document.getElementById('scanner-light-overlay');
  const icon = document.getElementById('flashlight-icon');
  if (overlay) overlay.style.opacity = AppState.flashlight ? '0.25' : '0';
  if (icon) icon.textContent = AppState.flashlight ? 'flash_on' : 'flash_off';
}

function flipCamera() {
  AppState.cameraFacingFront = !AppState.cameraFacingFront;
  showToast(AppState.cameraFacingFront ? 'Cámara Frontal' : 'Cámara Principal Trasera');
}

// ==============================================================================
// MÓDULO 2: GESTIÓN DE AMBIENTES
// ==============================================================================
async function loadEnvironments() {
  try {
    const res = await fetch('api/environments.php');
    const json = await res.json();
    if (!json.error && Array.isArray(json.data)) {
      renderEnvironmentsGrid(json.data);
    }
  } catch (err) {
    console.error('Error cargando ambientes:', err);
  }
}

function renderEnvironmentsGrid(rooms) {
  const grid = document.getElementById('environments-grid');
  if (!grid) return;

  grid.innerHTML = rooms.map(room => {
    const isLocked = room.doorStatus.includes('Bloqueada') || room.doorStatus.includes('Restringido');
    const statusBg = room.status === 'EN CLASE ACTIVA' ? 'bg-emerald-100 text-emerald-800' :
                     room.status === 'DISPONIBLE' ? 'bg-blue-100 text-blue-800' :
                     room.status === 'EN MANTENIMIENTO' ? 'bg-amber-100 text-amber-800' : 'bg-purple-100 text-purple-800';

    const occPercent = room.capacity > 0 ? Math.round((room.currentAttendance / room.capacity) * 100) : 0;

    return `
      <div class="bg-white rounded-2xl border border-slate-200/90 shadow-sm hover:shadow-md transition-all p-5 flex flex-col justify-between">
        <div>
          <div class="flex items-center justify-between mb-3">
            <span class="font-mono text-xs font-bold text-blue-900 bg-blue-50 px-2.5 py-1 rounded-md border border-blue-100">${room.code}</span>
            <span class="text-[11px] font-bold px-2.5 py-0.5 rounded-full ${statusBg}">${room.status}</span>
          </div>

          <h3 class="font-bold text-slate-900 text-sm mb-1">${room.name}</h3>
          <p class="text-slate-500 text-xs flex items-center gap-1 mb-3">
            <span class="material-symbols-outlined text-[15px]">location_on</span>
            ${room.location}
          </p>

          ${room.status === 'EN CLASE ACTIVA' ? `
            <div class="bg-slate-50 p-3 rounded-xl border border-slate-100 mb-4 text-xs">
              <p class="font-semibold text-slate-800">${room.currentSubject}</p>
              <p class="text-slate-500 text-[11px] mt-0.5">Profesor: ${room.instructor}</p>
              <div class="mt-2.5 flex items-center justify-between text-[11px] text-slate-600 mb-1">
                <span>Ocupación: ${room.currentAttendance} / ${room.capacity}</span>
                <span class="font-bold font-mono">${occPercent}%</span>
              </div>
              <div class="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                <div class="bg-blue-700 h-full rounded-full transition-all" style="width: ${occPercent}%"></div>
              </div>
            </div>
          ` : `
            <div class="bg-slate-50 p-3 rounded-xl border border-slate-100 mb-4 text-xs">
              <p class="text-slate-700 font-medium">${room.nextSubjectNotice || 'Sin actividad próxima programada'}</p>
              <p class="text-slate-400 text-[11px] mt-1">Capacidad estándar: ${room.capacity} personas</p>
            </div>
          `}

          <div class="flex flex-wrap gap-1 mb-4">
            ${(room.equipmentTags || []).map(t => `<span class="bg-slate-100 text-slate-600 px-2 py-0.5 rounded text-[10px] font-medium">${t}</span>`).join('')}
          </div>
        </div>

        <div class="pt-3 border-t border-slate-100 flex items-center justify-between">
          <div class="flex items-center gap-1.5 text-xs text-slate-600 font-medium">
            <span class="material-symbols-outlined text-[16px] ${isLocked ? 'text-amber-600' : 'text-emerald-600'}">
              ${isLocked ? 'lock' : 'lock_open'}
            </span>
            <span class="text-[11px]">${room.doorStatus}</span>
          </div>

          <button onclick="toggleRoomDoor('${room.id}', '${isLocked ? 'Desbloqueada Automáticamente' : 'Puerta Bloqueada'}')" 
                  class="px-2.5 py-1 rounded-lg text-xs font-semibold ${isLocked ? 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'} transition-colors">
            ${isLocked ? 'Desbloquear' : 'Bloquear'}
          </button>
        </div>
      </div>
    `;
  }).join('');
}

async function toggleRoomDoor(roomId, newDoorStatus) {
  try {
    const res = await fetch('api/environments.php', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: roomId, doorStatus: newDoorStatus })
    });
    const json = await res.json();
    if (!json.error) {
      AudioSynth.playSuccess();
      showToast(`Estado de puerta actualizado: ${newDoorStatus}`);
      loadEnvironments();
    }
  } catch (err) {
    console.error('Error modificando ambiente:', err);
  }
}

// ==============================================================================
// MÓDULO 3: CONTROL DE ASISTENCIA
// ==============================================================================
async function loadAttendance() {
  try {
    const res = await fetch('api/attendance.php');
    const json = await res.json();
    if (!json.error && Array.isArray(json.data)) {
      renderAttendanceTable(json.data);
      updateAttendanceCounters(json.data);
    }
  } catch (err) {
    console.error('Error cargando asistencia:', err);
  }
}

function renderAttendanceTable(students) {
  const tbody = document.getElementById('attendance-tbody');
  if (!tbody) return;

  tbody.innerHTML = students.map(s => {
    return `
      <tr class="hover:bg-slate-50/70 border-b border-slate-100 transition-colors text-xs">
        <td class="py-3 px-4 font-mono font-bold text-slate-400">${s.number}</td>
        <td class="py-3 px-4">
          <div class="flex items-center gap-2.5">
            <img src="${s.avatarUrl}" alt="${s.name}" class="w-8 h-8 rounded-full object-cover ring-1 ring-slate-200">
            <div>
              <p class="font-bold text-slate-900 leading-tight">${s.name}</p>
              <p class="text-[11px] font-mono text-slate-500">${s.doc}</p>
            </div>
          </div>
        </td>
        <td class="py-3 px-4">
          <div class="flex items-center gap-1">
            <button onclick="setStudentStatus('${s.id}', 'P')" class="w-7 h-7 rounded-lg font-bold text-xs transition-all ${s.status === 'P' ? 'bg-emerald-600 text-white shadow-xs' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}">P</button>
            <button onclick="setStudentStatus('${s.id}', 'R')" class="w-7 h-7 rounded-lg font-bold text-xs transition-all ${s.status === 'R' ? 'bg-amber-500 text-white shadow-xs' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}">R</button>
            <button onclick="setStudentStatus('${s.id}', 'J')" class="w-7 h-7 rounded-lg font-bold text-xs transition-all ${s.status === 'J' ? 'bg-blue-600 text-white shadow-xs' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}">J</button>
            <button onclick="setStudentStatus('${s.id}', 'F')" class="w-7 h-7 rounded-lg font-bold text-xs transition-all ${s.status === 'F' ? 'bg-red-600 text-white shadow-xs' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}">F</button>
          </div>
        </td>
        <td class="py-3 px-4 font-mono text-slate-600">${s.checkTime || '--:--'}</td>
        <td class="py-3 px-4 text-slate-600 hidden md:table-cell">
          <span class="text-[11px] text-slate-500">${s.deviceType}</span>
        </td>
        <td class="py-3 px-4 text-slate-600 hidden lg:table-cell">
          ${s.linkedDevice ? `
            <span class="inline-flex items-center gap-1 font-mono text-[10px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded">
              <span class="material-symbols-outlined text-[13px] text-slate-400">devices</span>
              ${s.linkedDevice}
            </span>
          ` : '<span class="text-slate-400 text-[11px]">Sin equipo</span>'}
        </td>
        <td class="py-3 px-4 text-slate-600">
          <input type="text" value="${s.notes || ''}" onchange="updateStudentNotes('${s.id}', this.value)" 
                 class="w-full bg-slate-50 hover:bg-white focus:bg-white border border-slate-200 rounded px-2 py-1 text-xs focus:ring-1 focus:ring-blue-500 focus:outline-none transition-all" 
                 placeholder="Agregar nota...">
        </td>
      </tr>
    `;
  }).join('');
}

async function setStudentStatus(studentId, newStatus) {
  try {
    const res = await fetch('api/attendance.php', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        id: studentId,
        status: newStatus,
        checkTime: (newStatus === 'P' || newStatus === 'R') ? new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''
      })
    });
    const json = await res.json();
    if (!json.error) {
      AudioSynth.playSuccess();
      loadAttendance();
    }
  } catch (err) {
    console.error('Error actualizando asistencia:', err);
  }
}

async function updateStudentNotes(studentId, notes) {
  try {
    await fetch('api/attendance.php', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: studentId, notes })
    });
    showToast('Nota guardada');
  } catch (err) {
    console.error('Error guardando notas:', err);
  }
}

function updateAttendanceCounters(students) {
  const total = students.length;
  let p = 0, r = 0, j = 0, f = 0;
  students.forEach(s => {
    if (s.status === 'P') p++;
    else if (s.status === 'R') r++;
    else if (s.status === 'J') j++;
    else if (s.status === 'F') f++;
  });

  const rate = total > 0 ? Math.round(((p + r) / total) * 100) : 100;

  const rateEl = document.getElementById('stat-attendance-rate');
  const countEl = document.getElementById('stat-attendance-summary');
  if (rateEl) rateEl.textContent = `${rate}%`;
  if (countEl) countEl.textContent = `${p} Presentes • ${r} Retardos • ${j} Justificados • ${f} Fallas`;
}

// ==============================================================================
// MÓDULO 4: NOVEDADES Y EQUIPOS
// ==============================================================================
async function loadAssets() {
  try {
    const res = await fetch('api/assets.php');
    const json = await res.json();
    if (!json.error && Array.isArray(json.data)) {
      renderAssetsGrid(json.data);
    }
  } catch (err) {
    console.error('Error cargando equipos:', err);
  }
}

function renderAssetsGrid(assets) {
  const container = document.getElementById('assets-grid');
  if (!container) return;

  container.innerHTML = assets.map(a => {
    const isError = a.deadlineType === 'error';
    const tagColor = a.statusTag.includes('Préstamo') ? 'bg-amber-100 text-amber-800' :
                     a.statusTag.includes('Fuera') ? 'bg-red-100 text-red-800' :
                     a.statusTag.includes('Portería') ? 'bg-blue-100 text-blue-800' : 'bg-emerald-100 text-emerald-800';

    return `
      <div class="bg-white rounded-2xl border border-slate-200/90 shadow-sm hover:shadow-md transition-all p-5 flex flex-col justify-between">
        <div>
          <div class="flex items-center justify-between mb-3">
            <span class="font-mono text-xs font-bold text-slate-700 bg-slate-100 px-2.5 py-1 rounded-md border border-slate-200 flex items-center gap-1">
              <span class="material-symbols-outlined text-[14px]">qr_code</span>
              ${a.qrCode}
            </span>
            <span class="text-[11px] font-bold px-2.5 py-0.5 rounded-full ${tagColor}">${a.statusTag}</span>
          </div>

          <h3 class="font-bold text-slate-900 text-sm mb-1">${a.title}</h3>
          <p class="text-slate-500 text-xs mb-3 font-mono">${a.specs}</p>

          <div class="bg-slate-50 p-3 rounded-xl border border-slate-100 text-xs space-y-1 mb-4">
            <div class="flex justify-between">
              <span class="text-slate-500">Serial:</span>
              <span class="font-mono font-semibold text-slate-800">${a.serial}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-slate-500">MAC / Chip:</span>
              <span class="font-mono text-slate-700">${a.mac}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-slate-500">Custodio:</span>
              <span class="font-semibold text-slate-900">${a.custodianName}</span>
            </div>
          </div>

          ${a.deadlineNotice ? `
            <div class="text-[11px] font-semibold flex items-center gap-1.5 px-3 py-1.5 rounded-lg ${isError ? 'bg-red-50 text-red-700 border border-red-200' : 'bg-slate-100 text-slate-700'} mb-2">
              <span class="material-symbols-outlined text-[16px]">${isError ? 'schedule' : 'info'}</span>
              <span>${a.deadlineNotice}</span>
            </div>
          ` : ''}
        </div>

        <div class="pt-3 border-t border-slate-100 flex items-center justify-between">
          <span class="text-[11px] text-slate-400 font-medium">${a.category}</span>
          <button onclick="toggleAssetLoan('${a.id}', '${a.statusTag.includes('Préstamo') ? 'En Sede / Fijo' : 'En Préstamo'}')" 
                  class="px-2.5 py-1 rounded-lg text-xs font-semibold bg-blue-50 text-blue-800 hover:bg-blue-100 transition-colors">
            ${a.statusTag.includes('Préstamo') ? 'Devolver Equipo' : 'Asignar Préstamo'}
          </button>
        </div>
      </div>
    `;
  }).join('');
}

async function toggleAssetLoan(assetId, newStatus) {
  try {
    const res = await fetch('api/assets.php', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: assetId, statusTag: newStatus })
    });
    const json = await res.json();
    if (!json.error) {
      AudioSynth.playSuccess();
      showToast(`Estado de equipo actualizado a: ${newStatus}`);
      loadAssets();
    }
  } catch (err) {
    console.error('Error actualizando equipo:', err);
  }
}

// ==============================================================================
// MÓDULO 5: USUARIOS Y CARNETS
// ==============================================================================
async function loadUsers() {
  try {
    const res = await fetch('api/users.php');
    const json = await res.json();
    if (!json.error && Array.isArray(json.data)) {
      renderUsersGrid(json.data);
    }
  } catch (err) {
    console.error('Error cargando usuarios:', err);
  }
}

function renderUsersGrid(users) {
  const container = document.getElementById('users-grid');
  if (!container) return;

  container.innerHTML = users.map(u => {
    return `
      <div class="bg-white rounded-2xl border border-slate-200/90 shadow-sm hover:shadow-md transition-all p-5 flex flex-col justify-between">
        <div>
          <div class="flex items-center gap-3 mb-4">
            <img src="${u.photoUrl}" alt="${u.fullName}" class="w-12 h-12 rounded-xl object-cover ring-2 ring-slate-100 shadow-xs">
            <div>
              <h3 class="font-bold text-slate-900 text-sm leading-tight">${u.fullName}</h3>
              <p class="text-slate-500 font-mono text-[11px]">CC ${u.doc}</p>
              <span class="inline-block mt-1 px-2 py-0.5 rounded text-[10px] font-bold ${u.role === 'INSTRUCTOR' ? 'bg-indigo-100 text-indigo-700' : 'bg-blue-100 text-blue-700'}">${u.role}</span>
            </div>
          </div>

          <div class="bg-slate-50 p-3 rounded-xl border border-slate-100 text-xs space-y-1 mb-3">
            <p class="text-slate-700 font-medium">${u.program}</p>
            <p class="text-slate-400 text-[11px]">${u.email}</p>
          </div>

          <div class="p-2.5 rounded-xl bg-blue-50/60 border border-blue-100 flex items-center justify-between">
            <div class="flex items-center gap-2">
              <span class="material-symbols-outlined text-blue-700 text-[20px]">qr_code_2</span>
              <div>
                <p class="text-[10px] uppercase font-bold text-blue-900">Carnet Digital</p>
                <p class="text-[11px] font-mono font-semibold text-blue-700">${u.carnetCode}</p>
              </div>
            </div>
            <span class="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 text-[10px] font-bold">${u.carnetStatus}</span>
          </div>
        </div>

        <div class="pt-3 border-t border-slate-100 mt-4 flex items-center justify-between text-xs">
          <span class="text-slate-500 text-[11px]">${u.authorizedEquipment || 'Sin equipo vinculado'}</span>
          <button onclick="previewUserCarnet('${u.doc}')" class="text-blue-700 font-bold hover:underline">Ver Carnet</button>
        </div>
      </div>
    `;
  }).join('');
}

function previewUserCarnet(doc) {
  queryPersonByDoc(doc);
  switchViewMode('mobile-carnet');
}

// ==============================================================================
// MÓDULO 6: REPORTES Y AUDITORÍA
// ==============================================================================
async function loadReports() {
  try {
    const res = await fetch('api/reports.php');
    const json = await res.json();
    if (!json.error && json.metrics) {
      renderReportsMetrics(json.metrics, json.hourly_traffic, json.role_distribution);
    }
  } catch (err) {
    console.error('Error cargando reportes:', err);
  }
}

function renderReportsMetrics(m, hourly, roles) {
  const container = document.getElementById('reports-container');
  if (!container) return;

  const maxTraffic = Math.max(...hourly.map(h => h.count), 1);

  container.innerHTML = `
    <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
      <div class="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
        <p class="text-xs text-slate-500 font-semibold uppercase">Total Ingresos Hoy</p>
        <p class="text-2xl font-black text-blue-900 mt-1">${m.entries_today}</p>
        <p class="text-[11px] text-emerald-600 mt-1 font-semibold flex items-center gap-1">
          <span class="material-symbols-outlined text-[14px]">trending_up</span> Flujo Activo
        </p>
      </div>

      <div class="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
        <p class="text-xs text-slate-500 font-semibold uppercase">En Sede Ahora</p>
        <p class="text-2xl font-black text-emerald-700 mt-1">${m.in_campus_now}</p>
        <p class="text-[11px] text-slate-500 mt-1">Estimado en tiempo real</p>
      </div>

      <div class="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
        <p class="text-xs text-slate-500 font-semibold uppercase">Tasa de Asistencia</p>
        <p class="text-2xl font-black text-indigo-700 mt-1">${m.attendance_rate}%</p>
        <p class="text-[11px] text-slate-500 mt-1">${m.students_present} de ${m.students_present + m.students_late + m.students_absent + m.students_excused} aprendices</p>
      </div>

      <div class="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
        <p class="text-xs text-slate-500 font-semibold uppercase">Equipos en Préstamo</p>
        <p class="text-2xl font-black text-amber-700 mt-1">${m.assets_on_loan}</p>
        <p class="text-[11px] text-slate-500 mt-1">${m.assets_fixed} activos fijos</p>
      </div>
    </div>

    <!-- Gráfico de barras de tráfico horario -->
    <div class="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm mb-6">
      <div class="flex items-center justify-between mb-4">
        <div>
          <h3 class="font-bold text-slate-900 text-sm">Distribución de Accesos por Hora</h3>
          <p class="text-xs text-slate-500">Comportamiento en torniquetes y accesos principales</p>
        </div>
        <button onclick="exportAuditCSV()" class="px-3 py-1.5 rounded-lg text-xs font-semibold bg-blue-50 text-blue-800 hover:bg-blue-100 flex items-center gap-1.5 transition-colors">
          <span class="material-symbols-outlined text-[16px]">download</span>
          Exportar CSV
        </button>
      </div>

      <div class="h-44 flex items-end gap-3 pt-6 border-b border-slate-100">
        ${hourly.map(h => {
          const heightPct = Math.round((h.count / maxTraffic) * 100);
          return `
            <div class="flex-1 flex flex-col items-center gap-1.5 group">
              <span class="text-[10px] font-mono font-bold text-slate-600 opacity-0 group-hover:opacity-100 transition-opacity">${h.count}</span>
              <div class="w-full bg-blue-100 hover:bg-blue-600 rounded-t-md transition-all cursor-pointer relative" style="height: ${heightPct}%"></div>
              <span class="text-[10px] font-mono text-slate-500 mt-1">${h.hour}</span>
            </div>
          `;
        }).join('')}
      </div>
    </div>
  `;
}

function exportAuditCSV() {
  window.open('api/access.php', '_blank');
}

// ==============================================================================
// VISTA MÓVIL: CARNET ESTUDIANTE CON QR DINÁMICO
// ==============================================================================
function startCarnetTimer() {
  clearInterval(AppState.carnetTimerInterval);
  AppState.carnetCountdown = 30;

  function tick() {
    AppState.carnetCountdown--;
    if (AppState.carnetCountdown <= 0) {
      AppState.carnetCountdown = 30;
      refreshCarnetQR();
    }

    const timerEl = document.getElementById('carnet-timer-seconds');
    const barEl = document.getElementById('carnet-timer-bar');
    if (timerEl) timerEl.textContent = `${AppState.carnetCountdown}s`;
    if (barEl) {
      const pct = (AppState.carnetCountdown / 30) * 100;
      barEl.style.width = `${pct}%`;
    }
  }

  tick();
  AppState.carnetTimerInterval = setInterval(tick, 1000);
}

function refreshCarnetQR() {
  const hash = Math.random().toString(36).substring(2, 9).toUpperCase();
  const hashEl = document.getElementById('carnet-dynamic-hash');
  if (hashEl) hashEl.textContent = `#${hash}-${Date.now().toString().slice(-4)}`;
}

// ==============================================================================
// CONFIGURADOR SUPABASE MODAL
// ==============================================================================
function openSupabaseModal() {
  const modal = document.getElementById('modal-supabase');
  if (modal) modal.style.display = 'flex';
}

function closeSupabaseModal() {
  const modal = document.getElementById('modal-supabase');
  if (modal) modal.style.display = 'none';
}

async function testSupabaseConnection() {
  const url = document.getElementById('input-supabase-url')?.value.trim();
  const key = document.getElementById('input-supabase-key')?.value.trim();
  const feedback = document.getElementById('supabase-test-feedback');

  if (!url || !key) {
    if (feedback) {
      feedback.innerHTML = `<span class="text-amber-600 font-bold">Por favor ingrese la URL y la API Key de Supabase.</span>`;
    }
    return;
  }

  if (feedback) feedback.innerHTML = `<span class="text-blue-600">Verificando conexión con Supabase...</span>`;

  try {
    const res = await fetch('api/test_supabase.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ supabase_url: url, supabase_key: key })
    });
    const json = await res.json();

    if (json.success) {
      AudioSynth.playSuccess();
      feedback.innerHTML = `
        <div class="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-xs">
          <p class="font-bold flex items-center gap-1.5">
            <span class="material-symbols-outlined text-[16px]">check_circle</span>
            ¡Conexión Exitosa con Supabase! (${json.latency_ms} ms)
          </p>
          <p class="mt-1">${json.message}</p>
        </div>
      `;
    } else {
      AudioSynth.playDenied();
      feedback.innerHTML = `
        <div class="p-3 bg-red-50 border border-red-200 rounded-xl text-red-800 text-xs">
          <p class="font-bold flex items-center gap-1.5">
            <span class="material-symbols-outlined text-[16px]">cancel</span>
            Error de Conexión
          </p>
          <p class="mt-1">${json.message}</p>
        </div>
      `;
    }
  } catch (err) {
    feedback.innerHTML = `<span class="text-red-600 font-bold">Error realizando la prueba: ${err.message}</span>`;
  }
}

async function saveSupabaseConfig() {
  const url = document.getElementById('input-supabase-url')?.value.trim();
  const key = document.getElementById('input-supabase-key')?.value.trim();
  const feedback = document.getElementById('supabase-test-feedback');

  try {
    const res = await fetch('api/save_config.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ supabase_url: url, supabase_key: key })
    });
    const json = await res.json();
    if (!json.error) {
      AudioSynth.playSuccess();
      showToast('Configuración guardada en config.json');
      closeSupabaseModal();
      location.reload();
    } else {
      if (feedback) feedback.innerHTML = `<span class="text-red-600 font-bold">${json.message}</span>`;
    }
  } catch (err) {
    console.error('Error guardando configuración:', err);
  }
}

async function syncSeedToSupabase() {
  const feedback = document.getElementById('supabase-test-feedback');
  if (feedback) feedback.innerHTML = `<span class="text-blue-600">Sincronizando datos hacia Supabase...</span>`;

  try {
    const res = await fetch('api/sync_seed.php');
    const json = await res.json();
    if (!json.error) {
      AudioSynth.playSuccess();
      showToast('Datos sincronizados a Supabase con éxito');
      if (feedback) {
        feedback.innerHTML = `
          <div class="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-xs">
            <p class="font-bold">¡Datos cargados en Supabase!</p>
            <p class="mt-1">Accesos: ${json.summary.access_logs} | Estudiantes: ${json.summary.students} | Ambientes: ${json.summary.environments} | Equipos: ${json.summary.assets}</p>
          </div>
        `;
      }
    } else {
      AudioSynth.playDenied();
      if (feedback) feedback.innerHTML = `<span class="text-red-600 font-bold">${json.message}</span>`;
    }
  } catch (err) {
    console.error('Error sincronizando semilla:', err);
  }
}

// ==============================================================================
// INICIALIZACIÓN GENERAL
// ==============================================================================
document.addEventListener('DOMContentLoaded', () => {
  // Cargar módulos iniciales
  loadAccessLogs();
  updatePersonPreviewCard();

  // Atajo de teclado: Tecla Enter para registrar acceso rápido
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && e.target.tagName !== 'INPUT' && e.target.tagName !== 'TEXTAREA') {
      if (AppState.activeModule === 'porteria') {
        registerAccess('Ingreso');
      }
    }
  });

  // Filtro de búsqueda en portería
  const searchInput = document.getElementById('input-access-search');
  if (searchInput) {
    let debounce;
    searchInput.addEventListener('input', (e) => {
      clearTimeout(debounce);
      debounce = setTimeout(() => {
        const role = document.getElementById('select-access-role')?.value || 'Todos';
        loadAccessLogs(e.target.value, role);
      }, 250);
    });
  }

  const roleSelect = document.getElementById('select-access-role');
  if (roleSelect) {
    roleSelect.addEventListener('change', (e) => {
      const query = document.getElementById('input-access-search')?.value || '';
      loadAccessLogs(query, e.target.value);
    });
  }
});
