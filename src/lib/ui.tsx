import { useMemo } from 'react'
import type { ReactNode } from 'react'

interface SectionProps {
  id: string
  title: string
  subtitle?: string
  children: ReactNode
}

/** Live-example section wrapper — token-based card with Devanagari anchor mark. */
export function Section({ id, title, subtitle, children }: SectionProps) {
  return (
    <section id={id} className="scroll-mt-4">
      <div className="rounded-xl border bg-card shadow-sm overflow-hidden">
        <div className="px-5 py-3.5 border-b border-border bg-muted/50">
          <span className="font-mono text-xs text-primary" title={id}>॥</span>
          <h2 className="ml-2 inline font-display text-base font-bold text-foreground">{title}</h2>
          {subtitle && <p className="mt-0.5 text-xs text-muted-foreground">{subtitle}</p>}
        </div>
        <div className="p-5">{children}</div>
      </div>
    </section>
  )
}

export function KV({ label, value, mono = true }: { label: string; value: ReactNode; mono?: boolean }) {
  return (
    <div className="flex justify-between gap-4 py-1.5 border-b border-border/60 last:border-0">
      <span className="text-xs text-muted-foreground shrink-0">{label}</span>
      <span className={`text-xs text-foreground text-right ${mono ? 'font-mono' : ''}`}>{value}</span>
    </div>
  )
}

/** Tiny self-contained code block (no syntax highlighting needed for a demo). */
export function CodeBlock({ code }: { code: string }) {
  return (
    <pre className="rounded-lg border border-code/50 bg-code text-code-foreground text-[11px] leading-relaxed p-3 overflow-x-auto">
      <code>{code}</code>
    </pre>
  )
}

export function useOnce<T>(factory: () => T): T {
  return useMemo(factory, [])
}
