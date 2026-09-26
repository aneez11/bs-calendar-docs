import { todayBS, toNepaliBSString, supportedRange, formatADDate, toAD, nepaliMonthName, toDevanagariNumeral } from 'nepali-bs-calendar'
import { Link } from '../lib/router'
import { H2 } from '../lib/docui'
import { NPM_URL } from '../lib/util'
import { Card } from '../components/ui/card'
import { Badge } from '../components/ui/badge'

const FEATURES: Array<{ np: string; title: string; to: string; desc: string }> = [
  { np: 'रूपान्तरण', title: 'Exact conversion', to: '/conversion', desc: 'Integer epoch-day math, UTC-civil semantics, exhaustive 33,238-day roundtrip tests — identical results on every timezone.' },
  { np: 'कम्पोनेन्ट', title: 'React components', to: '/react-components', desc: 'BSCalendar + BSDatePicker: themeable (inline styles or Tailwind class hooks), BS/AD/both views, events, holidays, custom renderers — separate optional entry points.' },
  { np: 'ढाँचा', title: 'Formatting', to: '/formatting', desc: 'Token patterns in English and Devanagari (YYYY, MMMM, MMMM-NP, DD-NP…), single-pass and corruption-proof.' },
  { np: 'प्रमाण', title: 'Verified data', to: '/methodology', desc: 'Primary reference dataset, chain-verified month by month, cross-checked against two independent libraries, one documented correction.' },
]

/** Landing page: twin-date hero, badges, quick start, calendar-grid features. */
export function HomePage() {
  const today = todayBS()
  const { minYear, maxYear } = supportedRange()
  const adDate = toAD(today.year, today.month, today.day)

  return (
    <article className="max-w-4xl">
      {/* Hero — the signature: today, twice. Devanagari panel | AD panel. */}
      <div className="mb-8 overflow-hidden rounded-2xl border bg-card shadow-sm">
        <div className="grid sm:grid-cols-[1.2fr_auto_1fr] items-stretch">
          <div className="bg-primary p-6 text-primary-foreground sm:p-7">
            <div className="font-mono text-[10px] font-semibold uppercase tracking-[0.2em] text-primary-foreground/70">आज · Bikram Sambat</div>
            <div className="mt-3 font-sans font-bold leading-tight">
              <span className="block text-3xl">{toDevanagariNumeral(today.year)} {nepaliMonthName(today.month)}</span>
              <span className="mt-1 block text-lg text-primary-foreground/90">{toDevanagariNumeral(today.day)} गते</span>
            </div>
          </div>
          <div className="hidden sm:flex w-px items-center justify-center bg-border">
            <span className="h-2 w-2 rounded-full bg-primary ring-4 ring-background" aria-hidden />
          </div>
          <div className="p-6 sm:p-7">
            <div className="font-mono text-[10px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">Gregorian · AD</div>
            <div className="mt-3 font-mono font-semibold leading-tight">
              <span className="block text-3xl">{formatADDate(adDate, 'YYYY')}</span>
              <span className="mt-1 block text-lg text-muted-foreground">{formatADDate(adDate, 'DD MMMM')}</span>
            </div>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-2 border-t border-border bg-muted/40 px-6 py-3.5">
          <Badge variant="outline" className="font-mono">v0.2.0</Badge>
          <Badge variant="outline" className="font-mono">zero dependencies</Badge>
          <Badge variant="outline" className="font-mono">{`${maxYear - minYear + 1} years · 33,238 days`}</Badge>
          <Badge variant="outline" className="font-mono">{'< 5 KB gzipped'}</Badge>
          <Badge variant="outline" className="font-mono">87 tests green</Badge>
        </div>
      </div>

      <p className="mb-6 max-w-2xl text-base leading-relaxed text-muted-foreground">
        A zero-dependency BS ⇄ AD calendar library for JavaScript and React — with a fully documented,
        multi-source-verified data pipeline. Chain-verified across all
        1,104 months, corroborated by independent libraries, and shipped with reproducible tooling.
      </p>

      <div className="mb-8 flex flex-wrap gap-2.5">
        <Link
          to="/getting-started"
          className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-6 text-sm font-semibold text-primary-foreground shadow-sm transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        >
          Get started
        </Link>
        <Link
          to="/methodology"
          className="inline-flex h-10 items-center justify-center rounded-md border border-input bg-card px-6 text-sm font-semibold shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        >
          Implementation methodology
        </Link>
        <Link
          to="/playground"
          className="inline-flex h-10 items-center justify-center rounded-md px-6 text-sm font-semibold text-primary underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        >
          Live playground →
        </Link>
        <a
          href={NPM_URL}
          target="_blank"
          rel="noreferrer"
          className="inline-flex h-10 items-center justify-center rounded-md border border-input bg-card px-6 text-sm font-semibold shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        >
          View on npm ↗
        </a>
      </div>

      <pre className="mb-8 rounded-lg border border-code/50 bg-code text-code-foreground text-xs leading-relaxed p-4 overflow-x-auto"><code>{`npm install nepali-bs-calendar

import { toAD, toBS, todayBS } from 'nepali-bs-calendar'
import { BSCalendar } from 'nepali-bs-calendar/react'

toAD(2080, 1, 1)     // 2023-04-14 — Nepali New Year 2080
daysInMonth(2080, 1) // 31 (verified)
todayBS()            // { year, month, day }`}</code></pre>

      {/* Calendar-grid feature cells — shared borders, like the calendar itself. */}
      <div className="mb-8 grid gap-px overflow-hidden rounded-xl border bg-border sm:grid-cols-2">
        {FEATURES.map(f => (
          <Link
            key={f.title}
            to={f.to}
            className="group bg-card p-5 transition-colors hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-inset"
          >
            <div className="font-mono text-[11px] font-semibold uppercase tracking-[0.16em] text-primary">{f.np}</div>
            <div className="mt-1.5 font-display text-base font-bold text-foreground group-hover:underline underline-offset-4">{f.title}</div>
            <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">{f.desc}</p>
          </Link>
        ))}
      </div>

      <Card className="mb-6 p-5">
        <h2 className="font-display text-sm font-bold text-foreground mb-3">Documentation map</h2>
        <ul className="grid sm:grid-cols-2 gap-x-6 gap-y-2 text-sm text-muted-foreground">
          <li><Link className="text-primary hover:underline underline-offset-4" to="/getting-started">Getting started</Link> — install, entry points, bundle notes.</li>
          <li><Link className="text-primary hover:underline underline-offset-4" to="/conversion">Conversion guide</Link> — semantics, typed errors, playground.</li>
          <li><Link className="text-primary hover:underline underline-offset-4" to="/react-components">React components</Link> — every prop, live.</li>
          <li><Link className="text-primary hover:underline underline-offset-4" to="/formatting">Formatting & grids</Link> — tokens, 42-cell grids, API.</li>
          <li><Link className="text-primary hover:underline underline-offset-4" to="/data">Data & year tables</Link> — all 91 verified years.</li>
          <li><Link className="text-primary hover:underline underline-offset-4" to="/methodology">Methodology</Link> — pipeline, corrections, tests.</li>
        </ul>
      </Card>

      <p className="text-center font-mono text-[11px] text-muted-foreground">
        {toNepaliBSString(new Date())}
      </p>
    </article>
  )
}

function GettingStartedPage() {
  return (
    <article className="max-w-4xl">
      <header className="mb-8 border-b border-border pb-6">
        <div className="mb-2 font-mono text-[11px] font-semibold uppercase tracking-[0.18em] text-primary">
          Overview <span className="text-muted-foreground/60">·</span> <span className="font-sans tracking-normal">सुरुवात</span>
        </div>
        <h1 className="font-display text-3xl font-extrabold tracking-tight text-foreground">Getting started</h1>
        <p className="mt-2 text-sm text-muted-foreground">Install, entry points, and the 30-second tour.</p>
      </header>

      <H2 id="install">Install</H2>
      <pre className="rounded-lg border border-code/50 bg-code text-code-foreground text-xs p-4 overflow-x-auto mb-3"><code>{`npm install nepali-bs-calendar`}</code></pre>
      <p className="text-sm text-muted-foreground mb-4">
        Node ≥ 18 (ESM + CJS dual build, TypeScript types included). No runtime dependencies.{' '}
        <a className="text-primary hover:underline underline-offset-4" href={NPM_URL} target="_blank" rel="noreferrer">
          View on npm ↗
        </a>
      </p>

      <H2 id="entry-points">Entry points</H2>
      <pre className="rounded-lg border border-code/50 bg-code text-code-foreground text-xs p-4 overflow-x-auto mb-3"><code>{`// core — zero dependencies, works in Node/bun/deno/browsers
import { toAD, toBS, todayBS, daysInMonth } from 'nepali-bs-calendar'

// React calendar component (optional peer: react >= 18)
import { BSCalendar } from 'nepali-bs-calendar/react'

// React date picker (optional peer: react >= 18)
import { BSDatePicker } from 'nepali-bs-calendar/date-picker'`}</code></pre>

      <H2 id="tree-shaking">Bundle impact</H2>
      <p className="text-sm text-muted-foreground mb-4">
        The React entry points are separate chunks; importing only the core never loads React. The packed data
        table is 1,092 characters — the whole core stays under 5 KB gzipped.
      </p>

      <H2 id="next">Where next</H2>
      <ul className="text-sm text-muted-foreground space-y-1.5">
        <li>→ <a className="text-primary hover:underline underline-offset-4" href="#/conversion">Conversion guide</a> (timezone semantics, typed errors)</li>
        <li>→ <a className="text-primary hover:underline underline-offset-4" href="#/react-components">React components</a></li>
        <li>→ <a className="text-primary hover:underline underline-offset-4" href="#/methodology">Implementation methodology</a></li>
      </ul>
    </article>
  )
}

export { GettingStartedPage }
