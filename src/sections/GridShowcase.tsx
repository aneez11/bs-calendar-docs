import { useState, useMemo } from 'react'
import { getMonthGrid, getADMonthGrid, EN_DAY_SHORT, todayBS, daysInMonth, daysInYear } from 'nepali-bs-calendar'
import type { CalendarCell } from 'nepali-bs-calendar'
import { Section } from '../lib/ui'

function BSGridTable({ year, month }: { year: number; month: number }) {
  const cells = useMemo(() => {
    try { return getMonthGrid(year, month) } catch { return null }
  }, [year, month])

  if (!cells) return <div className="text-xs text-destructive">Grid failed</div>

  return (
    <div className="grid grid-cols-7 gap-px bg-border rounded-lg overflow-hidden border border-border">
      {EN_DAY_SHORT.map(d => (
        <div key={d} className="bg-muted/50 text-center text-[10px] font-semibold text-muted-foreground py-1">{d}</div>
      ))}
      {cells.map(c => (
        <Cell key={c.bsKey} cell={c} />
      ))}
    </div>
  )
}

function Cell({ cell }: { cell: CalendarCell }) {
  const base = 'bg-card text-center py-1.5 min-h-[46px] flex flex-col items-center justify-start'
  const tone = cell.isToday
    ? 'ring-2 ring-inset ring-primary/60 bg-primary/5 font-bold'
    : cell.isOtherMonth
      ? 'opacity-40'
      : cell.isOutOfRange
        ? 'bg-muted opacity-50'
        : ''
  return (
    <div className={`${base} ${tone}`} title={cell.bsKey}>
      <span className="text-xs text-foreground leading-tight">{cell.bsDay}</span>
      <span className="text-[9px] text-muted-foreground/80 leading-tight font-mono">{cell.adDate.getUTCDate()}</span>
      {cell.isOutOfRange && <span className="text-[8px] text-pahenro leading-tight">o.o.r.</span>}
    </div>
  )
}

/**
 * Raw grid builders: getMonthGrid (BS, 42 cells) and getADMonthGrid (AD),
 * rendered as plain tables so the cell shape is visible.
 */
export function GridShowcase() {
  const today = todayBS()
  const [bsYear, setBsYear] = useState(today.year)
  const [bsMonth, setBsMonth] = useState(today.month)
  const [adMonth, setAdMonth] = useState(new Date().getMonth())

  const adCells = useMemo(() => getADMonthGrid(2026, adMonth), [adMonth])
  const stats = useMemo(() => ({ dim: daysInMonth(bsYear, bsMonth), total: daysInYear(bsYear) }), [bsYear, bsMonth])

  const move = (dm: number) => {
    let m = bsMonth + dm
    let y = bsYear
    if (m < 1) { m = 12; y -= 1 }
    if (m > 12) { m = 1; y += 1 }
    setBsMonth(m); setBsYear(y)
  }

  return (
    <Section
      id="grids"
      title="Calendar grids"
      subtitle="getMonthGrid → 42 BS cells (each with adDate) · getADMonthGrid → 42 AD cells"
    >
      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <div className="flex items-center gap-2 mb-3">
            <button onClick={() => move(-1)} className="rounded border border-input px-2 py-1 text-xs hover:bg-muted/50">‹</button>
            <select
              className="rounded border border-input bg-card px-2 py-1 text-sm font-mono"
              value={bsMonth}
              onChange={e => setBsMonth(Number(e.target.value))}
            >
              {Array.from({ length: 12 }, (_, i) => <option key={i + 1} value={i + 1}>{i + 1}</option>)}
            </select>
            <select
              className="rounded border border-input bg-card px-2 py-1 text-sm font-mono"
              value={bsYear}
              onChange={e => setBsYear(Number(e.target.value))}
            >
              {Array.from({ length: 91 }, (_, i) => <option key={i} value={2000 + i}>{2000 + i}</option>)}
            </select>
            <button onClick={() => move(1)} className="rounded border border-input px-2 py-1 text-xs hover:bg-muted/50">›</button>
            <span className="ml-auto text-[11px] text-muted-foreground font-mono">{stats.dim} days · {stats.total}/year</span>
          </div>
          <BSGridTable year={bsYear} month={bsMonth} />
          <p className="mt-2 text-[11px] text-muted-foreground">
            Small grey number = AD day. Out-of-range lead/trail cells (BS 2000/01, 2090/12 only) are
            flagged <span className="text-amber-600">o.o.r.</span>
          </p>
        </div>

        <div>
          <div className="flex items-center gap-2 mb-3">
            <select
              className="rounded border border-input bg-card px-2 py-1 text-sm"
              value={adMonth}
              onChange={e => setAdMonth(Number(e.target.value))}
            >
              {['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
                .map((n, i) => <option key={i} value={i}>{n} 2026</option>)}
            </select>
            <span className="ml-auto text-[11px] text-muted-foreground">0-indexed month</span>
          </div>
          <div className="grid grid-cols-7 gap-px bg-border rounded-lg overflow-hidden border border-border">
            {EN_DAY_SHORT.map(d => (
              <div key={d} className="bg-muted/50 text-center text-[10px] font-semibold text-muted-foreground py-1">{d}</div>
            ))}
            {adCells.map((c, i) => (
              <div
                key={i}
                className={`bg-card text-center py-1.5 min-h-[46px] flex flex-col items-center justify-start ${c.isToday ? 'ring-2 ring-inset ring-primary/60 bg-primary/5 font-bold' : ''} ${c.isOtherMonth ? 'opacity-40' : ''}`}
              >
                <span className="text-xs text-foreground leading-tight">{c.day}</span>
                <span className="text-[9px] text-muted-foreground/80 leading-tight font-mono">{c.month + 1}/{c.year}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Section>
  )
}
