import { Undo2 } from 'lucide-react';

type ConfigToastProps = {
  message: string;
  canUndo: boolean;
  onUndo: () => void;
};

export function ConfigToast({ message, canUndo, onUndo }: ConfigToastProps) {
  return (
    <div className="pointer-events-none absolute bottom-3 left-1/2 z-10 flex max-w-60 -translate-x-1/2 items-center gap-2 rounded-md bg-[#172033] px-3 py-2 text-[12px] font-medium text-white shadow-[0_10px_28px_rgba(15,23,42,0.18)]">
      <span className="min-w-0 truncate">{message}</span>
      {canUndo ? (
        <button
          type="button"
          onClick={onUndo}
          className="pointer-events-auto inline-flex h-6 shrink-0 items-center gap-1 rounded bg-white/10 px-2 text-[11px] font-bold text-white transition hover:bg-white/18"
        >
          <Undo2 className="h-3 w-3" />
          撤销
        </button>
      ) : null}
    </div>
  );
}
