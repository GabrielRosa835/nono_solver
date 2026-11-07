import { Cell } from "./Cell";
import { CellStatus } from "./CellStatus";
import { BoardLine } from "./BoardLine";

export type BoardTemplate = {
    size: number;
    rows: number[][],
    cols: number[][],
}

export type Board = {
    size: number;
    rows: BoardLine[];
    cols: BoardLine[];
}

export namespace Board {

    export function create(template: BoardTemplate) {

        const totalCells = Math.pow(template.size, 2);

        const cells: Cell[] = Array.from({ length: totalCells }, () => ({ status: CellStatus.Unknown } as Cell));

        const board: Board = { size: template.size } as Board;
        board.rows = BoardLine.createRows(template.rows, cells);
        board.cols = BoardLine.createCols(template.cols, cells);

        return board;
    }

    export function clone(source: Board): Board {
        const template: BoardTemplate = {
            size: source.size,
            rows: source.rows.map(r => r.hints.map(Number)),
            cols: source.cols.map(c => c.hints.map(Number)),
        };
        const next = Board.create(template);
        for (let r = 0; r < source.size; r++) {
            for (let c = 0; c < source.size; c++) {
                next.rows[r].cells[c].status = source.rows[r].cells[c].status;
            }
        }
        return next;
    }

    export type ValidationResult =
        | { valid: true }
        | { valid: false; reason: string; axis: 'row' | 'col'; index: number };

    export function validateHints(board: Board): ValidationResult {
        for (let r = 0; r < board.rows.length; r++) {
            if (BoardLine.getRequiredSpace(board.rows[r].hints) > board.size) {
                return {
                    valid: false,
                    reason: `Hints exceed line length on row ${r + 1}`,
                    axis: 'row',
                    index: r,
                };
            }
        }
        for (let c = 0; c < board.cols.length; c++) {
            if (BoardLine.getRequiredSpace(board.cols[c].hints) > board.size) {
                return {
                    valid: false,
                    reason: `Hints exceed line length on column ${c + 1}`,
                    axis: 'col',
                    index: c,
                };
            }
        }
        return { valid: true };
    }

    export function print(board: Board) {

        let maxColHintSize = 1;
        for (let i = 0; i < board.cols.length; i++) {
            const hint = board.cols[i].hints;
            if (maxColHintSize < hint.length) {
                maxColHintSize = hint.length;
            }
        };

        let maxRowHintSize = 1;
        for (let i = 0; i < board.rows.length; i++) {
            const hint = board.rows[i].hints;
            if (maxRowHintSize < hint.length) {
                maxRowHintSize = hint.length;
            }
        }

        const bufferWidth = board.size + maxRowHintSize;
        const bufferHeight = board.size + maxColHintSize;
        const buffer = Array(bufferHeight);

        for (let i = 0; i < bufferHeight; i++) {
            buffer[i] = Array(bufferWidth);
        }

        for (let i = 0; i < board.cols.length; i++) {

            const hints = board.cols[i].hints;

            const startRowIndex = maxColHintSize - hints.length;
            const colIndex = maxRowHintSize + i;

            for (let j = 0; j < hints.length; j++) {
                const rowIndex = startRowIndex + j;
                buffer[rowIndex][colIndex] = hints[j];
            }
        }

        for (let i = 0; i < board.rows.length; i++) {

            const hints = board.rows[i].hints;

            const startColIndex = maxRowHintSize - hints.length;
            const rowIndex = maxColHintSize + i;

            for (let j = 0; j < hints.length; j++) {
                const colIndex = startColIndex + j;
                buffer[rowIndex][colIndex] = hints[j];
            }
        }

        for (let i = 0; i < board.size; i++) {
            for (let j = 0; j < board.size; j++) {
                buffer[i + maxColHintSize][j + maxRowHintSize] = Cell.display(board.rows[i].cells[j]);
            }
        }

        for (let i = 0; i < bufferHeight; i++) {
            let line = String(buffer[i][0] ?? " ");
            for (let j = 1; j < bufferWidth; j++) {
                line += ` | ${String(buffer[i][j] ?? " ")}`
            }
            console.log(line);
        }
        console.log("\n")
    }

    export function isCompleted(board: Board): boolean {
        for (let i = 0; i < board.size; i++) {
            if (!BoardLine.isCompleted(board.rows[i])) return false;
            if (!BoardLine.isCompleted(board.cols[i])) return false;
        }
        return true;
    }
}