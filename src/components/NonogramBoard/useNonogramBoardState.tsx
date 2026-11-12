import React from 'react';
import type { NonogramBoardProps } from './NonogramBoard';

export type NonogramBoardState = {
  containerRef: React.RefObject<HTMLDivElement | null>;
  cellSize: number;
}

export function useNonogramBoardState(props: NonogramBoardProps)
{
  const containerRef = React.useRef<HTMLDivElement | null>(null);
  const [containerWidth, setContainerWidth] = React.useState<number>(0);

  React.useEffect(() =>
  {
    const el = containerRef.current;
    if (!el) return;

    const observer = new ResizeObserver((entries) =>
    {
      for (const entry of entries)
      {
        setContainerWidth(entry.contentRect.width);
      }
    });

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const maxRowHints = Math.max(1, ...props.board.rows.map((r) => r.hints.length));
  const estimatedRowHeaderWidth = Math.max(88, maxRowHints * 26 + 36);

  const availableForCells = containerWidth > 0 ? containerWidth - estimatedRowHeaderWidth - 16 : 640;
  const computedCellSize = Math.floor(availableForCells / props.board.size);
  const cellSize = Math.max(18, Math.min(36, computedCellSize));

  return {
    cellSize,
    containerRef,
  };
}
