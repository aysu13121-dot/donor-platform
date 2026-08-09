import { ChevronDown } from 'lucide-react';

import { cn } from '@/lib/utils';

export function Input({ className, ...props }) {
  return (
    <input
      className={cn(
        'h-10 w-full rounded-md border border-input bg-card px-3.5 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground/70 focus:border-primary focus:ring-4 focus:ring-primary/10',
        className,
      )}
      {...props}
    />
  );
}

export function Textarea({ className, ...props }) {
  return (
    <textarea
      className={cn(
        'w-full resize-none rounded-md border border-input bg-card px-3.5 py-2.5 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground/70 focus:border-primary focus:ring-4 focus:ring-primary/10',
        className,
      )}
      {...props}
    />
  );
}

// Native <select> ox-işarəsi brauzerdən brauzerə fərqli görünür və
// tətbiqin özəl input stilindən qopur - `appearance-none` ilə gizlədilir,
// yerinə tək tərz üçün öz ChevronDown ikonumuz qoyulur.
export function Select({ className, ...props }) {
  return (
    <div className={cn('relative', className)}>
      <select
        className="h-10 w-full appearance-none rounded-md border border-input bg-card px-3.5 pr-9 text-sm text-foreground outline-none transition-colors focus:border-primary focus:ring-4 focus:ring-primary/10"
        {...props}
      />
      <ChevronDown
        className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
        aria-hidden="true"
      />
    </div>
  );
}

export function Label({ className, ...props }) {
  return <label className={cn('text-[13px] font-semibold text-foreground', className)} {...props} />;
}
