export enum CellStatus {
    Unknown = 0,
    Filled = 1,
    Empty = 2,
}

export namespace CellStatus {
    
    export function display(status: CellStatus): string {
        switch (status) {
            case CellStatus.Unknown: return ".";
            case CellStatus.Filled: return "o";
            case CellStatus.Empty: return "x";
            default: return "?";
        }
    }

    export function detail(status: CellStatus): string {
        switch (status) {
            case CellStatus.Unknown: return "unknown";
            case CellStatus.Filled: return "filled";
            case CellStatus.Empty: return "empty";
            default: return "none";
        }
    }
}