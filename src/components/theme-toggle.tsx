import { useEffect, useState, useCallback } from 'react'
import { Button } from './ui/button'

const KEY = 'bsc-theme'

/** Shadcn-style light/dark toggle persisted to localStorage. */
export function ThemeToggle() {
  const [dark, setDark] = useState(() => {
    if (typeof window === 'undefined') return false
    const saved = window.localStorage.getItem(KEY)
    if (saved) return saved === 'dark'
    return window.matchMedia('(prefers-color-scheme: dark)').matches
  })

  useEffect(() => {
    document.documentElement.classList.toggle('dark', dark)
    window.localStorage.setItem(KEY, dark ? 'dark' : 'light')
  }, [dark])

  const toggle = useCallback(() => setDark(d => !d), [])

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggle}
      title={dark ? 'Switch to light theme' : 'Switch to dark theme'}
      aria-label={dark ? 'Switch to light theme' : 'Switch to dark theme'}
    >
      {dark ? '☀️' : '🌙'}
    </Button>
  )
}
