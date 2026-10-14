import React, { useState } from 'react';

interface UserRecord {
  id: string;
  name: string;
  doc: string;
  role: 'Estudiante' | 'Instructor' | 'Administrativo' | 'Visitante';
  programOrDept: string;
  status: 'Activo' | 'En Revisión' | 'Suspendido' | 'Vencido';
  cardId: string;
  avatarUrl: string;
  lastAccess: string;
}

const INITIAL_USERS: UserRecord[] = [
  {
    id: 'u-1',
    name: 'Valentina Restrepo Giraldo',
    doc: '1.036.982.410',
    role: 'Estudiante',
    programOrDept: 'Tecnología en Desarrollo de Software (Ficha 267014)',
    status: 'Activo',
    cardId: '#SGI-2025-0941',
    avatarUrl:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuCwfJxEb0HufFwFCG3UZfpisEfgqEdB80LTyXZSsa5biL3t-uTGM0p6FPSoYVsyx03zA409dXDjzvtVVUFXVv5Nsjs7pGi_WvgvNbCDsR5E0qGtcajcO6CUAX3zvLu_dXQWXBFRA7xD9CKpvPgvp9eTPmZEY0hYDa6MyMg0ke_Zy1pSRUp_CeFUNG8OUW3O6KpaBBmbzQPpxE2fzd4uXAtYMo9VXHNQOzjcJ-7XWsuvxwkgc0_PMlEQ5g',
    lastAccess: 'Hoy 08:04 AM (Torniquete V-04)',
  },
  {
    id: 'u-2',
    name: 'Ing. Carlos Mendoza',
    doc: '71.289.442',
    role: 'Instructor',
    programOrDept: 'Coordinación Telemática y Redes',
    status: 'Activo',
    cardId: '#SGI-DOC-0012',
    avatarUrl:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuDyNtfsgx2nphNnCUmn5GhaMsaPDUMoSetkO0RJPRNHZ-eqFXEnosW850fAHmh6uwKMkXcCSlI1ZnIRG1rL_2VQ-h6ZgZimi63Q7axX21Ba2xRdJ5_qC3oy4BHD8K_Ihr9mqf0mL2wh4I67DJMhvn8za4LnYM10KcXNqpFOxQgjUSZL2EOpx2MIcW1Xz6mR9ase9Qc93SwfJ0zXJs22voB9ONyvmtIX3BtDRcLfLtRB7Y7fCm76-_rW_Q',
    lastAccess: 'Hoy 06:45 AM (Puerta Principal)',
  },
  {
    id: 'u-3',
    name: 'David Mateo Ospina',
    doc: '1.017.654.321',
    role: 'Estudiante',
    programOrDept: 'Tecnología en Desarrollo de Software (Ficha 267014)',
    status: 'Activo',
    cardId: '#SGI-2025-0942',
    avatarUrl:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuCIK0mlwvezyI-DqjPcOamayHoZ2I2G3FV2TB-Ycu9aX1nbZLGdKGLU2TK_vQVvN88s5EDXYjYe9VEVt8M9RV-8g3Abfb5EFqvZE9_gbf3lGHzSvv4tXuV8NG5RZUZIQZk-Y7UHxMCvgqGJbfENEoSPfuqoh5NE5v8x2ABSOX9I22n7WTAzA3BUCAKuixgwypi20YsaCd4nwALcmpoukbikoBfPHFrjvuU1HsWox1r0jwNEuJ90wK9yuw',
    lastAccess: 'Hoy 08:01 AM (Torniquete V-04)',
  },
  {
    id: 'u-4',
    name: 'Dra. Claudia Benítez',
    doc: '43.876.512',
    role: 'Administrativo',
    programOrDept: 'Dirección Académica y Planificación',
    status: 'Activo',
    cardId: '#SGI-ADM-0044',
    avatarUrl:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuBBdO_sQYoFZUy9hj9IbCBEwqw4N40HgECL-9_BO5bR4aiukP9IP5ATiCJH00IMArPhbcHATcGEoVUay1XBax41WeyWeTDdb_wZHqlUR-_ohpIKFB3YOzOwWinQO-lE6HKURDxhKGV7AydlkMpHk6Y2D8Hsj47PRQ3qAoPwCdVo7SqDh-6nHEgUG6FEqNpMT0vq7lGKvIB-UBrODM17eKgUenq6wSPnDmZgrM-eR0NvQR9cfuB4ivItZQ',
    lastAccess: 'Hoy 08:04 AM (Salida Verificada)',
  },
  {
    id: 'u-5',
    name: 'Andrés Felipe Castro',
    doc: '1.040.123.889',
    role: 'Estudiante',
    programOrDept: 'Tecnología en Desarrollo de Software (Ficha 267014)',
    status: 'En Revisión',
    cardId: '#SGI-2025-0949',
    avatarUrl:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuDE-d7XtZq2D5OHajZ6cGv40ai3MArI3rAPhpRmmjfU7eUNWM_OSbwhCjjrbHFtanUX_kcodNYElsyfbBcorUj6S48E_N2vgNPckxJtlQdZR0YxYClXVV85EE2LzkV6seraF_tuZpPQyNq6Qo8kQ2SEG0r2LZ64Khk_jP2JgDgIaDRLpUV6OY8zWMvDHvG-G9xUDGCE1hHl71cGRcYq-IjqCip_rmteie9KdRpLw-sI0Qs2tkbQm91SWQ',
    lastAccess: 'Ayer 17:30 PM (Salida)',
  },
];

export const UsuariosCarnetsView: React.FC = () => {
  const [users, setUsers] = useState<UserRecord[]>(INITIAL_USERS);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('Todos');
  const [showIssueModal, setShowIssueModal] = useState(false);
  const [selectedUserForCard, setSelectedUserForCard] = useState<UserRecord | null>(null);

  const filteredUsers = users.filter((u) => {
    const matchesSearch =
      u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.doc.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.cardId.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === 'Todos' || u.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  return (
    <div className="w-full max-w-[1536px] mx-auto px-6 py-6 flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <span className="text-[11px] bg-primary-fixed text-on-primary-fixed px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider">
              Identidad &amp; Credenciales
            </span>
            <span className="text-outline text-xs">•</span>
            <span className="text-xs text-on-surface-variant font-semibold">Cifrado Asimétrico RSA-2048</span>
          </div>
          <h1 className="text-2xl lg:text-3xl font-bold text-on-surface tracking-tight">
            Gestión de Usuarios y Carnets Digitales
          </h1>
          <p className="text-sm text-on-surface-variant mt-0.5">
            Emisión de credenciales con código QR dinámico, asignación de roles y control fiduciario de identidad.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => alert('Sincronizando base de datos institucional con SOFIA Plus...')}
            type="button"
            className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-surface-container-low hover:bg-surface-container text-on-surface text-xs font-bold border border-surface-container transition-colors shadow-xs"
          >
            <span className="material-symbols-outlined text-[18px] text-secondary">sync</span>
            <span>Sincronizar SOFIA Plus</span>
          </button>
          <button
            onClick={() => setShowIssueModal(true)}
            type="button"
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-lg bg-primary hover:bg-primary-container text-on-primary text-xs font-bold transition-all shadow-xs"
          >
            <span className="material-symbols-outlined text-[18px]">add_card</span>
            <span>Emitir Nueva Credencial</span>
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="bg-surface-container-lowest p-4 rounded-xl shadow-xs border border-surface-container flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-[11px] text-on-surface-variant uppercase font-bold tracking-wider">
              Carnets Activos
            </span>
            <span className="text-2xl font-bold text-on-surface font-mono mt-1">2,845</span>
            <span className="text-[11px] text-secondary font-bold mt-0.5">99.2% validados</span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-secondary-container/40 flex items-center justify-center text-secondary">
            <span className="material-symbols-outlined text-[24px]">id_card</span>
          </div>
        </div>

        <div className="bg-surface-container-lowest p-4 rounded-xl shadow-xs border border-surface-container flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-[11px] text-on-surface-variant uppercase font-bold tracking-wider">
              Aprendices Registrados
            </span>
            <span className="text-2xl font-bold text-primary font-mono mt-1">2,410</span>
            <span className="text-[11px] text-on-surface-variant mt-0.5">Fichas activas: 68</span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-primary-fixed flex items-center justify-center text-primary">
            <span className="material-symbols-outlined text-[24px]">school</span>
          </div>
        </div>

        <div className="bg-surface-container-lowest p-4 rounded-xl shadow-xs border border-surface-container flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-[11px] text-on-surface-variant uppercase font-bold tracking-wider">
              Instructores &amp; Staff
            </span>
            <span className="text-2xl font-bold text-on-surface font-mono mt-1">385</span>
            <span className="text-[11px] text-on-surface-variant mt-0.5">Acceso 24/7 áreas I+D</span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-surface-container-high flex items-center justify-center text-on-surface">
            <span className="material-symbols-outlined text-[24px]">badge</span>
          </div>
        </div>

        <div className="bg-surface-container-lowest p-4 rounded-xl shadow-xs border border-surface-container flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-[11px] text-error uppercase font-bold tracking-wider">
              Pendientes Foto/Bio
            </span>
            <span className="text-2xl font-bold text-error font-mono mt-1">12</span>
            <span className="text-[11px] text-error font-semibold mt-0.5">Requieren auditoría</span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-error-container/40 flex items-center justify-center text-error">
            <span className="material-symbols-outlined text-[24px]">person_alert</span>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-surface-container-lowest p-3.5 rounded-xl shadow-xs border border-surface-container flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        <div className="relative flex-1">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-[18px]">
            search
          </span>
          <input
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 bg-surface text-xs text-on-surface placeholder:text-outline rounded-lg border border-surface-container focus:outline-none focus:ring-1 focus:ring-primary"
            placeholder="Buscar por nombre, documento o ID de carnet..."
            type="text"
          />
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center bg-surface-container-low border border-surface-container rounded-lg px-3 py-1">
            <span className="text-[11px] text-on-surface-variant mr-2 font-medium">Filtrar Rol:</span>
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="bg-transparent text-xs text-on-surface font-semibold focus:outline-none cursor-pointer"
            >
              <option>Todos</option>
              <option>Estudiante</option>
              <option>Instructor</option>
              <option>Administrativo</option>
              <option>Visitante</option>
            </select>
          </div>

          <button
            onClick={() => alert('Exportando lista completa de carnets institucionales en Excel...')}
            type="button"
            className="p-2 rounded-lg bg-surface-container-low hover:bg-surface-container text-on-surface-variant transition-colors border border-surface-container"
            title="Exportar"
          >
            <span className="material-symbols-outlined text-[18px]">download</span>
          </button>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-surface-container-lowest rounded-xl shadow-xs border border-surface-container overflow-hidden">
        <div className="overflow-x-auto w-full">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-surface-container-low text-[11px] text-on-surface-variant uppercase font-bold tracking-wider">
                <th className="py-3 px-4">Usuario</th>
                <th className="py-3 px-4">Documento</th>
                <th className="py-3 px-4">Rol Institucional</th>
                <th className="py-3 px-4">Programa / Área</th>
                <th className="py-3 px-4">ID Carnet</th>
                <th className="py-3 px-4">Estado</th>
                <th className="py-3 px-4">Último Acceso</th>
                <th className="py-3 px-4 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="text-xs divide-y divide-surface-container font-body-sm">
              {filteredUsers.map((u) => (
                <tr key={u.id} className="hover:bg-surface-container-low/60 transition-colors">
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-3">
                      <img
                        alt={u.name}
                        className="w-9 h-9 rounded-full object-cover shadow-xs bg-surface-container ring-1 ring-surface-container"
                        src={u.avatarUrl}
                      />
                      <span className="font-bold text-on-surface">{u.name}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4 font-mono font-medium text-on-surface-variant whitespace-nowrap">
                    CC {u.doc}
                  </td>
                  <td className="py-3 px-4 whitespace-nowrap">
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded font-bold ${
                        u.role === 'Instructor'
                          ? 'bg-primary-fixed text-on-primary-fixed'
                          : u.role === 'Estudiante'
                          ? 'bg-surface-container-highest text-primary'
                          : u.role === 'Administrativo'
                          ? 'bg-surface-container-high text-on-surface'
                          : 'bg-tertiary-fixed text-on-tertiary-fixed-variant'
                      }`}
                    >
                      {u.role}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-on-surface-variant font-medium">
                    {u.programOrDept}
                  </td>
                  <td className="py-3 px-4 font-mono font-bold text-primary whitespace-nowrap">
                    {u.cardId}
                  </td>
                  <td className="py-3 px-4 whitespace-nowrap">
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded-full font-bold inline-flex items-center gap-1 ${
                        u.status === 'Activo'
                          ? 'bg-secondary-container text-on-secondary-container'
                          : 'bg-error-container text-on-error-container'
                      }`}
                    >
                      <span
                        className={`w-1.5 h-1.5 rounded-full ${
                          u.status === 'Activo' ? 'bg-secondary' : 'bg-error'
                        }`}
                      />
                      {u.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-on-surface-variant font-mono text-[11px] whitespace-nowrap">
                    {u.lastAccess}
                  </td>
                  <td className="py-3 px-4 text-right whitespace-nowrap">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        onClick={() => setSelectedUserForCard(u)}
                        type="button"
                        className="p-1 rounded hover:bg-surface-container text-primary font-bold"
                        title="Ver Carnet Digital"
                      >
                        <span className="material-symbols-outlined text-[18px]">badge</span>
                      </button>
                      <button
                        onClick={() => alert(`Reemitiendo token QR para ${u.name}`)}
                        type="button"
                        className="p-1 rounded hover:bg-surface-container text-on-surface-variant"
                        title="Renovar Token"
                      >
                        <span className="material-symbols-outlined text-[18px]">refresh</span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal: Ver Carnet */}
      {selectedUserForCard && (
        <div className="fixed inset-0 z-50 bg-inverse-surface/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-surface-container-lowest max-w-sm w-full rounded-2xl shadow-2xl border border-surface-container p-6 flex flex-col gap-4 animate-in fade-in">
            <div className="flex items-center justify-between border-b border-surface-container pb-2">
              <span className="text-xs font-bold text-primary uppercase tracking-wider">
                Credencial Digital
              </span>
              <button
                onClick={() => setSelectedUserForCard(null)}
                className="text-on-surface-variant hover:text-on-surface"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            <div className="flex flex-col items-center text-center gap-2">
              <img
                alt={selectedUserForCard.name}
                className="w-20 h-20 rounded-full object-cover ring-2 ring-primary shadow-sm"
                src={selectedUserForCard.avatarUrl}
              />
              <h3 className="text-base font-bold text-on-surface">{selectedUserForCard.name}</h3>
              <span className="text-xs text-on-surface-variant font-mono font-bold">
                CC {selectedUserForCard.doc} • {selectedUserForCard.cardId}
              </span>
              <span className="text-xs text-primary font-semibold">
                {selectedUserForCard.programOrDept}
              </span>
            </div>

            <div className="p-3 rounded-xl bg-surface-container-low flex flex-col items-center border border-surface-container">
              <div className="w-32 h-32 bg-white rounded-lg p-2 flex items-center justify-center shadow-xs">
                <span className="material-symbols-outlined text-[80px] text-primary">qr_code_2</span>
              </div>
              <span className="text-[10px] font-mono text-outline font-bold mt-2">
                TOKEN VIGENTE: #SEC-9842
              </span>
            </div>

            <button
              onClick={() => setSelectedUserForCard(null)}
              type="button"
              className="w-full py-2 bg-primary text-on-primary text-xs font-bold rounded-lg shadow-xs"
            >
              Cerrar Vista Previa
            </button>
          </div>
        </div>
      )}

      {/* Modal: Emitir Nueva Credencial */}
      {showIssueModal && (
        <div className="fixed inset-0 z-50 bg-inverse-surface/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-surface-container-lowest max-w-md w-full rounded-2xl shadow-2xl border border-surface-container p-6 flex flex-col gap-4 animate-in fade-in">
            <div className="flex items-center justify-between border-b border-surface-container pb-2">
              <div className="flex items-center gap-2 text-primary">
                <span className="material-symbols-outlined text-[24px]">add_card</span>
                <h3 className="text-base font-bold text-on-surface">Emitir Nueva Credencial Institucional</h3>
              </div>
              <button
                onClick={() => setShowIssueModal(false)}
                className="text-on-surface-variant hover:text-on-surface"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-[11px] font-bold text-on-surface-variant uppercase">Nombre Completo</label>
              <input
                className="px-3 py-2 bg-surface rounded-lg text-xs border border-surface-container"
                placeholder="Ej. Santiago Mejía Salazar"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="flex flex-col gap-1">
                <label className="text-[11px] font-bold text-on-surface-variant uppercase">Cédula / Documento</label>
                <input
                  className="px-3 py-2 bg-surface rounded-lg text-xs border border-surface-container font-mono"
                  placeholder="Ej. 1029384756"
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-[11px] font-bold text-on-surface-variant uppercase">Rol</label>
                <select className="px-3 py-2 bg-surface rounded-lg text-xs border border-surface-container">
                  <option>Estudiante</option>
                  <option>Instructor</option>
                  <option>Administrativo</option>
                  <option>Visitante</option>
                </select>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-surface-container">
              <button
                onClick={() => setShowIssueModal(false)}
                className="px-4 py-2 rounded-lg bg-surface-container text-xs font-semibold"
              >
                Cancelar
              </button>
              <button
                onClick={() => {
                  alert('Credencial emitida. Código QR seguro enviado al correo del titular.');
                  setShowIssueModal(false);
                }}
                className="px-4 py-2 rounded-lg bg-primary hover:bg-primary-container text-on-primary text-xs font-bold shadow-xs"
              >
                Generar Carnet
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
