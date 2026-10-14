# SGI Acceso - Control Institucional y Trazabilidad (PHP + Supabase + XAMPP)

Sistema integral de gestión institucional diseñado para el control de accesos por torniquetes mediante códigos QR dinámicos, gestión de ambientes/laboratorios, control de asistencia de aprendices, trazabilidad de activos/equipos y emisión de carnets digitales.

Desarrollado en **PHP 8.2 (nativo)** para ejecutarse en **Apache / XAMPP** con integración a **Supabase (PostgreSQL en la nube)** y modo de almacenamiento local automático (*fallback*).

---

## 🚀 Arquitectura y Componentes del Sistema

1. **Backend PHP & REST API (`api/`)**:
   - [`api/SupabaseClient.php`](file:///c:/Users/mauri/OneDrive/Desktop/GESTION-INSTITUCIONAL-/api/SupabaseClient.php): Cliente cURL para interactuar con la API REST de Supabase (PostgREST).
   - [`api/access.php`](file:///c:/Users/mauri/OneDrive/Desktop/GESTION-INSTITUCIONAL-/api/access.php): Registro y consulta de ingresos y salidas en tiempo real.
   - [`api/attendance.php`](file:///c:/Users/mauri/OneDrive/Desktop/GESTION-INSTITUCIONAL-/api/attendance.php): Control de asistencia (Presente, Retardo, Justificado, Falla).
   - [`api/environments.php`](file:///c:/Users/mauri/OneDrive/Desktop/GESTION-INSTITUCIONAL-/api/environments.php): Monitoreo de aulas, aforo y control de cerraduras de puertas.
   - [`api/assets.php`](file:///c:/Users/mauri/OneDrive/Desktop/GESTION-INSTITUCIONAL-/api/assets.php): Inventario de equipos, asignación de custodios y préstamos.
   - [`api/users.php`](file:///c:/Users/mauri/OneDrive/Desktop/GESTION-INSTITUCIONAL-/api/users.php): Directorio institucional y emisión de carnets.
   - [`api/reports.php`](file:///c:/Users/mauri/OneDrive/Desktop/GESTION-INSTITUCIONAL-/api/reports.php): Métricas consolidadas, distribución horaria y auditoría.
   - [`api/test_supabase.php`](file:///c:/Users/mauri/OneDrive/Desktop/GESTION-INSTITUCIONAL-/api/test_supabase.php): Diagnóstico en vivo de latencia y estado de tablas en Supabase.
   - [`api/sync_seed.php`](file:///c:/Users/mauri/OneDrive/Desktop/GESTION-INSTITUCIONAL-/api/sync_seed.php): Sincronización en 1 clic de datos de prueba hacia Supabase.

2. **Base de Datos Supabase (`database/`)**:
   - [`database/schema.sql`](file:///c:/Users/mauri/OneDrive/Desktop/GESTION-INSTITUCIONAL-/database/schema.sql): Script completo con tablas (`access_logs`, `students_attendance`, `training_environments`, `asset_records`, `institutional_users`), políticas RLS y registros semilla.

3. **Frontend Interactivo (`index.php`)**:
   - Interfaz institucional moderna con Google Fonts (*Inter*, *JetBrains Mono*, *Material Symbols*).
   - Sintetizador de audio Web Audio API para alertas de escáner sonoras (aprobado / denegado).
   - Vistas móviles optimizadas: **Carnet Digital de Estudiante** (con QR dinámico rotativo cada 30 segundos) y **Portería Móvil del Guardia**.

---

## 🛠️ Ejecución y Publicación en XAMPP

El proyecto ya se encuentra enlazado directamente a su directorio de XAMPP:
`C:\xamppp\htdocs\gestion-institucional\`

### Opción A: Acceso mediante el Servidor Apache de XAMPP (Recomendado)
1. Abra el panel de control de XAMPP (`C:\xamppp\xampp-control.exe`).
2. Haga clic en **Start** en el módulo **Apache**.
3. Abra su navegador e ingrese a:
   👉 **`http://localhost/gestion-institucional/`**

### Opción B: Ejecución Automática con Script
Haga doble clic sobre el archivo:
- [`deploy_to_xampp.bat`](file:///c:/Users/mauri/OneDrive/Desktop/GESTION-INSTITUCIONAL-/deploy_to_xampp.bat): Sincroniza y abre el navegador automáticamente en la URL de XAMPP.

### Opción C: Servidor Local Rápido de PHP (Sin iniciar Apache)
Haga doble clic sobre:
- [`run_local_php.bat`](file:///c:/Users/mauri/OneDrive/Desktop/GESTION-INSTITUCIONAL-/run_local_php.bat): Inicia el servidor integrado de PHP en `http://localhost:8000/`.

---

## ⚡ Conexión con Supabase

La aplicación funciona al 100% en modo local de inmediato, y se conecta a Supabase en 3 sencillos pasos:

1. **Crear las tablas en Supabase**:
   - Ingrese a [supabase.com](https://supabase.com) y abra su proyecto.
   - Vaya a la sección **SQL Editor** en la barra lateral izquierda.
   - Copie y pegue el contenido de [`database/schema.sql`](file:///c:/Users/mauri/OneDrive/Desktop/GESTION-INSTITUCIONAL-/database/schema.sql) y presione **Run**.

2. **Configurar las credenciales**:
   - En el panel de Supabase, vaya a **Project Settings** -> **API**.
   - Copie el **Project URL** y el **anon public key**.
   - En la aplicación web (`http://localhost/gestion-institucional/`), haga clic en el botón **Supabase** de la cabecera o pie del menú lateral.
   - Ingrese la URL y la API Key y haga clic en **Guardar y Aplicar**.
   *(También puede editar directamente el archivo [`config.php`](file:///c:/Users/mauri/OneDrive/Desktop/GESTION-INSTITUCIONAL-/config.php) o [`config.json`](file:///c:/Users/mauri/OneDrive/Desktop/GESTION-INSTITUCIONAL-/config.json)).*

3. **Cargar los datos iniciales**:
   - En el modal de Supabase de la app, haga clic en **Probar Conexión** y luego en **Sincronizar Semilla** para poblar su base de datos con los registros de prueba.

---

## 📋 Módulos Operativos

- **Control de Portería & QR**: Validación en vivo de ingresos y salidas, búsqueda rápida por documento, bloqueo preventivo y registro en tabla en tiempo real.
- **Gestión de Ambientes**: Control de aforo, asignaturas en curso, apertura y bloqueo biomagnético de puertas.
- **Control de Asistencia**: Marcación instantánea (Presente, Retardo, Justificado, Falla) con cálculo dinámico de puntualidad.
- **Novedades y Equipos**: Control de seriales, direcciones MAC, préstamo de portátiles institucionales y declaración de equipos propios.
- **Usuarios y Carnets**: Generación de carnets digitales verificables para aprendices, docentes y contratistas.
- **Reportes y Auditoría**: Visualización de horas pico de ingreso, estadísticas consolidadas y exportación de datos.
