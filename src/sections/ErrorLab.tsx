import { useState } from 'react'
import { toAD, isValidBS } from 'nepali-bs-calendar'
import { BSRangeError, BSInvalidDateError } from 'nepali-bs-calendar'
import { Section } from '../lib/ui'

interface Row { label: string; year: number; month: number; day: number }

const CASES: Row[] = [
  { label: 'valid: 2080/01/14', year: 2080, month: 1, day: 14 },
  { label: 'valid: 2087/09/29 (post-override boundary)', year: 2087, month: 9, day: 29 },
  { label: 'valid: 2000/01/01 (range start)', year: 2000, month: 1, day: 1 },
  { label: 'valid: 2090/12/30 (range end)', year: 2090, month: 12, day: 30 },
  { label: 'year too early: 1999/01/01', year: 1999, month: 1, day: 1 },
  { label: 'year too late: 2091/01/01', year: 2091, month: 1, day: 1 },
  { label: 'month 0', year: 2080, month: 0, day: 1 },
  { label: 'month 13', year: 2080, month: 13, day: 1 },
  { label: 'day 0', year: 2080, month: 1, day: 0 },
  { label: 'day 32 in a 31-day month', year: 2080, month: 1, day: 32 },
  { label: 'day 31 in a 30-day month (2080/09)', year: 2080, month: 9, day: 31 },
  { label: 'non-integer day (1.5)', year: 2080, month: 1, day: 1.5 },
]

/**
 * Typed-error lab: run every case through isValidBS / toAD and show which
 * error class fires. Confirms BSRangeError vs BSInvalidDateError split and
 * the RangeError base-class catchability.
 */
export function ErrorLab() {
  const [catchBase, setCatchBase] = useState(false)

  return (
    <Section
      id="errors"
      title="Typed errors"
      subtitle="BSRangeError / BSInvalidDateError — both extend RangeError; isValidBS never throws"
    >
      <label className="flex items-center gap-2 mb-3 cursor-pointer">
        <input type="checkbox" checked={catchBase} onChange={e => setCatchBase(e.target.checked)} className="h-3.5 w-3.5" />
        <span className="text-[11px] font-mono text-muted-foreground">catch as RangeError (base class)</span>
      </label>

      <div className="grid md:grid-cols-2 gap-2">
        {CASES.map(c => {
          let status: 'ok' | 'range' | 'invalid' | 'range-base' | 'invalid-base'
          let detail = ''
          const valid = isValidBS(c.year, c.month, c.day)
          try {
            const ad = toAD(c.year, c.month, c.day)
            status = 'ok'
            detail = ad.toISOString().slice(0, 10)
          } catch (e) {
            if (e instanceof BSRangeError) { status = catchBase ? 'range-base' : 'range'; detail = e.message }
            else if (e instanceof BSInvalidDateError) { status = catchBase ? 'invalid-base' : 'invalid'; detail = e.message }
            else { status = catchBase ? 'range-base' : 'range'; detail = String(e) }
          }
          return (
            <div key={c.label} className={`rounded-lg border px-3 py-2 text-xs ${
              status === 'ok' ? 'border-emerald-600/30 bg-emerald-600/10' : 'border-destructive/30 bg-destructive/10'
            }`}>
              <div className="flex items-center justify-between gap-2">
                <span className="font-medium text-foreground">{c.label}</span>
                <span className={`font-mono text-[10px] px-1.5 py-0.5 rounded ${
                  status === 'ok' ? 'bg-emerald-600/20 text-emerald-700 dark:text-emerald-400' : 'bg-destructive/15 text-destructive'
                }`}>
                  {status === 'ok' ? 'toAD ok' : status}
                </span>
              </div>
              <div className="mt-0.5 font-mono text-[10px] text-muted-foreground truncate" title={detail}>
                {detail}
                {status !== 'ok' && !valid && ' · isValidBS=false'}
              </div>
            </div>
          )
        })}
      </div>
    </Section>
  )
}
