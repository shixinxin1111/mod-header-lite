type SwitchProps = {
  checked: boolean;
  label: string;
  onChange: () => void;
};

export function Switch({ checked, label, onChange }: SwitchProps) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={onChange}
      className={`relative inline-flex h-[18px] w-8 items-center rounded-full transition duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#93c5fd] ${
        checked ? 'bg-[#2563eb]' : 'bg-[#cbd5e1]'
      }`}
    >
      <span
        className={`inline-block h-3.5 w-3.5 rounded-full bg-white shadow-[0_1px_2px_rgba(15,23,42,0.24)] transition duration-200 ${
          checked ? 'translate-x-4' : 'translate-x-0.5'
        }`}
      />
    </button>
  );
}
