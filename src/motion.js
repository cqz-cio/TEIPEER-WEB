const revealSelectors = [
  '.hero-content > *',
  '.fact-item',
  '.section-heading',
  '.section-copy > *',
  '.about-figure',
  '.business-card',
  '.capability-item',
  '.purpose-copy article',
  '.map-image',
  '.insight-card',
  '.contact-inner > *',
  '.about-hero-copy > *',
  '.knowledge-hero-copy > *',
  '.contact-hero-copy > *',
  '.business-hero-copy > *',
  '.about-content > *',
  '.knowledge-shell > *',
  '.business-shell > *',
  '.contact-section-heading > *',
  '.contact-direct',
  '.contact-process-grid article',
  '.contact-trust-grid article',
  '.news-feature-card',
  '.news-card',
  '.global-footer-main > *',
].join(',')

export const createMotionController = () => {
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)')
  let observer

  const ensureObserver = () => {
    if (observer || reducedMotion.matches || !('IntersectionObserver' in window)) return
    observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return
          entry.target.classList.add('is-visible')
          observer.unobserve(entry.target)
        })
      },
      { rootMargin: '0px 0px -24px 0px', threshold: 0.01 },
    )
  }

  const observe = () => {
    document.documentElement.classList.add('motion-enabled')
    ensureObserver()

    document.querySelectorAll(revealSelectors).forEach((element) => {
      if (element.dataset.motionReveal) return

      const siblings = [...(element.parentElement?.children || [])]
      const siblingIndex = Math.max(0, siblings.indexOf(element))
      element.dataset.motionReveal = 'true'
      element.style.setProperty('--reveal-delay', `${Math.min(siblingIndex, 4) * 40}ms`)
      element.classList.add('motion-reveal')

      if (reducedMotion.matches || !observer) element.classList.add('is-visible')
      else observer?.observe(element)
    })
  }

  const handleMotionPreference = () => {
    if (!reducedMotion.matches) return
    observer?.disconnect()
    observer = undefined
    document.querySelectorAll('.motion-reveal').forEach(element => element.classList.add('is-visible'))
  }
  reducedMotion.addEventListener('change', handleMotionPreference)

  const destroy = () => {
    reducedMotion.removeEventListener('change', handleMotionPreference)
    observer?.disconnect()
    observer = undefined
    document.documentElement.classList.remove('motion-enabled')
  }

  return { observe, destroy }
}
