import { useState, useRef } from 'react';
import type { HintInputProps } from './HintInput';

export type HintInputState = {
  isFocused: boolean;
  setIsFocused: (value: boolean) => void;
  draft: string;
  setDraft: (value: string) => void,
  value: number;
  max: number;
  ariaLabel?: string;
  onChange: (newValue: number) => void;
  clamp: (value: number) => number;
  inputRef: React.RefObject<HTMLInputElement | null>;
  commitValue: (raw: string) => void;
  handleStep: (delta: number) => void,
}

export function useHintInputState(props: HintInputProps)
{
  const [isFocused, setIsFocused] = useState(false);
  const [draft, setDraft] = useState<string>(String(props.value));
  const inputRef = useRef<HTMLInputElement | null>(null);

  const clamp = (val: number) => Math.max(1, Math.min(props.max, Math.floor(val)));

  const commitValue = (raw: string) =>
  {
    const parsed = Number.parseInt(raw, 10);
    if (Number.isNaN(parsed))
    {
      setDraft(String(props.value));
      return;
    }
    const next = clamp(parsed);
    setDraft(String(next));
    if (next !== props.value)
    {
      props.onChange(next);
    }
  };

  const handleStep = (delta: number) =>
  {
    const next = clamp(props.value + delta);
    setDraft(String(next));
    if (next !== props.value)
    {
      props.onChange(next);
    }
    inputRef.current?.focus();
  };

  return {
    commitValue,
    handleStep,
    isFocused,
    setIsFocused,
    draft,
    inputRef,
    setDraft,
    clamp,
    value: props.value,
    ariaLabel: props.ariaLabel,
    onChange: props.onChange,
    max: props.max,
  };
}
