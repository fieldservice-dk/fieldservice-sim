# FieldService Sim

> Interactive Mission Control simulator for field service management — try
> dispatching technicians, tracking jobs, and managing service operations
> without signing up. Built with React 19 + Vite.

Maintained by [FieldService](https://fieldservice.dk) — a Danish FSM platform integrated with e-conomic, Uniconta, and Microsoft 365.

## What this is

A live, browser-based simulation of a field service management dashboard. It demonstrates real-time job dispatching, technician tracking, invoice flow, and ERP synchronization — concepts that are core to modern FSM platforms. We built it to let prospective customers and developers explore what FSM looks like in practice without creating an account.

The simulator uses a retro Mission Control aesthetic (IBM Plex Mono, scanline overlay, terminal-style data feeds) to make the underlying systems and data flows visible — every event, sync, and state change is on screen.

## Live demo

- Standalone: [https://fieldservice-dk.github.io/fieldservice-sim](https://fieldservice-dk.github.io/fieldservice-sim) (deployed via GitHub Pages)
- Embedded on production site: [https://fieldservice.dk/simulator](https://fieldservice.dk/simulator)

## Features demonstrated

- Real-time technician dispatching across a map
- Job lifecycle (assigned → en-route → on-site → completed → invoiced)
- ERP synchronization indicators (e-conomic, Uniconta, Microsoft 365)
- Ticker feed of live system events (the "lys avis" pattern)
- Dispatcher workload and SLA monitoring
- Mock customer notifications via SMS and email

## Quick start

```bash
git clone https://github.com/fieldservice-dk/fieldservice-sim.git
cd fieldservice-sim
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

## Build for production

```bash
npm run build
```

Output is in `dist/`. Deploy the contents to any static host (GitHub Pages, Netlify, Vercel, Cloudflare Pages).

## Embedding

The simulator can be embedded in any page via:

```html
<iframe
  src="https://fieldservice-dk.github.io/fieldservice-sim"
  width="100%"
  height="800"
  frameborder="0"
  loading="lazy">
</iframe>
```

For WordPress sites we provide a dedicated plugin — see [fieldservice-sim-wp](https://github.com/fieldservice-dk/fieldservice-sim-wp) (separate repository, coming soon).

## Tech stack

- [React 19](https://react.dev) — UI rendering
- [Vite 8](https://vitejs.dev) — build tooling and dev server
- Pure CSS — no Tailwind, no component library, single bundle
- No backend — all data is generated client-side for demonstration

## Project structure

```
src/
  App.jsx          # Main simulator (Mission Control dashboard)
  main.jsx         # React entry point
  index.css        # Base styles
  App.css          # Component-specific styles
  assets/          # Logos, icons
public/
  favicon.svg      # Favicon
```

## Customizing for your brand

The simulator was open sourced specifically so other FSM teams can fork it and adapt it to their own platforms. To rebrand:

1. Search for "FieldService" in `src/App.jsx` and replace with your brand name.
2. Edit color tokens in the `CSS` constant at the top of `App.jsx` (CSS custom properties under `:root`).
3. Replace mock data generators (technician names, job types, customer names) to match your domain.
4. Update integration labels (e-conomic, Uniconta, etc.) to your own ERP connectors.

## Contributing

Issues and pull requests are welcome. Please read [CONTRIBUTING.md](CONTRIBUTING.md) before submitting.

## License

[MIT](LICENSE) — use freely for commercial and personal projects.

## Sponsored by

[**FieldService**](https://fieldservice.dk) — Danish field service management for service businesses that want to digitalize jobs, invoices, and dispatching with native e-conomic, Uniconta, and Microsoft 365 integration.
