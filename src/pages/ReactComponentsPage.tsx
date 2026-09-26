import { PageHeader, H2, ApiTable, Callout, DocCode } from '../lib/docui'
import { CalendarShowcase } from '../sections/CalendarShowcase'
import { DatePickerShowcase } from '../sections/DatePickerShowcase'

const CALENDAR_PROPS: Array<[string, string, string]> = [
  ['view', "'bs' | 'ad' | 'both'", 'What the day cells show. Default both.'],
  ['language', "'nepali' | 'english' | 'both'", 'Header + weekday labels. Default both.'],
  ['theme', "'default' | 'tailwind'", 'Inline styles (default) or Tailwind class hooks. Default default.'],
  ['initialDate / initialBSYear / initialBSMonth', 'Date / number', 'Which month opens first. Defaults to today in BS. Year clamped to the data range.'],
  ['minBSYear / maxBSYear', 'number', 'Narrow the navigation range below BS 2000–2090 (nav buttons disable at the edges).'],
  ['selectedDate', 'Date', 'Controlled selection (UTC-midnight dates from toAD work best).'],
  ['onDateSelect', '(adDate, bs) => void', 'Fired on day click with both AD Date and BS parts.'],
  ['showNavigation', 'boolean', 'Show ‹ month › header. Default true.'],
  ['onMonthChange', '(bsYear, bsMonth, adYear, adMonth) => void', 'Fired with the target month — reported up-front, not stale.'],
  ['minDate / maxDate', 'Date', 'Enforced day-level bounds — outside days render struck-through and unclickable.'],
  ['disablePast / disableFuture / disabledDates', 'boolean / Date[]', 'More enforced bounds (today-relative or explicit blocklist).'],
  ['digits', "'latin' | 'devanagari'", 'Devanagari digits across headers, day numbers, and grids.'],
  ['enableMonthPicker / enableYearPicker', 'boolean', 'Reference-style quick-select dropdowns on the header month/year labels.'],
  ['events / holidays', 'CalendarEvent[] / Holiday[]', 'Strings keyed by date; dateType: "bs" | "ad". Multi-day events via endDate.'],
  ['maxVisibleEvents', 'number', 'Bars/list items per cell before the “+N more” chip. Default 2.'],
  ['showEventDots / showEventBars', 'boolean', 'Dot row vs color bars in cells (bars hide dots).'],
  ['showEventList / showPopupOnHover / showHolidayLabels', 'boolean', 'Extra event surfaces below the grid / on hover / in cells.'],
  ['renderDay', '(data: CellData) => ReactNode', 'Full custom cell renderer — receives bsCell, adCell, events, holidays.'],
  ['renderHeader', '(monthName, year, view) => ReactNode', 'Custom month/year header.'],
  ['renderEvent / renderHoliday', '(item, compact) => ReactNode', 'Custom rows in the event list.'],
  ['onEventClick / onHolidayClick', '(item, adDate) => void', 'Item clicks (events stopPropagation from the cell click).'],
  ['dateFormat', 'string', 'formatBSDate pattern for the day number, e.g. "D".'],
  ['cellAspectRatio', 'number', 'Cell height = width × ratio. Default 1.'],
  ['classNames / styles', 'BSCalendarClassNames / BSCalendarStyles', 'Per-element overrides (22 styleable keys). Merged over the theme.'],
]

const PICKER_PROPS: Array<[string, string, string]> = [
  ['value', 'Date', 'AD-controlled value (Date at UTC midnight from toAD works best).'],
  ['valueBS', '{ year, month, day } | null', 'BS-controlled value — the Nepali-first way to drive the picker. Takes precedence over value on mount.'],
  ['onChange', '(adDate, bs) => void', 'AD-primary change callback — bs is null if conversion failed.'],
  ['onChangeBS', '(bs, adDate) => void', 'BS-primary change callback (null, null) on clear.'],
  ['mode', "'ad' | 'bs' | 'both'", 'Input semantics. both shows the live BS⇄AD switch and converted label.'],
  ['defaultMode', "'bs' | 'ad'", "Which tab starts active when mode='both'. Default 'bs' — BS-first, like Nepali apps."],
  ['digits', "'latin' | 'devanagari'", "Devanagari digit rendering across the input, converted label, and calendar grid."],
  ['language / theme / dateFormat / placeholder / disabled / name', '—', 'Same meaning as the input implies. Footer buttons (आज / मेटाउनुहोस् / बन्द) localize too.'],
  ['showCalendar', 'boolean', 'Whether clicking opens the dropdown calendar. Default true.'],
  ['placement', "'bottom-start' | 'bottom-end' | 'top-start' | 'top-end'", 'Dropdown side. Default bottom-start.'],
  ['minDate / maxDate', 'Date', 'Enforced day-level bounds — outside days render struck-through and unclickable.'],
  ['disablePast / disableFuture / disabledDates', 'boolean / Date[]', 'More enforced bounds: relative to today, or an explicit blocklist of dates.'],
  ['showMonthYearPicker', 'boolean', 'Month & year quick-select dropdowns in the popup header (click the month/year). Default true.'],
  ['events / holidays', 'CalendarEvent[] / Holiday[]', 'Passed through to the embedded BSCalendar.'],
  ['renderInput', '(props: { value, onClick, onFocus }) => ReactNode', 'Custom trigger — a button, masked input, etc.'],
  ['calendarProps', 'Partial<BSCalendarProps>', 'Escape hatch to the embedded calendar (view, language, theme…).'],
]

/** Guide: the two React components, with every prop documented and live. */
export function ReactComponentsPage() {
  return (
    <article className="max-w-4xl">
      <PageHeader
        eyebrow="Guide"
        title="React components"
        lede="BSCalendar and BSDatePicker ship as separate entry points so the core package stays React-free. Both are typed end-to-end and themeable."
      />

      <Callout kind="tip" title="Imports">
        <DocCode code={`import { BSCalendar } from 'nepali-bs-calendar/react'
import { BSDatePicker } from 'nepali-bs-calendar/date-picker'`} lang="ts" />
        React ≥18 is an optional peer dependency — apps that never import these entry points don’t pay for React.
      </Callout>

      <H2 id="bscalendar">BSCalendar</H2>
      <p className="text-sm text-muted-foreground mb-3">
        42-cell (6×7, Sunday-first) month view. Cells carry <b>both</b> BS and AD dates; the AD column is derived
        cell-for-cell from the BS grid, so the two months can never misalign at edges.
      </p>
      <ApiTable rows={CALENDAR_PROPS} headers={['Prop', 'Type', 'Description']} />

      <H2 id="themes">Theming</H2>
      <DocCode code={`// default — override any of the 22 styleable keys with inline styles
<BSCalendar styles={{ cellToday: { background: '#1e3a5f' } }} />

// tailwind — component ships its class hooks; your app supplies Tailwind
<BSCalendar theme="tailwind" classNames={{ cellToday: 'bg-primary text-primary-foreground ring-2 ring-primary' }} />`} />

      <Callout kind="tip" title="Tailwind theme note">
        The tailwind theme needs the component’s class names present in your Tailwind build — add
        <code className="mx-1 font-mono text-xs bg-card/60 px-1 rounded">@source "../node_modules/nepali-bs-calendar/dist";</code>
        to your CSS if you use Tailwind v4.
      </Callout>

      <H2 id="live-calendar">Live — every prop switchable</H2>
      <CalendarShowcase />

      <H2 id="bsdatepicker">BSDatePicker</H2>
      <p className="text-sm text-muted-foreground mb-3">
        Typed date input with dropdown calendar. In <b>both</b> mode the input parses
        <b> YYYY-MM-DD</b> and <b>DD/MM/YYYY</b> (segment-shape disambiguation — a 2-digit leading segment is
        never eaten as a year), and shows the converted equivalent live.
      </p>
      <ApiTable rows={PICKER_PROPS} headers={['Prop', 'Type', 'Description']} />

      <H2 id="live-picker">Live</H2>
      <DatePickerShowcase />
    </article>
  )
}
