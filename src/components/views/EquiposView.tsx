import React, { useState } from 'react';
import { ASSET_RECORDS, AssetRecord } from '../../data/mockData';

export const EquiposView: React.FC = () => {
  const [assets, setAssets] = useState<AssetRecord[]>(ASSET_RECORDS);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [activeFilterChip, setActiveFilterChip] = useState('all');
  const [showScannerModal, setShowScannerModal] = useState(false);
  const [showNewAssetModal, setShowNewAssetModal] = useState(false);
  const [manualSerialInput, setManualSerialInput] = useState('');
  const [alertFeedback, setAlertFeedback] = useState<string | null>(null);

  const showAlert = (msg: string) => {
    setAlertFeedback(msg);
    setTimeout(() => setAlertFeedback(null), 3500);
  };

  const filteredAssets = assets.filter((asset) => {
    const matchesSearch =
      asset.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      asset.qrCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
      asset.serial.toLowerCase().includes(searchTerm.toLowerCase()) ||
      asset.custodianName.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory =
      !selectedCategory ||
      (selectedCategory === 'laptops' && asset.title.includes('ThinkPad')) ||
      (selectedCategory === 'aprendiz' && asset.category === 'Equipo Propio') ||
      (selectedCategory === 'proyectores' && asset.category === 'Audiovisual') ||
      (selectedCategory === 'redes' && asset.category === 'Garantía') ||
      (selectedCategory === 'robotica' && asset.category === 'Robótica');

    const matchesStatus =
      !selectedStatus ||
      (selectedStatus === 'prestado' && asset.statusTag === 'En Préstamo') ||
      (selectedStatus === 'asignado' && asset.statusTag === 'En Sede / Fijo') ||
      (selectedStatus === 'novedad' && asset.statusTag === 'Fuera de Servicio');

    const matchesChip =
      activeFilterChip === 'all' ||
      (activeFilterChip === 'due-today' && asset.deadlineNotice?.includes('Devolver hoy')) ||
      (activeFilterChip === 'robotics' && asset.category === 'Robótica') ||
      (activeFilterChip === 'audit' && asset.category === 'Garantía');

    return matchesSearch && matchesCategory && matchesStatus && matchesChip;
  });

  const handleValidateManual = () => {
    if (!manualSerialInput.trim()) return;
    const found = assets.find(
      (a) =>
        a.qrCode.toLowerCase() === manualSerialInput.trim().toLowerCase() ||
        a.serial.toLowerCase() === manualSerialInput.trim().toLowerCase()
    );
    if (found) {
      showAlert(`Activo Identificado: ${found.title} (${found.qrCode}) - Custodio: ${found.custodianName}`);
    } else {
      showAlert(`Placa/Serial "${manualSerialInput}" no encontrado en la base de activos.`);
    }
  };

  return (
    <div className="w-full max-w-[1536px] mx-auto px-6 py-6 flex flex-col gap-6">
      {/* Toast Alert */}
      {alertFeedback && (
        <div className="fixed top-20 right-8 z-50 bg-inverse-surface text-inverse-on-surface px-4 py-3 rounded-xl shadow-2xl flex items-center gap-3 border border-secondary animate-in fade-in">
          <span className="material-symbols-outlined text-secondary-fixed text-[20px]">info</span>
          <span className="text-xs font-semibold">{alertFeedback}</span>
        </div>
      )}

      {/* Cabecera de Módulo y Acciones Principales */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div className="flex flex-col">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[11px] text-primary uppercase font-bold tracking-wider">
              Módulo de Activos Tecnológicos
            </span>
            <span className="text-outline text-xs">•</span>
            <span className="text-xs text-on-surface-variant font-medium">SGI Acceso v4.2</span>
          </div>
          <h1 className="text-2xl lg:text-3xl font-bold text-on-surface tracking-tight">
            Inventario y Trazabilidad de Equipos
          </h1>
          <p className="text-sm text-on-surface-variant mt-0.5">
            Control institucional, pases de salida en portería, escaneo de placas y custodia de activos.
          </p>
        </div>

        {/* Acciones Operativas */}
        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={() => setShowScannerModal(true)}
            type="button"
            className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-surface-container-highest text-on-surface text-xs font-bold shadow-xs hover:bg-surface-variant transition-colors border border-surface-container"
          >
            <span className="material-symbols-outlined text-[18px] text-primary">qr_code_scanner</span>
            <span>Escanear Placa / QR</span>
          </button>

          <button
            onClick={() => showAlert('Carga masiva: seleccione archivo CSV o Excel de inventario institucional')}
            type="button"
            className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-surface-container-high text-on-surface text-xs font-bold shadow-xs hover:bg-surface-variant transition-colors border border-surface-container"
          >
            <span className="material-symbols-outlined text-[18px] text-on-surface-variant">upload_file</span>
            <span>Carga Masiva</span>
          </button>

          <button
            onClick={() => setShowNewAssetModal(true)}
            type="button"
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-lg bg-primary-container hover:bg-primary text-on-primary text-xs font-bold shadow-sm transition-all active:scale-[0.98]"
          >
            <span className="material-symbols-outlined text-[18px]">add_circle</span>
            <span>Registrar Nuevo Equipo</span>
          </button>
        </div>
      </div>

      {/* Métricas Clave de Inventario */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {/* Total Activos */}
        <div className="bg-surface-container-lowest p-4 rounded-xl shadow-xs border border-surface-container flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs text-on-surface-variant font-bold tracking-wider">
              Total Activos Registrados
            </span>
            <div className="w-10 h-10 rounded-xl bg-surface-container flex items-center justify-center text-primary shrink-0">
              <span className="material-symbols-outlined text-[22px]">devices_other</span>
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-bold text-on-surface font-mono">1,240</span>
            <span className="text-xs text-secondary font-bold">100% inventariados</span>
          </div>
          <div className="w-full bg-surface-container rounded-full h-1.5 mt-3 overflow-hidden">
            <div className="bg-primary h-1.5 rounded-full" style={{ width: '100%' }} />
          </div>
        </div>

        {/* En Préstamo Activo */}
        <div className="bg-surface-container-lowest p-4 rounded-xl shadow-xs border border-surface-container flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs text-on-surface-variant font-bold tracking-wider">
              Equipos en Préstamo
            </span>
            <div className="w-10 h-10 rounded-xl bg-secondary-container/40 flex items-center justify-center text-on-secondary-container shrink-0">
              <span className="material-symbols-outlined text-[22px]">assignment_turned_in</span>
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-bold text-on-surface font-mono">86</span>
            <span className="text-xs text-on-surface-variant font-medium">Con pase activo</span>
          </div>
          <div className="w-full bg-surface-container rounded-full h-1.5 mt-3 overflow-hidden">
            <div className="bg-secondary h-1.5 rounded-full" style={{ width: '24%' }} />
          </div>
        </div>

        {/* En Mantenimiento */}
        <div className="bg-surface-container-lowest p-4 rounded-xl shadow-xs border border-surface-container flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs text-on-surface-variant font-bold tracking-wider">
              Mantenimiento / Taller
            </span>
            <div className="w-10 h-10 rounded-xl bg-tertiary-fixed/40 flex items-center justify-center text-tertiary shrink-0">
              <span className="material-symbols-outlined text-[22px]">build_circle</span>
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-bold text-on-surface font-mono">14</span>
            <span className="text-xs text-tertiary font-bold">2 en garantía</span>
          </div>
          <div className="w-full bg-surface-container rounded-full h-1.5 mt-3 overflow-hidden">
            <div className="bg-on-tertiary-container h-1.5 rounded-full" style={{ width: '12%' }} />
          </div>
        </div>

        {/* Declarados por Aprendices */}
        <div className="bg-surface-container-lowest p-4 rounded-xl shadow-xs border border-surface-container flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs text-on-surface-variant font-bold tracking-wider">
              Pase Personal en Portería
            </span>
            <div className="w-10 h-10 rounded-xl bg-surface-container-high flex items-center justify-center text-primary-container shrink-0">
              <span className="material-symbols-outlined text-[22px]">badge</span>
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-bold text-on-surface font-mono">312</span>
            <span className="text-xs text-secondary font-bold">Validados hoy</span>
          </div>
          <div className="w-full bg-surface-container rounded-full h-1.5 mt-3 overflow-hidden">
            <div className="bg-surface-tint h-1.5 rounded-full" style={{ width: '68%' }} />
          </div>
        </div>
      </div>

      {/* Layout Principal con Grilla Asimétrica */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
        {/* Sección Central / Tablas y Filtros (8 columnas en XL) */}
        <div className="xl:col-span-8 flex flex-col gap-4">
          {/* Contenedor de Filtros */}
          <div className="bg-surface-container-lowest p-4 rounded-xl shadow-xs border border-surface-container flex flex-col gap-3">
            <div className="flex flex-col md:flex-row items-center gap-2.5">
              {/* Búsqueda Multicriterio */}
              <div className="relative w-full md:flex-1">
                <span className="material-symbols-outlined absolute left-3 top-2.5 text-[18px] text-outline">
                  search
                </span>
                <input
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full h-9 pl-9 pr-3 bg-surface rounded-lg text-xs text-on-surface border border-surface-container focus:outline-none focus:ring-1 focus:ring-primary"
                  placeholder="Buscar por Serial, Placa (ej. ACT-TI-), Marca o Doc. Custodio..."
                  type="text"
                />
              </div>

              {/* Filtro Categoría */}
              <div className="w-full md:w-52">
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full h-9 px-3 bg-surface rounded-lg text-xs text-on-surface border border-surface-container focus:outline-none cursor-pointer"
                >
                  <option value="">Todas las Categorías</option>
                  <option value="laptops">Portátiles Institucionales</option>
                  <option value="aprendiz">Portátiles de Aprendices</option>
                  <option value="proyectores">Proyectores Audiovisuales</option>
                  <option value="redes">Equipamiento de Redes</option>
                  <option value="robotica">Kits de Robótica / IoT</option>
                </select>
              </div>

              {/* Filtro Estado */}
              <div className="w-full md:w-48">
                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className="w-full h-9 px-3 bg-surface rounded-lg text-xs text-on-surface border border-surface-container focus:outline-none cursor-pointer"
                >
                  <option value="">Todos los Estados</option>
                  <option value="disponible">Disponible en Reserva</option>
                  <option value="asignado">Asignado a Ambiente</option>
                  <option value="prestado">En Préstamo Externo</option>
                  <option value="novedad">Con Novedad / Daño</option>
                </select>
              </div>
            </div>

            {/* Chips de Filtrado Rápido */}
            <div className="flex items-center gap-2 overflow-x-auto pb-0.5 text-nowrap">
              <span className="text-[11px] text-on-surface-variant mr-1 font-semibold">Vistas directas:</span>
              <button
                onClick={() => setActiveFilterChip('all')}
                type="button"
                className={`px-3 py-1 rounded-full text-xs font-bold transition-all ${
                  activeFilterChip === 'all'
                    ? 'bg-primary text-on-primary shadow-xs'
                    : 'bg-surface text-on-surface-variant hover:bg-surface-container border border-surface-container'
                }`}
              >
                Todos (1,240)
              </button>
              <button
                onClick={() => setActiveFilterChip('due-today')}
                type="button"
                className={`px-3 py-1 rounded-full text-xs font-bold transition-all ${
                  activeFilterChip === 'due-today'
                    ? 'bg-primary text-on-primary shadow-xs'
                    : 'bg-surface text-on-surface-variant hover:bg-surface-container border border-surface-container'
                }`}
              >
                Requiere Devolución Hoy (12)
              </button>
              <button
                onClick={() => setActiveFilterChip('robotics')}
                type="button"
                className={`px-3 py-1 rounded-full text-xs font-bold transition-all ${
                  activeFilterChip === 'robotics'
                    ? 'bg-primary text-on-primary shadow-xs'
                    : 'bg-surface text-on-surface-variant hover:bg-surface-container border border-surface-container'
                }`}
              >
                Kits Robótica (45)
              </button>
              <button
                onClick={() => setActiveFilterChip('audit')}
                type="button"
                className={`px-3 py-1 rounded-full text-xs font-bold transition-all ${
                  activeFilterChip === 'audit'
                    ? 'bg-primary text-on-primary shadow-xs'
                    : 'bg-surface text-on-surface-variant hover:bg-surface-container border border-surface-container'
                }`}
              >
                Auditoría Pendiente (8)
              </button>
            </div>
          </div>

          {/* Tabla Detallada de Activos */}
          <div className="bg-surface-container-lowest rounded-xl shadow-xs border border-surface-container overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead className="bg-surface-container-low text-on-surface-variant text-[11px] uppercase tracking-wider font-bold">
                  <tr>
                    <th className="py-2.5 px-4">Placa / QR</th>
                    <th className="py-2.5 px-4">Descripción &amp; Hardware</th>
                    <th className="py-2.5 px-4">Serial / MAC</th>
                    <th className="py-2.5 px-4">Custodio Actual</th>
                    <th className="py-2.5 px-4">Trazabilidad &amp; Ubicación</th>
                    <th className="py-2.5 px-4 text-right">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-surface-container text-xs text-on-surface">
                  {filteredAssets.map((asset) => {
                    const isWarranty = asset.category === 'Garantía';
                    return (
                      <tr
                        key={asset.id}
                        className={`transition-colors ${
                          isWarranty
                            ? 'bg-error-container/10 hover:bg-error-container/20'
                            : 'hover:bg-surface-container-low/60'
                        }`}
                      >
                        <td className="py-3.5 px-4">
                          <div className="flex items-center gap-2">
                            <span
                              className={`material-symbols-outlined text-[20px] ${
                                isWarranty ? 'text-error' : 'text-primary'
                              }`}
                            >
                              {asset.category === 'Audiovisual'
                                ? 'barcode_scanner'
                                : asset.category === 'Equipo Propio'
                                ? 'passkey'
                                : isWarranty
                                ? 'error'
                                : 'qr_code_2'}
                            </span>
                            <div>
                              <div
                                className={`font-mono font-bold ${
                                  isWarranty ? 'text-error' : 'text-primary'
                                }`}
                              >
                                {asset.qrCode}
                              </div>
                              <span className="text-[10px] px-1.5 py-0.5 rounded bg-surface-container text-on-surface-variant font-semibold">
                                {asset.category}
                              </span>
                            </div>
                          </div>
                        </td>

                        <td className="py-3.5 px-4">
                          <div className="flex flex-col">
                            <span className="font-semibold text-on-surface">{asset.title}</span>
                            <span className="text-on-surface-variant text-[11px]">{asset.specs}</span>
                          </div>
                        </td>

                        <td className="py-3.5 px-4 font-mono text-on-surface-variant text-[11px]">
                          <div>SN: {asset.serial}</div>
                          <div className="text-[10px] text-outline">MAC: {asset.mac}</div>
                        </td>

                        <td className="py-3.5 px-4">
                          <div className="flex items-center gap-2">
                            <div className="w-7 h-7 rounded-full bg-secondary-container text-on-secondary-container flex items-center justify-center font-bold text-[11px]">
                              {asset.custodianInitials || 'AP'}
                            </div>
                            <div className="flex flex-col min-w-0">
                              <span className="font-semibold text-on-surface truncate">
                                {asset.custodianName}
                              </span>
                              <span className="text-on-surface-variant text-[10px]">
                                {asset.custodianDocOrFicha}
                              </span>
                            </div>
                          </div>
                        </td>

                        <td className="py-3.5 px-4">
                          <div className="flex flex-col gap-1">
                            <div
                              className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[11px] font-bold w-fit ${
                                asset.statusTag === 'En Préstamo'
                                  ? 'bg-secondary-container/40 text-secondary'
                                  : asset.statusTag === 'Fuera de Servicio'
                                  ? 'bg-error-container text-on-error-container'
                                  : 'bg-surface-container text-on-surface-variant'
                              }`}
                            >
                              <span
                                className={`w-1.5 h-1.5 rounded-full ${
                                  asset.statusTag === 'En Préstamo'
                                    ? 'bg-secondary animate-pulse'
                                    : asset.statusTag === 'Fuera de Servicio'
                                    ? 'bg-error'
                                    : 'bg-outline'
                                }`}
                              />
                              <span>{asset.statusTag}</span>
                            </div>
                            {asset.deadlineNotice && (
                              <span
                                className={`text-[10px] font-semibold ${
                                  asset.deadlineType === 'error' ? 'text-error' : 'text-on-surface-variant'
                                }`}
                              >
                                {asset.deadlineNotice}
                              </span>
                            )}
                          </div>
                        </td>

                        <td className="py-3.5 px-4 text-right">
                          <div className="flex items-center justify-end gap-1">
                            <button
                              onClick={() => showAlert(`Historial de movimientos para ${asset.qrCode}`)}
                              type="button"
                              className="w-8 h-8 rounded-lg hover:bg-surface-container flex items-center justify-center text-on-surface-variant"
                              title="Historial y Bitácora"
                            >
                              <span className="material-symbols-outlined text-[18px]">history</span>
                            </button>
                            <button
                              onClick={() => showAlert(`Imprimiendo etiqueta térmica con código DataMatrix para ${asset.qrCode}`)}
                              type="button"
                              className="w-8 h-8 rounded-lg hover:bg-surface-container flex items-center justify-center text-on-surface-variant"
                              title="Imprimir Etiqueta"
                            >
                              <span className="material-symbols-outlined text-[18px]">print</span>
                            </button>
                            {isWarranty ? (
                              <button
                                onClick={() => showAlert(`Reingreso de ${asset.qrCode} verificado con soporte técnico.`)}
                                type="button"
                                className="w-8 h-8 rounded-lg hover:bg-surface-container flex items-center justify-center text-secondary"
                                title="Reingresar Activo"
                              >
                                <span className="material-symbols-outlined text-[18px]">check_circle</span>
                              </button>
                            ) : (
                              <button
                                onClick={() => showAlert(`Incidencia levantada para ${asset.qrCode}`)}
                                type="button"
                                className="w-8 h-8 rounded-lg hover:bg-surface-container flex items-center justify-center text-error"
                                title="Registrar Novedad"
                              >
                                <span className="material-symbols-outlined text-[18px]">report_problem</span>
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Paginación */}
            <div className="p-3.5 bg-surface-container-low flex flex-col sm:flex-row items-center justify-between gap-2 text-on-surface-variant text-xs border-t border-surface-container">
              <span>Mostrando 5 de 1,240 activos categorizados</span>
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  disabled
                  className="px-2.5 py-1 rounded bg-surface-container-high text-on-surface font-semibold opacity-50 cursor-not-allowed"
                >
                  Anterior
                </button>
                <span className="px-2.5 py-1 rounded bg-primary text-on-primary font-bold">1</span>
                <button type="button" className="px-2.5 py-1 rounded bg-surface-container hover:bg-surface-variant text-on-surface">
                  2
                </button>
                <button type="button" className="px-2.5 py-1 rounded bg-surface-container hover:bg-surface-variant text-on-surface">
                  3
                </button>
                <span className="px-1 text-outline font-bold">...</span>
                <button type="button" className="px-2.5 py-1 rounded bg-surface-container hover:bg-surface-variant text-on-surface">
                  62
                </button>
                <button type="button" className="px-2.5 py-1 rounded bg-surface-container-high hover:bg-surface-variant text-on-surface font-semibold">
                  Siguiente
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Columna Lateral: Bitácora en Vivo & Alertas de Devolución (4 columnas en XL) */}
        <div className="xl:col-span-4 flex flex-col gap-4">
          {/* Widget: Escáner Rápido en Vivo */}
          <div className="bg-surface-container-lowest p-4 rounded-xl shadow-xs border border-surface-container flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-[22px]">center_focus_strong</span>
                <h3 className="text-sm font-bold text-on-surface">Lector Activo</h3>
              </div>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-secondary-container/40 text-secondary font-bold">
                Cámara / Lector USB
              </span>
            </div>
            <p className="text-xs text-on-surface-variant">
              Apunte al código de barras, DataMatrix o QR en la etiqueta del chasis.
            </p>

            {/* Visor Simulado de Escaneo */}
            <div className="relative w-full h-40 rounded-lg bg-inverse-surface overflow-hidden flex flex-col items-center justify-center text-center p-4">
              <div className="absolute inset-x-8 top-1/2 -translate-y-1/2 h-0.5 bg-secondary animate-pulse shadow-[0_0_8px_rgba(0,108,73,0.8)]" />
              <div className="w-28 h-28 border-2 border-dashed border-outline-variant/60 rounded-xl flex items-center justify-center">
                <span className="material-symbols-outlined text-[42px] text-surface-variant/40">
                  qr_code_scanner
                </span>
              </div>
              <span className="absolute bottom-2 text-surface-variant font-mono text-[10px] tracking-widest uppercase">
                Listo para capturar placa
              </span>
            </div>

            <div className="flex items-center gap-2 mt-0.5">
              <input
                value={manualSerialInput}
                onChange={(e) => setManualSerialInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleValidateManual()}
                className="h-9 px-3 w-full bg-surface rounded-lg text-xs font-mono text-on-surface border border-surface-container focus:outline-none focus:ring-1 focus:ring-primary"
                placeholder="Entrada manual de serial o placa..."
                type="text"
              />
              <button
                onClick={handleValidateManual}
                type="button"
                className="h-9 px-4 bg-primary-container text-on-primary rounded-lg text-xs font-bold shrink-0 hover:bg-primary transition-colors"
              >
                Validar
              </button>
            </div>
          </div>

          {/* Widget: Alerta de Devoluciones del Día */}
          <div className="bg-surface-container-lowest p-4 rounded-xl shadow-xs border border-surface-container flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-error text-[20px]">timer</span>
                <h3 className="text-sm font-bold text-on-surface">Vencimientos Préstamo Hoy</h3>
              </div>
              <span className="px-2 py-0.5 rounded-full bg-error-container text-on-error-container text-[10px] font-bold">
                3 Pendientes
              </span>
            </div>

            <div className="flex flex-col gap-2 mt-1">
              <div className="p-3 rounded-lg bg-surface-container-low border border-surface-container flex items-start justify-between gap-2">
                <div className="flex flex-col">
                  <span className="text-xs font-bold text-on-surface">Lenovo ThinkPad #0941</span>
                  <span className="text-[11px] text-on-surface-variant">Valentina Restrepo • Lab 302</span>
                  <span className="text-[10px] text-error font-bold mt-0.5">Límite: 18:00 (Faltan 45 min)</span>
                </div>
                <button
                  onClick={() => showAlert('Notificación push enviada a Valentina Restrepo')}
                  type="button"
                  className="text-primary hover:text-primary-container text-xs font-bold flex items-center gap-0.5 shrink-0"
                >
                  Notificar
                </button>
              </div>

              <div className="p-3 rounded-lg bg-surface-container-low border border-surface-container flex items-start justify-between gap-2">
                <div className="flex flex-col">
                  <span className="text-xs font-bold text-on-surface">Proyector Epson #0045</span>
                  <span className="text-[11px] text-on-surface-variant">Carlos Mendieta • Auditorio 1</span>
                  <span className="text-[10px] text-error font-bold mt-0.5">Vencido hace 15 min</span>
                </div>
                <button
                  onClick={() => showAlert('Reporte de retraso radicado en portería')}
                  type="button"
                  className="text-error hover:text-error/80 text-xs font-bold flex items-center gap-0.5 shrink-0"
                >
                  Reportar
                </button>
              </div>

              <div className="p-3 rounded-lg bg-surface-container-low border border-surface-container flex items-start justify-between gap-2">
                <div className="flex flex-col">
                  <span className="text-xs font-bold text-on-surface">Kit Arduino Avanzado #12</span>
                  <span className="text-[11px] text-on-surface-variant">Semillero IA • Sala 12</span>
                  <span className="text-[10px] text-outline font-medium mt-0.5">Límite: 20:00</span>
                </div>
                <button
                  onClick={() => showAlert('Revisión programada con monitor')}
                  type="button"
                  className="text-primary hover:text-primary-container text-xs font-bold flex items-center gap-0.5 shrink-0"
                >
                  Revisar
                </button>
              </div>
            </div>
          </div>

          {/* Widget: Bitácora de Portería en Tiempo Real */}
          <div className="bg-surface-container-lowest p-4 rounded-xl shadow-xs border border-surface-container flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-secondary text-[20px]">door_front</span>
                <h3 className="text-sm font-bold text-on-surface">Bitácora en Porterías</h3>
              </div>
              <span className="w-2 h-2 rounded-full bg-secondary animate-pulse" />
            </div>

            <div className="flex flex-col divide-y divide-surface-container text-xs">
              <div className="py-2 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[18px] text-secondary">check_circle</span>
                  <div className="flex flex-col">
                    <span className="font-semibold text-on-surface">Ingreso de Portátil Personal</span>
                    <span className="text-[10px] text-on-surface-variant">Julián Soto (EXT-PC-4910)</span>
                  </div>
                </div>
                <span className="font-mono text-[11px] text-outline font-bold">07:15:22</span>
              </div>

              <div className="py-2 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[18px] text-primary">arrow_outward</span>
                  <div className="flex flex-col">
                    <span className="font-semibold text-on-surface">Salida Autorizada Préstamo</span>
                    <span className="text-[10px] text-on-surface-variant">Docente R. Gómez (ACT-TI-0104)</span>
                  </div>
                </div>
                <span className="font-mono text-[11px] text-outline font-bold">06:58:10</span>
              </div>

              <div className="py-2 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[18px] text-tertiary">assignment_return</span>
                  <div className="flex flex-col">
                    <span className="font-semibold text-on-surface">Devolución a Banco TI</span>
                    <span className="text-[10px] text-on-surface-variant">MacBook Air M2 (ACT-TI-0019)</span>
                  </div>
                </div>
                <span className="font-mono text-[11px] text-outline font-bold">06:40:05</span>
              </div>
            </div>

            <button
              onClick={() => showAlert('Descargando reporte completo de movimientos (PDF/Excel)...')}
              type="button"
              className="mt-1 text-center text-xs text-primary hover:underline font-bold"
            >
              Ver reporte completo de movimientos (PDF/Excel)
            </button>
          </div>
        </div>
      </div>

      {/* Modal: Auditoría Exprés de Activos */}
      {showScannerModal && (
        <div className="fixed inset-0 z-50 bg-inverse-surface/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-surface-container-lowest max-w-lg w-full rounded-2xl shadow-2xl border border-surface-container overflow-hidden flex flex-col animate-in fade-in">
            <div className="p-4 bg-surface-container-low flex items-center justify-between border-b border-surface-container">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-[24px]">qr_code_scanner</span>
                <div>
                  <h3 className="text-base font-bold text-on-surface">Auditoría Exprés de Activos</h3>
                  <span className="text-[11px] text-on-surface-variant">
                    Escaneo directo con cámara o pistola óptica
                  </span>
                </div>
              </div>
              <button
                onClick={() => setShowScannerModal(false)}
                className="w-8 h-8 rounded-lg hover:bg-surface-container-high flex items-center justify-center text-outline hover:text-on-surface"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            <div className="p-6 flex flex-col gap-4">
              {/* Contenedor Visual de Cámara */}
              <div className="relative w-full h-52 rounded-xl bg-inverse-surface flex items-center justify-center overflow-hidden">
                <div className="absolute inset-x-6 top-1/2 -translate-y-1/2 h-1 bg-secondary shadow-[0_0_12px_rgba(0,108,73,1)]" />
                <div className="w-36 h-36 border-2 border-white/50 rounded-lg flex items-center justify-center">
                  <span className="material-symbols-outlined text-[56px] text-white/30">document_scanner</span>
                </div>
                <div className="absolute top-3 left-3 bg-inverse-surface/80 px-2.5 py-1 rounded text-[11px] text-white font-mono flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-secondary animate-pulse" />
                  Sensor Óptico HD Activo
                </div>
              </div>

              {/* Resultado Rápido Encontrado */}
              <div className="p-4 rounded-xl bg-surface-container-low flex flex-col gap-1 border border-surface-container">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold text-primary">ACT-TI-0941 DETECTADO</span>
                  <span className="px-2 py-0.5 rounded bg-secondary-container/40 text-secondary text-[10px] font-bold">
                    COINCIDENCIA EXACTA
                  </span>
                </div>
                <span className="text-sm font-bold text-on-surface">Lenovo ThinkPad E14 Gen 4</span>
                <p className="text-xs text-on-surface-variant">
                  Custodia: Valentina Restrepo (ADSO) • Retorno estipulado para hoy a las 18:00
                </p>
              </div>

              {/* Acciones */}
              <div className="grid grid-cols-2 gap-3 pt-1">
                <button
                  onClick={() => {
                    showAlert('Novedad reportada sobre ACT-TI-0941.');
                    setShowScannerModal(false);
                  }}
                  type="button"
                  className="py-2.5 px-4 rounded-lg bg-surface-container hover:bg-surface-variant text-on-surface text-xs font-bold text-center border border-surface-container"
                >
                  Registrar Novedad
                </button>
                <button
                  onClick={() => {
                    showAlert('Devolución confirmada para ACT-TI-0941.');
                    setShowScannerModal(false);
                  }}
                  type="button"
                  className="py-2.5 px-4 rounded-lg bg-primary text-on-primary hover:bg-primary-container text-xs font-bold text-center shadow-xs"
                >
                  Confirmar Devolución
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Registrar Nuevo Equipo */}
      {showNewAssetModal && (
        <div className="fixed inset-0 z-50 bg-inverse-surface/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-surface-container-lowest max-w-lg w-full rounded-2xl shadow-2xl border border-surface-container flex flex-col gap-4 p-6 animate-in fade-in">
            <div className="flex items-center justify-between pb-2 border-b border-surface-container">
              <div className="flex items-center gap-2 text-primary">
                <span className="material-symbols-outlined text-[24px]">add_circle</span>
                <h3 className="text-base font-bold text-on-surface">Registrar Nuevo Activo Institucional</h3>
              </div>
              <button
                onClick={() => setShowNewAssetModal(false)}
                className="text-on-surface-variant hover:text-on-surface"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="flex flex-col gap-1">
                <label className="text-[11px] font-bold text-on-surface-variant uppercase">Código Placa / QR</label>
                <input
                  className="px-3 py-2 bg-surface rounded-lg text-xs font-mono border border-surface-container"
                  placeholder="ACT-TI-1241"
                  defaultValue="ACT-TI-1241"
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-[11px] font-bold text-on-surface-variant uppercase">Categoría</label>
                <select className="px-3 py-2 bg-surface rounded-lg text-xs border border-surface-container">
                  <option>Activo Fijo</option>
                  <option>Audiovisual</option>
                  <option>Equipo Propio</option>
                  <option>Robótica</option>
                </select>
              </div>
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-[11px] font-bold text-on-surface-variant uppercase">Descripción / Modelo</label>
              <input
                className="px-3 py-2 bg-surface rounded-lg text-xs border border-surface-container"
                placeholder="Ej. Dell Latitude 5430 Core i7 16GB"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="flex flex-col gap-1">
                <label className="text-[11px] font-bold text-on-surface-variant uppercase">Número de Serial</label>
                <input
                  className="px-3 py-2 bg-surface rounded-lg text-xs font-mono border border-surface-container"
                  placeholder="SN: DLL-88231"
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-[11px] font-bold text-on-surface-variant uppercase">Custodio / Responsable</label>
                <input
                  className="px-3 py-2 bg-surface rounded-lg text-xs border border-surface-container"
                  placeholder="Docente / Ambiente"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-surface-container">
              <button
                onClick={() => setShowNewAssetModal(false)}
                className="px-4 py-2 rounded-lg bg-surface-container text-xs font-semibold hover:bg-surface-container-high"
              >
                Cancelar
              </button>
              <button
                onClick={() => {
                  showAlert('Activo registrado con éxito. Etiqueta QR generada.');
                  setShowNewAssetModal(false);
                }}
                className="px-4 py-2 rounded-lg bg-primary hover:bg-primary-container text-on-primary text-xs font-bold shadow-xs"
              >
                Guardar Activo
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
