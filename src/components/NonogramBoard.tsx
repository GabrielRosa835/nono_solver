import { useEffect, useRef, useState } from 'react';
import { type Board } from '../solver/Board';
import { BoardLine } from '../solver/BoardLine';
import { CellStatus } from '../solver/CellStatus';
import { HintInput } from './HintInput';

export type NonogramBoardProps = {
  board: Board;
  onCellClick: (rowIndex: number, colIndex: number) => void;
  onAddHint: (axis: 'row' | 'col', lineIndex: number) => void;
  onRemoveLastHint: (axis: 'row' | 'col', lineIndex: number) => void;
  onUpdateHint: (axis: 'row' | 'col', lineIndex: number, hintIndex: number, newValue: number) => void;
};

export function NonogramBoard({
  board,
  onCellClick,
  onAddHint,
  onRemoveLastHint,
  onUpdateHint,
}: NonogramBoardProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [containerWidth, setContainerWidth] = useState<number>(0);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        setContainerWidth(entry.contentRect.width);
      }
    });

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const maxRowHints = Math.max(1, ...board.rows.map((r) => r.hints.length));
  const estimatedRowHeaderWidth = Math.max(88, maxRowHints * 26 + 36);

  const availableForCells =
    containerWidth > 0 ? containerWidth - estimatedRowHeaderWidth - 16 : 640;
  const computedCellSize = Math.floor(availableForCells / board.size);
  const cellSize = Math.max(18, Math.min(36, computedCellSize));

  return (
    <div ref={containerRef} className="board-viewport">
      <div
        className="nonogram-board"
        style={
          {
            '--cell-size': `${cellSize}px`,
            gridTemplateColumns: `auto repeat(${board.size}, var(--cell-size))`,
            gridTemplateRows: `auto repeat(${board.size}, var(--cell-size))`,
          } as React.CSSProperties
        }
      >
        {/* Top-left corner spacer */}
        <div className="board-corner" aria-hidden="true" />

        {/* Column headers */}
        {board.cols.map((col, colIndex) => {
          const isColDone = col.hints.length > 0 && BoardLine.isCompleted(col);
          const isMajorRight = (colIndex + 1) % 5 === 0 && colIndex !== board.size - 1;
          const canAddColHint = BoardLine.canAddHint(col.hints, board.size);

          return (
            <div
              key={`col-header-${colIndex}`}
              className={`line-header line-header--col ${isColDone ? 'line-header--completed' : ''} ${
                isMajorRight ? 'grid-major-right' : ''
              }`}
            >
              <div className="line-actions line-actions--col" role="group" aria-label={`Column ${colIndex + 1} hint actions`}>
                <button
                  type="button"
                  className="line-action-btn"
                  title={`Remove last hint from column ${colIndex + 1}`}
                  aria-label={`Remove last hint from column ${colIndex + 1}`}
                  disabled={col.hints.length === 0}
                  onClick={() => onRemoveLastHint('col', colIndex)}
                >
                  −
                </button>
                <button
                  type="button"
                  className="line-action-btn"
                  title={`Add hint to column ${colIndex + 1}`}
                  aria-label={`Add hint to column ${colIndex + 1}`}
                  disabled={!canAddColHint}
                  onClick={() => onAddHint('col', colIndex)}
                >
                  +
                </button>
              </div>

              <div className="hint-list hint-list--col">
                {col.hints.map((hint, hintIndex) => {
                  const maxAllowed = BoardLine.getMaxHintValue(col.hints, hintIndex, board.size);
                  return (
                    <HintInput
                      key={`col-${colIndex}-hint-${hintIndex}`}
                      value={hint}
                      max={maxAllowed}
                      ariaLabel={`Column ${colIndex + 1} hint ${hintIndex + 1}`}
                      onChange={(newVal) => onUpdateHint('col', colIndex, hintIndex, newVal)}
                    />
                  );
                })}
              </div>
            </div>
          );
        })}

        {/* Rows (each row has a row header followed by N cells) */}
        {board.rows.map((row, rowIndex) => {
          const isRowDone = row.hints.length > 0 && BoardLine.isCompleted(row);
          const isMajorBottom = (rowIndex + 1) % 5 === 0 && rowIndex !== board.size - 1;
          const canAddRowHint = BoardLine.canAddHint(row.hints, board.size);

          return (
            <div key={`row-group-${rowIndex}`} className="board-row-contents">
              <div
                className={`line-header line-header--row ${isRowDone ? 'line-header--completed' : ''} ${
                  isMajorBottom ? 'grid-major-bottom' : ''
                }`}
              >
                <div className="line-actions line-actions--row" role="group" aria-label={`Row ${rowIndex + 1} hint actions`}>
                  <button
                    type="button"
                    className="line-action-btn"
                    title={`Add hint to row ${rowIndex + 1}`}
                    aria-label={`Add hint to row ${rowIndex + 1}`}
                    disabled={!canAddRowHint}
                    onClick={() => onAddHint('row', rowIndex)}
                  >
                    +
                  </button>
                  <button
                    type="button"
                    className="line-action-btn"
                    title={`Remove last hint from row ${rowIndex + 1}`}
                    aria-label={`Remove last hint from row ${rowIndex + 1}`}
                    disabled={row.hints.length === 0}
                    onClick={() => onRemoveLastHint('row', rowIndex)}
                  >
                    −
                  </button>
                </div>

                <div className="hint-list hint-list--row">
                  {row.hints.map((hint, hintIndex) => {
                    const maxAllowed = BoardLine.getMaxHintValue(row.hints, hintIndex, board.size);
                    return (
                      <HintInput
                        key={`row-${rowIndex}-hint-${hintIndex}`}
                        value={hint}
                        max={maxAllowed}
                        ariaLabel={`Row ${rowIndex + 1} hint ${hintIndex + 1}`}
                        onChange={(newVal) => onUpdateHint('row', rowIndex, hintIndex, newVal)}
                      />
                    );
                  })}
                </div>
              </div>

              {row.cells.map((cell, colIndex) => {
                const isMajorRight = (colIndex + 1) % 5 === 0 && colIndex !== board.size - 1;
                const statusName = CellStatus.detail(cell.status);

                return (
                  <button
                    key={`cell-${rowIndex}-${colIndex}`}
                    type="button"
                    className={`board-cell board-cell--${statusName} ${
                      isMajorRight ? 'grid-major-right' : ''
                    } ${isMajorBottom ? 'grid-major-bottom' : ''}`}
                    aria-label={`Row ${rowIndex + 1}, Column ${colIndex + 1}: ${statusName}`}
                    onClick={() => onCellClick(rowIndex, colIndex)}
                  >
                    {cell.status === CellStatus.Empty && (
                      <span className="cell-cross" aria-hidden="true">
                        ×
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          );
        })}
      </div>
    </div>
  );
}
