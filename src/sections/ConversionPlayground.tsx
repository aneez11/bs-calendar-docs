import { useState, useMemo } from 'react'
import {
  toBS, toAD, todayBS, daysInMonth, daysInYear, isValidBS,
  supportedRange, toBSString, toFormattedBS, monthName,
  toDevanagariNumeral, nepaliMonthName, nepaliDayName,
  toNepaliBSString, toFormattedNepaliBS,
} from 'nepali-bs-calendar'
import { BSRangeError, BSInvalidDateError } from 'nepali-bs-calendar'
import { isoOf } from '../lib/util'
import { Section, KV } from '../lib/ui'

function toInt(v: string, fallback: number): number {
  const n = Number(v)
  return Number.isFinite(n) ? Math.trunc(n) : fallback
}

/**
 * Interactive conversion playground: BS ⇄ AD in both directions, plus a
 * live panel of every conversion helper fed from the current selection.
 */
export function ConversionPlayground() {
  const today = todayBS()
  const [bs, setBs] = useState({ y: String(today.year), m: String(today.month), d: String(today.day) })
  const [ad, setAd] = useState(() => isoOf(toAD(today.year, today.month, today.day)))
  const [error, setError] = useState<string | null>(null)

  const y = toInt(bs.y, 0)
  const m = toInt(bs.m, 0)
  const d = toInt(bs.d, 0)

  const results = useMemo(() => {
    const out: Record<string, string> = {}
    // Non-throwing helpers are safe to evaluate always
    try { out.range = `BS ${supportedRange().minYear}–${supportedRange().maxYear}` } catch { /* ignore */ }
    out.today = JSON.stringify(todayBS())
    out.isValid = String(isValidBS(y, m, d))
    try {
      out.daysInMonth = `${daysInMonth(y, m)} days`
      out.daysInYear = `${daysInYear(y)} days`
      out.monthName = monthName(m)
      out.nepaliMonthName = nepaliMonthName(m)
    } catch { /* out-of-range month: leave blank */ }
    try {
      const converted = toAD(y, m, d)
      out.ad = isoOf(converted)
      out.nepaliDayName = nepaliDayName(converted)
      out.toBSString = toBSString(converted)
      out.toFormattedBS = toFormattedBS(converted)
      out.toNepaliBSString = toNepaliBSString(converted)
      out.toFormattedNepaliBS = toFormattedNepaliBS(converted)
      out.devNumeral = toDevanagariNumeral(y)
    } catch (e) {
      out.ad = '—'
      if (e instanceof BSRangeError) out.ad = `BSRangeError: ${e.message}`
      else if (e instanceof BSInvalidDateError) out.ad = `BSInvalidDateError: ${e.message}`
      else if (e instanceof RangeError) out.ad = `RangeError: ${e.message}`
    }
    return out
  }, [y, m, d, today.year, today.month, today.day])

  const fromAD = (iso: string) => {
    const parsed = new Date(`${iso}T00:00:00.000Z`)
    try {
      const r = toBS(parsed)
      setError(null)
      setBs({ y: String(r.year), m: String(r.month), d: String(r.day) })
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Out of range')
    }
  }

  const fromBS = () => {
    try {
      const converted = toAD(y, m, d)
      setAd(isoOf(converted))
      setError(null)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Invalid BS date')
    }
  }

  return (
    <Section
      id="conversion"
      title="BS ⇄ AD Conversion"
      subtitle="typed errors, day/month/year helpers, Devanagari output"
    >
      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <div className="flex items-end gap-2 mb-3">
            <label className="flex flex-col text-[11px] text-muted-foreground">
              Year
              <input
                className="w-20 rounded border border-input px-2 py-1 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-ring"
                value={bs.y}
                inputMode="numeric"
                onChange={e => setBs({ ...bs, y: e.target.value })}
              />
            </label>
            <label className="flex flex-col text-[11px] text-muted-foreground">
              Month
              <input
                className="w-14 rounded border border-input px-2 py-1 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-ring"
                value={bs.m}
                inputMode="numeric"
                onChange={e => setBs({ ...bs, m: e.target.value })}
              />
            </label>
            <label className="flex flex-col text-[11px] text-muted-foreground">
              Day
              <input
                className="w-14 rounded border border-input px-2 py-1 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-ring"
                value={bs.d}
                inputMode="numeric"
                onChange={e => setBs({ ...bs, d: e.target.value })}
              />
            </label>
            <button
              className="rounded bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground hover:bg-primary/90 transition-colors"
              onClick={fromBS}
            >
              → AD
            </button>
          </div>

          <div className="flex items-end gap-2 mb-3">
            <label className="flex flex-col text-[11px] text-muted-foreground grow">
              AD date (UTC YYYY-MM-DD)
              <input
                type="date"
                className="w-full rounded border border-input px-2 py-1.5 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-ring"
                value={ad}
                onChange={e => { setAd(e.target.value); fromAD(e.target.value) }}
              />
            </label>
          </div>

          {error && (
            <div className="rounded bg-destructive/10 border border-destructive/30 px-3 py-2 text-xs text-destructive">{error}</div>
          )}

          <div className="mt-3 rounded-lg border border-border divide-y divide-border">
            <KV label="toAD(y, m, d)" value={results.ad} />
            <KV label="isValidBS(y, m, d)" value={results.isValid} />
            <KV label="daysInMonth(y, m)" value={results.daysInMonth ?? '—'} />
            <KV label="daysInYear(y)" value={results.daysInYear ?? '—'} />
            <KV label="monthName(m)" value={results.monthName ?? '—'} />
            <KV label="nepaliMonthName(m)" value={results.nepaliMonthName ?? '—'} />
            <KV label="toBSString(ad)" value={results.toBSString ?? '—'} />
            <KV label="toFormattedBS(ad)" value={results.toFormattedBS ?? '—'} />
            <KV label="toNepaliBSString(ad)" value={results.toNepaliBSString ?? '—'} />
            <KV label="toFormattedNepaliBS(ad)" value={results.toFormattedNepaliBS ?? '—'} />
            <KV label="nepaliDayName(ad)" value={results.nepaliDayName ?? '—'} />
            <KV label="toDevanagariNumeral(y)" value={results.devNumeral ?? '—'} />
            <KV label="supportedRange()" value={results.range} />
            <KV label="todayBS()" value={results.today} />
          </div>
        </div>

        <div className="text-xs text-muted-foreground leading-relaxed space-y-3">
          <p>
            <b>toBS(date)</b> accepts any <code>Date</code>. Exact UTC-midnight dates (like the
            <code> YYYY-MM-DD</code> input above) are read as UTC calendar dates; <code>new Date()</code>
            and locally-constructed dates use the machine-local civil date.
          </p>
          <p>
            <b>toAD()</b> returns a <code>Date</code> at UTC midnight — read it with UTC getters or
            format helpers. Round-tripping is exact in every timezone.
          </p>
          <p>
            Invalid inputs throw typed errors: <code>BSRangeError</code> (year outside 2000–2090) and
            <code> BSInvalidDateError</code> (bad month/day) — both catchable as <code>RangeError</code>.
            Try year 2091 or month 13.
          </p>
          <div className="rounded-lg bg-primary/5 border border-primary/20 p-3">
            <p className="text-[11px] text-primary">
              Data: verified BS month table, 91 years, 33,238 days. One documented correction
              (BS 2087) — see <code>SOURCES.md</code> in the package repository.
            </p>
          </div>
        </div>
      </div>
    </Section>
  )
}
