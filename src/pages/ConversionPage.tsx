import { PageHeader, H2, ApiTable, Callout } from '../lib/docui'
import { ConversionPlayground } from '../sections/ConversionPlayground'
import { ErrorLab } from '../sections/ErrorLab'

/** Guide: converting between Bikram Sambat and Gregorian dates. */
export function ConversionPage() {
  return (
    <article className="max-w-4xl">
      <PageHeader
        eyebrow="Guide"
        title="BS ⇄ AD conversion"
        lede="The core of the package: exact, timezone-portable conversion between Bikram Sambat and Gregorian dates using integer epoch-day arithmetic — no day-by-day loops, no Date mutation."
      />

      <H2 id="quick-example">Quick example</H2>
      <pre className="rounded-lg bg-code text-code-foreground text-xs leading-relaxed p-4 overflow-x-auto mb-4"><code>{`import { toAD, toBS, toBSString } from 'nepali-bs-calendar'

// BS → AD: returns a Date at UTC midnight
toAD(2080, 1, 1)              // 2023-04-14T00:00:00.000Z — Nepali New Year 2080

// AD → BS: reads the civil date carried by the Date
toBS(new Date('2023-04-14T00:00:00.000Z'))   // { year: 2080, month: 1, day: 1 }

toBSString(toAD(2080, 1, 1))  // "2080-01-01"`}</code></pre>

      <H2 id="anchor">Reference anchors</H2>
      <p className="text-sm text-muted-foreground mb-3">
        All arithmetic is anchored at <b>BS 2000/01/01 = AD 1943-04-14</b> (nepali-date-converter
        and nepali-datetime agree). Internally the package also pins BS 2080/01/01 = AD 2023-04-14 as
        <code className="mx-1 font-mono text-xs bg-muted px-1 rounded">referenceAD</code> — both anchors are
        consistent with the same month-length table.
      </p>
      <ApiTable
        rows={[
          ['BS 2000/01/01', 'AD 1943-04-14', 'Start of the supported range (91 years, 33,238 days)'],
          ['BS 2080/01/01', 'AD 2023-04-14', 'Reference anchor shipped in the data module'],
          ['BS 2090/12/30', 'AD 2034-04-13', 'Last supported day'],
        ]}
      />

      <H2 id="date-semantics">Date semantics (timezone-safe)</H2>
      <p className="text-sm text-muted-foreground leading-relaxed mb-3">
        A JS <code className="font-mono text-xs bg-muted px-1 rounded">Date</code> is an instant, so
        “which calendar date” depends on interpretation. The package resolves this with an
        exact-UTC-midnight detection, making behavior identical on every machine:
      </p>
      <ul className="text-sm text-foreground list-disc pl-5 space-y-1.5 mb-4">
        <li>
          <b>UTC-midnight instants</b> (e.g. <code className="font-mono text-xs">new Date('2023-04-14')</code> or
          anything <code className="font-mono text-xs">toAD()</code> returned) are read as that <b>UTC</b> calendar
          date — date-string round-trips are exact worldwide.
        </li>
        <li>
          <b>Every other instant</b> — <code className="font-mono text-xs">new Date()</code>,
          <code className="font-mono text-xs"> new Date(2023, 3, 14)</code> — is read as the machine-<b>local</b>
          civil date, so <code className="font-mono text-xs">toBS(new Date())</code> is “today in BS” for the
          user’s wall clock.
        </li>
        <li>
          <code className="font-mono text-xs">toAD()</code> returns a Date at <b>UTC midnight</b> — read it with
          <code className="font-mono text-xs"> .getUTCFullYear()/.getUTCMonth()/.getUTCDate()</code>, or format it
          with <code className="font-mono text-xs">toBSString()</code>/<code className="font-mono text-xs">formatBSDate()</code>.
        </li>
      </ul>
      <Callout kind="tip" title="Round-trip guarantee">
        <code>toBS(toAD(y, m, d))</code> is exact for every one of the 33,238 supported days in every timezone —
        the test suite runs this exhaustively, not on samples.
      </Callout>

      <H2 id="playground">Live playground</H2>
      <p className="text-sm text-muted-foreground mb-3">
        Try it — every helper below runs on the real package. Type an invalid date (year 2091, month 13) to see
        the typed errors fire.
      </p>
      <ConversionPlayground />

      <H2 id="errors">Typed errors</H2>
      <p className="text-sm text-muted-foreground leading-relaxed mb-3">
        Conversion failures throw typed errors — both extend <code className="font-mono text-xs">RangeError</code>,
        so existing <code className="font-mono text-xs">catch (e) {'{ if (e instanceof RangeError) }'}</code> code
        keeps working:
      </p>
      <ErrorLab />
    </article>
  )
}
