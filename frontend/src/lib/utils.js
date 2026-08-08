import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

// shadcn-tərzi className birləşdiricisi: şərtli class-ları (clsx) yığır,
// üst-üstə düşən Tailwind utility-lərini (məs. iki fərqli "px-*") twMerge
// ilə düzgün həll edir.
export function cn(...inputs) {
  return twMerge(clsx(inputs));
}
