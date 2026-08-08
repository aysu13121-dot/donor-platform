import './globals.css';

import { AuthProvider } from '@/context/AuthContext';
import { LanguageProvider } from '@/context/LanguageContext';

export const metadata = {
  title: 'QanDonoru.az - Qan Donoru Platforması',
  description:
    'Azərbaycan üzrə təcili qan donorluğu platforması. Təcili qan ehtiyaclarını bildirin, donor tapın və ya donor olaraq həyat qurtarın.',
  icons: { icon: '/favicon.svg' },
};

export default function RootLayout({ children }) {
  return (
    <html lang="az">
      <body>
        <LanguageProvider>
          <AuthProvider>{children}</AuthProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}
