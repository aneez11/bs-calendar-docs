import { PageHeader, H2, ApiTable } from '../lib/docui'
import { YearExplorer } from '../sections/YearExplorer'

/** Data page: year explorer + range facts + provenance summary. */
export function DataPage() {
  return (
    <article className="max-w-4xl">
      <PageHeader
        eyebrow="Data"
        title="Data & year tables"
        lede="Browse the verified month-length table for every supported BS year (2000–2090), cross-checked against two independent libraries."
      />

      <div className="grid sm:grid-cols-3 gap-3 mb-6">
        <Stat label="Years covered" value="91" sub="BS 2000 – 2090" />
        <Stat label="Days mapped" value="33,238" sub="AD 1943-04-14 → 2034-04-13" />
        <Stat label="Month boundary fixtures" value="1,092" sub="all verified vs reference firstAD/lastAD" />
      </div>

      <H2 id="explorer">Month table explorer</H2>
      <YearExplorer />

      <H2 id="facts">Facts about the table</H2>
      <ApiTable
        headers={['Property', 'Value']}
        rows={[
          ['Range', 'BS 2000–2090 (91 years) — supportedRange()'],
          ['Epoch anchor', 'BS 2000/01/01 = AD 1943-04-14 (chain start, all sources agree)'],
          ['Reference anchor', 'BS 2080/01/01 = AD 2023-04-14 (encoded in the data module)'],
          ['Year totals', '365 or 366 days only — enforced at build time'],
          ['Month lengths', '29–32 days; months 1–6 skew long (30–32), 7–12 skew short (29–31)'],
          ['Packed size', '1,092-character string + 92-entry prefix-offset table'],
          ['Provenance', 'Primary reference dataset; NDC 3.4.0 + NDT 2.0.0 corroborating; one documented override (BS 2087)'],
        ]}
      />
    </article>
  )
}

function Stat({ label, value, sub }: { label: string; value: string; sub: string }) {
  return (
    <div className="rounded-lg border border-border bg-card px-4 py-3">
      <div className="text-[11px] uppercase tracking-wide text-muted-foreground/80 font-semibold">{label}</div>
      <div className="text-2xl font-bold text-foreground">{value}</div>
      <div className="text-[11px] text-muted-foreground">{sub}</div>
    </div>
  )
}
