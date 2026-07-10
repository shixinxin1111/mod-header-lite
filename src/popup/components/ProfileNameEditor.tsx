import { useState } from 'react';

type ProfileNameEditorProps = {
  value: string;
  onCommit: (value: string) => void;
};

export function ProfileNameEditor({ value, onCommit }: ProfileNameEditorProps) {
  const [draft, setDraft] = useState(value);

  const commit = () => {
    const nextValue = draft.trim();

    if (!nextValue) {
      setDraft(value);
      return;
    }

    if (nextValue !== value) {
      onCommit(nextValue);
    }

    setDraft(nextValue);
  };

  return (
    <input
      value={draft}
      onChange={(event) => setDraft(event.target.value)}
      onBlur={commit}
      onKeyDown={(event) => {
        if (event.key === 'Enter') {
          event.currentTarget.blur();
        }

        if (event.key === 'Escape') {
          setDraft(value);
          event.currentTarget.blur();
        }
      }}
      placeholder="配置名称"
      aria-label="配置名称"
      title="点击编辑配置名称"
      className="profile-name-input h-7 min-w-0 flex-1 px-2 text-[14px] font-bold text-[#172033] placeholder:text-[#94a3b8]"
    />
  );
}
