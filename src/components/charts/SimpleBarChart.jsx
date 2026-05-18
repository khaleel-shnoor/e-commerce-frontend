import { cn } from '../../lib/utils';

export function SimpleBarChart({ data, dataKey = 'revenue', labelKey = 'month', className }) {
  const max = Math.max(...data.map((d) => d[dataKey]));

  return (
    <figure className={cn('space-y-4', className)}>
      <div className="flex items-end gap-2 h-48">
        {data.map((item) => {
          const height = max ? (item[dataKey] / max) * 100 : 0;
          return (
            <div key={item[labelKey]} className="flex-1 flex flex-col items-center gap-2">
              <div
                className="w-full bg-foreground rounded-t-lg transition-all hover:opacity-80 min-h-[4px]"
                style={{ height: `${height}%` }}
                title={`${item[labelKey]}: ${item[dataKey]}`}
              />
              <span className="text-xs text-muted-foreground">{item[labelKey]}</span>
            </div>
          );
        })}
      </div>
    </figure>
  );
}

