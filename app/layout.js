import { Inter } from 'next/font/google';
import { AppRouterCacheProvider } from '@mui/material-nextjs/v16-appRouter';
import Box from '@mui/material/Box';
import Providers from './providers';
import Navbar from '@/components/Navbar';
import './globals.css';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

export const metadata = {
  title: 'BusGo — Bus Booking Demo',
  description: 'A clean demo bus-ticket booking app built with Next.js + MUI.',
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={inter.variable}>
      <body>
        <AppRouterCacheProvider options={{ key: 'mui' }}>
          <Providers>
            <Navbar />
            <Box component="main" sx={{ minHeight: 'calc(100vh - 64px)' }}>
              {children}
            </Box>
          </Providers>
        </AppRouterCacheProvider>
      </body>
    </html>
  );
}
