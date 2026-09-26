import { useState, useCallback } from 'react'
import { BSDatePicker } from 'nepali-bs-calendar/date-picker'
import type { DatePickerMode } from 'nepali-bs-calendar/date-picker'
import { BSCalendar } from 'nepali-bs-calendar/react'
import { toBS, toAD, todayBS } from 'nepali-bs-calendar'
import { sampleEvents, sampleHolidays } from '../lib/sample-data'
import { isoOf } from '../lib/util'
import { Section, KV } from '../lib/ui'

const fmtBS = (bs: { year: number; month: number; day: number }) =>
  `${bs.year}-${String(bs.month).padStart(2, '0')}-${String(bs.day).padStart(2, '0')}`

/**
 * BSDatePicker showcase:
 *  1. BS-first picker (reference-style: BS-native valueBS/onChangeBS,
 *     Devanagari digits, month/year quick-select, disable-past bounds)
 *  2. Multi-mode playground (ad/bs/both, themes, placements, custom trigger)
 *  3. Embedded always-open variant
 */
export function DatePickerShowcase() {
  const today = todayBS()
  const [mode, setMode] = useState<DatePickerMode>('both')
  const [theme, setTheme] = useState<'default' | 'tailwind'>('default')
  const [placement, setPlacement] = useState<'bottom-start' | 'bottom-end' | 'top-start' | 'top-end'>('bottom-start')
  const [customTrigger, setCustomTrigger] = useState(false)
  const [showCalendar, setShowCalendar] = useState(true)
  const [disablePast, setDisablePast] = useState(false)
  const [showQuickSelect, setShowQuickSelect] = useState(true)
  const [picked, setPicked] = useState<Date | null>(null)
  const [pickerValue, setPickerValue] = useState<Date | undefined>(undefined)
  const [bsValue, setBsValue] = useState<{ year: number; month: number; day: number } | null>({ ...today, month: today.month, day: today.day })

  const onChange = useCallback((ad: Date | null, bs: { year: number; month: number; day: number } | null) => {
    setPicked(ad)
    if (ad) setPickerValue(ad)
    if (bs) console.log('date-picker onChange bs:', bs)
  }, [])

  const bsOfPicked = picked ? (() => { try { return toBS(picked) } catch { return null } })() : null

  return (
    <Section
      id="date-picker"
      title="BSDatePicker component"
      subtitle="BS-first by default (valueBS / onChangeBS), Devanagari digits, month+year quick-select, enforced bounds — plus full AD/both modes"
    >
      {/* 1. BS-first picker, reference-style */}
      <div className="rounded-xl border border-primary/25 bg-primary/5 p-4 mb-6">
        <div className="text-[11px] font-semibold text-primary uppercase tracking-wide mb-2">BS date picker — Nepali-first</div>
        <p className="text-[11px] text-muted-foreground mb-3 leading-relaxed">
          The picker is controlled with a <b>BS value</b> (<code className="font-mono">valueBS / onChangeBS</code>) and
          renders Devanagari digits. The popup header has month &amp; year quick-select dropdowns; past days are
          disabled via <code className="font-mono">disablePast</code>. Inspired by nepali-datepicker-react.
        </p>
        <div className="grid md:grid-cols-2 gap-4 items-start">
          <div>
            <BSDatePicker
              valueBS={bsValue}
              onChangeBS={setBsValue}
              language="nepali"
              digits="devanagari"
              disablePast
              showMonthYearPicker
              events={sampleEvents}
              holidays={sampleHolidays}
              theme={theme}
            />
            <div className="mt-3 rounded-lg border border-border divide-y divide-border bg-card">
              <KV label="valueBS (BS)" value={bsValue ? fmtBS(bsValue) : 'null'} />
              <KV label="equivalent AD" value={bsValue ? isoOf(toAD(bsValue.year, bsValue.month, bsValue.day)) : 'null'} />
            </div>
          </div>
          <div className="text-[11px] text-muted-foreground leading-relaxed space-y-1.5">
            <p><code className="font-mono">valueBS / onChangeBS</code> — BS is the primary value; the AD date arrives second. <code className="font-mono">value / onChange</code> (AD <code className="font-mono">Date</code>) still works.</p>
            <p><code className="font-mono">digits="devanagari"</code> — every digit in the input, label, and grid renders in Devanagari; combined with <code className="font-mono">language="nepali"</code> for month names.</p>
            <p><code className="font-mono">showMonthYearPicker</code> — click the month or year in the popup header for quick-select grids (default on).</p>
            <p><code className="font-mono">disablePast / disableFuture / minDate / maxDate / disabledDates</code> — enforced day-level bounds; disabled days are struck through and unclickable.</p>
            <p>Footer: <b>आज</b> (Today), <b>मेटाउनुहोस्</b> (Clear) and <b>बन्द</b> (Close) localize with the language prop.</p>
          </div>
        </div>
      </div>

      {/* 2. Multi-mode playground */}
      <div className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wide mb-2">Multi-mode playground</div>
      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div className="flex flex-wrap items-center gap-2 text-xs">
            <select className="rounded border border-input bg-card px-2 py-1" value={mode} onChange={e => setMode(e.target.value as DatePickerMode)}>
              <option value="ad">mode="ad"</option>
              <option value="bs">mode="bs"</option>
              <option value="both">mode="both"</option>
            </select>
            <select className="rounded border border-input bg-card px-2 py-1" value={theme} onChange={e => setTheme(e.target.value as typeof theme)}>
              <option value="default">default</option>
              <option value="tailwind">tailwind</option>
            </select>
            <select className="rounded border border-input bg-card px-2 py-1" value={placement} onChange={e => setPlacement(e.target.value as typeof placement)}>
              <option value="bottom-start">bottom-start</option>
              <option value="bottom-end">bottom-end</option>
              <option value="top-start">top-start</option>
              <option value="top-end">top-end</option>
            </select>
            <label className="flex items-center gap-1.5">
              <input type="checkbox" checked={showCalendar} onChange={e => setShowCalendar(e.target.checked)} className="h-3.5 w-3.5" />
              <span className="font-mono text-[11px] text-muted-foreground">showCalendar</span>
            </label>
            <label className="flex items-center gap-1.5">
              <input type="checkbox" checked={customTrigger} onChange={e => setCustomTrigger(e.target.checked)} className="h-3.5 w-3.5" />
              <span className="font-mono text-[11px] text-muted-foreground">renderInput</span>
            </label>
            <label className="flex items-center gap-1.5">
              <input type="checkbox" checked={disablePast} onChange={e => setDisablePast(e.target.checked)} className="h-3.5 w-3.5" />
              <span className="font-mono text-[11px] text-muted-foreground">disablePast</span>
            </label>
            <label className="flex items-center gap-1.5">
              <input type="checkbox" checked={showQuickSelect} onChange={e => setShowQuickSelect(e.target.checked)} className="h-3.5 w-3.5" />
              <span className="font-mono text-[11px] text-muted-foreground">showMonthYearPicker</span>
            </label>
          </div>

          {customTrigger ? (
            <BSDatePicker
              value={pickerValue}
              onChange={onChange}
              mode={mode}
              theme={theme}
              placement={placement}
              showCalendar={showCalendar}
              showMonthYearPicker={showQuickSelect}
              disablePast={disablePast}
              renderInput={({ value, onClick }: { value: string; onClick: () => void }) => (
                <button
                  onClick={onClick}
                  className="rounded-lg border-2 border-primary/50 bg-primary/10 px-4 py-2 text-sm font-medium text-primary hover:bg-primary/15 transition-colors"
                >
                  {value || '📅 Pick a date…'}
                </button>
              )}
            />
          ) : (
            <BSDatePicker
              value={pickerValue}
              onChange={onChange}
              mode={mode}
              theme={theme}
              placement={placement}
              showCalendar={showCalendar}
              showMonthYearPicker={showQuickSelect}
              disablePast={disablePast}
              events={sampleEvents}
              holidays={sampleHolidays}
            />
          )}

          <p className="text-[11px] text-muted-foreground leading-relaxed">
            Typing <code className="font-mono">2080-01-01</code> (or <code className="font-mono">01/01/2080</code>) converts
            live; the converted equivalent shows in the input. <b>DD/MM/YYYY</b> is parsed by
            segment shape — 2-digit-first segments never get eaten as years.
          </p>
        </div>

        <div className="space-y-3">
          <div className="rounded-lg border border-border divide-y divide-border">
            <KV label="onChange adDate" value={picked ? isoOf(picked) : 'null'} />
            <KV label="onChange bs" value={bsOfPicked ? JSON.stringify(bsOfPicked) : 'null'} />
            <KV label="toAD(bs)" value={bsOfPicked ? isoOf(toAD(bsOfPicked.year, bsOfPicked.month, bsOfPicked.day)) : '—'} />
          </div>

          <div>
            <div className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wide mb-1">Embedded (always-open) variant</div>
            <p className="text-[11px] text-muted-foreground mb-2">
              A second picker with <code className="font-mono">showCalendar</code> off — the same
              component composed inside a custom panel with <code className="font-mono">calendarProps</code>.
            </p>
            <div className="rounded-lg border border-border p-3 inline-block bg-muted/50">
              <BSDatePicker
                value={pickerValue}
                onChange={onChange}
                mode="bs"
                showCalendar={false}
                calendarProps={{ view: 'bs' }}
              />
              <div className="mt-2">
                <BSCalendar
                  view="bs"
                  language="nepali"
                  theme="tailwind"
                  selectedDate={pickerValue}
                  onDateSelect={(ad) => { setPicked(ad); setPickerValue(ad) }}
                  showNavigation
                  events={sampleEvents}
                  holidays={sampleHolidays}
                  showEventList={false}
                  showHolidayLabels
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </Section>
  )
}
