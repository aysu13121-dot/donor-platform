import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';

export default function StatCard({ icon: Icon, label, value, tone = 'default' }) {
  return (
    <Card className="flex items-center gap-4 p-5">
      <span
        className={cn(
          'flex size-11 shrink-0 items-center justify-center rounded-xl',
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
