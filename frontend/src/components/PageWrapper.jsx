import { useEffect, useRef, useState } from 'react'
import { useLocation } from 'react-router-dom'
import useScrollReveal from '../hooks/useScrollReveal'

export default function PageWrapper({ children }) {
  const location = useLocation()
  const [mounted, setMounted] = useState(false)

  // Activate scroll-reveal on every page/content change
  useScrollReveal()

  useEffect(() => {
    setMounted(false)
    window.scrollTo({ top: 0, behavior: 'instant' })
    const t = setTimeout(() => setMounted(true), 20)
    return () => clearTimeout(t)
  }, [location.pathname])

  return (
    <div
      className={`page-transition ${mounted ? 'is-mounted' : ''}`}
      key={location.pathname}
      style={{ transition: 'opacity 0.35s ease, transform 0.35s ease' }}
    >
      {children}
    </div>
  )
}
