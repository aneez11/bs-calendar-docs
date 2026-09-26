import {
  todayBS, toBSString, toFormattedBS, toNepaliBSString, toFormattedNepaliBS,
  formatBSDate, nepaliDayName, nepaliMonthName, toDevanagariNumeral,
  supportedRange, daysInYear,
} from 'nepali-bs-calendar'
import { Section, KV } from '../lib/ui'

/** Everything the core helpers say about *today*, in one card. */
export function TodayCard() {
  const today = todayBS()
  const now = new Date()
  const { minYear, maxYear } = supportedRange()

  let totalDays = 0
  for (let y = minYear; y <= maxYear; y++) totalDays += daysInYear(y)

  return (
    <Section id="today" title="Today in BS" subtitle="todayBS() and every string helper">
      <div className="grid md:grid-cols-2 gap-6">
        <div className="rounded-xl bg-gradient-to-br from-primary to-primary/80 text-primary-foreground p-5">
          <div className="text-xs uppercase tracking-widest text-primary-foreground/60">{nepaliDayName(now)} · {now.toDateString()}</div>
          <div className="mt-2 font-display text-4xl font-bold">
            {toDevanagariNumeral(today.year)} {nepaliMonthName(today.month)} {toDevanagariNumeral(today.day)}
          </div>
          <div className="mt-1 text-sm text-primary-foreground/85">
            {today.year} / {today.month} / {today.day} — {formatBSDate(now, 'DD MMMM YYYY')}
          </div>
        </div>
        <div className="rounded-lg border border-border divide-y divide-border px-3">
          <KV label="todayBS()" value={JSON.stringify(today)} />
          <KV label="toBSString(now)" value={toBSString(now)} />
          <KV label="toFormattedBS(now)" value={toFormattedBS(now)} />
          <KV label="toNepaliBSString(now)" value={toNepaliBSString(now)} />
          <KV label="toFormattedNepaliBS(now)" value={toFormattedNepaliBS(now)} />
          <KV label="formatBSDate(now, 'YYYY MMMM-NP DD-NP')" value={formatBSDate(now, 'YYYY MMMM-NP DD-NP')} />
          <KV label="supportedRange()" value={`BS ${minYear}–${maxYear} (${maxYear - minYear + 1} years, ${totalDays.toLocaleString()} days)`} />
        </div>
      </div>
    </Section>
  )
}
