import React, { useState } from 'react';

export const ReportesView: React.FC = () => {
  const [dateRange, setDateRange] = useState('Hoy (Turno Matutino)');
  const [downloading, setDownloading] = useState<string | null>(null);

  const handleExport = (format: string) => {
    setDownloading(format);
    setTimeout(() => {
      setDownloading(null);
      alert(`Reporte institucional en formato ${format} generado y descargado con hash SHA-256 de conformidad.`);
    }, 1200);
  };

  const hourlyData = [
    { hour: '06:00', count: 120, height: '35%' },
    { hour: '07:00', count: 380, height: '85%' },
    { hour: '08:00', count: 420, height: '95%' },
    { hour: '09:00', count: 180, height: '45%' },
    { hour: '10:00', count: 90, height: '25%' },
    { hour: '11:00', count: 140, height: '38%' },
    { hour: '12:00', count: 310, height: '75%' },
    { hour: '13:00', count: 260, height: '65%' },
    { hour: '14:00', count: 190, height: '50%' },
  ];

  return (
    <div className="w-full max-w-[1536px] mx-auto px-6 py-6 flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <span className="text-[11px] bg-primary-fixed text-on-primary-fixed px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider">
              Auditoría &amp; Analítica
            </span>
            <span className="text-outline text-xs">•</span>
            <span className="text-xs text-on-surface-variant font-semibold">Trazabilidad ISO 27001</span>
          </div>
          <h1 className="text-2xl lg:text-3xl font-bold text-on-surface tracking-tight">
            Reportes e Informes de Control Institucional
          </h1>
          <p className="text-sm text-on-surface-variant mt-0.5">
            Métricas de aforo en campus, bitácora forense de torniquetes, novedades de activos y actas de asistencia.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => handleExport('PDF')}
            disabled={!!downloading}
            type="button"
            className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-surface-container-low hover:bg-surface-container text-on-surface text-xs font-bold border border-surface-container transition-colors shadow-xs"
          >
            <span className="material-symbols-outlined text-[18px] text-error">picture_as_pdf</span>
            <span>{downloading === 'PDF' ? 'Generando...' : 'Descargar PDF'}</span>
          </button>
          <button
            onClick={() => handleExport('Excel')}
            disabled={!!downloading}
            type="button"
            className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-primary hover:bg-primary-container text-on-primary text-xs font-bold transition-all shadow-xs"
          >
            <span className="material-symbols-outlined text-[18px]">table_view</span>
            <span>{downloading === 'Excel' ? 'Generando...' : 'Exportar Excel / CSV'}</span>
          </button>
        </div>
      </div>

      {/* Top 4 Summary Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="bg-surface-container-lowest p-4 rounded-xl shadow-xs border border-surface-container flex flex-col justify-between">
          <span className="text-[11px] text-on-surface-variant uppercase font-bold tracking-wider">
            Total Flujo Hoy
          </span>
          <div className="mt-2">
            <span className="text-3xl font-bold text-on-surface font-mono">1,608</span>
            <span className="text-[11px] text-secondary font-bold block mt-0.5">
              1,428 entradas · 180 salidas
            </span>
          </div>
        </div>

        <div className="bg-surface-container-lowest p-4 rounded-xl shadow-xs border border-surface-container flex flex-col justify-between">
          <span className="text-[11px] text-on-surface-variant uppercase font-bold tracking-wider">
            Efectividad QR Dinámico
          </span>
          <div className="mt-2">
            <span className="text-3xl font-bold text-secondary font-mono">99.8%</span>
            <span className="text-[11px] text-on-surface-variant block mt-0.5">
              Latencia media: 32ms
            </span>
          </div>
        </div>

        <div className="bg-surface-container-lowest p-4 rounded-xl shadow-xs border border-surface-container flex flex-col justify-between">
          <span className="text-[11px] text-on-surface-variant uppercase font-bold tracking-wider">
            Préstamos Cumplidos
          </span>
          <div className="mt-2">
            <span className="text-3xl font-bold text-primary font-mono">96.4%</span>
            <span className="text-[11px] text-on-surface-variant block mt-0.5">
              3 retornos pendientes
            </span>
          </div>
        </div>

        <div className="bg-surface-container-lowest p-4 rounded-xl shadow-xs border border-surface-container flex flex-col justify-between">
          <span className="text-[11px] text-error uppercase font-bold tracking-wider">
            Incidentes / Denegados
          </span>
          <div className="mt-2">
            <span className="text-3xl font-bold text-error font-mono">3</span>
            <span className="text-[11px] text-error font-semibold block mt-0.5">
              2 QRs vencidos · 1 daño fuente
            </span>
          </div>
        </div>
      </div>

      {/* Access Flow Density Bar Chart Simulation */}
      <div className="bg-surface-container-lowest p-6 rounded-xl shadow-xs border border-surface-container flex flex-col gap-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-surface-container pb-3">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-[22px]">bar_chart</span>
            <h2 className="text-base font-bold text-on-surface">Curva de Flujo de Accesos por Franja Horaria</h2>
          </div>
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="text-xs bg-surface border border-surface-container px-3 py-1.5 rounded-lg text-on-surface font-semibold focus:outline-none cursor-pointer"
          >
            <option>Hoy (Turno Matutino)</option>
            <option>Semana en Curso</option>
            <option>Mes de Octubre 2024</option>
          </select>
        </div>

        <div className="h-64 w-full flex items-end gap-3 pt-6 pb-2 px-4 bg-surface-container-low rounded-xl border border-surface-container">
          {hourlyData.map((d, i) => (
            <div key={i} className="flex-1 flex flex-col items-center gap-2 h-full justify-end group">
              <span className="text-[10px] font-mono text-outline opacity-0 group-hover:opacity-100 transition-opacity font-bold">
                {d.count}
              </span>
              <div
                className="w-full bg-primary hover:bg-primary-container rounded-t-md transition-all shadow-xs"
                style={{ height: d.height }}
              />
              <span className="text-[10px] font-mono font-bold text-on-surface-variant">
                {d.hour}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Incidents and Compliance Log */}
      <div className="bg-surface-container-lowest rounded-xl p-5 shadow-xs border border-surface-container flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-tertiary-container text-[20px]">
              warning
            </span>
            <h3 className="text-sm font-bold text-on-surface">Novedades Operativas Registradas Recientemente</h3>
          </div>
          <span className="text-xs text-on-surface-variant font-semibold">Auditoría en tiempo real</span>
        </div>

        <div className="flex flex-col divide-y divide-surface-container text-xs">
          <div className="py-3 flex items-start justify-between gap-3">
            <div className="flex items-start gap-2.5">
              <span className="material-symbols-outlined text-error text-[18px] shrink-0 mt-0.5">
                cancel
              </span>
              <div className="flex flex-col">
                <span className="font-bold text-on-surface">Intento de acceso con código QR expirado</span>
                <span className="text-on-surface-variant text-[11px]">
                  Torniquete #03 (Puerta Peatonal) · Hash: #88F0-EXPIRED · No se abrió paso
                </span>
              </div>
            </div>
            <span className="font-mono text-outline font-bold text-[11px]">08:09:12</span>
          </div>

          <div className="py-3 flex items-start justify-between gap-3">
            <div className="flex items-start gap-2.5">
              <span className="material-symbols-outlined text-tertiary-container text-[18px] shrink-0 mt-0.5">
                build
              </span>
              <div className="flex flex-col">
                <span className="font-bold text-on-surface">Orden de Mantenimiento OT-994 activa en Taller 101</span>
                <span className="text-on-surface-variant text-[11px]">
                  Calibración de osciloscopios y canaletas por Brigada Técnica Mantenimiento Sur
                </span>
              </div>
            </div>
            <span className="font-mono text-outline font-bold text-[11px]">07:30:00</span>
          </div>

          <div className="py-3 flex items-start justify-between gap-3">
            <div className="flex items-start gap-2.5">
              <span className="material-symbols-outlined text-primary text-[18px] shrink-0 mt-0.5">
                laptop_mac
              </span>
              <div className="flex flex-col">
                <span className="font-bold text-on-surface">Préstamo de equipo ACT-TI-0941 a aprendiz Valentina Restrepo</span>
                <span className="text-on-surface-variant text-[11px]">
                  Lenovo ThinkPad E14 Gen 4 · Vencimiento hoy a las 18:00
                </span>
              </div>
            </div>
            <span className="font-mono text-outline font-bold text-[11px]">06:40:05</span>
          </div>
        </div>
      </div>
    </div>
  );
};
