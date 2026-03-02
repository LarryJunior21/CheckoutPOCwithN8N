'use client'

import { useEffect } from 'react'
import ReactGA from 'react-ga4'

export default function GA4Provider() {
  useEffect(() => {
    const gaId = process.env.NEXT_PUBLIC_GA_ID
    if (gaId) {
      ReactGA.initialize(gaId)
      ReactGA.send({ hitType: 'pageview', page: window.location.pathname })
    }
  }, [])

  return null
}
