type ConfigImportDialogProps = {
  value: string;
  error: string | null;
  onChange: (value: string) => void;
  onCancel: () => void;
  onConfirm: () => void;
};

export function ConfigImportDialog({
  value,
  error,
  onChange,
  onCancel,
  onConfirm,
}: ConfigImportDialogProps) {
  return (
    <div className="fixed inset-0 z-20 flex items-center justify-center bg-[rgba(15,23,42,0.24)] px-5">
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="config-import-title"
        className="w-full max-w-140 rounded-lg bg-white shadow-[0_18px_44px_rgba(15,23,42,0.18)] ring-1 ring-[#dbe3ee]"
      >
        <div className="border-b border-[#e2e8f0] px-4 py-3">
          <h2
            id="config-import-title"
            className="m-0 text-[14px] font-bold text-[#172033]"
          >
            导入配置
          </h2>
        </div>

        <div className="px-4 py-3">
          <textarea
            autoFocus
            value={value}
            onChange={(event) => onChange(event.target.value)}
            rows={10}
            spellCheck={false}
            placeholder="粘贴当前面板的 JSON 配置"
            className="min-h-45 w-full resize-none rounded-md border border-[#dbe3ee] bg-[#f8fafc] px-3 py-2 font-mono text-[12px] leading-5 text-[#172033] outline-none transition focus:border-[#60a5fa] focus:bg-white focus:shadow-[0_0_0_2px_rgba(37,99,235,0.1)]"
          />

          {error ? (
            <div className="mt-2 rounded-md bg-[#fff1f2] px-3 py-2 text-[12px] font-medium text-[#be123c] ring-1 ring-inset ring-[#fecdd3]">
              {error}
            </div>
          ) : null}
        </div>

        <div className="flex justify-end gap-2 border-t border-[#e2e8f0] px-4 py-3">
          <button
            type="button"
            onClick={onCancel}
            className="inline-flex h-8 items-center rounded-md bg-white px-3 text-[12px] font-bold text-[#475569] ring-1 ring-inset ring-[#cbd5e1] transition hover:bg-[#f8fafc]"
          >
            取消
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="inline-flex h-8 items-center rounded-md bg-[#2563eb] px-3 text-[12px] font-bold text-white transition hover:bg-[#1d4ed8]"
          >
            确定
          </button>
        </div>
      </div>
    </div>
  );
}
