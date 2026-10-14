-- ==============================================================================
-- SISTEMA DE GESTIÓN INSTITUCIONAL (SGI ACCESO)
-- Esquema de Base de Datos para Supabase (PostgreSQL)
-- ==============================================================================

-- 1. TABLA: REGISTROS DE ACCESO / PORTERÍA
CREATE TABLE IF NOT EXISTS public.access_logs (
    id TEXT PRIMARY KEY,
    time TEXT NOT NULL,
    user_name TEXT NOT NULL,
    user_doc TEXT NOT NULL,
    role TEXT NOT NULL CHECK (role IN ('ESTUDIANTE', 'INSTRUCTOR', 'PROVEEDOR', 'ADMINISTRATIVO', 'DESCONOCIDO')),
    program_or_dept TEXT DEFAULT '',
    destination TEXT DEFAULT '',
    equipment TEXT DEFAULT '',
    avatar_url TEXT DEFAULT '',
    initials TEXT DEFAULT '',
    result TEXT NOT NULL,
    is_denied BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. TABLA: ASISTENCIA DE APRENDICES / ESTUDIANTES
CREATE TABLE IF NOT EXISTS public.students_attendance (
    id TEXT PRIMARY KEY,
    number TEXT NOT NULL,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    doc TEXT NOT NULL,
    status TEXT NOT NULL CHECK (status IN ('P', 'R', 'J', 'F')),
    check_time TEXT DEFAULT '',
    delay_minutes INTEGER DEFAULT 0,
    device_type TEXT DEFAULT 'Manual',
    notes TEXT DEFAULT '',
    avatar_url TEXT DEFAULT '',
    linked_device TEXT DEFAULT '',
    excuse_id TEXT DEFAULT '',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. TABLA: AMBIENTES Y AULAS DE FORMACIÓN
CREATE TABLE IF NOT EXISTS public.training_environments (
    id TEXT PRIMARY KEY,
    code TEXT NOT NULL UNIQUE,
    name TEXT NOT NULL,
    location TEXT NOT NULL,
    status TEXT NOT NULL CHECK (status IN ('EN CLASE ACTIVA', 'DISPONIBLE', 'EN MANTENIMIENTO', 'RESERVADO')),
    capacity INTEGER NOT NULL DEFAULT 30,
    current_attendance INTEGER DEFAULT 0,
    schedule_time TEXT DEFAULT '',
    current_subject TEXT DEFAULT '',
    instructor TEXT DEFAULT '',
    equipment_tags JSONB DEFAULT '[]'::jsonb,
    next_subject_notice TEXT DEFAULT '',
    door_status TEXT DEFAULT 'Puerta Bloqueada',
    accent_color TEXT DEFAULT 'primary',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. TABLA: REGISTRO Y TRAZABILIDAD DE ACTIVOS Y EQUIPOS
CREATE TABLE IF NOT EXISTS public.asset_records (
    id TEXT PRIMARY KEY,
    qr_code TEXT NOT NULL UNIQUE,
    category TEXT NOT NULL CHECK (category IN ('Activo Fijo', 'Audiovisual', 'Equipo Propio', 'Robótica', 'Garantía')),
    title TEXT NOT NULL,
    specs TEXT DEFAULT '',
    serial TEXT NOT NULL,
    mac TEXT DEFAULT 'N/A',
    custodian_name TEXT NOT NULL,
    custodian_doc_or_ficha TEXT NOT NULL,
    custodian_initials TEXT DEFAULT '',
    custodian_role TEXT NOT NULL,
    status_tag TEXT NOT NULL,
    deadline_notice TEXT DEFAULT '',
    deadline_type TEXT DEFAULT 'normal' CHECK (deadline_type IN ('normal', 'warning', 'error')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 5. TABLA: USUARIOS Y CARNETS DIGITALES
CREATE TABLE IF NOT EXISTS public.institutional_users (
    id TEXT PRIMARY KEY,
    full_name TEXT NOT NULL,
    doc TEXT NOT NULL UNIQUE,
    role TEXT NOT NULL CHECK (role IN ('ESTUDIANTE', 'INSTRUCTOR', 'PROVEEDOR', 'ADMINISTRATIVO')),
    email TEXT NOT NULL,
    program TEXT DEFAULT '',
    carnet_code TEXT NOT NULL UNIQUE,
    carnet_status TEXT NOT NULL DEFAULT 'ACTIVO',
    photo_url TEXT DEFAULT '',
    authorized_equipment TEXT DEFAULT '',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ==============================================================================
-- HABILITAR SEGURIDAD POR FILAS (RLS) Y POLÍTICAS DE ACCESO PÚBLICO
-- ==============================================================================

ALTER TABLE public.access_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.students_attendance ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.training_environments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.asset_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.institutional_users ENABLE ROW LEVEL SECURITY;

-- Políticas para anon (acceso vía API Key de Supabase)
DO $$
BEGIN
    DROP POLICY IF EXISTS "Permitir lectura publica de access_logs" ON public.access_logs;
    DROP POLICY IF EXISTS "Permitir escritura publica de access_logs" ON public.access_logs;
    CREATE POLICY "Permitir lectura publica de access_logs" ON public.access_logs FOR SELECT USING (true);
    CREATE POLICY "Permitir escritura publica de access_logs" ON public.access_logs FOR ALL USING (true);

    DROP POLICY IF EXISTS "Permitir lectura publica de students_attendance" ON public.students_attendance;
    DROP POLICY IF EXISTS "Permitir escritura publica de students_attendance" ON public.students_attendance;
    CREATE POLICY "Permitir lectura publica de students_attendance" ON public.students_attendance FOR SELECT USING (true);
    CREATE POLICY "Permitir escritura publica de students_attendance" ON public.students_attendance FOR ALL USING (true);

    DROP POLICY IF EXISTS "Permitir lectura publica de training_environments" ON public.training_environments;
    DROP POLICY IF EXISTS "Permitir escritura publica de training_environments" ON public.training_environments;
    CREATE POLICY "Permitir lectura publica de training_environments" ON public.training_environments FOR SELECT USING (true);
    CREATE POLICY "Permitir escritura publica de training_environments" ON public.training_environments FOR ALL USING (true);

    DROP POLICY IF EXISTS "Permitir lectura publica de asset_records" ON public.asset_records;
    DROP POLICY IF EXISTS "Permitir escritura publica de asset_records" ON public.asset_records;
    CREATE POLICY "Permitir lectura publica de asset_records" ON public.asset_records FOR SELECT USING (true);
    CREATE POLICY "Permitir escritura publica de asset_records" ON public.asset_records FOR ALL USING (true);

    DROP POLICY IF EXISTS "Permitir lectura publica de institutional_users" ON public.institutional_users;
    DROP POLICY IF EXISTS "Permitir escritura publica de institutional_users" ON public.institutional_users;
    CREATE POLICY "Permitir lectura publica de institutional_users" ON public.institutional_users FOR SELECT USING (true);
    CREATE POLICY "Permitir escritura publica de institutional_users" ON public.institutional_users FOR ALL USING (true);
END $$;

-- ==============================================================================
-- DATOS INICIALES (SEMILLA INSTITUCIONAL)
-- ==============================================================================

-- 1. Inserción de Usuarios
INSERT INTO public.institutional_users (id, full_name, doc, role, email, program, carnet_code, carnet_status, photo_url, authorized_equipment)
VALUES 
('usr-1', 'Valentina Restrepo Giraldo', '1.036.982.410', 'ESTUDIANTE', 'v.restrepo@instituto.edu.co', 'Tecnología en Desarrollo de Software (Ficha 267014)', 'CARNET-2024-EST-0941', 'ACTIVO', 'https://lh3.googleusercontent.com/aida-public/AB6AXuAW2bl7t4zaAY0z7mG0kX3fZ49i7-Rd7RBeGYYFccDuMsXvl9OLCOQe9SAOng69jf12jxTx1lkSbGFt9xX7JywGZAjLMBcBVNltme7BgWrWK-keJ4Ej1BPX3qgkblN_oMOR8LQ5j0RWJwUxp_MMVMfsuTqqN5SyK7GDIzDYv2RmM9yrrZdyaEGo3AwwCNb8P47EGebWfjC8scg_XVKO8WpyNX9MwSbuzp4fOYL0P3ls5QQwmObaLNg9vw', 'Lenovo ThinkPad E14 Gen 4 (#LNV-99214)'),
('usr-2', 'Camilo Andrés Torres', '71.394.021', 'INSTRUCTOR', 'c.torres@instituto.edu.co', 'Facultad de Ingeniería y Tecnologías TIC', 'CARNET-2024-DOC-021', 'ACTIVO', 'https://lh3.googleusercontent.com/aida-public/AB6AXuDdfwl4UT_p5W5ojP8tOZ1gTksXhD6F_KTWGUUAuDofxVj5AOFQJKmTCD2rFqhePwr3I7cua4A15krrg-KOs04C6oOn5U6gRrJ53YiApYD3amLHJghCt64zHRQU0mJyX42mWcxHVQ38moTB2aJP0hgkl20ieSBWgJ0Os446FFMLopR7eRvDCmFC66CxE8HQ0QEGKJWotz-n1YOVo5Prx5sqDQhXAvIV5b3Ijt7gNgQ1VcXYPK0phvwXRg', 'Dell Latitude 5530 (#DLL-44091)'),
('usr-3', 'Carlos D. Morales', '98.415.228', 'PROVEEDOR', 'cmorales@redes.com.co', 'Mantenimiento Redes S.A.S', 'PASE-PROV-2024-88', 'TEMPORAL', '', 'Valija Técnica #04'),
('usr-4', 'Dra. Claudia Benítez', '43.876.512', 'ADMINISTRATIVO', 'c.benitez@instituto.edu.co', 'Dirección de Gestión Académica', 'CARNET-ADM-004', 'ACTIVO', 'https://lh3.googleusercontent.com/aida-public/AB6AXuBBdO_sQYoFZUy9hj9IbCBEwqw4N40HgECL-9_BO5bR4aiukP9IP5ATiCJH00IMArPhbcHATcGEoVUay1XBax41WeyWeTDdb_wZHqlUR-_ohpIKFB3YOzOwWinQO-lE6HKURDxhKGV7AydlkMpHk6Y2D8Hsj47PRQ3qAoPwCdVo7SqDh-6nHEgUG6FEqNpMT0vq7lGKvIB-UBrODM17eKgUenq6wSPnDmZgrM-eR0NvQR9cfuB4ivItZQ', 'MacBook Air M2')
ON CONFLICT (id) DO NOTHING;

-- 2. Inserción de Registros de Acceso
INSERT INTO public.access_logs (id, time, user_name, user_doc, role, program_or_dept, destination, equipment, avatar_url, result, is_denied)
VALUES
('ev-1', '08:14:22', 'Camilo Andrés Torres', 'CC 71.394.021', 'INSTRUCTOR', 'Ingeniería de Software', 'Lab de Software 304', '1 Dell Latitude 5530', 'https://lh3.googleusercontent.com/aida-public/AB6AXuDdfwl4UT_p5W5ojP8tOZ1gTksXhD6F_KTWGUUAuDofxVj5AOFQJKmTCD2rFqhePwr3I7cua4A15krrg-KOs04C6oOn5U6gRrJ53YiApYD3amLHJghCt64zHRQU0mJyX42mWcxHVQ38moTB2aJP0hgkl20ieSBWgJ0Os446FFMLopR7eRvDCmFC66CxE8HQ0QEGKJWotz-n1YOVo5Prx5sqDQhXAvIV5b3Ijt7gNgQ1VcXYPK0phvwXRg', 'INGRESO EXITOSO', false),
('ev-2', '08:13:05', 'Mariana Gómez V.', 'CC 1.017.842.109', 'ESTUDIANTE', 'Salud Ocupacional', 'Aula Magna Bloque B', 'Sin equipos', 'https://lh3.googleusercontent.com/aida-public/AB6AXuBud5vIHRRnirhtrVE_-KGB0305ObGZOvJ9LZEuP5ejbkkoUwBzZjMMyMl-hVV5p5m2CrNcOu3HwR5zncZ_F8pnn9xmuf59BLYi5crs1A35Lr5SRfNH9xjZ7G8Kwg6MsG9U69GLv55zIt-6YASdAJwgWNe544eObVX-kTiWRFkYP4VJao_H2SrSE5MlWcy72eyCEHeTArkSFMmXnC89fZL_IkVA-GOr0oulTYrugOqKTSHJKmoAhybVzQ', 'INGRESO EXITOSO', false),
('ev-3', '08:11:40', 'Carlos D. Morales', 'CC 98.415.228', 'PROVEEDOR', 'Mantenimiento Redes S.A.S', 'Subestación Eléctrica', 'Valija Técnica #04', '', 'PASE TEMPORAL', false),
('ev-4', '08:09:12', 'QR No Reconocido', 'HASH: #88F0-EXPIRED', 'DESCONOCIDO', 'Sin Ficha Asignada', 'Sin Autorización', 'N/A', '', 'DENEGADO (VENCIDO)', true),
('ev-5', '08:04:45', 'Dra. Claudia Benítez', 'CC 43.876.512', 'ADMINISTRATIVO', 'Dirección Académica', 'Edificio de Rectoría', 'MacBook Air M2', 'https://lh3.googleusercontent.com/aida-public/AB6AXuBBdO_sQYoFZUy9hj9IbCBEwqw4N40HgECL-9_BO5bR4aiukP9IP5ATiCJH00IMArPhbcHATcGEoVUay1XBax41WeyWeTDdb_wZHqlUR-_ohpIKFB3YOzOwWinQO-lE6HKURDxhKGV7AydlkMpHk6Y2D8Hsj47PRQ3qAoPwCdVo7SqDh-6nHEgUG6FEqNpMT0vq7lGKvIB-UBrODM17eKgUenq6wSPnDmZgrM-eR0NvQR9cfuB4ivItZQ', 'SALIDA VERIFICADA', false)
ON CONFLICT (id) DO NOTHING;

-- 3. Inserción de Estudiantes y Asistencia
INSERT INTO public.students_attendance (id, number, name, email, doc, status, check_time, delay_minutes, device_type, notes, avatar_url, linked_device, excuse_id)
VALUES
('std-1', '01', 'Valentina Restrepo Giraldo', 'v.restrepo@instituto.edu.co', '1.036.982.410', 'P', '08:04 AM', 0, 'Torniquete V-04 (QR Dinámico)', 'Ingreso validado por torniquete QR', 'https://lh3.googleusercontent.com/aida-public/AB6AXuAW2bl7t4zaAY0z7mG0kX3fZ49i7-Rd7RBeGYYFccDuMsXvl9OLCOQe9SAOng69jf12jxTx1lkSbGFt9xX7JywGZAjLMBcBVNltme7BgWrWK-keJ4Ej1BPX3qgkblN_oMOR8LQ5j0RWJwUxp_MMVMfsuTqqN5SyK7GDIzDYv2RmM9yrrZdyaEGo3AwwCNb8P47EGebWfjC8scg_XVKO8WpyNX9MwSbuzp4fOYL0P3ls5QQwmObaLNg9vw', 'PORTATIL-HP-TIC302-09', ''),
('std-2', '02', 'David Mateo Ospina', 'd.ospina@instituto.edu.co', '1.017.654.321', 'P', '08:01 AM', 0, 'Carnet RFID Físico', 'Normal', 'https://lh3.googleusercontent.com/aida-public/AB6AXuCIK0mlwvezyI-DqjPcOamayHoZ2I2G3FV2TB-Ycu9aX1nbZLGdKGLU2TK_vQVvN88s5EDXYjYe9VEVt8M9RV-8g3Abfb5EFqvZE9_gbf3lGHzSvv4tXuV8NG5RZUZIQZk-Y7UHxMCvgqGJbfENEoSPfuqoh5NE5v8x2ABSOX9I22n7WTAzA3BUCAKuixgwypi20YsaCd4nwALcmpoukbikoBfPHFrjvuU1HsWox1r0jwNEuJ90wK9yuw', 'PORTATIL-LENOVO-TIC302-12', ''),
('std-3', '03', 'Sofía Henao Londoño', 's.henao@instituto.edu.co', '1.020.987.112', 'R', '08:26 AM', 26, 'Torniquete V-02', 'Retardo por transporte público', 'https://lh3.googleusercontent.com/aida-public/AB6AXuDmsDdslI-1KyO1nCm5z0Z0DpIpbJ5_scndPPCFQ_kq5i93d5qkViqkQrSsLnejdLvjqvoWjnAt8snSzIejTcB74_6lstG5FjMeGDJDtFMdLkuxF_J0DC-t56wmJ40QkNUWNOLH14SeJh0TS5O3lxP3RCIdu913qvNIXtx-qkgwi_9CAgk9A6KVofOc0VIVk03Y0jO6f93Q5Po3OpHAoViRQmkm84IyDxQ7a7_AsF1Fs__Ed04N-BCEVA', 'DELL-INSPIRON-TIC302-04', ''),
('std-4', '04', 'Juan Diego Morales', 'jd.morales@instituto.edu.co', '1.035.789.444', 'J', '', 0, 'Sistema Bienestar', 'Incapacidad médica #MED-402', 'https://lh3.googleusercontent.com/aida-public/AB6AXuDtwCCaWMQyaNbqbgP_XY83gL9GOk1f9gnyrv4THqV7pCXZMe4f3vwohWR7vlI8kJsF4R9HWRqCDNYEoZaG_DdquB1s7mV60IpXO5xM53fQIPOD3M5_45IozPxEg_Mj2vgaZksTM28XEKMi0yGdSeHcbl1QCcrXMvj65JHq5boA_-G_qpNC656z4JVwwtNDV_lK8RWbKQNgoF_3c-LuFGJMhzCNaOvP_TroxN3R7D6KDh3dOsjhK--E5A', '', 'MED-402'),
('std-5', '05', 'Andrés Felipe Castro', 'af.castro@instituto.edu.co', '1.040.123.889', 'F', '', 0, 'Portería: No detectado', 'Sin registro en portería', 'https://lh3.googleusercontent.com/aida-public/AB6AXuDE-d7XtZq2D5OHajZ6cGv40ai3MArI3rAPhpRmmjfU7eUNWM_OSbwhCjjrbHFtanUX_kcodNYElsyfbBcorUj6S48E_N2vgNPckxJtlQdZR0YxYClXVV85EE2LzkV6seraF_tuZpPQyNq6Qo8kQ2SEG0r2LZ64Khk_jP2JgDgIaDRLpUV6OY8zWMvDHvG-G9xUDGCE1hHl71cGRcYq-IjqCip_rmteie9KdRpLw-sI0Qs2tkbQm91SWQ', '', ''),
('std-6', '06', 'Laura Camila Ríos', 'lc.rios@instituto.edu.co', '1.022.345.901', 'P', '08:02 AM', 0, 'Torniquete V-04 (QR Dinámico)', 'Normal', 'https://lh3.googleusercontent.com/aida-public/AB6AXuCwL5Wg0yvZU0VTGAnIgx_vNVUaa83sieMCt_32wVkyJsO5im2vSFeJ1h_HRRZcCWn4A7Fvo8sP3mbMqe695UmA5Xw9U88VuizkNwxNOfIn8G3zbJGuUCQJTLMKByfFK4Jf-YW1mpjGc8WHXG_eq94Gs1K23JExhWRuycVbV5tUcEtx_1VB6hOryxNztoOPNKWPKPoscmV-BnUIOnntfO9x9Yju6VJmv3_m3LwhFGzx4nVVzrK1KxOz9Q', 'PORTATIL-ASUS-TIC302-15', '')
ON CONFLICT (id) DO NOTHING;

-- 4. Inserción de Ambientes
INSERT INTO public.training_environments (id, code, name, location, status, capacity, current_attendance, schedule_time, current_subject, instructor, equipment_tags, next_subject_notice, door_status, accent_color)
VALUES
('amb-1', 'TIC 302', 'Laboratorio TIC 302', 'Bloque A • Piso 3', 'EN CLASE ACTIVA', 35, 32, '07:00 - 10:00', 'Bases de Datos MySQL - Ficha 258901', 'Ing. Sandra Milena Peña', '["35 PCs Core i7", "Proyector 4K", "A/C Climatizado"]'::jsonb, 'Próxima: Redes Distribuidas (10:15)', 'Desbloqueada Automáticamente', 'primary'),
('amb-2', 'Aula 204', 'Aula Polivalente 204', 'Bloque A • Piso 2', 'DISPONIBLE', 40, 0, '10:00 - 12:30', 'Redes de Comunicación & Protocolos', 'Msc. Fernando Alarcón', '["Pantalla Interactiva 75\"", "Cobertura Mesh WiFi-6"]'::jsonb, 'Redes de Comunicación & Protocolos (10:00)', 'Puerta Bloqueada', 'secondary'),
('amb-3', 'Taller 101', 'Taller de Electrónica 101', 'Bloque A • Piso 1', 'EN MANTENIMIENTO', 25, 0, 'Todo el día', 'Mantenimiento Técnico', 'Brigada Técnica Mantenimiento Sur', '["25 Mesas ESD", "Bancos Trifásicos"]'::jsonb, 'Calibración de osciloscopios y recableado', 'Acceso Restringido a Personal TI', 'tertiary'),
('amb-4', 'Móvil 305', 'Lab. Desarrollo Móvil 305', 'Bloque A • Piso 3', 'EN CLASE ACTIVA', 30, 28, '08:30 - 11:30', 'Desarrollo Frontend React - Ficha 267014', 'Prof. Julián Duque', '["30 Mac Mini M2", "Smart Board 85\"", "Sistema Microfonía"]'::jsonb, 'Próxima: UX/UI Design (12:00)', 'Desbloqueada Automáticamente', 'primary'),
('amb-5', 'Auditorio A', 'Auditorio Principal Bloque A', 'Bloque A • Planta Baja', 'RESERVADO', 180, 0, '14:00 - 18:30', 'Jornada Institucional de Ciberseguridad', 'Dirección Nacional TIC & Alianzas', '["Streaming HD Dual", "Audio Dolby 7.1", "Cabina de Traducción"]'::jsonb, 'Montaje técnico en curso', 'Puerta Bloqueada', 'primary'),
('amb-6', 'Servidores', 'Sala de Servidores & Redes', 'Bloque A • Sótano Tecnológico', 'DISPONIBLE', 15, 2, '11:00 - 18:00', 'Práctica de Cableado & Racks Cisco', 'Ing. Carlos Mendoza', '["4 Racks Cisco Catalyst", "Fibra Óptica Monomodo"]'::jsonb, 'Acceso Biomagnético (18°C Estable)', 'Control Biométrico', 'secondary')
ON CONFLICT (id) DO NOTHING;

-- 5. Inserción de Equipos y Activos
INSERT INTO public.asset_records (id, qr_code, category, title, specs, serial, mac, custodian_name, custodian_doc_or_ficha, custodian_initials, custodian_role, status_tag, deadline_notice, deadline_type)
VALUES
('ast-1', 'ACT-TI-0941', 'Activo Fijo', 'Lenovo ThinkPad E14 Gen 4', 'Core i7 12va • 16GB RAM • 512GB SSD', 'PF4289K0', '3C:52:82:11:A9:BC', 'Valentina Restrepo', 'Aprendiz ADSO • Ficha 2670182', 'VR', 'Aprendiz', 'En Préstamo', 'Devolver hoy 18:00', 'error'),
('ast-2', 'ACT-AV-0118', 'Audiovisual', 'Epson PowerLite Laser 4K', '4500 lúmenes • Soporte techo antirrobo', 'EP9928-0012', 'A4:BB:6D:77:E1:02', 'Aula Lab TIC 302', 'Asignación Permanente', '', 'Infraestructura', 'En Sede / Fijo', '', 'normal'),
('ast-3', 'EXT-PC-4910', 'Equipo Propio', 'ASUS ROG Zephyrus G14', 'Color Gris Eclipse • Calcomanías Dev', 'CN-0N8329-873', 'N/A (Declarado)', 'Julián Soto', 'C.C. 1.092.348.112', 'JS', 'Aprendiz Externo', 'Portería Norte (07:15)', 'Pase de Salida Habilitado', 'normal'),
('ast-4', 'ROB-KT-003', 'Robótica', 'Maletín LEGO Spike Prime', 'Hub inteligente, 4 sensores y servomotores', 'LG-2023-9941', 'BLE: E8:3B:11:00:23:44', 'Ing. M. Benítez', 'Instructor Mecatrónica', 'MB', 'Instructor', 'Taller 104 - En Uso', '', 'normal'),
('ast-5', 'NET-SW-088', 'Garantía', 'Cisco Catalyst 2960-X', '48 Puertos PoE+ • Falla en Fuente 2', 'FOC2230Z18', '00:1E:F7:88:99:A1', 'Taller Central TI', 'Ticket #8491', 'TI', 'Soporte TI', 'Fuera de Servicio', 'En revisión técnica', 'error')
ON CONFLICT (id) DO NOTHING;
