import { useState, useMemo } from 'react'
import { formatBSDate, formatADDate, toAD, todayBS } from 'nepali-bs-calendar'
import { Section } from '../lib/ui'

const TOKENS = ['YYYY', 'YY', 'MM', 'M', 'DD', 'D', 'MMMM', 'MMM', 'YYYY-NP', 'MMMM-NP', 'DD-NP', 'D-NP'] as const

/**
 * Live formatter playground for formatBSDate / formatADDate — type any
 * pattern or click a token to append it.
 */
export function FormatPlayground() {
  const today = todayBS()
  const [bs, setBs] = useState({ y: today.year, m: today.month, d: today.day })
  const [format, setFormat] = useState('DD MMMM YYYY (MMMM DD, YYYY)')

  const adDate = useMemo(() => {
    try { return toAD(bs.y, bs.m, bs.d) } catch { return null }
  }, [bs])

  return (
    <Section
      id="formatting"
      title="Format tokens"
      subtitle="formatBSDate · formatADDate — single-pass token parser (month names never corrupted)"
    >
      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <div className="flex gap-2 mb-3">
            <input
              type="number"
              min={2000}
              max={2090}
              value={bs.y}
              onChange={e => setBs({ ...bs, y: Number(e.target.value) })}
              className="w-20 rounded border border-input px-2 py-1 text-sm font-mono"
              aria-label="BS year"
            />
            <input
              type="number"
              min={1}
              max={12}
              value={bs.m}
              onChange={e => setBs({ ...bs, m: Number(e.target.value) })}
              className="w-16 rounded border border-input px-2 py-1 text-sm font-mono"
              aria-label="BS month"
            />
            <input
              type="number"
              min={1}
              max={32}
              value={bs.d}
              onChange={e => setBs({ ...bs, d: Number(e.target.value) })}
              className="w-16 rounded border border-input px-2 py-1 text-sm font-mono"
              aria-label="BS day"
            />
          </div>

          <label className="block text-[11px] text-muted-foreground mb-1">Format string</label>
          <input
            className="w-full rounded border border-input px-3 py-2 text-sm font-mono mb-3 focus:outline-none focus:ring-2 focus:ring-ring"
            value={format}
            onChange={e => setFormat(e.target.value)}
          />

          <div className="flex flex-wrap gap-1.5 mb-4">
            {TOKENS.map(t => (
              <button
                key={t}
                className="rounded bg-muted hover:bg-primary/15 border border-border px-2 py-0.5 text-[11px] font-mono text-muted-foreground transition-colors"
                onClick={() => setFormat(f => `${f}${t}`)}
                title={`append ${t}`}
              >
                +{t}
              </button>
            ))}
          </div>

          <div className="space-y-2">
            <div className="rounded-lg border border-border px-3 py-2.5">
              <div className="text-[11px] text-muted-foreground mb-0.5">formatBSDate(ad, format)</div>
              <div className="font-mono text-sm text-foreground">
                {adDate ? formatBSDate(adDate, format) : <span className="text-destructive">invalid BS date</span>}
              </div>
            </div>
            <div className="rounded-lg border border-border px-3 py-2.5">
              <div className="text-[11px] text-muted-foreground mb-0.5">formatADDate(ad, format)</div>
              <div className="font-mono text-sm text-foreground">
                {adDate ? formatADDate(adDate, format) : '—'}
              </div>
            </div>
          </div>
        </div>

        <div>
          <div className="text-[11px] text-muted-foreground mb-2">Token reference</div>
          <div className="grid grid-cols-2 gap-1.5 text-[11px] font-mono">
            {[
              ['YYYY', '2080'], ['YY', '80'],
              ['MM', '01'], ['M', '1'],
              ['DD', '01'], ['D', '1'],
              ['MMMM', 'Baisakh'], ['MMM', 'Bais'],
              ['MMMM-NP', 'बैशाख'], ['YYYY-NP', '२०८०'],
              ['DD-NP', '०१'], ['D-NP', '१'],
            ].map(([t, ex]) => (
              <div key={t} className="flex items-center gap-2 rounded border border-border/60 bg-muted/50 px-2 py-1">
                <code className="text-primary">{t}</code>
                <span className="text-muted-foreground/80">→</span>
                <span className="text-foreground truncate">{ex}</span>
              </div>
            ))}
          </div>
          <p className="mt-3 text-[11px] text-muted-foreground leading-relaxed">
            Tokens are replaced longest-first in a single pass — substituted text (like the M in
            “Mangsir”) is never rescanned. The old <code>split/join</code> implementation turned
            <code> MMMM</code> into <code>9angsir</code>; this regression is covered by tests.
          </p>
        </div>
      </div>
    </Section>
  )
}
