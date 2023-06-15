import './globals.css'
import { Quicksand } from 'next/font/google'
import UNavbar from '@/components/UNavbar'
import { twMerge } from 'tailwind-merge'
import { Analytics } from '@vercel/analytics/react';

const inter = Quicksand({ subsets: ['latin'], weight: ['400'] })

export const metadata = {
  title: 'ULB Fast Booker',
  description: 'Generated by create next app',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={twMerge(inter.className, 'bg-sky-200')}>
        <UNavbar/>
        {children}
        <Analytics/>
        </body>
    </html>
  )
}
