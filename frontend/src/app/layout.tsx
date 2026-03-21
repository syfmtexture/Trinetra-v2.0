import type { Metadata } from 'next';
import { Inter, Space_Mono, Syncopate } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const spaceMono = Space_Mono({ weight: ['400', '700'], subsets: ['latin'], variable: '--font-mono' });
const syncopate = Syncopate({ weight: ['400', '700'], subsets: ['latin'], variable: '--font-syncopate' });

export const metadata: Metadata = {
  title: 'Trinetra V2 - Glassbox Dashboard',
  description: 'Forensic Investigation Dashboard for Deepfake Detection',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning className={`${inter.variable} ${spaceMono.variable} ${syncopate.variable}`}>
      <body suppressHydrationWarning className="text-[#212529] min-h-screen font-sans selection:bg-[#FF6B00] selection:text-white">
        {children}
      </body>
    </html>
  );
}
