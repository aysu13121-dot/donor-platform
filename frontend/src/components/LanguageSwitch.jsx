'use client';

import { Globe } from 'lucide-react';

import { cn } from '@/lib/utils';
import { useLanguage } from '@/context/LanguageContext';

// Tək kliklə dil dəyişdirən düymə - qutu/border olmadan, nav linkləri ilə
// eyni yüngül mətn stilində ki, sağ tərəfdəki düymələr sırasını
// qabartmasın (əvvəllər borderli qutu idi, "3 düymə" kimi ağır görünürdü).
export default function LanguageSwitch({ className }) {
  const { lang, toggle } = useLanguage();

  return (
    <button
      type="button"
      onClick={toggle}
      className={cn(
        'inline-flex items-center gap-1 text-sm font-medium text-muted-foreground transition-colors hover:text-primary',
        className,
      )}
    >
      <Globe className="size-3.5" aria-hidden="true" />
      {lang === 'az' ? 'EN' : 'AZ'}
    </button>
  );
}
