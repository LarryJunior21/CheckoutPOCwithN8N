import { ReactNode } from 'react'
import GA4Provider from '@/components/analytics/ga4-provider'

interface RootLayoutProps {
  children: ReactNode
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en">
      <body>
        <GA4Provider />
        {children}
      </body>
    </html>
  )
}
