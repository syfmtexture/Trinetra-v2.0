import type { Metadata } from 'next';
import { Inter, Space_Mono, Syncopate, Oswald, Outfit, DM_Sans } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter', display: 'swap' });
const dmSans = DM_Sans({ subsets: ['latin'], variable: '--font-dm-sans', display: 'swap' });
const spaceMono = Space_Mono({ weight: ['400', '700'], subsets: ['latin'], variable: '--font-mono', display: 'swap' });
const syncopate = Syncopate({ weight: ['400', '700'], subsets: ['latin'], variable: '--font-syncopate', display: 'swap' });
const oswald = Oswald({ subsets: ['latin'], variable: '--font-oswald', display: 'swap' });
const outfit = Outfit({ subsets: ['latin'], variable: '--font-outfit', display: 'swap' });

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
    <html lang="en" suppressHydrationWarning className={`${inter.variable} ${dmSans.variable} ${spaceMono.variable} ${syncopate.variable} ${oswald.variable} ${outfit.variable}`}>
      <body suppressHydrationWarning className="font-sans antialiased">
        {children}
      </body>
    </html>
  );
}
