# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Repository contents

A single self-contained HTML file: `jcdetalles_landing.html`. Spanish-language landing page (`<html lang="es">`) for **JC Detalles Planner**, an event-planning business in Panama City, Panama.

No build system, package manager, or test suite. The page is hosted on **GitHub Pages**: `https://luishenry07.github.io/Pagina-Howard/jcdetalles_landing.html`. The page uses the **Firebase Web SDK v9 compat** (three `<script>` tags in `<head>` loaded from `gstatic.com`) for the agenda and solicitudes; everything else is plain HTML + inline CSS.

> **Do not open the file directly** from the filesystem — Firebase Firestore's WebSocket connections are blocked on `file://` in mobile browsers. Always use the GitHub Pages URL or a local HTTP server.

## High-level architecture

**Static marketing page + Firebase backend.** All UI lives in one HTML file; persistent state for the agenda lives in two Firestore documents. The marketing sections (hero, services, gallery, about, contact) are pure static markup. The agenda section is the only interactive piece.

### Page structure

Sections in body order: `<nav>`, `.hero`, `.stats`, `#servicios`, `#galeria`, `#agenda`, `#nosotros`, `#contacto`, `<footer>`. Nav anchors link to the section IDs.

Mounted after the footer (so they overlay everything):
- `.admin-trigger` — small floating "Admin" button (bottom-right) that opens the login modal. URL hash `#admin` also opens it.
- `.admin-bar` — top banner, shown only while authenticated. Contains "Solicitudes" button with red badge counter.
- `#admin-overlay` — email/password login modal.
- `#day-editor-overlay` — admin modal for editing a single date (status + note + visibility).
- `#day-info-overlay` — read-only modal shown to public visitors who click a date with a public note.
- `#solicitud-overlay` — modal shown to public visitors who click an available date; lets them submit a booking request.
- `#solicitudes-panel` — admin-only panel listing all pending solicitudes with Approve/Reject buttons.

The single `<script>` (regular, not module) at the bottom holds all the Firebase + calendar + solicitudes logic.

### Firestore data model

Three data stores — two documents for the agenda (split by privacy) and one collection for booking requests:

| Path              | Fields                                                                  | Read          | Write         |
|-------------------|-------------------------------------------------------------------------|---------------|---------------|
| `agenda/dates`    | `ocupadas: string[]` (YYYY-MM-DD), `notasPublicas: { [date]: string }` | public        | authenticated |
| `agenda/privado`  | `notasPrivadas: { [date]: string }`                                     | authenticated | authenticated |
| `solicitudes/{id}`| `date, nombre, telefono, evento, nota, estado, timestamp`               | authenticated | public (create only) |

`estado` values for solicitudes: `'pendiente'` → `'aprobada'` or `'rechazada'`. Public users can only `create`; only admin can read and update.

A date can carry at most one note; its visibility (public vs private) determines which document it lives in. Switching visibility moves the entry between docs. Marking a date "Disponible" deletes the entry from both `ocupadas` and both notas maps. **Never put sensitive content into `agenda/dates`** — it is world-readable by Firestore Rules design.

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
  }
}
```

### Auth

Firebase Auth email/password. No signup UI — the owner/admin user is created manually in Firebase Console → Authentication → Users. The `firebaseConfig` object is hardcoded in the script; this is **safe by design** (Firebase web config identifies the project but is not a secret — security comes from Rules + Auth).

### Client state and reactivity

- `AGENDA_DOC.onSnapshot(...)` subscribes to the public doc on page load (works for everyone).
- `PRIVATE_DOC.onSnapshot(...)` is set up inside `onAuthStateChanged` only when a user is authenticated, and is torn down on logout.
- `SOLICITUDES_COL.where('estado','==','pendiente').onSnapshot(...)` is set up inside `onAuthStateChanged` only when authenticated; drives the badge counter and the solicitudes panel list.
- All agenda writes go through the "Save" button in `#day-editor-overlay` (optimistic local update then `.set()` on both docs). Solicitud approval also calls `AGENDA_DOC.set(...)` to mark the date occupied.
- **WhatsApp popup rule**: `window.open(waUrl, '_blank')` must be called *before* any `await` in the click handler, otherwise mobile browsers block it as a popup (user gesture is no longer active after an async gap).

## File-editing notes

- **Do not Read the whole file in one call.** The `#galeria` section embeds 5 base64 images, each on its own multi-megabyte line. A full Read blows the token budget. Use `offset`/`limit` to read the surrounding markup, or use Grep with line numbers to navigate. To swap a gallery image, target just the `src="data:image/...;base64,..."` attribute for one `.gal-item`. Line numbers shift as the file grows — re-grep for landmarks rather than hardcoding line numbers.
- CSS uses custom properties defined in `:root` near the top of the `<style>` block (`--gold`, `--gold-light`, `--gold-deep`, `--gold-bright`, `--rose`, `--rose-light`, `--rose-deep`, `--dark`, `--cream`, `--text`, `--text-light`, `--black-gold`). Prefer these over hardcoded colors.
- WhatsApp number `+507 6369 1175` and Instagram handle `@jcdetallesplanner` appear in multiple places (hero CTA, agenda CTA, `#contacto`). Update all together.
- WhatsApp links carry a URL-encoded Spanish pre-filled message; preserve the encoding when editing.
- All strings shown to users are Spanish. Match the tone of the existing copy (formal but warm — `Disponible`, `Ocupado`, `Cotiza tu evento`, etc.).

## Refreshing this file

Re-run `/init` and select option 2 ("update existing CLAUDE.md") when significant architecture changes happen.
