import './(home)/globals.css';
import { Quicksand } from 'next/font/google';
import { UniversityProvider } from '@/components/UniversityContext';
import { EmailProvider } from '@/components/EmailContext';
import QueryProvider from '@/components/QueryProvider';
import { twMerge } from 'tailwind-merge';
import { Analytics } from '@vercel/analytics/react';
import type { ReactNode } from 'react';

const inter = Quicksand({ subsets: ['latin'], weight: ['400'] });

export const metadata = {
  title: 'FastBooker — University Library Seat Booking',
  description: 'Unofficial library booking tool for educational purposes - Not affiliated with Affluences',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className={twMerge(inter.className, 'bg-gradient-to-br from-gray-50 to-gray-100 flex flex-col min-h-screen')}>
        <QueryProvider>
          <UniversityProvider>
            <EmailProvider>
              {children}
            </EmailProvider>
          </UniversityProvider>
        </QueryProvider>
        <Analytics />
      </body>
    </html>
  );
}
