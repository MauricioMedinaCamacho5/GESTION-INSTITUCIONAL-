export interface AccessEvent {
  id: string;
  time: string;
  userName: string;
  userDoc: string;
  role: 'INSTRUCTOR' | 'ESTUDIANTE' | 'PROVEEDOR' | 'ADMINISTRATIVO' | 'DESCONOCIDO';
  programOrDept: string;
  destination: string;
  equipment: string;
  avatarUrl?: string;
  initials?: string;
  result: 'INGRESO EXITOSO' | 'SALIDA VERIFICADA' | 'PASE TEMPORAL' | 'DENEGADO (VENCIDO)';
  isDenied?: boolean;
}

export interface StudentAttendance {
  id: string;
  number: string;
  name: string;
  email: string;
  doc: string;
  status: 'P' | 'R' | 'J' | 'F';
  checkTime?: string;
  delayMinutes?: number;
  deviceType: string;
  notes: string;
  avatarUrl: string;
  linkedDevice?: string;
  excuseId?: string;
}

export interface TrainingEnvironment {
  id: string;
  code: string;
  name: string;
  location: string;
  status: 'EN CLASE ACTIVA' | 'DISPONIBLE' | 'EN MANTENIMIENTO' | 'RESERVADO';
  capacity: number;
  currentAttendance?: number;
  scheduleTime?: string;
  currentSubject?: string;
  groupCode?: string;
  instructor?: string;
  equipmentTags: string[];
  nextSubjectNotice?: string;
  nextSubjectTime?: string;
  doorStatus?: string;
  accentColor: 'primary' | 'secondary' | 'tertiary';
  maintenanceReason?: string;
  maintenanceEnd?: string;
  eventTitle?: string;
  eventOrganizer?: string;
}

export interface AssetRecord {
  id: string;
  qrCode: string;
  category: 'Activo Fijo' | 'Audiovisual' | 'Equipo Propio' | 'Robótica' | 'Garantía';
  title: string;
  specs: string;
  serial: string;
  mac: string;
  custodianName: string;
  custodianDocOrFicha: string;
  custodianInitials?: string;
  custodianRole: string;
  statusTag: 'En Préstamo' | 'En Sede / Fijo' | 'Portería Norte (07:15)' | 'Taller 104 - En Uso' | 'Fuera de Servicio';
  deadlineNotice?: string;
  deadlineType?: 'warning' | 'error' | 'normal';
}

export const INITIAL_ACCESS_LOGS: AccessEvent[] = [
  {
    id: 'ev-1',
    time: '08:14:22',
    userName: 'Camilo Andrés Torres',
    userDoc: 'CC 71.394.021',
    role: 'INSTRUCTOR',
    programOrDept: 'Ingeniería de Software',
    destination: 'Lab de Software 304',
    equipment: '1 Dell Latitude',
    avatarUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDdfwl4UT_p5W5ojP8tOZ1gTksXhD6F_KTWGUUAuDofxVj5AOFQJKmTCD2rFqhePwr3I7cua4A15krrg-KOs04C6oOn5U6gRrJ53YiApYD3amLHJghCt64zHRQU0mJyX42mWcxHVQ38moTB2aJP0hgkl20ieSBWgJ0Os446FFMLopR7eRvDCmFC66CxE8HQ0QEGKJWotz-n1YOVo5Prx5sqDQhXAvIV5b3Ijt7gNgQ1VcXYPK0phvwXRg',
    result: 'INGRESO EXITOSO',
  },
  {
    id: 'ev-2',
    time: '08:13:05',
    userName: 'Mariana Gómez V.',
    userDoc: 'CC 1.017.842.109',
    role: 'ESTUDIANTE',
    programOrDept: 'Salud Ocupacional',
    destination: 'Aula Magna Bloque B',
    equipment: 'Sin equipos',
    avatarUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBud5vIHRRnirhtrVE_-KGB0305ObGZOvJ9LZEuP5ejbkkoUwBzZjMMyMl-hVV5p5m2CrNcOu3HwR5zncZ_F8pnn9xmuf59BLYi5crs1A35Lr5SRfNH9xjZ7G8Kwg6MsG9U69GLv55zIt-6YASdAJwgWNe544eObVX-kTiWRFkYP4VJao_H2SrSE5MlWcy72eyCEHeTArkSFMmXnC89fZL_IkVA-GOr0oulTYrugOqKTSHJKmoAhybVzQ',
    result: 'INGRESO EXITOSO',
  },
  {
    id: 'ev-3',
    time: '08:11:40',
    userName: 'Carlos D. Morales',
    userDoc: 'CC 98.415.228',
    role: 'PROVEEDOR',
    programOrDept: 'Mantenimiento Redes S.A.S',
    destination: 'Subestación Eléctrica',
    equipment: 'Valija Técnica #04',
    initials: 'CM',
    result: 'PASE TEMPORAL',
  },
  {
    id: 'ev-4',
    time: '08:09:12',
    userName: 'QR No Reconocido',
    userDoc: 'HASH: #88F0-EXPIRED',
    role: 'DESCONOCIDO',
    programOrDept: 'Sin Ficha Asignada',
    destination: 'Sin Autorización',
    equipment: 'N/A',
    result: 'DENEGADO (VENCIDO)',
    isDenied: true,
  },
  {
    id: 'ev-5',
    time: '08:04:45',
    userName: 'Dra. Claudia Benítez',
    userDoc: 'CC 43.876.512',
    role: 'ADMINISTRATIVO',
    programOrDept: 'Dirección Académica',
    destination: 'Edificio de Rectoría',
    equipment: 'MacBook Air M2',
    avatarUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBBdO_sQYoFZUy9hj9IbCBEwqw4N40HgECL-9_BO5bR4aiukP9IP5ATiCJH00IMArPhbcHATcGEoVUay1XBax41WeyWeTDdb_wZHqlUR-_ohpIKFB3YOzOwWinQO-lE6HKURDxhKGV7AydlkMpHk6Y2D8Hsj47PRQ3qAoPwCdVo7SqDh-6nHEgUG6FEqNpMT0vq7lGKvIB-UBrODM17eKgUenq6wSPnDmZgrM-eR0NvQR9cfuB4ivItZQ',
    result: 'SALIDA VERIFICADA',
  },
];

export const INITIAL_STUDENTS: StudentAttendance[] = [
  {
    id: 'std-1',
    number: '01',
    name: 'Valentina Restrepo Giraldo',
    email: 'v.restrepo@instituto.edu.co',
    doc: '1.036.982.410',
    status: 'P',
    checkTime: '08:04 AM',
    deviceType: 'Torniquete V-04 (QR Dinámico)',
    notes: 'Ingreso validado por torniquete QR',
    avatarUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCwfJxEb0HufFwFCG3UZfpisEfgqEdB80LTyXZSsa5biL3t-uTGM0p6FPSoYVsyx03zA409dXDjzvtVVUFXVv5Nsjs7pGi_WvgvNbCDsR5E0qGtcajcO6CUAX3zvLu_dXQWXBFRA7xD9CKpvPgvp9eTPmZEY0hYDa6MyMg0ke_Zy1pSRUp_CeFUNG8OUW3O6KpaBBmbzQPpxE2fzd4uXAtYMo9VXHNQOzjcJ-7XWsuvxwkgc0_PMlEQ5g',
    linkedDevice: 'PORTATIL-HP-TIC302-09',
  },
  {
    id: 'std-2',
    number: '02',
    name: 'David Mateo Ospina',
    email: 'd.ospina@instituto.edu.co',
    doc: '1.017.654.321',
    status: 'P',
    checkTime: '08:01 AM',
    deviceType: 'Carnet RFID Físico',
    notes: 'Normal',
    avatarUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCIK0mlwvezyI-DqjPcOamayHoZ2I2G3FV2TB-Ycu9aX1nbZLGdKGLU2TK_vQVvN88s5EDXYjYe9VEVt8M9RV-8g3Abfb5EFqvZE9_gbf3lGHzSvv4tXuV8NG5RZUZIQZk-Y7UHxMCvgqGJbfENEoSPfuqoh5NE5v8x2ABSOX9I22n7WTAzA3BUCAKuixgwypi20YsaCd4nwALcmpoukbikoBfPHFrjvuU1HsWox1r0jwNEuJ90wK9yuw',
    linkedDevice: 'PORTATIL-LENOVO-TIC302-12',
  },
  {
    id: 'std-3',
    number: '03',
    name: 'Sofía Henao Londoño',
    email: 's.henao@instituto.edu.co',
    doc: '1.020.987.112',
    status: 'R',
    checkTime: '08:26 AM',
    delayMinutes: 26,
    deviceType: 'Torniquete V-02',
    notes: 'Retardo por transporte público',
    avatarUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDmsDdslI-1KyO1nCm5z0Z0DpIpbJ5_scndPPCFQ_kq5i93d5qkViqkQrSsLnejdLvjqvoWjnAt8snSzIejTcB74_6lstG5FjMeGDJDtFMdLkuxF_J0DC-t56wmJ40QkNUWNOLH14SeJh0TS5O3lxP3RCIdu913qvNIXtx-qkgwi_9CAgk9A6KVofOc0VIVk03Y0jO6f93Q5Po3OpHAoViRQmkm84IyDxQ7a7_AsF1Fs__Ed04N-BCEVA',
    linkedDevice: 'DELL-INSPIRON-TIC302-04',
  },
  {
    id: 'std-4',
    number: '04',
    name: 'Juan Diego Morales',
    email: 'jd.morales@instituto.edu.co',
    doc: '1.035.789.444',
    status: 'J',
    deviceType: 'Sistema Bienestar',
    notes: 'Incapacidad médica #MED-402',
    avatarUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDtwCCaWMQyaNbqbgP_XY83gL9GOk1f9gnyrv4THqV7pCXZMe4f3vwohWR7vlI8kJsF4R9HWRqCDNYEoZaG_DdquB1s7mV60IpXO5xM53fQIPOD3M5_45IozPxEg_Mj2vgaZksTM28XEKMi0yGdSeHcbl1QCcrXMvj65JHq5boA_-G_qpNC656z4JVwwtNDV_lK8RWbKQNgoF_3c-LuFGJMhzCNaOvP_TroxN3R7D6KDh3dOsjhK--E5A',
    excuseId: 'MED-402',
  },
  {
    id: 'std-5',
    number: '05',
    name: 'Andrés Felipe Castro',
    email: 'af.castro@instituto.edu.co',
    doc: '1.040.123.889',
    status: 'F',
    deviceType: 'Portería: No detectado',
    notes: 'Sin registro en portería',
    avatarUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDE-d7XtZq2D5OHajZ6cGv40ai3MArI3rAPhpRmmjfU7eUNWM_OSbwhCjjrbHFtanUX_kcodNYElsyfbBcorUj6S48E_N2vgNPckxJtlQdZR0YxYClXVV85EE2LzkV6seraF_tuZpPQyNq6Qo8kQ2SEG0r2LZ64Khk_jP2JgDgIaDRLpUV6OY8zWMvDHvG-G9xUDGCE1hHl71cGRcYq-IjqCip_rmteie9KdRpLw-sI0Qs2tkbQm91SWQ',
  },
  {
    id: 'std-6',
    number: '06',
    name: 'Laura Camila Ríos',
    email: 'lc.rios@instituto.edu.co',
    doc: '1.022.345.901',
    status: 'P',
    checkTime: '08:02 AM',
    deviceType: 'Torniquete V-04 (QR Dinámico)',
    notes: 'Normal',
    avatarUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCwL5Wg0yvZU0VTGAnIgx_vNVUaa83sieMCt_32wVkyJsO5im2vSFeJ1h_HRRZcCWn4A7Fvo8sP3mbMqe695UmA5Xw9U88VuizkNwxNOfIn8G3zbJGuUCQJTLMKByfFK4Jf-YW1mpjGc8WHXG_eq94Gs1K23JExhWRuycVbV5tUcEtx_1VB6hOryxNztoOPNKWPKPoscmV-BnUIOnntfO9x9Yju6VJmv3_m3LwhFGzx4nVVzrK1KxOz9Q',
    linkedDevice: 'PORTATIL-ASUS-TIC302-15',
  },
  {
    id: 'std-7',
    number: '07',
    name: 'Santiago Ospina Morales',
    email: 's.ospina@instituto.edu.co',
    doc: '1.017.934.120',
    status: 'P',
    checkTime: '08:02 AM',
    deviceType: 'NFC Carnet',
    notes: 'Normal',
    avatarUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCIK0mlwvezyI-DqjPcOamayHoZ2I2G3FV2TB-Ycu9aX1nbZLGdKGLU2TK_vQVvN88s5EDXYjYe9VEVt8M9RV-8g3Abfb5EFqvZE9_gbf3lGHzSvv4tXuV8NG5RZUZIQZk-Y7UHxMCvgqGJbfENEoSPfuqoh5NE5v8x2ABSOX9I22n7WTAzA3BUCAKuixgwypi20YsaCd4nwALcmpoukbikoBfPHFrjvuU1HsWox1r0jwNEuJ90wK9yuw',
  },
  {
    id: 'std-8',
    number: '08',
    name: 'Mariana Castaño Vélez',
    email: 'm.castano@instituto.edu.co',
    doc: '1.152.441.908',
    status: 'P',
    checkTime: '07:59 AM',
    deviceType: 'QR Aula',
    notes: 'Normal',
    avatarUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBud5vIHRRnirhtrVE_-KGB0305ObGZOvJ9LZEuP5ejbkkoUwBzZjMMyMl-hVV5p5m2CrNcOu3HwR5zncZ_F8pnn9xmuf59BLYi5crs1A35Lr5SRfNH9xjZ7G8Kwg6MsG9U69GLv55zIt-6YASdAJwgWNe544eObVX-kTiWRFkYP4VJao_H2SrSE5MlWcy72eyCEHeTArkSFMmXnC89fZL_IkVA-GOr0oulTYrugOqKTSHJKmoAhybVzQ',
  },
];

export const UNREGISTERED_STUDENTS = [
  { name: 'Camilo Echeverry Gómez', doc: '1.019.223.109' },
  { name: 'Laura Sofía Morales', doc: '1.128.441.590' },
  { name: 'David Fernando Rincón', doc: '1.037.994.312' },
  { name: 'Estefanía Pérez Toro', doc: '1.098.334.819' },
];

export const TRAINING_ENVIRONMENTS: TrainingEnvironment[] = [
  {
    id: 'amb-1',
    code: 'TIC 302',
    name: 'Laboratorio TIC 302',
    location: 'Bloque A • Piso 3',
    status: 'EN CLASE ACTIVA',
    capacity: 35,
    currentAttendance: 32,
    scheduleTime: '07:00 - 10:00',
    currentSubject: 'Bases de Datos MySQL - Ficha 258901',
    instructor: 'Ing. Sandra Milena Peña',
    equipmentTags: ['35 PCs Core i7', 'Proyector 4K', 'A/C Climatizado'],
    nextSubjectNotice: 'Próxima: Redes Distribuidas (10:15)',
    accentColor: 'primary',
  },
  {
    id: 'amb-2',
    code: 'Aula 204',
    name: 'Aula Polivalente 204',
    location: 'Bloque A • Piso 2',
    status: 'DISPONIBLE',
    capacity: 40,
    equipmentTags: ['Pantalla Interactiva 75"', 'Cobertura Mesh WiFi-6'],
    nextSubjectNotice: 'Redes de Comunicación & Protocolos',
    nextSubjectTime: '10:00 - 12:30',
    instructor: 'Msc. Fernando Alarcón',
    doorStatus: 'Puerta Desbloqueada',
    accentColor: 'secondary',
  },
  {
    id: 'amb-3',
    code: 'Taller 101',
    name: 'Taller de Electrónica 101',
    location: 'Bloque A • Piso 1',
    status: 'EN MANTENIMIENTO',
    capacity: 25,
    equipmentTags: ['25 Mesas ESD', 'Bancos Trifásicos'],
    maintenanceReason: 'Calibración de osciloscopios digitales y recableado de canaletas para seguridad industrial.',
    maintenanceEnd: 'Finaliza hoy 14:00 (3h 15m restantes)',
    instructor: 'Brigada Técnica Mantenimiento Sur',
    accentColor: 'tertiary',
  },
  {
    id: 'amb-4',
    code: 'Móvil 305',
    name: 'Lab. Desarrollo Móvil 305',
    location: 'Bloque A • Piso 3',
    status: 'EN CLASE ACTIVA',
    capacity: 30,
    currentAttendance: 28,
    scheduleTime: '08:30 - 11:30',
    currentSubject: 'Desarrollo Frontend React - Ficha 267014',
    instructor: 'Prof. Julian Duque',
    equipmentTags: ['30 Mac Mini M2', 'Smart Board 85"', 'Sistema Microfonía'],
    nextSubjectNotice: 'Próxima: UX/UI Design (12:00)',
    accentColor: 'primary',
  },
  {
    id: 'amb-5',
    code: 'Auditorio A',
    name: 'Auditorio Principal Bloque A',
    location: 'Bloque A • Planta Baja',
    status: 'RESERVADO',
    capacity: 180,
    scheduleTime: '14:00 - 18:30',
    eventTitle: 'Jornada Institucional de Ciberseguridad 2024',
    eventOrganizer: 'Dirección Nacional TIC & Alianzas',
    equipmentTags: ['Streaming HD Dual', 'Audio Dolby 7.1', 'Cabina de Traducción'],
    nextSubjectNotice: 'Montaje técnico en curso',
    accentColor: 'primary',
  },
  {
    id: 'amb-6',
    code: 'Servidores',
    name: 'Sala de Servidores & Redes',
    location: 'Bloque A • Sótano Tecnológico',
    status: 'DISPONIBLE',
    capacity: 15,
    equipmentTags: ['4 Racks Cisco Catalyst', 'Fibra Óptica Monomodo'],
    nextSubjectNotice: 'Práctica de Cableado & Racks Cisco',
    nextSubjectTime: '11:00 - 18:00',
    doorStatus: 'Acceso Biomagnético (18°C Estable)',
    accentColor: 'secondary',
  },
];

export const ASSET_RECORDS: AssetRecord[] = [
  {
    id: 'ast-1',
    qrCode: 'ACT-TI-0941',
    category: 'Activo Fijo',
    title: 'Lenovo ThinkPad E14 Gen 4',
    specs: 'Core i7 12va • 16GB RAM • 512GB SSD',
    serial: 'PF4289K0',
    mac: '3C:52:82:11:A9:BC',
    custodianName: 'Valentina Restrepo',
    custodianDocOrFicha: 'Aprendiz ADSO • Ficha 2670182',
    custodianInitials: 'VR',
    custodianRole: 'Aprendiz',
    statusTag: 'En Préstamo',
    deadlineNotice: 'Devolver hoy 18:00',
    deadlineType: 'error',
  },
  {
    id: 'ast-2',
    qrCode: 'ACT-AV-0118',
    category: 'Audiovisual',
    title: 'Epson PowerLite Laser 4K',
    specs: '4500 lúmenes • Soporte techo antirrobo',
    serial: 'EP9928-0012',
    mac: 'A4:BB:6D:77:E1:02',
    custodianName: 'Aula Lab TIC 302',
    custodianDocOrFicha: 'Asignación Permanente',
    custodianRole: 'Infraestructura',
    statusTag: 'En Sede / Fijo',
    deadlineType: 'normal',
  },
  {
    id: 'ast-3',
    qrCode: 'EXT-PC-4910',
    category: 'Equipo Propio',
    title: 'ASUS ROG Zephyrus G14',
    specs: 'Color Gris Eclipse • Calcomanías Dev',
    serial: 'CN-0N8329-873',
    mac: 'N/A (Declarado)',
    custodianName: 'Julián Soto',
    custodianDocOrFicha: 'C.C. 1.092.348.112',
    custodianInitials: 'JS',
    custodianRole: 'Aprendiz Externo',
    statusTag: 'Portería Norte (07:15)',
    deadlineNotice: 'Pase de Salida Habilitado',
    deadlineType: 'normal',
  },
  {
    id: 'ast-4',
    qrCode: 'ROB-KT-003',
    category: 'Robótica',
    title: 'Maletín LEGO Spike Prime',
    specs: 'Hub inteligente, 4 sensores y servomotores',
    serial: 'LG-2023-9941',
    mac: 'BLE: E8:3B:11:00:23:44',
    custodianName: 'Ing. M. Benítez',
    custodianDocOrFicha: 'Instructor Mecatrónica',
    custodianInitials: 'MB',
    custodianRole: 'Instructor',
    statusTag: 'Taller 104 - En Uso',
    deadlineType: 'normal',
  },
  {
    id: 'ast-5',
    qrCode: 'NET-SW-088',
    category: 'Garantía',
    title: 'Cisco Catalyst 2960-X',
    specs: '48 Puertos PoE+ • Falla en Fuente 2',
    serial: 'FOC2230Z18',
    mac: '00:1E:F7:88:99:A1',
    custodianName: 'Taller Central TI',
    custodianDocOrFicha: 'Ticket #8491',
    custodianInitials: 'TI',
    custodianRole: 'Soporte TI',
    statusTag: 'Fuera de Servicio',
    deadlineNotice: 'En revisión técnica',
    deadlineType: 'error',
  },
];
