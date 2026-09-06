const CellStatusValues = {
    Unknown: 0,
    Filled: 1,
    Empty: 2,
} as const;

export namespace CellStatus {
    export type Unknown = 0;
    export type Filled = 1;
    export type Empty = 2;
}

export type CellStatus = typeof CellStatusValues[keyof typeof CellStatusValues];

export const CellStatus = {
    ...CellStatusValues,
    display(status: CellStatus): string {
        switch (status) {
            case CellStatus.Unknown: return ".";
            case CellStatus.Filled: return "X";
            case CellStatus.Empty: return "+";
            default: return "?";
        }
    },
}

export type Cell = {
    status: CellStatus;
}

export const Cell = {
    clone(cell: Cell): Cell {
        return { status: cell.status };
    },
    display(cell: Cell): string {
        return CellStatus.display(cell.status);
    },
} 