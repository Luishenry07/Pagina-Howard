# JC Detalles Planner — Landing Page

Página de aterrizaje de **JC Detalles Planner**, planificadores de eventos en Panama City, Panamá. Una sola página, sin frameworks ni build step, con una agenda interactiva en tiempo real y un panel de administración para el dueño del negocio.

## Demo

Abre `jcdetalles_landing.html` directamente en cualquier navegador moderno.

## Stack

- HTML + CSS inline — sin frameworks, sin preprocesadores, sin npm.
- Firebase Web SDK v10 (Auth + Firestore) cargado vía ESM desde `gstatic.com`.
- Google Fonts: Cormorant Garamond + Jost.

## Características

### Página pública
Hero, servicios, galería (imágenes embebidas en base64), sección "Quiénes somos", contacto con CTAs a WhatsApp e Instagram.

### Agenda interactiva
Calendario mensual navegable con tres estados: **Disponible**, **Ocupado**, **Fecha pasada**. Sincronización en tiempo real con Firestore — cuando el administrador cambia una fecha, todos los visitantes la ven al instante sin recargar.

Las fechas ocupadas con una nota pública muestran un botón **"VER EVENTO"**; los visitantes pueden hacer click para leer el detalle (ej: *"Reservado para boda Pérez — 6:00 pm"*).

### Panel de administrador
Login email/contraseña (Firebase Auth) desde el botón "Admin" abajo a la derecha, o vía `#admin` en la URL. Por cada fecha futura, el administrador puede:

- Marcar **Disponible** u **Ocupado**.
- Adjuntar una **nota** (ej: cliente, detalles del evento, anticipo pendiente).
- Elegir si la nota es **Pública** (visible para todos) o **Privada** (solo administrador).

## Privacidad real de las notas privadas

Las notas privadas no son sólo ocultas del UI — viven en un documento de Firestore separado cuyas reglas bloquean la lectura para usuarios no autenticados. Ni siquiera con DevTools puede un visitante leerlas.

| Documento        | Contenido                              | Lectura       | Escritura      |
|------------------|----------------------------------------|---------------|----------------|
| `agenda/dates`   | `ocupadas[]` + `notasPublicas{}`       | público       | autenticado    |
| `agenda/privado` | `notasPrivadas{}`                      | autenticado   | autenticado    |

## Configuración de Firebase (una sola vez)

1. Crear proyecto en https://console.firebase.google.com
2. Agregar app Web y copiar las credenciales en el bloque `firebaseConfig` dentro del `<script type="module">` al final del HTML.
3. Activar **Firestore Database** (modo producción).
4. Activar **Authentication → Email/Password** y crear el usuario administrador desde la pestaña *Users*.
5. Publicar las reglas de Firestore — copia el bloque exacto del comentario al inicio del `<script>` en el HTML, o consulta `CLAUDE.md`.

Las credenciales de Firebase Web son **públicas por diseño** — la seguridad real la dan las reglas de Firestore + Auth, no ocultar esos valores en el código.

## Estructura del archivo

Todo vive en `jcdetalles_landing.html`:

- `<style>` con CSS inline y variables CSS (`--gold`, `--rose`, `--cream`…) para el tema dorado/rosa.
- Secciones en orden: nav → hero → stats → servicios → galería → **agenda** → nosotros → contacto → footer.
- Tres modales superpuestos: login admin, editor por fecha, info pública por fecha.
- `<script type="module">` al final con toda la lógica de Firebase y del calendario.

Para detalles técnicos y notas de edición ver [`CLAUDE.md`](./CLAUDE.md).

## Contacto del negocio

- WhatsApp: +507 6369 1175
- Instagram: [@jcdetallesplanner](https://www.instagram.com/jcdetallesplanner)
- Ubicación: PH Bay View, Panama City, Panamá
