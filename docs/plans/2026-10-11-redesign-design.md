# ADQ Media redesign: design

Date: 2026-10-11
Status: Approved

## Goal

Rebuild adqmedia.au so the client can publish shoots themselves. Every shoot becomes its own project page, and information pages take an editorial style. The site gets light and dark modes and a pop-out menu.

The Sav Media site (https://web.archive.org/web/20250114130338/https://www.savmedia.com.au/) is the main reference. We take its structure as inspiration but don't copy it. Colour and type come from the ADQ Media design system in Paper.

## Current state

- Vite + React 19 single-page app, Tailwind v4, deployed to GitHub Pages.
- Galleries are hand-written arrays in `src/constants/`, and each image has a hard-coded column span.
- About 1 GB of media (including 24 videos) is committed to the repo.
- Commercial work is grouped one page per client. Showcase is one mixed gallery.
- The contact form uses EmailJS, with its service, template and public key IDs in the source.

## Decisions

| Area | Decision |
|---|---|
| Content management | Hosted headless CMS (Sanity) plus a video service (Mux) |
| Framework and hosting | Next.js (App Router) on Vercel |
| Content model | One project per shoot, tagged Creative or Commercial, linked to a client |
| Homepage | Project index: cover grid by default, switchable to an editorial list |
| Information pages | One editorial Info page |
| Project default view | Layout on desktop, scroll on mobile; the visitor's choice is remembered |
| Layout control | The client builds each shoot from preset rows (full, pair, trio) |
| Theme | Each page sets a default (work dark, Info light); a visitor toggle overrides it and is remembered |
| Filter toggle | Homepage only; next/previous step through all projects |

## Architecture

- **Next.js on Vercel.** Keep React, Tailwind v4 and motion. Pages are statically generated and refreshed on demand.
- **Sanity** stores all content and photos. Images are served through Sanity's image pipeline, resized per breakpoint and in modern formats.
- **Mux** stores and streams video using adaptive streaming, with generated poster frames.
- **Publishing.** A Sanity webhook calls a Next.js revalidation route, protected by a shared secret. The route refreshes the affected project page and the index within seconds.
- **Migration.** A one-off script uploads the existing media from `public/` into Sanity and Mux and creates the matching projects. After that, the media is removed from the repo.

## Content model

**Project**
- `title`: the car or shoot name
- `slug`
- `client` (reference)
- `date`
- `category`: `creative` | `commercial`
- `cover`: image
- `info`: description (rich text) and credits (role/name pairs)
- `rows`: an array of rows

**Row**: one of
- `full`: one slot
- `pair`: two slots
- `trio`: three slots

Each slot holds either an image (with alt text) or a Mux video.

**Client**
- `name`
- optional `logo`
- optional `url`

**Site settings** (singleton)
- Info page copy
- services list
- contact details
- socials

**Ordering.** Projects are ordered manually by drag and drop in Sanity. Next and previous follow this order across all projects and wrap at the ends.

**Scroll order.** The scroll view walks the rows in order and the slots left to right within each row.

## Pages

### Home `/`
- The project index.
- Cover-image grid by default. A view switch shows an editorial list with title, client, category and year.
- The Creative / All / Commercial toggle filters the index. The filter is stored in the URL (`?filter=creative`) so it can be shared and survives the back button.
- Dark by default.

### Project `/work/[slug]`
- **Layout view.** The preset rows, rendered editorially.
- **Scroll view.** Each item fills the screen and snaps to the next on scroll or swipe. Videos autoplay muted and pause when they leave the screen.
- **Default view.** Layout on desktop and scroll on mobile. Once a visitor switches, their choice is stored in local storage and used from then on.
- Next and previous project buttons.
- An info pop-out showing the description, client, date and credits. It can be dismissed with Esc or by clicking outside, and focus stays inside it while open.
- Per-project metadata (title, description, Open Graph image from the cover).
- Dark by default.

### Info `/info`
- One long editorial page with these sections: about, services, clients, contact form.
- Light by default.

### Redirects
- `/showcase` → `/?filter=creative`
- `/commercial` → `/?filter=commercial`
- `/commercial/:client` → `/?filter=commercial`
- `/about` → `/info`
- `/services` → `/info#services`

## Navigation and theme

- **Top bar.** The wordmark and a menu button. The filter toggle appears on the homepage only.
- **Menu pop-out.** Info, contact details, socials and the light/dark toggle.
- **Theme tokens.** These come from Paper. Raw tokens are `--dark-*` and `--light-*`. Semantic `--color-*` tokens are swapped by a class on `<html>`.
- **Defaults.** Each route declares its default theme. A visitor override is stored in local storage and applied before first paint, so the page doesn't flash the wrong theme.

## Contact

- The form posts to a Next.js route handler that sends mail through a transactional email provider (e.g. Resend).
- The input is validated against a schema on the server.
- A honeypot field and rate limiting (per IP) cut down on spam.
- Visitors see a friendly error message. Details go to the server log.
- The API keys live in environment variables. The EmailJS IDs are removed from the source.

## Error handling

- An unknown slug returns a 404 page.
- If Sanity is unavailable, statically generated pages keep serving the last good version.
- A missing image or video in a slot is skipped; the page still renders.

## Testing

- **Unit tests:**
  - flattening rows into scroll order
  - next/previous with wrap-around
  - index filtering
  - the theme resolution order (visitor override, then page default)
- **End-to-end test:**
  - open a project
  - switch views
  - use next and previous
  - open and close the info pop-out
  - submit the contact form against a mocked provider

## Build order

1. Sanity project, schemas and migration script
2. Next.js scaffold with tokens, fonts (Satoshi, Bebas Neue) and theme
3. Homepage index (grid, list and filter)
4. Project page (layout view, scroll view, next/previous, info pop-out)
5. Menu and Info page
6. Contact route and redirects
7. Polish pass, then the domain cutover from GitHub Pages to Vercel

Before building, design the homepage, project page and menu in Paper using the new design system.

## Out of scope for now

- Client-specific landing pages (projects can still be listed by client later)
- Search
- Next and previous within a filter
