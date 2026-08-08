import { cn } from '@/lib/utils';

// Data server-dən gələnə qədər eyni ölçüdə boşluq tutur - məzmun gəldikdə
// səhifə birdən "sıçramasın" deyə. Loading mətni əvəzinə hər yerdə bu istifadə
// olunur.
export default function Skeleton({ className, ...props }) {
  return <div className={cn('animate-pulse rounded-md bg-secondary', className)} {...props} />;
}
