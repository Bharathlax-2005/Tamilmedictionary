import { useEffect } from 'react'

export default function useAnimateOnScroll(rootRef) {
  useEffect(() => {
    if (!rootRef || !rootRef.current) return
    const root = rootRef.current

    const selector = '.animate-on-scroll, .section-pad, .soft-card, img'
    const elements = root.querySelectorAll(selector)
    if (!('IntersectionObserver' in window)) {
      elements.forEach(el => el.classList.add('is-visible'))
      return
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible')
            // keep observed once visible
            observer.unobserve(entry.target)
          }
        })
      },
      { root: null, rootMargin: '0px 0px -8% 0px', threshold: 0.1 }
    )

    elements.forEach(el => {
      // skip if already visible
      if (!el.classList.contains('is-visible')) observer.observe(el)
    })

    return () => observer.disconnect()
  }, [rootRef])
}
