import type { Metadata } from 'next'
import { Geist, Playfair_Display } from 'next/font/google'
import { Toaster } from 'sonner'
import './globals.css'

const geist = Geist({ subsets: ['latin'], variable: '--font-geist' })
const playfair = Playfair_Display({ subsets: ['latin'], variable: '--font-playfair' })

export const metadata: Metadata = {
  title: { default: 'Melian Event Center', template: '%s | Melian Event Center' },
  description: 'Book beautiful venues for your events at Melian Event Center.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${geist.variable} ${playfair.variable} font-sans antialiased bg-white text-gray-900`}>
        {children}
        <Toaster richColors position="top-right" />
      </body>
    </html>
  )
}
