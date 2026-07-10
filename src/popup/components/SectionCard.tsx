import type { PropsWithChildren, ReactNode } from 'react';

type SectionCardProps = PropsWithChildren<{
  title: string;
  actions?: ReactNode;
}>;

export function SectionCard({ title, actions, children }: SectionCardProps) {
  return (
    <section className="flex min-h-0 flex-1 flex-col overflow-hidden border-b border-[#e2e8f0] bg-white">
      <div className="flex h-8 items-center justify-between gap-3 border-b border-[#e2e8f0] bg-white px-2">
        <h2 className="truncate text-[12px] font-bold text-[#334155]">
          {title}
        </h2>
        {actions ? <div className="shrink-0">{actions}</div> : null}
      </div>
      <div className="min-h-0 flex-1">{children}</div>
    </section>
  );
}
