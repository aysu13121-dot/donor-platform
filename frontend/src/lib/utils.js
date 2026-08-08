import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

// shadcn-tərzi className birləşdiricisi: şərtli class-ları (clsx) yığır,
// üst-üstə düşən Tailwind utility-lərini (məs. iki fərqli "px-*") twMerge
// ilə düzgün həll edir.
export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

// Azərbaycan mobil nömrə formatı: +994XXXXXXXXX və ya 0XXXXXXXXX (boşluq/tire
// çıxarıldıqdan sonra). Signup və dashboard profil formaları paylaşır -
// backend-dəki eyni qaydanın (auth.py PHONE_RE) frontend qarşılığıdır.
const PHONE_RE = /^(\+994|0)\d{9}$/;

export function isValidPhone(phone) {
  return PHONE_RE.test(String(phone).replace(/[\s-]/g, ''));
}
