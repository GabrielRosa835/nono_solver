import { useHintInputState } from './useHintInputState';

export type HintInputProps = {
  value: number;
  max: number;
  ariaLabel?: string;
  onChange: (newValue: number) => void;
};

export function HintInput(props: HintInputProps) {  
  const state = useHintInputState(props);
  return (
    <div
      className={`hint-chip ${state.isFocused ? 'hint-chip--focused' : ''}`}
      tabIndex={state.isFocused ? -1 : 0}
      onFocus={(e) => {
        if (!state.isFocused) {
          state.setIsFocused(true);
          state.setDraft(String(state.value));
          requestAnimationFrame(() => {
            state.inputRef.current?.focus();
            state.inputRef.current?.select();
          });
        }
        e.stopPropagation();
      }}
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node | null)) {
          state.commitValue(state.draft);
          state.setIsFocused(false);
        }
      }}
    >
      <button
        type="button"
        className="hint-stepper hint-stepper--dec"
        tabIndex={state.isFocused ? 0 : -1}
        aria-label="Decrease hint"
        disabled={state.value <= 1}
        onMouseDown={(e) => e.preventDefault()}
        onClick={() => state.handleStep(-1)}
      >
        −
      </button>

      <input
        ref={state.inputRef}
        type="text"
        inputMode="numeric"
        aria-label={state.ariaLabel ?? 'Hint value'}
        className="hint-input"
        readOnly={!state.isFocused}
        value={state.isFocused ? state.draft : String(state.value)}
        onChange={(e) => {
          const nextRaw = e.target.value.replace(/[^0-9]/g, '');
          state.setDraft(nextRaw);
          const parsed = Number.parseInt(nextRaw, 10);
          if (!Number.isNaN(parsed)) {
            const clamped = state.clamp(parsed);
            if (clamped !== state.value) {
              state.onChange(clamped);
            }
          }
        }}
        onKeyDown={(e) => {
          if (e.key === 'ArrowUp') {
            e.preventDefault();
            state.handleStep(1);
          } else if (e.key === 'ArrowDown') {
            e.preventDefault();
            state.handleStep(-1);
          } else if (e.key === 'Enter' || e.key === 'Escape') {
            e.preventDefault();
            state.commitValue(state.draft);
            state.setIsFocused(false);
            state.inputRef.current?.blur();
          }
        }}
      />

      <button
        type="button"
        className="hint-stepper hint-stepper--inc"
        tabIndex={state.isFocused ? 0 : -1}
        aria-label="Increase hint"
        disabled={state.value >= state.max}
        onMouseDown={(e) => e.preventDefault()}
        onClick={() => state.handleStep(1)}
      >
        +
      </button>
    </div>
  );
}
