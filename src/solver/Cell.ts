import type { BoardLine } from "./BoardLine";
import { CellStatus } from "./CellStatus";

export type Cell = {
    col: BoardLine;
    row: BoardLine;
    status: CellStatus;
}

export namespace Cell {

    export function display(cell: Cell): string {
        return CellStatus.display(cell.status);
    }

    export function inRow({ rowIndex, cellIndex, rowSize }: InRowArgs): boolean {
        return Math.floor(cellIndex / rowSize) === rowIndex;
    }

    export function inCol({ colIndex, cellIndex, colCount }: InColArgs): boolean {
        return cellIndex % colCount === colIndex;
    }

}

type InRowArgs = {
    rowIndex: number;
    cellIndex: number;
    rowSize: number;
};

type InColArgs = {
    colIndex: number;
    cellIndex: number;
    colCount: number;
};