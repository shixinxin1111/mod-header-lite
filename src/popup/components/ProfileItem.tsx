import { useLayoutEffect, useRef, useState } from 'react';

type ProfileItemProps = {
  name: string;
  active: boolean;
  onSelect: () => void;
};

export function ProfileItem({ name, active, onSelect }: ProfileItemProps) {
  const labelWrapRef = useRef<HTMLSpanElement>(null);
  const labelRef = useRef<HTMLSpanElement>(null);
  const [labelScale, setLabelScale] = useState(1);

  useLayoutEffect(() => {
    const labelWrap = labelWrapRef.current;
    const label = labelRef.current;

    if (!labelWrap || !label) {
      return;
    }

    const updateScale = () => {
      const availableWidth = labelWrap.clientWidth;
      const labelWidth = label.scrollWidth;

      setLabelScale(
        availableWidth > 0 && labelWidth > availableWidth
          ? availableWidth / labelWidth
          : 1,
      );
    };

    updateScale();

    const resizeObserver = new ResizeObserver(updateScale);
    resizeObserver.observe(labelWrap);
    resizeObserver.observe(label);

    return () => resizeObserver.disconnect();
  }, [name]);

  return (
    <button
      type="button"
      title={name}
      onClick={onSelect}
      className={`relative flex h-9 w-full shrink-0 items-center justify-center overflow-hidden rounded-lg px-2 text-[12px] font-bold transition duration-150 ${
        active
          ? 'border-2 border-[#2563eb] bg-[#eff6ff] text-[#1d4ed8] shadow-[inset_0_0_0_2px_#fff]'
          : 'border border-[#dbe3ee] bg-white text-[#64748b] hover:border-[#93c5fd] hover:bg-[#f8fbff] hover:text-[#2563eb]'
      }`}
    >
      <span
        ref={labelWrapRef}
        className="pointer-events-none flex min-w-0 flex-1 justify-center overflow-hidden"
      >
        <span
          ref={labelRef}
          className="block w-max origin-center select-none whitespace-nowrap leading-none"
          style={{ transform: `scaleX(${labelScale})` }}
        >
          {name.trim() || '配置'}
        </span>
      </span>
    </button>
  );
}
