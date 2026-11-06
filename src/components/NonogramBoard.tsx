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
  return (
    <div
      className="nonogram-board"
      style={{
        gridTemplateColumns: `auto repeat(${board.size}, var(--cell-size))`,
        gridTemplateRows: `auto repeat(${board.size}, var(--cell-size))`,
      }}
    >
      {/* Top-left corner spacer */}
      <div className="board-corner" aria-hidden="true" />

      {/* Column headers */}
      {board.cols.map((col, colIndex) => {
        const isColDone = col.hints.length > 0 && BoardLine.isCompleted(col);
        const isMajorRight = (colIndex + 1) % 5 === 0 && colIndex !== board.size - 1;

        return (
          <div
            key={`col-header-${colIndex}`}
            className={`line-header line-header--col ${isColDone ? 'line-header--completed' : ''} ${
              isMajorRight ? 'grid-major-right' : ''
            }`}
          >
            <div className="line-actions" role="group" aria-label={`Column ${colIndex + 1} hint actions`}>
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
                disabled={col.hints.length >= board.size}
                onClick={() => onAddHint('col', colIndex)}
              >
                +
              </button>
            </div>

            <div className="hint-list hint-list--col">
              {col.hints.map((hint, hintIndex) => (
                <HintInput
                  key={`col-${colIndex}-hint-${hintIndex}`}
                  value={hint}
                  max={board.size}
                  ariaLabel={`Column ${colIndex + 1} hint ${hintIndex + 1}`}
                  onChange={(newVal) => onUpdateHint('col', colIndex, hintIndex, newVal)}
                />
              ))}
            </div>
          </div>
        );
      })}

      {/* Rows (each row has a row header followed by N cells) */}
      {board.rows.map((row, rowIndex) => {
        const isRowDone = row.hints.length > 0 && BoardLine.isCompleted(row);
        const isMajorBottom = (rowIndex + 1) % 5 === 0 && rowIndex !== board.size - 1;

        return (
          <div key={`row-group-${rowIndex}`} className="board-row-contents">
            <div
              className={`line-header line-header--row ${isRowDone ? 'line-header--completed' : ''} ${
                isMajorBottom ? 'grid-major-bottom' : ''
              }`}
            >
              <div className="line-actions" role="group" aria-label={`Row ${rowIndex + 1} hint actions`}>
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
                <button
                  type="button"
                  className="line-action-btn"
                  title={`Add hint to row ${rowIndex + 1}`}
                  aria-label={`Add hint to row ${rowIndex + 1}`}
                  disabled={row.hints.length >= board.size}
                  onClick={() => onAddHint('row', rowIndex)}
                >
                  +
                </button>
              </div>

              <div className="hint-list hint-list--row">
                {row.hints.map((hint, hintIndex) => (
                  <HintInput
                    key={`row-${rowIndex}-hint-${hintIndex}`}
                    value={hint}
                    max={board.size}
                    ariaLabel={`Row ${rowIndex + 1} hint ${hintIndex + 1}`}
                    onChange={(newVal) => onUpdateHint('row', rowIndex, hintIndex, newVal)}
                  />
                ))}
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
  );
}
