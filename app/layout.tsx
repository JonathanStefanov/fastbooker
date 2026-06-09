import './globals.css';
import type { ReactNode } from 'react';

export const metadata = {
  title: 'FastBooker',
  description: 'Unofficial library booking tool for educational purposes',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return children;
}
