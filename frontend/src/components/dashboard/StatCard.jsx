import { Card } from '@/components/ui/card';
import Skeleton from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';

export default function StatCard({ icon: Icon, label, value, tone = 'default', loading = false }) {
  if (loading) {
    return (
      <Card className="flex items-center gap-4 p-5">
        <Skeleton className="size-11 shrink-0" />
        <div className="flex min-w-0 flex-1 flex-col gap-2">
          <Skeleton className="h-6 w-14" />
          <Skeleton className="h-3 w-20" />
        </div>
      </Card>
    );
  }

  return (
    <Card className="flex items-center gap-4 p-5">
      <span
        className={cn(
          'flex size-11 shrink-0 items-center justify-center rounded-md',
          tone === 'primary' ? 'bg-accent text-primary' : 'bg-secondary text-foreground',
        )}
      >
        <Icon className="size-5" aria-hidden="true" />
      </span>
      <div className="min-w-0">
        <p className="text-2xl font-bold text-foreground">{value}</p>
        <p className="truncate text-xs text-muted-foreground">{label}</p>
      </div>
    </Card>
  );
}
