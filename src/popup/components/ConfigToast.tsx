type ConfigToastProps = {
  message: string;
};

export function ConfigToast({ message }: ConfigToastProps) {
  return (
    <div className="pointer-events-none absolute bottom-3 left-1/2 z-10 flex max-w-60 -translate-x-1/2 items-center gap-2 rounded-md bg-[#172033] px-3 py-2 text-[12px] font-medium text-white shadow-[0_10px_28px_rgba(15,23,42,0.18)]">
      <span className="min-w-0 truncate">{message}</span>
    </div>
  );
}
