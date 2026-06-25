export function DonorCardSkeleton() {
  return (
    <div className="card p-5 space-y-4">
      <div className="flex items-center gap-3">
        <div className="skeleton w-12 h-12 rounded-full" />
        <div className="space-y-2 flex-1">
          <div className="skeleton h-4 w-32" />
          <div className="skeleton h-3 w-20" />
        </div>
        <div className="skeleton w-12 h-12 rounded-full" />
      </div>
      <div className="space-y-2">
        <div className="skeleton h-3 w-full" />
        <div className="skeleton h-3 w-3/4" />
        <div className="skeleton h-3 w-2/3" />
      </div>
      <div className="flex justify-between">
        <div className="skeleton h-6 w-20 rounded-full" />
        <div className="skeleton h-6 w-16" />
      </div>
    </div>
  );
}

export function TableRowSkeleton({ cols = 5 }) {
  return (
    <tr>
      {Array.from({ length: cols }).map((_, i) => (
        <td key={i} className="px-6 py-4"><div className="skeleton h-4 w-full rounded" /></td>
      ))}
    </tr>
  );
}
