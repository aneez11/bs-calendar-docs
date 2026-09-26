# bs-calendar — documentation site

Publishable documentation for the [`bs-calendar`](../bs-calendar) npm package:
guides, full API reference, live interactive examples, and the complete
implementation methodology (data provenance, verification pipeline, and the
documented BS 2087 correction).

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # typecheck + static build → dist/
npm run preview    # serve the built site locally
```

## Publishing

The build emits a **fully static** site (`dist/`) with relative asset paths
(`base: './'`) and hash-based routing, so it deploys anywhere with zero
server configuration:

```bash
npm run build
npx gh-pages -d dist          # GitHub Pages (project site)
# or drop dist/ on Netlify / Vercel / S3 / any static host
```

Routes are URL fragments (`#/conversion`, `#/methodology`, …) — no rewrite
rules needed, and deep links survive on any host.

## Structure

| Route | Content |
|---|---|
| `#/` | Landing: badges, live "today" readout, quick start, feature map |
| `#/getting-started` | Install, entry points, bundle-impact notes |
| `#/conversion` | toBS/toAD guide, timezone semantics, typed errors + live playground |
| `#/react-components` | BSCalendar + BSDatePicker — every prop documented, live demos |
| `#/formatting` | Token playground, grid builders, full core API table |
| `#/data` | Month-table explorer for all 91 verified BS years |
| `#/methodology` | **Implementation methodology**: Hamro Patro extraction, chain verification, corroboration, BS 2087 correction, packing, test strategy |
| `#/playground` | All interactive demos on one page |

## Notes

- The package is linked via `file:../bs-calendar` — run `npm run build` in
  the package directory first, then `npm install ../bs-calendar` here to
  refresh the linked copy after package changes.
- The demo sections (`src/sections/`) are reused inside doc pages as live
  examples; they run on the real package.
- Tailwind scans the package dist via `@source` (see `src/index.css`) so
  component themes render correctly.
