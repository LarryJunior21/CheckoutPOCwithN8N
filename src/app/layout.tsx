'use client';
import { ReactNode, useEffect } from 'react';
import ReactGA from 'react-ga4';
// import Hotjar from '@hotjar/browser'

interface RootLayoutProps {
  children: ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  const GA_ID = process.env.NEXT_PUBLIC_GA_ID;

  useEffect(() => {
    try {
      if (GA_ID) {
        ReactGA.initialize(GA_ID);
        ReactGA.send({ hitType: 'pageview', page: window.location.pathname });
        console.log('ReactGA initialized ✅');
      }
    } catch (e) {
      console.error('ReactGA failed ❌', e);
    }
  }, [])

  return <html><body>{children}</body></html>
}