export type Example = {
    size: number;
    rowHints: number[][],
    colHints: number[][],
}

export type BoardCell = {
    status: CellStatus;
}

export type BoardLine = {
    hints: number[];
    cells: BoardCell[];
}

export type Board = {
    size: number;
    rows: BoardLine[];
    cols: BoardLine[];
}

export type CellSection = { 
    startIndex: number;
    endIndex: number;
    size: number;
    status: CellStatus;
}

export const CellStatus = {
    Unknown: 0,
    Filled: 1,
    Empty: 2,
} as const;

export type CellStatus = typeof CellStatus[keyof typeof CellStatus];