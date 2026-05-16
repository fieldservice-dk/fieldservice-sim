# Contributing to FieldService Sim

Thanks for considering a contribution. This simulator exists to demonstrate FSM concepts and to give other teams a head start on building their own demos.

## What we welcome

- Bug fixes (rendering issues, broken animations, mobile layout problems).
- New simulated scenarios (different industry verticals — HVAC, electrical, plumbing, cleaning).
- Performance improvements (reduced bundle size, smoother animations).
- Accessibility improvements (keyboard navigation, screen reader support, color contrast).
- Documentation improvements.
- Translations of UI strings (we ship in English by default; Danish, Swedish, German welcome).

## What we typically reject

- New commercial integrations branded for specific vendors (this is a demo, not a product directory).
- Adding tracking, analytics, or telemetry.
- Dependencies that bring in large frameworks (no jQuery, no Tailwind setup, no full UI libraries).
- Changes that break the standalone demo (it must work offline, no required APIs).

## Setup

```bash
git clone https://github.com/fieldservice-dk/fieldservice-simulator.git
cd fieldservice-simulator
npm install
npm run dev
```

## Pull request process

1. Fork the repo.
2. Create a branch with a descriptive name: `fix/dispatcher-mobile-layout` or `feat/hvac-scenario`.
3. Make focused commits with clear messages.
4. Test your changes locally — both `npm run dev` and `npm run build && npm run preview`.
5. Open a PR with a screenshot or screen recording for visual changes.

## Code style

- Functional React components, hooks only (no class components).
- Inline CSS via template strings or CSS-in-JS is fine — this is a demo, not a design system.
- No new dependencies without discussion. The intent is to keep this lean.
- ASCII-only in source comments where possible (the simulator is shared globally).

## License

By contributing, you agree your contributions will be licensed under the [MIT License](LICENSE).

---

Maintained by [FieldService](https://fieldservice.dk).
