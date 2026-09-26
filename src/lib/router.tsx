import { useState, useEffect, useCallback } from 'react'
import type { ReactNode, MouseEvent } from 'react'

/**
 * Minimal hash router — no dependency, works on every static host
 * (GitHub Pages project sites, S3, file://) because routes live in the
 * URL fragment and never need server rewrites.
 */
export function useRoute(): string {
  const [route, setRoute] = useState(() => currentRoute())
  useEffect(() => {
    const onHash = () => setRoute(currentRoute())
    window.addEventListener('hashchange', onHash)
    return () => window.removeEventListener('hashchange', onHash)
  }, [])
  return route
}

function currentRoute(): string {
  const h = window.location.hash
  if (!h || h === '#') return '/'
  return h.startsWith('#') ? h.slice(1) : h
}

export function navigate(route: string): void {
  window.location.hash = route
}

interface LinkProps {
  to: string
  children: ReactNode
  className?: string
  title?: string
}

/** Anchor-based link so middle-click/new-tab still work. */
export function Link({ to, children, className, title }: LinkProps) {
  return (
    <a href={`#${to}`} className={className} title={title}>
      {children}
    </a>
  )
}

/** In-page anchor that scrolls without clobbering the hash route. */
export function useScrollToId(): (id: string) => (e: MouseEvent) => void {
  return useCallback((id: string) => (e: MouseEvent) => {
    e.preventDefault()
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }, [])
}
