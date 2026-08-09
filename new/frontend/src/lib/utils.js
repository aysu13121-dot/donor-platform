import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs) {
	return twMerge(clsx(inputs));
}

// Azərbaycan mobil nömrəsi: +994XXXXXXXXX və ya 0XXXXXXXXX (boşluq/tire
// çıxarıldıqdan sonra). Backend qarşılığı: app/utils/validators.py.
const PHONE_RE = /^(\+994|0)\d{9}$/;

export function isValidPhone(phone) {
	if (!phone) return false;
	return PHONE_RE.test(phone.replace(/[\s-]/g, ''));
}
