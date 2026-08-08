import './globals.css';

import { cookies } from 'next/headers';

import { AuthProvider } from '@/context/AuthContext';
import { LanguageProvider } from '@/context/LanguageContext';

export const metadata = {
  title: 'Donor.az - Qan Donorluğu Platforması',
  description:
    'Azərbaycan üzrə təcili qan donorluğu platforması. Təcili qan ehtiyaclarını bildirin, donor tapın və ya donor olaraq həyat qurtarın.',
  icons: { icon: '/favicon.svg' },
};

export default async function RootLayout({ children }) {
  // Dil seçimi cookie-dən oxunur ki, server ilk render-i birbaşa düzgün
  // dildə göndərsin - client-də sonradan "AZ-dan EN-ə keçid" yanıb-sönməsi
  // olmasın (bax: LanguageContext.jsx).
  const cookieStore = await cookies();
  const lang = cookieStore.get('lang')?.value === 'en' ? 'en' : 'az';

  return (
    <html lang={lang}>
      <body>
        <LanguageProvider initialLang={lang}>
          <AuthProvider>{children}</AuthProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}
