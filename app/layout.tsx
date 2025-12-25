import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Sysmoon Dashboard',
  description: 'Real-time monitoring and event tracking system',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
