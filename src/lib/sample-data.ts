import { todayBS, toAD, daysInMonth } from 'nepali-bs-calendar'
import { isoOf, pad } from './util'
import type { CalendarEvent, Holiday } from 'nepali-bs-calendar/react'

const t = todayBS()

function bsDate(m: number, d: number): string {
  return `${t.year}-${pad(m)}-${pad(d)}`
}

function clampDay(m: number, day: number): number {
  return Math.min(day, daysInMonth(t.year, m))
}

function addDaysBs(days: number): string {
  // walk via AD epoch to stay exact across month/year boundaries
  const base = toAD(t.year, t.month, t.day)
  const next = new Date(base.getTime() + days * 86400000)
  return isoOf(next)
}

/**
 * Sample events and holidays, generated relative to *today* so the calendar
 * always has visible content. Mixes BS-typed and AD-typed dates on purpose.
 */
export const sampleEvents: CalendarEvent[] = [
  {
    id: 'e1',
    title: 'Team standup',
    date: bsDate(t.month, t.day),
    dateType: 'bs',
    time: '10:00',
    color: '#3b82f6',
    type: 'event',
  },
  {
    id: 'e2',
    title: 'Sprint planning',
    date: addDaysBs(2),
    dateType: 'ad',
    time: '14:00',
    color: '#8b5cf6',
    type: 'task',
  },
  {
    id: 'e3',
    title: 'Code retreat (2 days)',
    date: addDaysBs(4),
    endDate: addDaysBs(5),
    dateType: 'ad',
    color: '#14b8a6',
    allDay: true,
  },
  {
    id: 'e4',
    title: 'Mom\'s birthday',
    date: bsDate(t.month, clampDay(t.month, 25)),
    dateType: 'bs',
    color: '#f59e0b',
    type: 'birthday',
  },
]

export const sampleHolidays: Holiday[] = [
  {
    date: `${t.year}-01-01`,
    dateType: 'bs',
    name: 'Nepali New Year',
    nameNP: 'नयाँ वर्ष',
    type: 'festival',
    color: '#22c55e',
  },
  {
    date: bsDate(t.month, clampDay(t.month, 8)),
    dateType: 'bs',
    name: 'Public Holiday',
    nameNP: 'सार्वजनिक बिदा',
    type: 'public',
    color: '#ef4444',
  },
]
