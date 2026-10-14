<?php
require_once __DIR__ . '/config.php';
$supabaseConnected = isSupabaseConfigured();
$localData = getLocalStorage();
?>
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>SGI Acceso - Control Institucional y Trazabilidad</title>
  <meta name="description" content="Sistema de control institucional de accesos con QR dinámico, gestión de aulas, asistencia y trazabilidad de activos con PHP y Supabase.">

  <!-- Tipografías Google Fonts -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=JetBrains+Mono:wght@400;500;600;700&display=swap" rel="stylesheet">
  <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200" rel="stylesheet">

  <!-- Tailwind CSS CDN para máxima flexibilidad y rendimiento inmediato en XAMPP -->
  <script src="https://cdn.tailwindcss.com"></script>
  <script>
    tailwind.config = {
      theme: {
        extend: {
          colors: {
            brand: {
              50: '#eff4ff',
              100: '#dbeafe',
              500: '#3b82f6',
              800: '#1e40af',
              900: '#00288e',
            }
          }
        }
      }
    }
  </script>

  <!-- Estilos del Sistema -->
  <link rel="stylesheet" href="assets/css/styles.css">
</head>
<body class="bg-slate-50 text-slate-900 min-h-screen flex flex-col font-sans antialiased select-none">

  <!-- Contenedor de notificaciones flotantes (Toast) -->
  <div id="toast-container" class="fixed top-20 right-6 z-50 flex flex-col gap-2 max-w-sm pointer-events-none"></div>

  <!-- Banner Superior de Selección de Vista (Desktop vs Móviles) -->
  <div class="bg-blue-900 text-white px-4 py-2 flex flex-wrap items-center justify-between text-xs font-semibold z-50 shadow-sm border-b border-white/10">
    <div class="flex items-center gap-2.5">
      <span class="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
      <span class="font-bold tracking-wide">SGI ACCESO INSTITUCIONAL</span>
      <span class="text-white/40 hidden sm:inline">|</span>
      <span class="text-white/80 hidden sm:inline">
        Control de Acceso, Asistencia y Trazabilidad de Activos (PHP + Supabase)
      </span>
    </div>

    <!-- Conmutador de Vistas -->
    <div class="flex items-center gap-1.5 flex-wrap">
      <span class="text-white/70 text-[11px] mr-1">Vistas Disponibles:</span>
      <button onclick="switchViewMode('desktop')" data-view-mode="desktop" type="button"
              class="px-2.5 py-1 rounded-md text-[11px] font-bold transition-all flex items-center gap-1 bg-white text-blue-900 shadow-xs">
        <span class="material-symbols-outlined text-[15px]">desktop_windows</span>
        <span>Escritorio</span>
      </button>

      <button onclick="switchViewMode('mobile-carnet')" data-view-mode="mobile-carnet" type="button"
              class="px-2.5 py-1 rounded-md text-[11px] font-bold transition-all flex items-center gap-1 bg-white/15 text-white hover:bg-white/25">
        <span class="material-symbols-outlined text-[15px]">qr_code_2</span>
        <span>App: Carnet Estudiante</span>
      </button>

      <button onclick="switchViewMode('mobile-guard')" data-view-mode="mobile-guard" type="button"
              class="px-2.5 py-1 rounded-md text-[11px] font-bold transition-all flex items-center gap-1 bg-white/15 text-white hover:bg-white/25">
        <span class="material-symbols-outlined text-[15px]">security</span>
        <span>App: Portería Móvil</span>
      </button>
    </div>
  </div>

  <!-- Alerta de Bloqueo Preventivo de Emergencia -->
  <div id="emergency-lock-banner" style="display: none;" class="bg-red-700 text-white px-4 py-2.5 flex items-center justify-between z-40 text-xs font-bold animate-pulse">
    <div class="flex items-center gap-2 mx-auto">
      <span class="material-symbols-outlined text-[20px]">warning</span>
      <span>¡BLOQUEO DE EMERGENCIA ACTIVO! Los torniquetes de acceso se encuentran bloqueados por protocolo de seguridad.</span>
    </div>
    <button onclick="toggleEmergencyLock()" class="bg-white text-red-800 px-3 py-1 rounded font-bold hover:bg-red-50 text-[11px]">
      Desactivar Bloqueo
    </button>
  </div>

  <!-- =========================================================================
       VISTA 1: SUITE DE ESCRITORIO INSTITUCIONAL
       ========================================================================= -->
  <div id="view-desktop" class="relative min-h-screen">

    <!-- SIDEBAR DE NAVEGACIÓN -->
    <aside class="fixed left-0 top-10 bottom-0 w-64 bg-white border-r border-slate-200/90 shadow-sm z-30 flex flex-col justify-between">
      <div>
        <!-- Logo y Nombre -->
        <div class="h-16 flex items-center gap-3 px-5 border-b border-slate-100">
          <div class="w-9 h-9 rounded-xl bg-blue-900 flex items-center justify-center text-white font-black text-lg shadow-sm">
            S
          </div>
          <div>
            <h1 class="font-extrabold text-sm text-blue-900 leading-tight">SGI Acceso</h1>
            <p class="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Control Institucional</p>
          </div>
        </div>

        <!-- Indicador de Nivel de Seguridad -->
        <div class="p-3">
          <div class="bg-slate-50 border border-slate-100 px-3 py-2 rounded-xl flex items-center justify-between">
            <span class="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Seguridad</span>
            <span class="text-[10px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded font-bold">NORMAL</span>
          </div>
        </div>

        <!-- Links de Navegación -->
        <div class="px-5 pt-2 pb-1 text-[10px] font-bold uppercase tracking-wider text-slate-400">
          Módulos Operativos
        </div>

        <nav class="flex flex-col gap-1 px-3">
          <button onclick="switchModule('porteria')" data-module="porteria"
                  class="sidebar-link w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold bg-blue-900 text-white shadow-sm transition-all">
            <div class="flex items-center gap-2.5">
              <span class="material-symbols-outlined text-[19px]">qr_code_scanner</span>
              <span>Control de Portería & QR</span>
            </div>
            <span class="text-[9px] font-extrabold bg-emerald-400 text-slate-950 px-1.5 py-0.5 rounded">ACTIVO</span>
          </button>

          <button onclick="switchModule('ambientes')" data-module="ambientes"
                  class="sidebar-link w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-100 transition-all">
            <div class="flex items-center gap-2.5">
              <span class="material-symbols-outlined text-[19px]">meeting_room</span>
              <span>Gestión de Ambientes</span>
            </div>
            <span class="text-[10px] font-mono text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded">6 Aulas</span>
          </button>

          <button onclick="switchModule('asistencia')" data-module="asistencia"
                  class="sidebar-link w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-100 transition-all">
            <div class="flex items-center gap-2.5">
              <span class="material-symbols-outlined text-[19px]">badge</span>
              <span>Control de Asistencia</span>
            </div>
            <span class="text-[9px] font-bold text-blue-700 bg-blue-50 px-1.5 py-0.5 rounded">Sesión</span>
          </button>

          <button onclick="switchModule('equipos')" data-module="equipos"
                  class="sidebar-link w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-100 transition-all">
            <div class="flex items-center gap-2.5">
              <span class="material-symbols-outlined text-[19px]">devices</span>
              <span>Novedades y Equipos</span>
            </div>
            <span class="text-[9px] font-bold text-amber-800 bg-amber-100 px-1.5 py-0.5 rounded">5 Activos</span>
          </button>

          <button onclick="switchModule('usuarios')" data-module="usuarios"
                  class="sidebar-link w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-100 transition-all">
            <div class="flex items-center gap-2.5">
              <span class="material-symbols-outlined text-[19px]">id_card</span>
              <span>Usuarios y Carnets</span>
            </div>
          </button>

          <button onclick="switchModule('reportes')" data-module="reportes"
                  class="sidebar-link w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-100 transition-all">
            <div class="flex items-center gap-2.5">
              <span class="material-symbols-outlined text-[19px]">summarize</span>
              <span>Reportes y Auditoría</span>
            </div>
          </button>
        </nav>
      </div>

      <!-- Pie del Sidebar: Supabase status & Config button -->
      <div class="p-3 border-t border-slate-100 bg-slate-50/50">
        <button onclick="openSupabaseModal()" type="button"
                class="w-full flex items-center justify-between p-2.5 rounded-xl border <?= $supabaseConnected ? 'border-emerald-200 bg-emerald-50/80 hover:bg-emerald-100/70' : 'border-amber-200 bg-amber-50/80 hover:bg-amber-100/70' ?> transition-all text-left">
          <div class="flex items-center gap-2">
            <span class="w-2.5 h-2.5 rounded-full <?= $supabaseConnected ? 'bg-emerald-500 pulse-green' : 'bg-amber-500 animate-pulse' ?>"></span>
            <div>
              <p class="text-[11px] font-bold <?= $supabaseConnected ? 'text-emerald-900' : 'text-amber-900' ?>">
                <?= $supabaseConnected ? 'Supabase Conectado' : 'Modo Local Activo' ?>
              </p>
              <p class="text-[10px] text-slate-500">Configurar credenciales</p>
            </div>
          </div>
          <span class="material-symbols-outlined text-[18px] text-slate-400">tune</span>
        </button>
      </div>
    </aside>

    <!-- ÁREA DE CONTENIDO PRINCIPAL -->
    <div class="pl-64 flex flex-col min-h-screen">

      <!-- HEADER SUPERIOR -->
      <header class="h-16 bg-white/90 backdrop-blur-md border-b border-slate-200/90 shadow-xs z-20 flex items-center justify-between px-8 sticky top-10">
        <!-- Indicador de Sincronización y Ubicación -->
        <div class="flex items-center gap-4">
          <div class="flex items-center gap-2 bg-slate-100 px-3 py-1.5 rounded-full">
            <span class="w-2 h-2 rounded-full <?= $supabaseConnected ? 'bg-emerald-500' : 'bg-blue-600' ?> animate-ping"></span>
            <span class="text-xs text-slate-700 font-semibold">
              <?= $supabaseConnected ? 'Supabase Cloud: Conectado 99.9%' : 'XAMPP Apache: Almacenamiento Local' ?>
            </span>
          </div>

          <div class="hidden lg:flex items-center gap-1 text-slate-500 text-xs">
            <span class="material-symbols-outlined text-[18px]">corporate_fare</span>
            <span>Campus Central: Puerta Principal</span>
          </div>
        </div>

        <!-- Perfil y Acciones de Cabecera -->
        <div class="flex items-center gap-3">
          <button onclick="openSupabaseModal()" class="px-3 py-1.5 rounded-lg border border-slate-200 hover:border-slate-300 bg-white text-xs font-semibold text-slate-700 flex items-center gap-1.5 transition-colors">
            <span class="material-symbols-outlined text-[16px] text-blue-700">database</span>
            <span>Supabase</span>
          </button>

          <div class="flex items-center gap-2 pl-3 border-l border-slate-200">
            <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuDdfwl4UT_p5W5ojP8tOZ1gTksXhD6F_KTWGUUAuDofxVj5AOFQJKmTCD2rFqhePwr3I7cua4A15krrg-KOs04C6oOn5U6gRrJ53YiApYD3amLHJghCt64zHRQU0mJyX42mWcxHVQ38moTB2aJP0hgkl20ieSBWgJ0Os446FFMLopR7eRvDCmFC66CxE8HQ0QEGKJWotz-n1YOVo5Prx5sqDQhXAvIV5b3Ijt7gNgQ1VcXYPK0phvwXRg"
                 alt="Admin" class="w-8 h-8 rounded-full object-cover ring-1 ring-slate-200">
            <div class="hidden sm:block text-left leading-tight">
              <p class="text-xs font-bold text-slate-900">Ing. Carlos Mendoza</p>
              <p class="text-[10px] text-slate-500 font-medium">Operaciones / Portería</p>
            </div>
          </div>
        </div>
      </header>

      <!-- MAIN CONTENEDOR DE TABS -->
      <main class="p-8 flex-1">

        <!-- =====================================================================
             TAB 1: CONTROL DE PORTERÍA & QR
             ===================================================================== -->
        <section id="tab-porteria" class="tab-content active">
          
          <!-- Tarjetas KPI de Estado Rápido -->
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <div class="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
              <div>
                <p class="text-xs text-slate-500 font-semibold uppercase">Torniquetes Activos</p>
                <p class="text-xl font-extrabold text-blue-900 mt-0.5">4/4 Operativos</p>
                <p class="text-[11px] text-emerald-600 font-semibold mt-0.5 flex items-center gap-1">
                  <span class="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> Modo Biométrico & QR
                </p>
              </div>
              <div class="w-10 h-10 rounded-xl bg-blue-50 text-blue-900 flex items-center justify-center">
                <span class="material-symbols-outlined text-[24px]">sensor_door</span>
              </div>
            </div>

            <div class="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
              <div>
                <p class="text-xs text-slate-500 font-semibold uppercase">Flujo Hora Pico</p>
                <p class="text-xl font-extrabold text-slate-900 mt-0.5">92 pases/h</p>
                <p class="text-[11px] text-slate-500 mt-0.5">Ventana: 07:30 - 08:30</p>
              </div>
              <div class="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-800 flex items-center justify-center">
                <span class="material-symbols-outlined text-[24px]">speed</span>
              </div>
            </div>

            <div class="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
              <div>
                <p class="text-xs text-slate-500 font-semibold uppercase">En Sede Ahora</p>
                <p class="text-xl font-extrabold text-slate-900 mt-0.5">48 Personas</p>
                <p class="text-[11px] text-slate-500 mt-0.5">38 Aprendices • 10 Staff</p>
              </div>
              <div class="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-900 flex items-center justify-center">
                <span class="material-symbols-outlined text-[24px]">group</span>
              </div>
            </div>

            <div class="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
              <div>
                <p class="text-xs text-slate-500 font-semibold uppercase">Alertas / Denegados</p>
                <p class="text-xl font-extrabold text-red-600 mt-0.5">1 Evento</p>
                <p class="text-[11px] text-red-600 font-medium mt-0.5">QR vencido detectado</p>
              </div>
              <div class="w-10 h-10 rounded-xl bg-red-50 text-red-700 flex items-center justify-center">
                <span class="material-symbols-outlined text-[24px]">notification_important</span>
              </div>
            </div>
          </div>

          <!-- Módulo Central: Escáner y Validación de Persona -->
          <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-8">

            <!-- Columna Izquierda: Visor del Escáner QR de Torniquete (5 Cols) -->
            <div class="lg:col-span-5 bg-slate-900 text-white rounded-3xl p-5 shadow-xl flex flex-col justify-between relative overflow-hidden">
              <div id="scanner-light-overlay" class="absolute inset-0 bg-white pointer-events-none opacity-0 transition-opacity"></div>

              <div>
                <div class="flex items-center justify-between mb-3">
                  <div class="flex items-center gap-2">
                    <span class="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
                    <span class="font-bold text-xs uppercase tracking-wider text-emerald-400">Escáner Activo: Torniquete V-04</span>
                  </div>
                  <div class="flex items-center gap-1">
                    <button onclick="toggleFlashlight()" class="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white text-xs" title="Linterna">
                      <span id="flashlight-icon" class="material-symbols-outlined text-[17px]">flash_off</span>
                    </button>
                    <button onclick="flipCamera()" class="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white text-xs" title="Girar Cámara">
                      <span class="material-symbols-outlined text-[17px]">flip_camera_ios</span>
                    </button>
                  </div>
                </div>

                <!-- Visor Simulado de Cámara con Láser -->
                <div class="w-full h-56 bg-slate-950 rounded-2xl relative flex items-center justify-center border border-white/15 overflow-hidden">
                  <!-- Retícula de escaneo -->
                  <div class="w-44 h-44 border-2 border-emerald-400/80 rounded-2xl relative flex items-center justify-center shadow-[0_0_20px_rgba(16,185,129,0.3)]">
                    <!-- Láser dinámico -->
                    <div class="absolute left-2 right-2 h-0.5 bg-emerald-400 animate-scan-laser shadow-[0_0_12px_#34d399]"></div>
                    <span class="material-symbols-outlined text-white/30 text-[72px]">qr_code_2</span>
                  </div>

                  <div class="absolute bottom-3 text-center text-[11px] text-white/70 font-mono">
                    Alinee el Carnet QR Dinámico en el recuadro
                  </div>
                </div>
              </div>

              <!-- Consultar Documento Rápido -->
              <div class="mt-4 pt-4 border-t border-white/10">
                <p class="text-[11px] text-white/70 mb-2 font-medium">Búsqueda Rápida de Identificación:</p>
                <div class="flex gap-2">
                  <input id="input-doc-query" type="text" value="1036982410" 
                         class="bg-white/10 text-white placeholder-white/40 border border-white/20 rounded-xl px-3 py-2 text-xs w-full focus:outline-none focus:ring-2 focus:ring-emerald-400 font-mono" 
                         placeholder="Cédula o Código...">
                  <button onclick="queryPersonByDoc()" class="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold px-4 py-2 rounded-xl text-xs transition-colors flex items-center gap-1 shrink-0">
                    <span class="material-symbols-outlined text-[16px]">search</span>
                    <span>Consultar</span>
                  </button>
                </div>

                <!-- Atajos rápidos -->
                <div class="flex items-center gap-2 mt-2 text-[10px] text-white/60">
                  <span>Pruebas:</span>
                  <button onclick="queryPersonByDoc('1036982410')" class="underline hover:text-white">Valentina (Estudiante)</button>
                  <span>•</span>
                  <button onclick="queryPersonByDoc('71394021')" class="underline hover:text-white">Camilo (Instructor)</button>
                </div>
              </div>
            </div>

            <!-- Columna Derecha: Tarjeta de Verificación del Usuario Identificado (7 Cols) -->
            <div class="lg:col-span-7 bg-white rounded-3xl p-6 border border-slate-200 shadow-sm flex flex-col justify-between">
              <div>
                <div class="flex items-center justify-between pb-4 border-b border-slate-100">
                  <div class="flex items-center gap-2">
                    <span class="material-symbols-outlined text-blue-900 text-[20px]">how_to_reg</span>
                    <h2 class="font-extrabold text-slate-900 text-sm">Ficha de Identificación Institucional</h2>
                  </div>
                  <span class="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200 flex items-center gap-1">
                    <span class="material-symbols-outlined text-[14px]">verified</span> Habilitado para Ingreso
                  </span>
                </div>

                <!-- Datos Principales de la Persona -->
                <div class="grid grid-cols-1 md:grid-cols-12 gap-5 mt-5">
                  <div class="md:col-span-4 flex flex-col items-center text-center">
                    <img id="preview-photo" 
                         src="https://lh3.googleusercontent.com/aida-public/AB6AXuAW2bl7t4zaAY0z7mG0kX3fZ49i7-Rd7RBeGYYFccDuMsXvl9OLCOQe9SAOng69jf12jxTx1lkSbGFt9xX7JywGZAjLMBcBVNltme7BgWrWK-keJ4Ej1BPX3qgkblN_oMOR8LQ5j0RWJwUxp_MMVMfsuTqqN5SyK7GDIzDYv2RmM9yrrZdyaEGo3AwwCNb8P47EGebWfjC8scg_XVKO8WpyNX9MwSbuzp4fOYL0P3ls5QQwmObaLNg9vw" 
                         alt="Foto Usuario" class="w-28 h-28 rounded-2xl object-cover ring-4 ring-slate-100 shadow-md">
                    <span id="preview-role" class="mt-2.5 px-2.5 py-0.5 rounded text-[10px] font-extrabold bg-blue-100 text-blue-800 tracking-wider uppercase">
                      ESTUDIANTE
                    </span>
                  </div>

                  <div class="md:col-span-8 flex flex-col justify-center space-y-2">
                    <div>
                      <h3 id="preview-name" class="font-black text-slate-900 text-lg leading-tight">Valentina Restrepo Giraldo</h3>
                      <p id="preview-doc" class="font-mono text-xs text-slate-500 font-bold">CC 1.036.982.410</p>
                    </div>

                    <div class="bg-slate-50 p-3 rounded-xl border border-slate-100 text-xs">
                      <p id="preview-program" class="font-semibold text-slate-800">Tecnología en Desarrollo de Software - Ficha 267014 (Jornada Mañana)</p>
                      <p class="text-emerald-700 font-bold text-[11px] mt-1 flex items-center gap-1">
                        <span class="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> Matrícula Vigente 2025-1
                      </p>
                    </div>

                    <!-- Equipo Asociado -->
                    <div class="flex items-center gap-3 p-2.5 rounded-xl bg-blue-50/70 border border-blue-100 text-xs">
                      <span class="material-symbols-outlined text-blue-800 text-[22px]">laptop_mac</span>
                      <div class="flex-1">
                        <p class="text-[10px] uppercase font-bold text-blue-900">Equipo Declarado Autorizado:</p>
                        <p id="preview-laptop" class="font-bold text-slate-900">Lenovo ThinkPad E14 Gen 4</p>
                        <p id="preview-serial" class="font-mono text-[10px] text-slate-500">#LNV-99214 • Pase Vigente</p>
                      </div>
                      <span class="material-symbols-outlined text-emerald-600 text-[18px]">check_circle</span>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Botones de Acción Inmediata (Ingreso / Salida) -->
              <div class="pt-5 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3 mt-4">
                <div class="flex items-center gap-2">
                  <button onclick="registerAccess('Ingreso')" class="bg-blue-900 hover:bg-blue-800 text-white font-bold px-5 py-2.5 rounded-xl text-xs flex items-center gap-2 shadow-sm transition-all">
                    <span class="material-symbols-outlined text-[18px]">login</span>
                    <span>Autorizar Ingreso (Enter)</span>
                  </button>
                  <button onclick="registerAccess('Salida')" class="bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold px-4 py-2.5 rounded-xl text-xs flex items-center gap-2 transition-all">
                    <span class="material-symbols-outlined text-[18px]">logout</span>
                    <span>Registrar Salida</span>
                  </button>
                </div>

                <button id="btn-emergency-lock" onclick="toggleEmergencyLock()" class="px-3.5 py-2 rounded-xl text-xs font-bold border border-red-200 text-red-700 hover:bg-red-50 flex items-center gap-1.5 transition-all">
                  <span class="material-symbols-outlined text-[17px]">emergency</span>
                  <span>Bloqueo Preventivo</span>
                </button>
              </div>
            </div>
          </div>

          <!-- Tabla de Registros en Tiempo Real -->
          <div class="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
            <div class="p-5 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h3 class="font-extrabold text-slate-900 text-sm">Registro de Accesos en Vivo</h3>
                <p class="text-xs text-slate-500">Sincronizado con base de datos y torniquetes</p>
              </div>

              <!-- Filtros de la Tabla -->
              <div class="flex items-center gap-3">
                <div class="relative">
                  <input id="input-access-search" type="text" placeholder="Buscar por nombre o cédula..." 
                         class="pl-8 pr-3 py-1.5 rounded-xl border border-slate-200 bg-slate-50 text-xs focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-600 w-56 font-medium">
                  <span class="material-symbols-outlined text-slate-400 absolute left-2.5 top-2 text-[16px]">search</span>
                </div>

                <select id="select-access-role" class="px-3 py-1.5 rounded-xl border border-slate-200 bg-slate-50 text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-blue-600 text-slate-700">
                  <option value="Todos">Todos los Roles</option>
                  <option value="ESTUDIANTE">Estudiantes</option>
                  <option value="INSTRUCTOR">Instructores</option>
                  <option value="PROVEEDOR">Proveedores</option>
                  <option value="ADMINISTRATIVO">Administrativos</option>
                </select>

                <button onclick="loadAccessLogs()" class="p-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-600" title="Actualizar">
                  <span class="material-symbols-outlined text-[18px]">refresh</span>
                </button>
              </div>
            </div>

            <div class="overflow-x-auto">
              <table class="w-full text-left border-collapse">
                <thead>
                  <tr class="bg-slate-50/80 text-[11px] font-bold uppercase tracking-wider text-slate-500 border-b border-slate-100">
                    <th class="py-3 px-4">Hora</th>
                    <th class="py-3 px-4">Usuario</th>
                    <th class="py-3 px-4">Rol</th>
                    <th class="py-3 px-4 hidden md:table-cell">Destino</th>
                    <th class="py-3 px-4 hidden lg:table-cell">Equipo Declarado</th>
                    <th class="py-3 px-4">Resultado</th>
                    <th class="py-3 px-4 text-right">Ficha</th>
                  </tr>
                </thead>
                <tbody id="access-logs-tbody">
                  <!-- Llenado dinámicamente por app.js -->
                </tbody>
              </table>
            </div>
          </div>

        </section>

        <!-- =====================================================================
             TAB 2: GESTIÓN DE AMBIENTES Y AULAS
             ===================================================================== -->
        <section id="tab-ambientes" class="tab-content">
          <div class="flex items-center justify-between mb-6">
            <div>
              <h2 class="text-lg font-black text-slate-900">Ambientes de Formación y Laboratorios</h2>
              <p class="text-xs text-slate-500">Monitoreo de ocupación, aforo y control biomagnético de puertas</p>
            </div>
            <button onclick="loadEnvironments()" class="px-3 py-1.5 rounded-xl bg-white border border-slate-200 text-xs font-semibold hover:bg-slate-50 flex items-center gap-1">
              <span class="material-symbols-outlined text-[16px]">refresh</span> Actualizar
            </button>
          </div>

          <div id="environments-grid" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <!-- Renderizado por app.js -->
          </div>
        </section>

        <!-- =====================================================================
             TAB 3: CONTROL DE ASISTENCIA
             ===================================================================== -->
        <section id="tab-asistencia" class="tab-content">
          <div class="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div class="flex items-center gap-2 mb-1">
                <span class="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-100 text-blue-800">Ficha 267014</span>
                <span class="text-xs text-slate-500 font-semibold">• Laboratorio TIC 302</span>
              </div>
              <h2 class="text-lg font-black text-slate-900">Bases de Datos MySQL & Arquitectura</h2>
              <p class="text-xs text-slate-500">Instructora: Ing. Sandra Milena Peña • 07:00 - 10:00</p>
            </div>

            <div class="flex items-center gap-4">
              <div class="text-right">
                <p id="stat-attendance-rate" class="text-2xl font-black text-blue-900">92%</p>
                <p id="stat-attendance-summary" class="text-[11px] text-slate-500 font-medium">Asistencia de la Sesión</p>
              </div>
              <button onclick="loadAttendance()" class="px-3 py-2 rounded-xl bg-blue-900 hover:bg-blue-800 text-white font-bold text-xs flex items-center gap-1.5 transition-colors">
                <span class="material-symbols-outlined text-[17px]">refresh</span>
                <span>Sincronizar</span>
              </button>
            </div>
          </div>

          <!-- Tabla de Aprendices -->
          <div class="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
            <div class="p-4 border-b border-slate-100 flex items-center justify-between text-xs font-semibold">
              <span class="text-slate-700">Listado de Aprendices Convocados</span>
              <div class="flex items-center gap-2 text-[11px] text-slate-500">
                <span class="flex items-center gap-1"><span class="w-2.5 h-2.5 rounded bg-emerald-600"></span> Presente (P)</span>
                <span class="flex items-center gap-1"><span class="w-2.5 h-2.5 rounded bg-amber-500"></span> Retardo (R)</span>
                <span class="flex items-center gap-1"><span class="w-2.5 h-2.5 rounded bg-blue-600"></span> Justificado (J)</span>
                <span class="flex items-center gap-1"><span class="w-2.5 h-2.5 rounded bg-red-600"></span> Falla (F)</span>
              </div>
            </div>

            <div class="overflow-x-auto">
              <table class="w-full text-left border-collapse">
                <thead>
                  <tr class="bg-slate-50 text-[11px] font-bold uppercase tracking-wider text-slate-500 border-b border-slate-100">
                    <th class="py-3 px-4 w-12">#</th>
                    <th class="py-3 px-4">Estudiante</th>
                    <th class="py-3 px-4">Estado</th>
                    <th class="py-3 px-4">Hora</th>
                    <th class="py-3 px-4 hidden md:table-cell">Dispositivo</th>
                    <th class="py-3 px-4 hidden lg:table-cell">Equipo Vinculado</th>
                    <th class="py-3 px-4">Observaciones / Novedad</th>
                  </tr>
                </thead>
                <tbody id="attendance-tbody">
                  <!-- Renderizado por app.js -->
                </tbody>
              </table>
            </div>
          </div>
        </section>

        <!-- =====================================================================
             TAB 4: NOVEDADES Y EQUIPOS
             ===================================================================== -->
        <section id="tab-equipos" class="tab-content">
          <div class="flex items-center justify-between mb-6">
            <div>
              <h2 class="text-lg font-black text-slate-900">Trazabilidad de Equipos y Activos</h2>
              <p class="text-xs text-slate-500">Gestión de activos fijos, préstamos y dispositivos personales declarados</p>
            </div>
            <button onclick="loadAssets()" class="px-3 py-1.5 rounded-xl bg-white border border-slate-200 text-xs font-semibold hover:bg-slate-50 flex items-center gap-1">
              <span class="material-symbols-outlined text-[16px]">refresh</span> Actualizar
            </button>
          </div>

          <div id="assets-grid" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <!-- Renderizado por app.js -->
          </div>
        </section>

        <!-- =====================================================================
             TAB 5: USUARIOS Y CARNETS
             ===================================================================== -->
        <section id="tab-usuarios" class="tab-content">
          <div class="flex items-center justify-between mb-6">
            <div>
              <h2 class="text-lg font-black text-slate-900">Directorio Institucional y Carnets Digitales</h2>
              <p class="text-xs text-slate-500">Credenciales con código dinámico QR para personal y estudiantes</p>
            </div>
            <button onclick="loadUsers()" class="px-3 py-1.5 rounded-xl bg-white border border-slate-200 text-xs font-semibold hover:bg-slate-50 flex items-center gap-1">
              <span class="material-symbols-outlined text-[16px]">refresh</span> Actualizar
            </button>
          </div>

          <div id="users-grid" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <!-- Renderizado por app.js -->
          </div>
        </section>

        <!-- =====================================================================
             TAB 6: REPORTES Y AUDITORÍA
             ===================================================================== -->
        <section id="tab-reportes" class="tab-content">
          <div class="flex items-center justify-between mb-6">
            <div>
              <h2 class="text-lg font-black text-slate-900">Auditoría y Métricas Institucionales</h2>
              <p class="text-xs text-slate-500">Estadísticas consolidadas de accesos, puntualidad y flujo por horas</p>
            </div>
            <button onclick="loadReports()" class="px-3 py-1.5 rounded-xl bg-white border border-slate-200 text-xs font-semibold hover:bg-slate-50 flex items-center gap-1">
              <span class="material-symbols-outlined text-[16px]">refresh</span> Actualizar
            </button>
          </div>

          <div id="reports-container">
            <!-- Renderizado dinámicamente por app.js -->
          </div>
        </section>

      </main>
    </div>
  </div>

  <!-- =========================================================================
       VISTA 2: VISTA MÓVIL - CARNET DIGITAL DEL ESTUDIANTE
       ========================================================================= -->
  <div id="view-mobile-carnet" style="display: none;" class="flex-1 items-center justify-center py-8 px-4 bg-slate-200/60">
    <div class="phone-casing">
      <div class="phone-island">
        <div class="phone-island-camera"></div>
      </div>

      <!-- Barra de estado del teléfono -->
      <div class="pt-8 px-6 pb-2 flex items-center justify-between text-[11px] font-bold text-slate-800">
        <span>08:14</span>
        <div class="flex items-center gap-1.5">
          <span class="material-symbols-outlined text-[14px]">signal_cellular_4_bar</span>
          <span class="material-symbols-outlined text-[14px]">wifi</span>
          <span class="material-symbols-outlined text-[14px]">battery_full</span>
        </div>
      </div>

      <!-- Carnet Digital Content -->
      <div class="flex-1 overflow-y-auto px-5 py-3 flex flex-col justify-between">
        <div>
          <!-- Cabecera Institucional del Carnet -->
          <div class="bg-blue-900 text-white p-4 rounded-2xl shadow-sm text-center relative overflow-hidden">
            <p class="text-[10px] uppercase font-bold tracking-wider text-blue-200">Instituto Tecnológico Superior</p>
            <h3 class="text-sm font-extrabold tracking-tight mt-0.5">Carnet Digital de Acceso</h3>
            <span class="inline-block mt-1 px-2 py-0.5 rounded text-[9px] font-bold bg-emerald-400 text-slate-950">VIGENTE 2025</span>
          </div>

          <!-- Foto y Datos del Estudiante -->
          <div class="mt-4 flex flex-col items-center text-center">
            <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuAW2bl7t4zaAY0z7mG0kX3fZ49i7-Rd7RBeGYYFccDuMsXvl9OLCOQe9SAOng69jf12jxTx1lkSbGFt9xX7JywGZAjLMBcBVNltme7BgWrWK-keJ4Ej1BPX3qgkblN_oMOR8LQ5j0RWJwUxp_MMVMfsuTqqN5SyK7GDIzDYv2RmM9yrrZdyaEGo3AwwCNb8P47EGebWfjC8scg_XVKO8WpyNX9MwSbuzp4fOYL0P3ls5QQwmObaLNg9vw" 
                 alt="Valentina Restrepo" class="w-20 h-20 rounded-2xl object-cover ring-4 ring-blue-100 shadow-md">
            
            <h4 class="font-extrabold text-slate-900 text-sm mt-2 leading-tight">Valentina Restrepo Giraldo</h4>
            <p class="font-mono text-xs text-slate-500 font-bold">CC 1.036.982.410</p>
            <p class="text-[11px] text-slate-600 mt-1 font-medium">Tecnología en Desarrollo de Software</p>
          </div>

          <!-- QR Dinámico con Temporizador Anticopia -->
          <div class="mt-4 bg-slate-50 border border-slate-200 rounded-2xl p-4 flex flex-col items-center shadow-xs">
            <div class="w-36 h-36 bg-white p-2.5 rounded-xl border border-slate-200 shadow-inner flex items-center justify-center relative">
              <span class="material-symbols-outlined text-[100px] text-slate-900">qr_code_2</span>
            </div>

            <!-- Contador de rotación -->
            <div class="w-full mt-3">
              <div class="flex items-center justify-between text-[10px] font-mono font-bold text-slate-600 mb-1">
                <span class="flex items-center gap-1">
                  <span class="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span> QR Dinámico
                </span>
                <span id="carnet-timer-seconds">30s</span>
              </div>
              <div class="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                <div id="carnet-timer-bar" class="bg-blue-700 h-full rounded-full transition-all duration-1000" style="width: 100%"></div>
              </div>
              <p id="carnet-dynamic-hash" class="text-[9px] font-mono text-center text-slate-400 mt-1">#88F2-SECURE-HASH</p>
            </div>
          </div>

          <!-- Dispositivo Autorizado -->
          <div class="mt-3 p-2.5 rounded-xl bg-slate-100 text-xs flex items-center gap-2">
            <span class="material-symbols-outlined text-slate-600 text-[18px]">devices</span>
            <div class="flex-1">
              <p class="text-[10px] text-slate-500 uppercase font-bold">Laptop Registrada:</p>
              <p class="font-semibold text-slate-900 text-[11px]">Lenovo ThinkPad E14 (#LNV-99214)</p>
            </div>
            <span class="material-symbols-outlined text-emerald-600 text-[16px]">check_circle</span>
          </div>
        </div>

        <!-- Botón para regresar a escritorio -->
        <button onclick="switchViewMode('desktop')" class="w-full mt-3 py-2.5 rounded-xl bg-slate-900 text-white text-xs font-bold hover:bg-slate-800 transition-colors">
          Volver a Modo Escritorio
        </button>
      </div>
    </div>
  </div>

  <!-- =========================================================================
       VISTA 3: VISTA MÓVIL - PORTERÍA MÓVIL DEL GUARDIA
       ========================================================================= -->
  <div id="view-mobile-guard" style="display: none;" class="flex-1 items-center justify-center py-8 px-4 bg-slate-200/60">
    <div class="phone-casing bg-slate-950 text-white">
      <div class="phone-island">
        <div class="phone-island-camera"></div>
      </div>

      <div class="pt-8 px-6 pb-2 flex items-center justify-between text-[11px] font-bold text-white/80">
        <span>Guardia Móvil #02</span>
        <span class="material-symbols-outlined text-[16px] text-emerald-400">verified_user</span>
      </div>

      <div class="flex-1 overflow-y-auto px-4 py-2 flex flex-col justify-between">
        <div>
          <!-- Visor de Escaneo Rápido -->
          <div class="relative w-full h-64 bg-slate-900 rounded-2xl border border-white/20 overflow-hidden flex items-center justify-center">
            <div class="w-48 h-48 border-2 border-emerald-400 rounded-xl relative flex items-center justify-center shadow-[0_0_20px_rgba(16,185,129,0.3)]">
              <div class="absolute left-2 right-2 h-0.5 bg-emerald-400 animate-scan-laser"></div>
              <span class="material-symbols-outlined text-white/30 text-[80px]">qr_code_scanner</span>
            </div>
            <div class="absolute top-2 right-2 flex gap-1">
              <button onclick="toggleFlashlight()" class="p-1 rounded bg-black/50 text-white">
                <span class="material-symbols-outlined text-[16px]">flash_on</span>
              </button>
            </div>
          </div>

          <!-- Resultado del Escaneo -->
          <div class="mt-4 bg-slate-900 border border-white/10 rounded-2xl p-4">
            <div class="flex items-center gap-3">
              <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuAW2bl7t4zaAY0z7mG0kX3fZ49i7-Rd7RBeGYYFccDuMsXvl9OLCOQe9SAOng69jf12jxTx1lkSbGFt9xX7JywGZAjLMBcBVNltme7BgWrWK-keJ4Ej1BPX3qgkblN_oMOR8LQ5j0RWJwUxp_MMVMfsuTqqN5SyK7GDIzDYv2RmM9yrrZdyaEGo3AwwCNb8P47EGebWfjC8scg_XVKO8WpyNX9MwSbuzp4fOYL0P3ls5QQwmObaLNg9vw" 
                   class="w-12 h-12 rounded-xl object-cover ring-2 ring-emerald-400">
              <div class="flex-1">
                <h4 class="font-bold text-white text-xs">Valentina Restrepo</h4>
                <p class="font-mono text-[10px] text-white/60">CC 1.036.982.410 • Estudiante</p>
                <span class="inline-block mt-0.5 text-[9px] font-bold text-emerald-400 bg-emerald-950/80 px-1.5 py-0.5 rounded border border-emerald-500/30">
                  MATRÍCULA ACTIVA
                </span>
              </div>
            </div>

            <!-- Botones Grandes de Confirmación -->
            <div class="grid grid-cols-2 gap-2 mt-4">
              <button onclick="registerAccess('Ingreso')" class="py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs flex items-center justify-center gap-1.5 transition-colors">
                <span class="material-symbols-outlined text-[18px]">check_circle</span>
                <span>PERMITIR</span>
              </button>
              <button onclick="AudioSynth.playDenied(); showToast('Acceso Rechazado por Guardia', 'error');" class="py-3 rounded-xl bg-red-600 hover:bg-red-500 text-white font-black text-xs flex items-center justify-center gap-1.5 transition-colors">
                <span class="material-symbols-outlined text-[18px]">cancel</span>
                <span>DENEGAR</span>
              </button>
            </div>
          </div>
        </div>

        <button onclick="switchViewMode('desktop')" class="w-full mt-3 py-2.5 rounded-xl bg-white/10 text-white text-xs font-bold hover:bg-white/20 transition-colors">
          Volver a Pantalla Completa
        </button>
      </div>
    </div>
  </div>

  <!-- =========================================================================
       MODAL DE CONFIGURACIÓN DE SUPABASE
       ========================================================================= -->
  <div id="modal-supabase" style="display: none;" class="fixed inset-0 bg-slate-950/70 backdrop-blur-sm z-50 items-center justify-center p-4">
    <div class="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200">
      <div class="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
        <div class="flex items-center gap-2.5">
          <div class="w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-700 flex items-center justify-center font-bold">
            <span class="material-symbols-outlined text-[20px]">database</span>
          </div>
          <div>
            <h3 class="font-bold text-slate-900 text-sm">Configuración de Supabase Cloud</h3>
            <p class="text-[11px] text-slate-500">Conecte su base de datos PostgreSQL en la nube</p>
          </div>
        </div>
        <button onclick="closeSupabaseModal()" class="text-slate-400 hover:text-slate-600 p-1">
          <span class="material-symbols-outlined text-[20px]">close</span>
        </button>
      </div>

      <div class="space-y-3 text-xs">
        <div>
          <label class="block font-bold text-slate-700 mb-1">Project URL (Supabase):</label>
          <input id="input-supabase-url" type="text" value="<?= htmlspecialchars(SUPABASE_URL) ?>"
                 placeholder="https://xyzproject.supabase.co" 
                 class="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 font-mono text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500">
          <p class="text-[10px] text-slate-400 mt-0.5">Encuéntrelo en Supabase -> Project Settings -> API -> Project URL</p>
        </div>

        <div>
          <label class="block font-bold text-slate-700 mb-1">API Key (anon o service_role):</label>
          <input id="input-supabase-key" type="password" value="<?= htmlspecialchars(SUPABASE_KEY) ?>"
                 placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." 
                 class="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 font-mono text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500">
          <p class="text-[10px] text-slate-400 mt-0.5">Encuéntrelo en Supabase -> Project Settings -> API -> anon public key</p>
        </div>

        <!-- Feedback de Prueba de Conexión -->
        <div id="supabase-test-feedback" class="min-h-[24px]"></div>

        <div class="bg-blue-50 border border-blue-100 rounded-xl p-3 text-[11px] text-blue-900">
          <p class="font-bold flex items-center gap-1">
            <span class="material-symbols-outlined text-[15px]">info</span> Paso previo en Supabase:
          </p>
          <p class="mt-0.5">
            Abra el <strong>SQL Editor</strong> en su panel de Supabase y ejecute el archivo <code class="font-mono bg-blue-100 px-1 rounded">database/schema.sql</code> incluido en este proyecto para crear las tablas y políticas RLS.
          </p>
        </div>
      </div>

      <div class="pt-4 border-t border-slate-100 flex items-center justify-between mt-5">
        <button onclick="testSupabaseConnection()" class="px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-bold hover:bg-slate-50 text-slate-700 flex items-center gap-1.5">
          <span class="material-symbols-outlined text-[16px]">cable</span> Probar Conexión
        </button>

        <div class="flex items-center gap-2">
          <button onclick="syncSeedToSupabase()" class="px-3.5 py-2 rounded-xl bg-emerald-50 text-emerald-800 hover:bg-emerald-100 text-xs font-bold">
            Sincronizar Semilla
          </button>
          <button onclick="saveSupabaseConfig()" class="px-4 py-2 rounded-xl bg-blue-900 hover:bg-blue-800 text-white text-xs font-bold">
            Guardar y Aplicar
          </button>
        </div>
      </div>
    </div>
  </div>

  <!-- Scripts del Sistema -->
  <script src="assets/js/app.js"></script>
</body>
</html>
