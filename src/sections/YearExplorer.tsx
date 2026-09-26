import { useState, useMemo } from 'react'
import {
  supportedRange, daysInMonth, daysInYear, toAD,
  monthName, nepaliMonthName, EN_MONTH_NAMES, NEPALI_MONTH_NAMES, EN_DAY_NAMES,
} from 'nepali-bs-calendar'
import { isoOf } from '../lib/util'
import { Section } from '../lib/ui'

/**
 * Every month of a chosen BS year: length, first AD day, weekday — straight
 * from the package data via daysInMonth / toAD.
 */
export function YearExplorer() {
  const { minYear, maxYear } = supportedRange()
  const [year, setYear] = useState(2080)

  const rows = useMemo(() => {
    const out: Array<{ m: number; days: number; firstAD: string; weekday: string }> = []
    for (let m = 1; m <= 12; m++) {
      const first = toAD(year, m, 1)
      out.push({
        m,
        days: daysInMonth(year, m),
        firstAD: isoOf(first),
        weekday: EN_DAY_NAMES[first.getUTCDay()]!,
      })
    }
    return out
  }, [year])

  const years = useMemo(() => {
    const list: number[] = []
    for (let y = minYear; y <= maxYear; y++) list.push(y)
    return list
  }, [minYear, maxYear])

  return (
    <Section
      id="year-explorer"
      title="Year data explorer"
      subtitle="daysInMonth · daysInYear · toAD — driven by the embedded verified month table"
    >
      <div className="flex flex-wrap items-center gap-3 mb-4">
        <select
          className="rounded border border-input bg-card px-3 py-1.5 text-sm font-mono"
          value={year}
          onChange={e => setYear(Number(e.target.value))}
        >
          {years.map(y => <option key={y} value={y}>BS {y}</option>)}
        </select>
        <span className="text-xs text-muted-foreground">
          Total: <b className="font-mono text-foreground">{daysInYear(year)}</b> days
          {' · '}{daysInYear(year) === 366 ? 'leap year' : 'normal year'}
          {' · '}<span className="font-mono">{year} → AD {toAD(year, 1, 1).getUTCFullYear()}</span>
        </span>
      </div>

      <div className="overflow-x-auto rounded-lg border border-border">
        <table className="w-full text-xs">
          <thead className="bg-muted/50 text-muted-foreground">
            <tr>
              <th className="text-left px-3 py-2 font-medium">#</th>
              <th className="text-left px-3 py-2 font-medium">Month</th>
              <th className="text-left px-3 py-2 font-medium">Nepali</th>
              <th className="text-right px-3 py-2 font-medium">Days</th>
              <th className="text-left px-3 py-2 font-medium">First AD</th>
              <th className="text-left px-3 py-2 font-medium">Weekday</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {rows.map(r => (
              <tr key={r.m} className="hover:bg-primary/5">
                <td className="px-3 py-1.5 font-mono text-muted-foreground/80">{r.m}</td>
                <td className="px-3 py-1.5 text-foreground">{monthName(r.m)} <span className="text-muted-foreground/80">({EN_MONTH_NAMES[r.m - 1]})</span></td>
                <td className="px-3 py-1.5 text-foreground">{nepaliMonthName(r.m)} <span className="text-muted-foreground/80">{NEPALI_MONTH_NAMES[r.m - 1]}</span></td>
                <td className="px-3 py-1.5 text-right font-mono text-foreground">{r.days}</td>
                <td className="px-3 py-1.5 font-mono text-muted-foreground">{r.firstAD}</td>
                <td className="px-3 py-1.5 text-muted-foreground">{r.weekday}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Section>
  )
}
