import type { ReactNode } from 'react'
import { cn } from '../lib/utils'
import {
  Table, TableHeader, TableRow, TableHead, TableBody, TableCell,
} from '../components/ui/table'
import { Badge } from '../components/ui/badge'

/** Callout box for notes, warnings, tips — token-colored, no hard-coded hues. */
export function Callout({ kind = 'note', title, children }: { kind?: 'note' | 'warn' | 'tip'; title?: string; children: ReactNode }) {
  const styles = {
    note: 'border-primary/30 bg-primary/5 text-foreground [&_div:first-child]:text-primary',
    warn: 'border-pahenro/50 bg-pahenro/10 text-foreground [&_div:first-child]:text-pahenro-foreground',
    tip: 'border-emerald-600/30 bg-emerald-600/5 text-foreground [&_div:first-child]:text-emerald-700 dark:[&_div:first-child]:text-emerald-400',
  }[kind]
  const icon = { note: 'ℹ', warn: '⚠', tip: '✓' }[kind]
  return (
    <div className={cn('rounded-lg border px-4 py-3 text-sm leading-relaxed', styles)}>
      <div className="font-semibold">
        {icon} {title ?? { note: 'Note', warn: 'Warning', tip: 'Good to know' }[kind]}
      </div>
      <div className="mt-1 opacity-90">{children}</div>
    </div>
  )
}

/** Page title with Devanagari eyebrow (the twin-script signature). */
export function PageHeader({ title, lede, eyebrow }: { title: string; lede: string; eyebrow?: string }) {
  return (
    <header className="mb-8 border-b border-border pb-6">
      {eyebrow && (
        <div className="mb-2 font-mono text-[11px] font-semibold uppercase tracking-[0.18em] text-primary">
          {eyebrow} <span className="text-muted-foreground/60">·</span>{' '}
          <span className="font-sans tracking-normal">{eyebrowNP(eyebrow)}</span>
        </div>
      )}
      <h1 className="font-display text-3xl font-extrabold tracking-tight text-foreground">{title}</h1>
      <p className="mt-2 max-w-3xl text-sm leading-relaxed text-muted-foreground">{lede}</p>
    </header>
  )
}

function eyebrowNP(en: string): string {
  const map: Record<string, string> = {
    'Guide': 'गाइड',
    'Reference': 'सन्दर्भ',
    'Overview': 'परिचय',
    'Data': 'तथ्याङ्क',
    'Methodology': 'विधि',
    'Playground': 'अभ्यास',
  }
  return map[en] ?? en
}

/** Section heading with copy-link anchor. */
export function H2({ id, children }: { id: string; children: ReactNode }) {
  return (
    <h2 id={id} className="group scroll-mt-20 font-display text-xl font-bold text-foreground mt-10 mb-4">
      {children}
      <button
        onClick={() => navigator.clipboard?.writeText(window.location.origin + window.location.pathname + '#/' + id)}
        className="ml-2 align-middle font-mono text-xs text-muted-foreground/40 hover:text-primary opacity-0 group-hover:opacity-100 transition-opacity"
        title="copy link"
        aria-label="copy link to section"
      >
        #
      </button>
    </h2>
  )
}

export function DocCode({ code, lang = 'ts' }: { code: string; lang?: string }) {
  return (
    <div className="relative">
      <span className="absolute right-3 top-2 font-mono text-[10px] uppercase tracking-wider text-code-foreground/40">{lang}</span>
      <pre className="rounded-lg bg-code text-code-foreground text-[12px] leading-relaxed p-4 overflow-x-auto border border-code/50">
        <code>{code}</code>
      </pre>
    </div>
  )
}

/**
 * Two-column property/method table used across the API pages.
 * rows: [member, type] or [member, type, description].
 */
export function ApiTable({ rows, headers = ['Member', 'Type', 'Description'] }: {
  rows: Array<[string, string] | [string, string, ReactNode]>
  headers?: string[]
}) {
  return (
    <div className="overflow-hidden rounded-lg border bg-card">
      <Table>
        <TableHeader>
          <TableRow>
            {headers.map(h => <TableHead key={h}>{h}</TableHead>)}
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.map(row => (
            <TableRow key={row[0]}>
              <TableCell className="whitespace-nowrap font-mono text-[11px] font-semibold text-primary">{row[0]}</TableCell>
              <TableCell className="whitespace-nowrap font-mono text-[11px] text-muted-foreground">{row[1]}</TableCell>
              <TableCell className="text-foreground/90">{row.length > 2 ? row[2] : ''}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

export function TypeBadge({ children }: { children: ReactNode }) {
  return <Badge variant="outline" className="font-mono text-[10px]">{children}</Badge>
}
