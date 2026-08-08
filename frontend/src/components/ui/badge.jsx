import { cva } from 'class-variance-authority';

import { cn } from '@/lib/utils';

// Bütün status/aciliyyət pill-ləri üçün tək mənbə - dashboard, donors və
// requests səhifələri əvvəllər öz cn() bloklarını təkrarlayırdı, indi hamısı
// buradan keçir.
export const badgeVariants = cva(
  'inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-[11px] font-medium [&_svg]:size-3',
  {
    variants: {
      variant: {
        default: 'bg-secondary text-muted-foreground',
        accent: 'bg-accent text-accent-foreground',
        success: 'bg-emerald-50 text-emerald-700',
        warning: 'bg-amber-50 text-amber-700',
        destructive: 'bg-red-50 text-destructive',
        outline: 'border border-border text-foreground',
      },
    },
    defaultVariants: { variant: 'default' },
  },
);

export default function Badge({ className, variant, icon: Icon, children, ...props }) {
  return (
    <span className={cn(badgeVariants({ variant }), className)} {...props}>
      {Icon && <Icon aria-hidden="true" />}
      {children}
    </span>
  );
}
