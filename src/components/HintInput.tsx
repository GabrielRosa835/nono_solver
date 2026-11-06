import { useRef, useState } from 'react';

export type HintInputProps = {
  value: number;
  max: number;
  ariaLabel?: string;
  onChange: (newValue: number) => void;
};

export function HintInput({ value, max, ariaLabel, onChange }: HintInputProps) {
  const [isFocused, setIsFocused] = useState(false);
  const [draft, setDraft] = useState<string>(String(value));
  const inputRef = useRef<HTMLInputElement | null>(null);

  const clamp = (val: number) => Math.max(1, Math.min(max, Math.floor(val)));

  const commitValue = (raw: string) => {
    const parsed = Number.parseInt(raw, 10);
    if (Number.isNaN(parsed)) {
      setDraft(String(value));
      return;
    }
    const next = clamp(parsed);
    setDraft(String(next));
    if (next !== value) {
      onChange(next);
    }
  };

  const handleStep = (delta: number) => {
    const next = clamp(value + delta);
    setDraft(String(next));
    if (next !== value) {
      onChange(next);
    }
    inputRef.current?.focus();
  };

  return (
    <div
      className={`hint-chip ${isFocused ? 'hint-chip--focused' : ''}`}
      tabIndex={isFocused ? -1 : 0}
      onFocus={(e) => {
        if (!isFocused) {
          setIsFocused(true);
          setDraft(String(value));
          requestAnimationFrame(() => {
            inputRef.current?.focus();
            inputRef.current?.select();
          });
        }
        e.stopPropagation();
      }}
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node | null)) {
          commitValue(draft);
          setIsFocused(false);
        }
      }}
    >
      <button
        type="button"
        className="hint-stepper hint-stepper--dec"
        tabIndex={isFocused ? 0 : -1}
        aria-label="Decrease hint"
        disabled={value <= 1}
        onMouseDown={(e) => e.preventDefault()}
        onClick={() => handleStep(-1)}
      >
        −
      </button>

      <input
        ref={inputRef}
        type="text"
        inputMode="numeric"
        aria-label={ariaLabel ?? 'Hint value'}
        className="hint-input"
        readOnly={!isFocused}
        value={isFocused ? draft : String(value)}
        onChange={(e) => {
          const nextRaw = e.target.value.replace(/[^0-9]/g, '');
          setDraft(nextRaw);
          const parsed = Number.parseInt(nextRaw, 10);
          if (!Number.isNaN(parsed)) {
            const clamped = clamp(parsed);
            if (clamped !== value) {
              onChange(clamped);
            }
          }
        }}
        onKeyDown={(e) => {
          if (e.key === 'ArrowUp') {
            e.preventDefault();
            handleStep(1);
          } else if (e.key === 'ArrowDown') {
            e.preventDefault();
            handleStep(-1);
          } else if (e.key === 'Enter' || e.key === 'Escape') {
            e.preventDefault();
            commitValue(draft);
            setIsFocused(false);
            inputRef.current?.blur();
          }
        }}
      />

      <button
        type="button"
        className="hint-stepper hint-stepper--inc"
        tabIndex={isFocused ? 0 : -1}
        aria-label="Increase hint"
        disabled={value >= max}
        onMouseDown={(e) => e.preventDefault()}
        onClick={() => handleStep(1)}
      >
        +
      </button>
    </div>
  );
}
