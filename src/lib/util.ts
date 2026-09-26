/** Shared helpers for Section components. */

/** Canonical npm package page for the library. */
export const NPM_URL = 'https://www.npmjs.com/package/nepali-bs-calendar'

export function pad(n: number): string {
  return String(n).padStart(2, '0')
}

/** ISO YYYY-MM-DD of a UTC-midnight Date (the library's toAD output). */
export function isoOf(d: Date): string {
  return `${d.getUTCFullYear()}-${pad(d.getUTCMonth() + 1)}-${pad(d.getUTCDate())}`
}
