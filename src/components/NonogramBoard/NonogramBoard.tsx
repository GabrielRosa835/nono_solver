import React from 'react';
import { type Board } from '../../solver/Board';
import { BoardLine } from '../../solver/BoardLine';
import { CellStatus } from '../../solver/CellStatus';
import { HintInput } from '../HintInput/HintInput';
import { useNonogramBoardState } from './useNonogramBoardState';

export type NonogramBoardProps = {
  board: Board;
  onCellClick: (rowIndex: number, colIndex: number) => void;
  onAddHint: (axis: 'row' | 'col', lineIndex: number) => void;
  onRemoveLastHint: (axis: 'row' | 'col', lineIndex: number) => void;
  onUpdateHint: (axis: 'row' | 'col', lineIndex: number, hintIndex: number, newValue: number) => void;
};

export function NonogramBoard(props: NonogramBoardProps) {
  const state = useNonogramBoardState(props);
  return (
    <div ref={state.containerRef} className="board-viewport">
      <div
        className="nonogram-board"
        style={
          {
            '--cell-size': `${state.cellSize}px`,
            gridTemplateColumns: `auto repeat(${props.board.size}, var(--cell-size))`,
            gridTemplateRows: `auto repeat(${props.board.size}, var(--cell-size))`,
          } as React.CSSProperties
        }
      >
        {/* Top-left corner spacer */}
        <div className="board-corner" aria-hidden="true" />

        {/* Column headers */}
        {props.board.cols.map((col, colIndex) => {
          const isColDone = col.hints.length > 0 && BoardLine.isCompleted(col);
          const isMajorRight = (colIndex + 1) % 5 === 0 && colIndex !== props.board.size - 1;
          const canAddColHint = BoardLine.canAddHint(col.hints, props.board.size);

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
                  onClick={() => props.onRemoveLastHint('col', colIndex)}
                >
                  −
                </button>
                <button
                  type="button"
                  className="line-action-btn"
                  title={`Add hint to column ${colIndex + 1}`}
                  aria-label={`Add hint to column ${colIndex + 1}`}
                  disabled={!canAddColHint}
                  onClick={() => props.onAddHint('col', colIndex)}
                >
                  +
                </button>
              </div>

              <div className="hint-list hint-list--col">
                {col.hints.map((hint, hintIndex) => {
                  const maxAllowed = BoardLine.getMaxHintValue(col.hints, hintIndex, props.board.size);
                  return (
                    <HintInput
                      key={`col-${colIndex}-hint-${hintIndex}`}
                      value={hint}
                      max={maxAllowed}
                      ariaLabel={`Column ${colIndex + 1} hint ${hintIndex + 1}`}
                      onChange={(newVal) => props.onUpdateHint('col', colIndex, hintIndex, newVal)}
                    />
                  );
                })}
              </div>
            </div>
          );
        })}

        {/* Rows (each row has a row header followed by N cells) */}
        {props.board.rows.map((row, rowIndex) => {
          const isRowDone = row.hints.length > 0 && BoardLine.isCompleted(row);
          const isMajorBottom = (rowIndex + 1) % 5 === 0 && rowIndex !== props.board.size - 1;
          const canAddRowHint = BoardLine.canAddHint(row.hints, props.board.size);

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
                    onClick={() => props.onAddHint('row', rowIndex)}
                  >
                    +
                  </button>
                  <button
                    type="button"
                    className="line-action-btn"
                    title={`Remove last hint from row ${rowIndex + 1}`}
                    aria-label={`Remove last hint from row ${rowIndex + 1}`}
                    disabled={row.hints.length === 0}
                    onClick={() => props.onRemoveLastHint('row', rowIndex)}
                  >
                    −
                  </button>
                </div>

                <div className="hint-list hint-list--row">
                  {row.hints.map((hint, hintIndex) => {
                    const maxAllowed = BoardLine.getMaxHintValue(row.hints, hintIndex, props.board.size);
                    return (
                      <HintInput
                        key={`row-${rowIndex}-hint-${hintIndex}`}
                        value={hint}
                        max={maxAllowed}
                        ariaLabel={`Row ${rowIndex + 1} hint ${hintIndex + 1}`}
                        onChange={(newVal) => props.onUpdateHint('row', rowIndex, hintIndex, newVal)}
                      />
                    );
                  })}
                </div>
              </div>

              {row.cells.map((cell, colIndex) => {
                const isMajorRight = (colIndex + 1) % 5 === 0 && colIndex !== props.board.size - 1;
                const statusName = CellStatus.detail(cell.status);

                return (
                  <button
                    key={`cell-${rowIndex}-${colIndex}`}
                    type="button"
                    className={`board-cell board-cell--${statusName} ${
                      isMajorRight ? 'grid-major-right' : ''
                    } ${isMajorBottom ? 'grid-major-bottom' : ''}`}
                    aria-label={`Row ${rowIndex + 1}, Column ${colIndex + 1}: ${statusName}`}
                    onClick={() => props.onCellClick(rowIndex, colIndex)}
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
