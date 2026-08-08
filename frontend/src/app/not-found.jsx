import Link from 'next/link';

import Button from '@/components/ui/button';

// Next.js-in App Router-i bu faylı bilinməyən hər path üçün avtomatik
// göstərir - əvvəlki React Router versiyasında 404 route heç tanımlanmamışdı.
export default function NotFound() {
  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center gap-4 px-4 py-10 text-center">
      <span className="text-6xl font-bold text-primary md:text-7xl">404</span>
      <h1 className="text-xl font-semibold text-foreground">Səhifə tapılmadı</h1>
      <p className="text-sm text-muted-foreground">Axtardığınız səhifə mövcud deyil.</p>
      <Button as={Link} href="/">Ana səhifəyə qayıt</Button>
    </div>
  );
}
