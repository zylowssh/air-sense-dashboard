import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';

interface LoadingSkeletonProps {
  variant?: 'card' | 'table' | 'chart' | 'list' | 'sensor' | 'kpi';
  count?: number;
  className?: string;
}

export function LoadingSkeleton({ variant = 'card', count = 1, className }: LoadingSkeletonProps) {
  const items = Array.from({ length: count }, (_, i) => i);

  if (variant === 'kpi') {
    return (
      <div className={cn("grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4", className)}>
        {items.map((i) => (
          <div key={i} className="p-5 rounded-xl bg-card border border-border">
            <div className="flex items-center justify-between mb-3">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-8 w-8 rounded-lg" />
            </div>
            <Skeleton className="h-8 w-20 mb-2" />
            <Skeleton className="h-3 w-16" />
          </div>
        ))}
      </div>
    );
  }

  if (variant === 'sensor') {
    return (
      <div className={cn("grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4", className)}>
        {items.map((i) => (
          <div key={i} className="p-5 rounded-xl bg-card border border-border">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <Skeleton className="h-10 w-10 rounded-lg" />
                <div>
                  <Skeleton className="h-4 w-32 mb-2" />
                  <Skeleton className="h-3 w-24" />
                </div>
              </div>
              <Skeleton className="h-6 w-16 rounded-full" />
            </div>
            <div className="space-y-3">
              <div className="flex justify-between">
                <Skeleton className="h-4 w-12" />
                <Skeleton className="h-4 w-16" />
              </div>
              <div className="flex justify-between">
                <Skeleton className="h-4 w-16" />
                <Skeleton className="h-4 w-12" />
              </div>
              <div className="flex justify-between">
                <Skeleton className="h-4 w-14" />
                <Skeleton className="h-4 w-10" />
              </div>
            </div>
            <Skeleton className="h-12 w-full mt-4 rounded-lg" />
          </div>
        ))}
      </div>
    );
  }

  if (variant === 'chart') {
    return (
      <div className={cn("p-5 rounded-xl bg-card border border-border", className)}>
        <div className="flex items-center justify-between mb-4">
          <Skeleton className="h-5 w-40" />
          <div className="flex gap-2">
            <Skeleton className="h-8 w-16 rounded-md" />
            <Skeleton className="h-8 w-16 rounded-md" />
          </div>
        </div>
        <Skeleton className="h-64 w-full rounded-lg" />
      </div>
    );
  }

  if (variant === 'table') {
    return (
      <div className={cn("rounded-xl bg-card border border-border overflow-hidden", className)}>
        <div className="p-4 border-b border-border">
          <Skeleton className="h-5 w-32" />
        </div>
        <div className="p-4">
          <div className="flex gap-4 mb-4">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-4 w-16" />
            <Skeleton className="h-4 w-20" />
          </div>
          {items.map((i) => (
            <div key={i} className="flex gap-4 py-3 border-b border-border last:border-0">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-4 w-16" />
              <Skeleton className="h-4 w-20" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (variant === 'list') {
    return (
      <div className={cn("space-y-3", className)}>
        {items.map((i) => (
          <div key={i} className="flex items-center gap-4 p-4 rounded-lg bg-card border border-border">
            <Skeleton className="h-10 w-10 rounded-full" />
            <div className="flex-1">
              <Skeleton className="h-4 w-40 mb-2" />
              <Skeleton className="h-3 w-24" />
            </div>
            <Skeleton className="h-8 w-20 rounded-md" />
          </div>
        ))}
      </div>
    );
  }

  // Default card variant
  return (
    <div className={cn("grid gap-4", className)}>
      {items.map((i) => (
        <div key={i} className="p-5 rounded-xl bg-card border border-border">
          <Skeleton className="h-5 w-32 mb-4" />
          <Skeleton className="h-4 w-full mb-2" />
          <Skeleton className="h-4 w-3/4" />
        </div>
      ))}
    </div>
  );
}
