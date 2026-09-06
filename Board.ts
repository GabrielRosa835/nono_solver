import { Cell, CellStatus } from "./Cell";

export type Hint = number;

export type BoardTemplate = {
    size: number;
    rowHints: Hint[][],
    colHints: Hint[][],
}

export type BoardLine = {
    hints: Hint[];
    cells: Cell[];
}

export const BoardLine = {
    clone(line: BoardLine): BoardLine {
        return {
            cells: line.cells.map(Cell.clone),
            hints: line.hints.map(c => c),
        };
    },
}

export type Board = {
    size: number;
    rows: BoardLine[];
    cols: BoardLine[];
}

export const Board = {
    clone(board: Board): Board {
        return {
            size: board.size,
            cols: board.cols.map(BoardLine.clone),
            rows: board.rows.map(BoardLine.clone),
        };
    },
    create(example: BoardTemplate) {

        const totalCells = Math.pow(example.size, 2);
        const cells = Array(totalCells);

        for (let i = 0; i < totalCells; i++) {
            cells[i] = { status: CellStatus.Unknown };
        }

        const board: Board = {
            size: example.size,
            rows: [],
            cols: [],
        }

        for (let i = 0; i < board.size; i++) {
            const rowCells = [];
            for (let j = 0; j < board.size; j++) {
                rowCells[j] = cells[(i * board.size) + j];
            }
            board.rows[i] = {
                hints: example.rowHints[i],
                cells: rowCells,
            }
        }

        for (let i = 0; i < board.size; i++) {
            const colCells = [];
            for (let j = 0; j < board.size; j++) {
                colCells[j] = cells[(j * board.size) + i];
            }
            board.cols[i] = {
                hints: example.colHints[i],
                cells: colCells,
            }
        }
        return board;
    },
    print(board: Board) {

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
            let line = String(buffer[i][0] ?? ".");
            for (let j = 1; j < bufferWidth; j++) {
                line += ` | ${String(buffer[i][j] ?? ".")}`
            }
            console.log(line);
        }
        console.log("\n")
    },
}