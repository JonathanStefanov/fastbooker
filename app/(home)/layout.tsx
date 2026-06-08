import UNavbar from '@/components/UNavbar';
import Footer from '@/components/Footer';
import DisclaimerModal from '@/components/DisclaimerModal';
import EmailModal from '@/components/EmailModal';
import type { ReactNode } from 'react';

export default function HomeLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <DisclaimerModal />
      <EmailModal />
      <UNavbar />
      <main className="flex-grow">
        {children}
      </main>
      <Footer />
    </>
  );
}
