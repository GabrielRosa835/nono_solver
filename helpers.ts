import { Board, BoardLine, BoardCell, CellSection, CellStatus, Example } from "./types";

export function log<T>(subject: T): T {
    console.log(subject);
    return subject;
}

export function cloneSection(sec: CellSection): CellSection {
    return {
        endIndex: sec.endIndex,
        startIndex: sec.startIndex,
        size: sec.size,
        status: sec.status,
    };
}

export function cloneBoard(board: Board): Board {
    return {
        size: board.size,
        cols: board.cols.map(cloneLine),
        rows: board.rows.map(cloneLine),
    };
}

export function cloneLine(line: BoardLine): BoardLine {
    return {
        cells: line.cells.map(cloneCell),
        hints: line.hints.map(c => c),
    };
}

export function cloneCell(cell: BoardCell): BoardCell {
    return { status: cell.status };
}

export function printSections(secs: CellSection[]) {
    const buffer: CellStatus[] = [];
    for (let i = 0; i < secs.length; i++) {
        for (let j = secs[i].startIndex; j <= secs[i].endIndex; j++) {
            buffer[j] = secs[i].status;
        }
    }
    const line = buffer.map(displayCellStatus).join(" | ");
    console.log(line);
}

export function createBoard(example: Example) {

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
}

export function displayCell(cell: BoardCell) {
    return displayCellStatus(cell.status);
}

export function displayCellStatus(status: CellStatus) {
    switch (status) {
        case CellStatus.Unknown: return ".";
        case CellStatus.Filled: return "X";
        case CellStatus.Empty: return "+";
        default: return "?";
    }
}

export function printBoard(board: Board) {

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
            buffer[i + maxColHintSize][j + maxRowHintSize] = displayCell(board.rows[i].cells[j]);
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
}

