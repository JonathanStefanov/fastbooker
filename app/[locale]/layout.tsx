import { Quicksand } from 'next/font/google';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import UNavbar from '@/components/UNavbar';
import Footer from '@/components/Footer';
import DisclaimerModal from '@/components/DisclaimerModal';
import EmailModal from '@/components/EmailModal';
import UniversitySelectModalWrapper from '@/components/UniversitySelectModalWrapper';
import { twMerge } from 'tailwind-merge';
import { Analytics } from '@vercel/analytics/react';
import QueryProvider from '@/components/QueryProvider';
import { UniversityProvider } from '@/components/UniversityContext';
import { EmailProvider } from '@/components/EmailContext';
import type { ReactNode } from 'react';

const inter = Quicksand({ subsets: ['latin'], weight: ['400'] });

export default async function RootLayout({ children, params }: { children: ReactNode; params: { locale: string } }) {
  const { locale } = params;
  const messages = await getMessages();

  return (
    <html lang={locale}>
      <body className={twMerge(inter.className, 'bg-gradient-to-br from-gray-50 to-gray-100 flex flex-col min-h-screen')}>
        <QueryProvider>
          <UniversityProvider>
            <EmailProvider>
              <NextIntlClientProvider messages={messages}>
                <DisclaimerModal />
                <EmailModal />
                <UniversitySelectModalWrapper />
                <UNavbar />
                <main className="flex-grow">
                  {children}
                </main>
                <Footer />
              </NextIntlClientProvider>
            </EmailProvider>
          </UniversityProvider>
        </QueryProvider>
        <Analytics />
      </body>
    </html>
  );
}
