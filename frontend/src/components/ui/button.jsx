import { cva } from 'class-variance-authority';

import { cn } from '@/lib/utils';

export const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full text-sm font-semibold transition-all duration-200 disabled:pointer-events-none disabled:opacity-60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 [&_svg]:size-4 [&_svg]:shrink-0',
  {
    variants: {
      variant: {
        primary:
          'bg-primary text-primary-foreground shadow-sm hover:bg-primary-hover hover:-translate-y-0.5 hover:shadow-lg hover:shadow-primary/20',
        outline:
          'border-2 border-border text-foreground hover:border-primary hover:text-primary hover:-translate-y-0.5',
        ghost: 'text-muted-foreground hover:bg-secondary hover:text-foreground',
        destructive: 'bg-destructive text-destructive-foreground hover:opacity-90',
        dark: 'bg-foreground text-background hover:opacity-90',
      },
      size: {
        default: 'h-11 px-6',
        sm: 'h-9 px-4 text-[13px]',
        lg: 'h-13 px-8 text-base',
        icon: 'h-9 w-9 rounded-full',
      },
    },
    defaultVariants: { variant: 'primary', size: 'default' },
  },
);

export default function Button({ className, variant, size, as: Comp = 'button', ...props }) {
  return <Comp className={cn(buttonVariants({ variant, size }), className)} {...props} />;
}
