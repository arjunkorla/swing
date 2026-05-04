import './globals.css';
import type { ReactNode } from 'react';
import { ThemeInit } from './components/ThemeInit';

export const metadata = {
  title: 'Create API-integrated application',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <ThemeInit />
        {children}
      </body>
    </html>
  );
}
