import Link from 'next/link';

// Next.js-in App Router-i bu faylı bilinməyən hər path üçün avtomatik
// göstərir - əvvəlki React Router versiyasında 404 route heç tanımlanmamışdı.
export default function NotFound() {
  return (
    <div className="not-found-page">
      <span className="not-found-page__code">404</span>
      <h1 className="auth-title">Səhifə tapılmadı</h1>
      <p className="auth-sub">Axtardığınız səhifə mövcud deyil.</p>
      <Link href="/" className="btn-primary">Ana səhifəyə qayıt</Link>
    </div>
  );
}
