import { PageHeader, H2, ApiTable, Callout } from '../lib/docui'

const PIPELINE = [
  { n: '1', title: 'Extract', desc: 'per-day AD↔BS records from a primary public dataset → 1,104 month records (BS 2000-01 … 2091-12)' },
  { n: '2', title: 'Chain-verify', desc: "every month's firstAD = previous lastAD + 1 — zero gaps, zero overlaps" },
  { n: '3', title: 'Corroborate', desc: 'diff against two independent npm libraries + an independent 2025 scrape of the same calendar data' },
  { n: '4', title: 'Resolve', desc: 'documented conflict policy; one impossible-year correction (BS 2087)' },
  { n: '5', title: 'Build', desc: 'raw JSON → packed TS table; 12×29–32 constraints, 365/366 totals enforced' },
  { n: '6', title: 'Verify + test', desc: 'fixture diff of all 1,092 month boundaries + 87 tests incl. exhaustive roundtrip' },
]

const DISPUTES: Array<[string, string, string]> = [
  ['2062', 'Primary: Baishakh 31, Jestha 31 — NDC/NDT: 30/32 (both 365-day years)', 'Primary — its own per-day records place Jestha 1 on 2005-05-15, confirming its composition; cumulative anchors identical either way'],
  ['2084/2085', 'Primary totals 365/366 — NDC/NDT 366/365 (leap day in different years’ Chaitra)', 'Primary — reference dataset (future years, no official declaration yet)'],
  ['2086/2089', 'equal totals, intra-year composition differs', 'Primary — reference dataset'],
  ['2087', 'Primary source serves a 367-day year — impossible', 'corrected to 366 (Mangsir 30→29), matching NDC — see below'],
]

/** The full data-engineering methodology: extraction, verification, correction, packing. */
export function MethodologyPage() {
  return (
    <article className="max-w-4xl">
      <PageHeader
        eyebrow="Methodology"
        title="Implementation methodology"
        lede="How the month-length table behind this package was built, cross-verified against multiple independent sources, and corrected — plus the pipeline that keeps it reproducible."
      />

      <Callout kind="note" title="Scope of trust">
        BS month lengths are officially declared by Nepal’s Calendar Determination Committee (Panchanga
        Pramanik Samiti). Years through ~2083 match the declared calendar; later years are <b>projections</b>
        from the referenced sources and may be revised. The package ships its provenance so that any future
        revision is a one-line regeneration, not a mystery.
      </Callout>

      <H2 id="pipeline">Pipeline at a glance</H2>
      <ol className="space-y-2 mb-4">
        {PIPELINE.map(p => (
          <li key={p.n} className="flex gap-3 items-start rounded-lg border border-border bg-card px-4 py-2.5">
            <span className="mt-0.5 h-6 w-6 shrink-0 rounded-full bg-primary text-primary-foreground text-xs font-bold flex items-center justify-center">{p.n}</span>
            <div>
              <div className="text-sm font-semibold text-foreground">{p.title}</div>
              <div className="text-xs text-muted-foreground">{p.desc}</div>
            </div>
          </li>
        ))}
      </ol>

      <H2 id="extraction">1 — Extracting the primary dataset</H2>
      <p className="text-sm text-muted-foreground leading-relaxed mb-3">
        The primary source publishes its calendar with per-day AD↔BS records. Fetching a month page in its
        structured-data mode returns those records directly — no DOM scraping, no headless browser. Each response
        embeds three months of data:
      </p>
      <pre className="rounded-lg bg-code text-code-foreground text-xs leading-relaxed p-4 overflow-x-auto mb-3"><code>{`GET <primary-source>/calendar/2080/01   (structured-data mode)

payload: {"yearBs":"2080","monthBs":"01","daysInMonth":31, ...
  per-day records: { year_ad, month_ad, day_ad, year_bs, month_bs, day_bs }`}</code></pre>
      <p className="text-sm text-muted-foreground leading-relaxed mb-3">
        1,104 month records were fetched (BS 2000-01 through 2091-12 — one extra year so the chain can be
        verified <i>past</i> the supported edge). The extractor lives at
        <code className="mx-1 font-mono text-xs bg-muted px-1 rounded">bs-calendar/scripts/reference/tooling/</code>:
        <code className="font-mono text-xs bg-muted px-1 rounded">fetch-source.js</code> (throttled fetch),
        <code className="font-mono text-xs bg-muted px-1 rounded">parse-hp.js</code> (payload → month records),
        <code className="font-mono text-xs bg-muted px-1 rounded">check-chain.js</code> (continuity audit).
      </p>
      <Callout kind="tip" title="Why the chain check matters">
        Month totals alone can hide errors — a wrong <code>daysInMonth</code> with a compensating error elsewhere
        still produces a consistent-looking table. The per-day records let us verify
        <b> firstAD = previous lastAD + 1</b> for all 1,104 months: zero gaps, zero overlaps. The served data is
        internally consistent before any comparison even starts.
      </Callout>

      <H2 id="corroboration">2 — Corroborating datasets</H2>
      <ApiTable
        headers={['Source', 'Coverage', 'Role']}
        rows={[
          ['Primary public dataset (structured calendar payloads, 2026-09-04 snapshot)', 'BS 2000-01 – 2091-12', 'Primary reference; snapshot shipped as scripts/reference/source-months.json'],
          ['nepali-date-converter@3.4.0 (npm)', 'month table 2000–2090', 'Independent implementation — detected the primary source’s 2087 projection error'],
          ['nepali-datetime@2.0.0 (npm, ashesh)', '2000–2099, anchored AD 1943-04-14', 'Independent anchor confirmation (matches the primary source’s firstAD for BS 2000-01)'],
          ['bikrantj/nepali-calendar-scraper (2025)', 'BS 2081–2089', 'A 2025 scrape of the same calendar data — agrees with the 2026 extraction on every overlapping month'],
        ]}
      />

      <H2 id="conflicts">3 — Conflict resolution & the BS 2087 correction</H2>
      <p className="text-sm text-muted-foreground leading-relaxed mb-3">
        The rule is simple: <b>the primary dataset is the reference</b>; divergences are documented, not averaged.
        Where sources disagree, the choice and its evidence are recorded in
        <code className="mx-1 font-mono text-xs bg-muted px-1 rounded">SOURCES.md</code>:
      </p>
      <ApiTable headers={['Year', 'Source difference', 'Decision & evidence']} rows={DISPUTES} />
      <div className="mt-4 rounded-lg border-2 border-pahenro/50 bg-pahenro/10 px-4 py-3 text-sm text-foreground">
        <div className="font-bold">The one correction — BS 2087 (impossible year)</div>
        <p className="mt-1 leading-relaxed">
          The primary source currently serves BS 2087 as a <b>367-day</b> year. The BS calendar only ever adds days
          to individual months (up to 32); a 367-day year cannot exist. Verified directly from raw structured
          payloads and independently by the 2025 bikrantj scrape — the error is in the served <i>projection</i>,
          not the extraction.
        </p>
        <pre className="mt-2 rounded bg-card/70 px-3 py-2 text-xs overflow-x-auto"><code>{`Served by primary source : [31,31,32,31,31,31,30,30,30,30,30,30]  = 367  (impossible)
Adopted                  : [31,31,32,31,31,31,30,30,29,30,30,30]  = 366  (Poush 30→29, month 9 — matches NDC)
New Year 2087 = 2030-04-14 (primary anchor kept)`}</code></pre>
        <p className="mt-2 leading-relaxed">
          <b>Documented consequence:</b> years 2088–2090 here sit one day earlier than the primary source’s current
          serving (e.g. New Year 2088 = 2031-04-15 vs 2031-04-16 as currently served). If the source corrects its
          projection,
          <code className="font-mono text-xs bg-card/70 px-1 rounded"> npm run build:data</code> regenerates everything from the snapshot + override list.
        </p>
      </div>

      <H2 id="build-verify">4 — Build-time enforcement & fixture verification</H2>
      <p className="text-sm text-muted-foreground leading-relaxed mb-3">
        <code className="font-mono text-xs bg-muted px-1 rounded">scripts/build-data.ts</code> turns the raw
        JSON into the shipped table and hard-fails on structural violations (12 months, 29–32 days each,
        365/366-day totals — the 2087 override is the single whitelisted exception, encoded as a
        <code className="mx-1 font-mono text-xs bg-muted px-1 rounded">knownOverrides</code> entry, never as a
        silent patch).
      </p>
      <p className="text-sm text-muted-foreground leading-relaxed mb-3">
        <code className="font-mono text-xs bg-muted px-1 rounded">scripts/verify-data.ts</code> then diffs the
        built table against the reference fixtures:
      </p>
      <ul className="text-sm text-foreground list-disc pl-5 space-y-1.5 mb-4">
        <li>all 1,092 supported month lengths vs the reference fixture (with the documented override applied)</li>
        <li>every month’s <b>firstAD</b> and <b>lastAD</b> vs the fixture, shift-adjusted through override years</li>
        <li>anchor algebra: BS 2080/01/01 = 2023-04-14 must reduce to BS 2000/01/01 = 1943-04-14</li>
      </ul>

      <H2 id="packing">5 — Shipped representation & runtime math</H2>
      <p className="text-sm text-muted-foreground leading-relaxed mb-3">
        The 91×12 table packs into a <b>1,092-character string</b>: each month is one letter
        <code className="font-mono text-xs bg-muted px-1 rounded">'a'+(days−29)</code> — so ‘a’=29 … ‘d’=32 —
        and a 92-entry cumulative-offset prefix table enables <b>O(1)</b> year lookup by binary search. No
        <code className="font-mono text-xs bg-muted px-1 rounded">Date</code> mutation anywhere; conversion is
        pure integer epoch-day arithmetic with a single anchor:
      </p>
      <pre className="rounded-lg bg-code text-code-foreground text-xs leading-relaxed p-4 overflow-x-auto mb-3"><code>{`BS_AD_OFFSET = 29220                    // epoch days between 1943-04-14 (BS epoch) and 2023-04-14 (reference)
toAD(y, m, d) = epochDayToAd(bsEpochDays(y, m, d) − BS_AD_OFFSET)
bsEpochDays   = offsetBeforeYear(y) + offsetBeforeMonth(y, m) + (d − 1)   // O(1) via prefix table`}</code></pre>
      <p className="text-sm text-muted-foreground leading-relaxed">
        Result: the core is <b>zero-dependency, &lt; 5 KB gzipped</b>, and identical on every timezone (dates are
        read as UTC civil days; see the conversion guide’s semantics section).
      </p>

      <H2 id="tests">6 — Test strategy (87 tests, all green)</H2>
      <ApiTable
        headers={['Suite', 'What it proves']}
        rows={[
          ['Exhaustive roundtrip', 'toBS(toAD(y,m,d)) exact for every one of the 33,238 supported days — not sampled'],
          ['Boundary fixtures', 'per-month firstAD/lastAD vs reference fixture for all 1,092 months'],
          ['Anchor & range', 'BS 2000/01/01 = 1943-04-14, BS 2090/12/30 = 2034-04-13; out-of-range throws BSRangeError'],
          ['Formatter regression', 'toAD(2080,8,16) era token corruption (Mangsir → “9angsir”) can never return'],
          ['Typed errors', 'month 13, day 32-in-30, year 1999/2091 → BSInvalidDateError vs BSRangeError split'],
        ]}
      />
      <Callout kind="tip" title="Reproducibility">
        Everything regenerates from the shipped snapshots:{' '}
        <code>npm run build:data && npx tsx scripts/verify-data.ts</code> in the package directory. The extraction
        tooling is committed at <code>scripts/reference/tooling/</code> so the pipeline can be re-run end-to-end
        years from now.
      </Callout>
    </article>
  )
}
