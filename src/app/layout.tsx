'use client'
import { ReactNode, useEffect } from 'react';
import ReactGA from 'react-ga4';

interface RootLayoutProps {
  children: ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  const GA_ID = process.env.NEXT_PUBLIC_GA_ID;
  const FS_ORG_ID = process.env.NEXT_PUBLIC_FULLSTORY_ORGID;

  useEffect(() => {
    // --- GA4 ---
    if (GA_ID) {
      ReactGA.initialize(GA_ID);
      ReactGA.send({ hitType: 'pageview', page: window.location.pathname });
      console.log('ReactGA initialized ✅');
    }

    // --- FullStory ---
    if (FS_ORG_ID && typeof window !== 'undefined') {
      // Create the script element pointing to FullStory
      const fsScript = document.createElement('script');
      fsScript.src = `https://edge.fullstory.com/s/fs.js`;
      fsScript.async = true;
      fsScript.crossOrigin = 'anonymous';

      // Set the required FullStory globals before loading
      window['_fs_org'] = FS_ORG_ID;
      window['_fs_namespace'] = 'FS';
      window['_fs_host'] = 'fullstory.com';
      window['_fs_script'] = 'edge.fullstory.com/s/fs.js';

      document.head.appendChild(fsScript);
      console.log('FullStory snippet loaded ✅');
    }
  }, []);

  return <html><body>{children}</body></html>;
}