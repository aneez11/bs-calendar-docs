import { useState, useCallback } from 'react'
import { BSCalendar } from 'nepali-bs-calendar/react'
import type { BSCalendarProps, CalendarEvent, CalendarView, CalendarLanguage, CalendarTheme, CellData, Holiday } from 'nepali-bs-calendar/react'
import { sampleEvents, sampleHolidays } from '../lib/sample-data'
import { Section } from '../lib/ui'

const THEMES: CalendarTheme[] = ['default', 'tailwind']
const VIEWS: CalendarView[] = ['bs', 'ad', 'both']
const LANGS: CalendarLanguage[] = ['nepali', 'english', 'both']

/**
 * BSCalendar with every prop switchable live: view / language / theme,
 * events + holidays (BS- and AD-typed), event dots/bars/list/popup,
 * custom renderDay + renderHeader, and all callbacks logged.
 */
export function CalendarShowcase() {
  const [view, setView] = useState<CalendarView>('both')
  const [language, setLanguage] = useState<CalendarLanguage>('both')
  const [theme, setTheme] = useState<CalendarTheme>('default')
  const [showEventList, setShowEventList] = useState(true)
  const [showEventBars, setShowEventBars] = useState(false)
  const [showPopupOnHover, setShowPopupOnHover] = useState(false)
  const [showHolidayLabels, setShowHolidayLabels] = useState(true)
  const [customRenders, setCustomRenders] = useState(false)
  const [maxVisibleEvents, setMaxVisibleEvents] = useState(2)
  const [digits, setDigits] = useState<'latin' | 'devanagari'>('latin')
  const [quickSelect, setQuickSelect] = useState(false)
  const [log, setLog] = useState<string[]>([])

  const push = useCallback((msg: string) => {
    setLog(l => [`${new Date().toLocaleTimeString()}  ${msg}`, ...l].slice(0, 8))
  }, [])

  const onDateSelect: BSCalendarProps['onDateSelect'] = useCallback((
    ad: Date,
    bs: { year: number; month: number; day: number },
  ) => {
    push(`onDateSelect → AD ${ad.toISOString().slice(0, 10)} = BS ${bs.year}-${bs.month}-${bs.day}`)
  }, [push])

  const onMonthChange: BSCalendarProps['onMonthChange'] = useCallback((
    bsYear: number, bsMonth: number, adYear: number, adMonth: number,
  ) => {
    push(`onMonthChange → BS ${bsYear}/${bsMonth} (AD ${adYear}-${adMonth + 1})`)
  }, [push])

  const onEventClick: BSCalendarProps['onEventClick'] = useCallback((ev: CalendarEvent) => {
    push(`onEventClick → "${ev.title}"`)
  }, [push])

  const onHolidayClick: BSCalendarProps['onHolidayClick'] = useCallback((h: Holiday) => {
    push(`onHolidayClick → "${h.name}"`)
  }, [push])

  // Custom renderDay: big BS day, event count badge, AD day bottom-right
  const renderDay = useCallback((data: CellData) => {
    const { cell, events, holidays } = data
    return (
      <div className="flex w-full flex-col items-center justify-start gap-0.5 py-0.5">
        <span className="text-sm font-bold leading-none">{cell.bsDay}</span>
        <span className="text-[8px] text-muted-foreground/80 leading-none font-mono">{cell.adDate.getUTCDate()}</span>
        <div className="flex gap-0.5 mt-0.5">
          {holidays.slice(0, 2).map((h, i) => (
            <span key={i} className="w-1.5 h-1.5 rounded-full" style={{ background: h.color ?? '#ef4444' }} />
          ))}
          {events.slice(0, 3).map((e, i) => (
            <span key={i} className="w-1.5 h-1.5 rounded-full" style={{ background: e.color ?? '#3b82f6' }} />
          ))}
        </div>
        {(events.length + holidays.length > 3) && (
          <span className="text-[8px] text-muted-foreground/80 leading-none">+{events.length + holidays.length - 3}</span>
        )}
      </div>
    )
  }, [])

  const renderHeader = useCallback((monthName: string, year: string) => (
    <div className="flex items-baseline gap-2">
      <span className="text-lg font-bold text-primary">{monthName}</span>
      <span className="text-sm text-muted-foreground/80 font-mono">{year}</span>
    </div>
  ), [])

  return (
    <Section
      id="calendar"
      title="BSCalendar component"
      subtitle="every prop switchable live — themes, view, language, events, holidays, custom renders, callbacks"
    >
      <div className="grid lg:grid-cols-[1fr_260px] gap-6">
        <div className="flex flex-col items-center">
          <BSCalendar
            view={view}
            language={language}
            theme={theme}
            events={sampleEvents}
            holidays={sampleHolidays}
            showEventList={showEventList}
            showEventBars={showEventBars}
            showEventDots={!showEventBars}
            showPopupOnHover={showPopupOnHover}
            showHolidayLabels={showHolidayLabels}
            maxVisibleEvents={maxVisibleEvents}
            onDateSelect={onDateSelect}
            onMonthChange={onMonthChange}
            onEventClick={onEventClick}
            onHolidayClick={onHolidayClick}
            renderDay={customRenders ? renderDay : undefined}
            renderHeader={customRenders ? renderHeader : undefined}
            digits={digits}
            enableMonthPicker={quickSelect}
            enableYearPicker={quickSelect}
            cellAspectRatio={1.15}
          />
        </div>

        <div className="space-y-3 text-xs">
          <ControlGroup label="view">
            {VIEWS.map(v => <Choice key={v} active={view === v} onClick={() => setView(v)}>{v}</Choice>)}
          </ControlGroup>
          <ControlGroup label="language">
            {LANGS.map(l => <Choice key={l} active={language === l} onClick={() => setLanguage(l)}>{l}</Choice>)}
          </ControlGroup>
          <ControlGroup label="theme">
            {THEMES.map(t => <Choice key={t} active={theme === t} onClick={() => setTheme(t)}>{t}</Choice>)}
          </ControlGroup>
          <ControlGroup label="maxVisibleEvents">
            {[1, 2, 3, 4].map(n => <Choice key={n} active={maxVisibleEvents === n} onClick={() => setMaxVisibleEvents(n)}>{n}</Choice>)}
          </ControlGroup>
          <div className="space-y-1.5">
            <Toggle checked={showEventList} onChange={setShowEventList} label="showEventList" />
            <Toggle checked={showEventBars} onChange={setShowEventBars} label="showEventBars (hides dots)" />
            <Toggle checked={showPopupOnHover} onChange={setShowPopupOnHover} label="showPopupOnHover" />
            <Toggle checked={showHolidayLabels} onChange={setShowHolidayLabels} label="showHolidayLabels" />
            <Toggle checked={customRenders} onChange={setCustomRenders} label="custom renderDay/renderHeader" />
            <Toggle checked={quickSelect} onChange={setQuickSelect} label="enableMonth/YearPicker" />
          </div>
          <ControlGroup label="digits">
            <Choice active={digits === 'latin'} onClick={() => setDigits('latin')}>latin</Choice>
            <Choice active={digits === 'devanagari'} onClick={() => setDigits('devanagari')}>devanagari</Choice>
          </ControlGroup>
          <div>
            <div className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wide mb-1">Callback log</div>
            <div className="rounded-lg bg-code text-code-foreground/80 text-[10px] font-mono p-2 min-h-[96px] space-y-0.5 overflow-y-auto max-h-40">
              {log.length === 0 && <div className="text-muted-foreground">interact with the calendar…</div>}
              {log.map((l, i) => <div key={i} className={i === 0 ? 'text-emerald-400' : ''}>{l}</div>)}
            </div>
          </div>
          <p className="text-[10px] text-muted-foreground/80 leading-relaxed">
            Events/holidays mix <code>dateType: 'bs'</code> and <code>'ad'</code> strings — the
            component normalizes both onto the grid. Multi-day events use <code>endDate</code>.
          </p>
        </div>
      </div>
    </Section>
  )
}

function ControlGroup({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wide mb-1">{label}</div>
      <div className="flex flex-wrap gap-1">{children}</div>
    </div>
  )
}

function Choice({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      className={`rounded-full px-2.5 py-0.5 text-[11px] border transition-colors ${
        active
          ? 'bg-primary border-primary text-primary-foreground'
          : 'bg-card border-input text-muted-foreground hover:border-primary/50'
      }`}
    >
      {children}
    </button>
  )
}

function Toggle({ checked, onChange, label }: { checked: boolean; onChange: (v: boolean) => void; label: string }) {
  return (
    <label className="flex items-center gap-2 cursor-pointer">
      <input
        type="checkbox"
        checked={checked}
        onChange={e => onChange(e.target.checked)}
        className="h-3.5 w-3.5 rounded border-input text-primary focus:ring-ring"
      />
      <span className="text-[11px] font-mono text-muted-foreground">{label}</span>
    </label>
  )
}
