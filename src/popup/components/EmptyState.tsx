type EmptyStateProps = {
  title: string;
  description: string;
  actionLabel: string;
  onAction: () => void;
};

export function EmptyState({
  title,
  description,
  actionLabel,
  onAction,
}: EmptyStateProps) {
  return (
    <div className="flex h-full min-h-0 flex-col items-center justify-center gap-2 bg-white px-3 text-center">
      <h3 className="text-[13px] font-semibold text-[#334155]">{title}</h3>
      <p className="max-w-sm text-[11px] leading-4 text-[#94a3b8]">
        {description}
      </p>
      <button
        type="button"
        onClick={onAction}
        className="inline-flex h-7 items-center justify-center rounded-md bg-[#2563eb] px-3 text-[11px] font-semibold text-white transition hover:bg-[#1d4ed8]"
      >
        {actionLabel}
      </button>
    </div>
  );
}
