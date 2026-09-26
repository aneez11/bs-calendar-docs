import { PageHeader, H2, ApiTable, Callout } from '../lib/docui'
import { FormatPlayground } from '../sections/FormatPlayground'
import { GridShowcase } from '../sections/GridShowcase'
import { TodayCard } from '../sections/TodayCard'

const CORE_API: Array<[string, string, string]> = [
  ['toAD', '(bsYear, bsMonth, bsDay) → Date', 'BS → AD at UTC midnight. Throws typed errors on bad input.'],
  ['toBS', '(date) → { year, month, day }', 'AD → BS (see the timezone semantics on the conversion page).'],
  ['todayBS', '() → { year, month, day }', 'Today in BS for the machine wall clock.'],
  ['isValidBS / assertValidBS', '(y, m, d) → boolean / void', 'Validate against the real month-length table; assert throws.'],
  ['daysInMonth / daysInYear', '(y, m) / (y) → number', 'Actual month lengths — BS years are 365 or 366 days.'],
  ['supportedRange', '() → { minYear, maxYear }', 'BS 2000–2090 (91 years, 33,238 days).'],
  ['getMonthGrid', '(bsYear, bsMonth) → CalendarCell[]', '42 cells (6×7), Sunday-first; each cell carries its AD date. Out-of-range edge cells flagged.'],
  ['getADMonthGrid', '(adYear, adMonth) → ADCalendarCell[]', 'Plain Gregorian grid, same 42-cell shape.'],
  ['toBSString / toFormattedBS', 'date → string', 'ISO-style BS string / "Month D, YYYY" English format.'],
  ['toNepaliBSString / toFormattedNepaliBS', 'date → string', 'Devanagari-digit equivalents.'],
  ['formatBSDate / formatADDate', '(date, pattern) → string', 'Token patterns — see below.'],
  ['monthName / nepaliMonthName', '(m) → string', 'English ("Baisakh") / Devanagari ("बैशाख") month names.'],
  ['nepaliDayName', '(date) → string', 'Devanagari weekday name (आइतबार…).'],
  ['toDevanagariNumeral', 'n → string', 'Digit transliteration 0-9 → ०-९.'],
  ['EN_MONTH_NAMES / EN_DAY_SHORT / NEPALI_MONTH_NAMES / NEPALI_DAY_NAMES', 'string[]', 'Exported name arrays for your own UIs.'],
]

/** Guide: formatting tokens, grid builders, and the full core surface. */
export function FormattingPage() {
  return (
    <article className="max-w-4xl">
      <PageHeader
        eyebrow="Guide"
        title="Formatting & grids"
        lede="Token-based date formatting (English + Devanagari), the 42-cell grid builders that power the React components, and the complete core API surface."
      />

      <H2 id="tokens">Format tokens</H2>
      <p className="text-sm text-muted-foreground leading-relaxed mb-3">
        One pattern string works for both <code className="font-mono text-xs bg-muted px-1 rounded">formatBSDate</code> and
        <code className="font-mono text-xs bg-muted px-1 rounded"> formatADDate</code>. Tokens are replaced
        longest-first in a <b>single pass</b> — substituted text is never rescanned. (The pre-audit
        <code className="font-mono text-xs bg-muted px-1 rounded"> split/join</code> implementation turned
        <code className="font-mono text-xs bg-muted px-1 rounded"> MMMM</code> into “9angsir” for Mangsir;
        the single-pass parser is the fix, covered by a regression test.)
      </p>
      <FormatPlayground />

      <H2 id="grids">Grid builders</H2>
      <p className="text-sm text-muted-foreground leading-relaxed mb-3">
        <code className="font-mono text-xs bg-muted px-1 rounded">getMonthGrid</code> pads the month to a
        Sunday-first 6×7 grid. Adjacent-month cells are real dates from the neighboring BS month (computed via the
        same epoch arithmetic); at the range edges (BS 2000/01 and 2090/12) the extrapolated cells are flagged
        <code className="font-mono text-xs bg-muted px-1 rounded"> isOutOfRange</code> instead of silently
        representing unsupportable days.
      </p>
      <GridShowcase />

      <H2 id="core-api">Core API reference</H2>
      <ApiTable rows={CORE_API} headers={['Function', 'Signature', 'Description']} />

      <H2 id="today">All formatters on one date</H2>
      <TodayCard />

      <Callout kind="note" title="Design choice — zero dependencies">
        The core has <b>no runtime dependencies</b> and is &lt; 5 KB gzipped: one packed month-length table
        (1,092 chars), offset math, and pure functions. The React entry points are separate so non-React apps
        never load them.
      </Callout>
    </article>
  )
}
