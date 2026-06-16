# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Repository contents

A single self-contained HTML file: `jcdetalles_landing.html`. Spanish-language landing page (`<html lang="es">`) for **JC Detalles Planner**, an event-planning business in Panama City, Panama.

No build system, package manager, or test suite. The page is hosted on **GitHub Pages**: `https://luishenry07.github.io/Pagina-Howard/jcdetalles_landing.html`. The page uses the **Firebase Web SDK v9 compat** (three `<script>` tags in `<head>` loaded from `gstatic.com`) for the agenda, solicitudes, packages, and quotations; everything else is plain HTML + inline CSS.

> **Do not open the file directly** from the filesystem — Firebase Firestore's WebSocket connections are blocked on `file://` in mobile browsers. Always use the GitHub Pages URL or a local HTTP server.

## Assets

Gallery images and the logo are stored in `Imagenes/` (capital I — case-sensitive on GitHub Pages Linux servers):

```
Imagenes/
  Logos/Logo.png               ← navbar logo
  Boda/SAT_3280.jpeg           ← gallery image 1
  QuinceAños/IMG_6239.jpeg     ← gallery images 2-5
  QuinceAños/IMG_6256.jpeg
  QuinceAños/IMG_6262.jpeg
  QuinceAños/IMG_6322.jpeg
```

Always use `Imagenes/` (capital I) in `src` attributes — lowercase `imagenes/` will 404 on GitHub Pages.

## High-level architecture

**Static marketing page + Firebase backend.** All UI lives in one HTML file; persistent state lives in Firestore. The marketing sections (hero, services, gallery, about, contact) are pure static markup.

### Page structure

Sections in body order: `<nav>`, `.hero`, `.stats`, `#servicios`, `#galeria`, `#agenda`, `#nosotros`, `#contacto`, `<footer>`.

**Nav:** Logo (image) on the left + hamburger button (mobile) + links on the right. "Servicios" link has a hover dropdown with the 6 service items; clicking one calls `abrirServicio(index)` which opens that accordion item and scrolls to it. On mobile (≤768px) the nav collapses to a hamburger menu that opens a full-screen overlay.

**#servicios:** Accordion using native `<details>`/`<summary>` elements. No JS needed to open/close — `abrirServicio(index)` programmatically sets the `open` attribute.

**#galeria:** CSS grid (3 cols × 2 rows, first item spans 2 rows) with real images from `Imagenes/`. No base64.

Mounted after the footer (overlays everything):
- `.admin-trigger` — floating "Admin" button (bottom-right); URL hash `#admin` also opens it
- `.admin-bar` — top banner shown only while authenticated; contains Solicitudes, 📦 Paquetes, ⚙ Formulario, Cerrar sesión buttons
- `#admin-overlay` — email/password login modal
- `#day-editor-overlay` — admin modal: edit a date's status, note, and visibility
- `#day-info-overlay` — read-only modal for public visitors who click a date with a public note
- `#solicitud-overlay` — client booking-request form (6 fields + optional promo banner)
- `#solicitudes-panel` — admin panel listing pending + quoted solicitudes
- `#paquetes-overlay` — admin panel to create/edit/delete packages (name, description, price)
- `#cotizar-overlay` — admin modal to send a formal quote via WhatsApp: select a package, add a note
- `#form-config-overlay` — admin modal to edit the promotional banner text shown on the client form

### Firestore data model

| Path | Fields | Read | Write |
|---|---|---|---|
| `agenda/dates` | `ocupadas: string[]` (YYYY-MM-DD), `notasPublicas: { [date]: string }` | public | authenticated |
| `agenda/privado` | `notasPrivadas: { [date]: string }` | authenticated | authenticated |
| `solicitudes/{id}` | `date, nombre, correo, invitados, evento, presupuesto, estado, timestamp, paqueteCotizado?` | authenticated | public (create only) |
| `config/formulario` | `promoBanner: string` | public | authenticated |
| `config/paquetes` | `lista: [{id, nombre, descripcion, precio}]` | authenticated | authenticated |

**`estado` values for solicitudes:** `'pendiente'` → `'cotizada'` → `'aprobada'` or `'rechazada'`. The admin panel shows `pendiente` and `cotizada`; approved/rejected are archived. **Approving does NOT auto-block the date** — the admin manually blocks dates by clicking them in the calendar editor.

### Required Firestore Rules

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /agenda/dates {
      allow read: if true;
      allow write: if request.auth != null;
    }
    match /agenda/privado {
      allow read, write: if request.auth != null;
    }
    match /solicitudes/{doc} {
      allow create: if true;
      allow read, update: if request.auth != null;
    }
    match /config/formulario {
      allow read: if true;
      allow write: if request.auth != null;
    }
    match /config/paquetes {
      allow read, write: if request.auth != null;
    }
  }
}
```

### Auth

Firebase Auth email/password. No signup UI — admin user created manually in Firebase Console → Authentication → Users. The `firebaseConfig` object is hardcoded; this is safe by design (security enforced by Rules + Auth).

### Client state and reactivity

Subscriptions set up on page load (public):
- `AGENDA_DOC.onSnapshot` — ocupadas + public notes
- `CONFIG_DOC.onSnapshot` — promo banner text

Subscriptions set up inside `onAuthStateChanged` (authenticated only), torn down on logout:
- `PRIVATE_DOC.onSnapshot` — private notes
- `SOLICITUDES_COL.where('estado','in',['pendiente','cotizada']).onSnapshot` — drives badge + panel
- `PAQUETES_DOC.onSnapshot` — package list for cotizar modal

### Admin quotation flow

1. Client clicks available date → fills 6-field form (nombre, correo, invitados, evento, presupuesto, optional promo banner) → WhatsApp opens + saved to `solicitudes` as `pendiente`
2. Admin sees badge on "Solicitudes" button
3. Admin clicks **Cotizar** on a pending solicitud → selects a package from `config/paquetes` → adds optional note → "Enviar por WhatsApp" opens WA with formatted quote → solicitud marked `cotizada`
4. Admin clicks **Aprobar** or **Rechazar** to finalize
5. Admin manually blocks the date in the calendar if needed

### WhatsApp popup rule

`window.open(waUrl, '_blank')` must be called **before** any `await` in the click handler — mobile browsers block popups opened after an async gap (user gesture no longer active).

### Firestore offline persistence

`db.enablePersistence()` is enabled so `SOLICITUDES_COL.add()` writes locally first and syncs even if the user navigates to WhatsApp before the network round-trip completes.

## File-editing notes

- **Do not Read the whole file in one call.** The file is large. Use `offset`/`limit` to read specific sections, or use Grep with line numbers to navigate.
- CSS uses custom properties in `:root`: `--gold`, `--gold-light`, `--gold-deep`, `--gold-bright`, `--rose`, `--rose-light`, `--rose-deep`, `--dark`, `--cream`, `--text`, `--text-light`, `--black-gold`. Prefer these over hardcoded colors.
- WhatsApp number `+507 6369 1175` and Instagram handle `@jcdetallesplanner` appear in multiple places. Update all together.
- WhatsApp links carry URL-encoded Spanish pre-filled messages; preserve the encoding when editing.
- All strings shown to users are Spanish. Match tone: formal but warm (`Disponible`, `Cotizar`, `Enviar por WhatsApp`, etc.).
- The gallery uses real image files from `Imagenes/` — never re-embed as base64.
- When adding new gallery images, commit them to `Imagenes/` and use relative paths with capital `I`.
- Mobile breakpoint is `max-width: 768px`. The nav hamburger menu, logo size, and dropdown behavior all change at this breakpoint.

## Refreshing this file

Re-run `/init` and select option 2 ("update existing CLAUDE.md") when significant architecture changes happen.
