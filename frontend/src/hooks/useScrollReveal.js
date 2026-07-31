import { useEffect } from 'react'

/**
 * Activates scroll-reveal animations site-wide.
 * Observes all .reveal, .reveal-left, .reveal-right, .reveal-scale, .reveal-fade
 * elements and toggles .visible when they enter the viewport.
 *
 * Also handles stagger-container children by adding sequential delays.
 */
export default function useScrollReveal() {
  useEffect(() => {
    const selectors = ['.reveal', '.reveal-left', '.reveal-right', '.reveal-scale', '.reveal-fade']
    const nodes = document.querySelectorAll(selectors.join(','))

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible')
            observer.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    )

    nodes.forEach((el) => observer.observe(el))

    return () => observer.disconnect()
  })
}
