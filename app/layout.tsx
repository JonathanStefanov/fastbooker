import './globals.css';
import type { ReactNode } from 'react';

export const metadata = {
  title: 'FastBooker — University Library Seat Booking',
  description: 'Unofficial library booking tool for educational purposes - Not affiliated with Affluences',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return children;
}
