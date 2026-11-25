import type { Metadata } from 'next';
import './globals.css';
import './premium.css';
import './three-studio.css';
import './section-refinements.css';
import './studio-polish.css';
import './upload-download.css';
import './rack-cart.css';
export const metadata: Metadata = { title: 'ZL — Roots run deep. Wear yours.', description: 'Moroccan streetwear. Discover oversized hoodies or create your own. Prices in MAD, delivery across Morocco, payment on delivery.' };
export default function RootLayout({children}:{children:React.ReactNode}) { return <html lang="fr"><body>{children}</body></html>; }
