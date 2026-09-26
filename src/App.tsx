import { useEffect, useMemo } from 'react'
import { useRoute, Link } from './lib/router'
import { HomePage, GettingStartedPage } from './pages/HomePage'
import { ConversionPage } from './pages/ConversionPage'
import { ReactComponentsPage } from './pages/ReactComponentsPage'
import { FormattingPage } from './pages/FormattingPage'
import { MethodologyPage } from './pages/MethodologyPage'
import { DataPage } from './pages/DataPage'
import { ThemeToggle } from './components/theme-toggle'
import { Badge } from './components/ui/badge'
import { buttonVariants } from './components/ui/button'
import { NPM_URL } from './lib/util'
import { todayBS, toAD, formatADDate, toFormattedNepaliBS } from 'nepali-bs-calendar'

const NAV: Array<{ group: string; np: string; items: Array<{ label: string; np: string; to: string }> }> = [
  {
    group: 'Overview', np: 'परिचय',
    items: [
      { label: 'Home', np: 'गृह', to: '/' },
      { label: 'Getting started', np: 'सुरुवात', to: '/getting-started' },
    ],
  },
  {
    group: 'Guides', np: 'गाइड',
    items: [
      { label: 'Conversion & errors', np: 'रूपान्तरण', to: '/conversion' },
      { label: 'React components', np: 'कम्पोनेन्ट', to: '/react-components' },
      { label: 'Formatting & grids', np: 'फरम्याट', to: '/formatting' },
    ],
  },
  {
    group: 'Reference', np: 'सन्दर्भ',
    items: [
      { label: 'Data & year tables', np: 'तथ्याङ्क', to: '/data' },
      { label: 'Implementation methodology', np: 'विधि', to: '/methodology' },
      { label: 'Live playground', np: 'अभ्यास', to: '/playground' },
    ],
  },
]

const TITLES: Record<string, string> = {
  '/': 'nepali-bs-calendar — Bikram Sambat dates, done exactly',
  '/getting-started': 'Getting started · nepali-bs-calendar',
  '/conversion': 'Conversion guide · nepali-bs-calendar',
  '/react-components': 'React components · nepali-bs-calendar',
  '/formatting': 'Formatting & grids · nepali-bs-calendar',
  '/data': 'Data & year tables · nepali-bs-calendar',
  '/methodology': 'Implementation methodology · nepali-bs-calendar',
  '/playground': 'Live playground · nepali-bs-calendar',
}

/** Twin-date signature card: today rendered twice, Devanagari over Latin. */
function TwinDateCard() {
  const { bs, ad } = useMemo(() => {
    const b = todayBS()
    return { bs: b, ad: toAD(b.year, b.month, b.day) }
  }, [])
  return (
    <div className="rounded-xl border bg-card p-3.5 shadow-sm">
      <div className="text-[10px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">आज · Today</div>
      <div className="mt-1.5 font-display text-xl font-bold leading-tight text-primary">{toFormattedNepaliBS(new Date())}</div>
      <div className="font-mono text-xs text-muted-foreground">{formatADDate(ad, 'DD MMMM YYYY')}</div>
      <div className="mt-2 border-t border-border pt-2 font-mono text-[11px] text-muted-foreground">
        {bs.year}-{String(bs.month).padStart(2, '0')}-{String(bs.day).padStart(2, '0')} <span className="text-border">→</span> {formatADDate(ad, 'YYYY-MM-DD')}
      </div>
    </div>
  )
}

export default function App() {
  const route = useRoute()

  useEffect(() => {
    document.title = TITLES[route] ?? 'nepali-bs-calendar docs'
    window.scrollTo(0, 0)
  }, [route])

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-40 border-b border-border bg-background/85 backdrop-blur">
        <div className="mx-auto max-w-6xl px-4 h-14 flex items-center gap-3">
          <Link to="/" className="flex items-center gap-2.5 shrink-0 group">
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary font-display text-[13px] font-extrabold text-primary-foreground shadow-sm">बै</span>
            <span className="font-display text-lg font-extrabold tracking-tight">nepali-bs-calendar</span>
            <Badge variant="outline" className="hidden sm:inline-flex font-mono text-[10px]">v0.2.0</Badge>
          </Link>
          <nav className="ml-auto hidden sm:flex items-center gap-1 text-xs font-medium">
            <NavLink to="/getting-started" active={route === '/getting-started'}>Start</NavLink>
            <NavLink to="/conversion" active={route === '/conversion' || route === '/react-components' || route === '/formatting'}>Guides</NavLink>
            <NavLink to="/data" active={route === '/data'}>Data</NavLink>
            <NavLink to="/methodology" active={route === '/methodology'}>Methodology</NavLink>
            <NavLink to="/playground" active={route === '/playground'}>Playground</NavLink>
          </nav>
          <div className="ml-auto sm:ml-2 flex items-center gap-1.5">
            <ThemeToggle />
            <a
              href={NPM_URL}
              target="_blank"
              rel="noreferrer"
              className={buttonVariants({ variant: 'outline', size: 'sm', className: 'hidden md:inline-flex font-mono text-xs' })}
            >
              npm i nepali-bs-calendar
            </a>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-6xl px-4 py-8 flex gap-8">
        <aside className="hidden md:block w-56 shrink-0">
          <div className="sticky top-20 space-y-5">
            <TwinDateCard />
            <nav className="space-y-5">
              {NAV.map(g => (
                <div key={g.group}>
                  <div className="mb-1.5 px-2 text-[10px] font-bold uppercase tracking-[0.16em] text-muted-foreground">
                    {g.group} <span className="font-sans text-muted-foreground/50">· {g.np}</span>
                  </div>
                  {g.items.map(i => (
                    <Link
                      key={i.to}
                      to={i.to}
                      className={`
                        block rounded-md px-2 py-1.5 text-[13px] font-medium transition-colors
                        focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring
                        ${route === i.to
                          ? 'bg-primary text-primary-foreground shadow-sm'
                          : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'}
                      `}
                    >
                      <span className="float-right ml-2 font-sans text-[11px] opacity-60">{i.np}</span>
                      {i.label}
                    </Link>
                  ))}
                </div>
              ))}
            </nav>
          </div>
        </aside>

        <main className="min-w-0 flex-1">
          <Route route={route} />
          <footer className="mt-12 border-t border-border pt-5 pb-10 text-center text-xs text-muted-foreground">
            <span className="font-display font-bold text-foreground">nepali-bs-calendar</span> v0.2.0 · zero dependencies ·
            data verified 2026-09-04 against multiple independent sources
            <span className="mx-2 text-border">|</span>
            <span className="font-mono">built with the nepali-bs-calendar you're reading about</span>
          </footer>
        </main>
      </div>
    </div>
  )
}

function NavLink({ to, active, children }: { to: string; active: boolean; children: React.ReactNode }) {
  return (
    <Link
      to={to}
      className={`rounded-full px-3 py-1.5 transition-colors ${
        active ? 'bg-primary text-primary-foreground shadow-sm' : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
      }`}
    >
      {children}
    </Link>
  )
}

function Route({ route }: { route: string }) {
  switch (route) {
    case '/': return <HomePage />
    case '/getting-started': return <GettingStartedPage />
    case '/conversion': return <ConversionPage />
    case '/react-components': return <ReactComponentsPage />
    case '/formatting': return <FormattingPage />
    case '/data': return <DataPage />
    case '/methodology': return <MethodologyPage />
    case '/playground': return <PlaygroundPage />
    default: return <NotFound route={route} />
  }
}

function PlaygroundPage() {
  return (
    <div className="space-y-8 max-w-4xl">
      <header>
        <div className="mb-2 font-mono text-[11px] font-semibold uppercase tracking-[0.18em] text-primary">
          Playground <span className="text-muted-foreground/60">·</span> <span className="font-sans tracking-normal">अभ्यास</span>
        </div>
        <h1 className="font-display text-3xl font-extrabold tracking-tight">Live playground</h1>
        <p className="mt-2 max-w-3xl text-sm leading-relaxed text-muted-foreground">
          Every feature of the package, running live — the same examples the guides embed, stacked in one place.
        </p>
      </header>
      <ConversionPage />
      <ReactComponentsPage />
      <FormattingPage />
      <DataPage />
    </div>
  )
}

function NotFound({ route }: { route: string }) {
  return (
    <div className="max-w-xl rounded-xl border bg-card p-8 text-center shadow-sm">
      <div className="font-display text-4xl font-extrabold text-primary mb-2">४०४</div>
      <h1 className="font-display text-lg font-bold">No docs at “{route}”</h1>
      <p className="mt-1 text-sm text-muted-foreground mb-5">The page may have moved — pick one from the sidebar.</p>
      <Link to="/" className="inline-flex h-9 items-center justify-center rounded-md bg-primary px-4 text-sm font-semibold text-primary-foreground shadow-sm hover:bg-primary/90">
        Back to home
      </Link>
    </div>
  )
}
