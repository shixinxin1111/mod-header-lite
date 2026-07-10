type ProfileItemProps = {
  name: string;
  active: boolean;
  badge: string;
  onSelect: () => void;
};

export function ProfileItem({
  name,
  active,
  badge,
  onSelect,
}: ProfileItemProps) {
  return (
    <button
      type="button"
      title={name}
      onClick={onSelect}
      className={`relative flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-[12px] font-bold transition duration-150 ${
        active
          ? 'border-2 border-[#2563eb] bg-[#eff6ff] text-[#1d4ed8] shadow-[inset_0_0_0_2px_#fff]'
          : 'border border-[#dbe3ee] bg-white text-[#64748b] hover:border-[#93c5fd] hover:bg-[#f8fbff] hover:text-[#2563eb]'
      }`}
    >
      <span className="pointer-events-none select-none">{badge}</span>
    </button>
  );
}
