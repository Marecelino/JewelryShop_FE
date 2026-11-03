import { useEffect, useRef } from 'react'
import { useLocation } from 'react-router-dom'

/**
 * Scrolls window to top only when the URL pathname changes.
 * Preserves scroll position when only search/query parameters change (e.g. filters, pagination).
 */
export function ScrollToTop(): null {
  const { pathname } = useLocation()
  const prevPathname = useRef(pathname)

  useEffect(() => {
    if (prevPathname.current !== pathname) {
      window.scrollTo(0, 0)
      prevPathname.current = pathname
    }
  }, [pathname])

  return null
}

