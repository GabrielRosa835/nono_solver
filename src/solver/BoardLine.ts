import { Cell } from "./Cell";
import { CellSection } from "./CellSection";
import { CellStatus } from "./CellStatus";
import { Hint } from "./Hint";

export type BoardLine = {
    hints: Hint[];
    cells: Cell[];
};

export namespace BoardLine {

    export function createRows(hints: number[][], cells: Cell[]): BoardLine[] {
        return hints.map((rowTempl, rowIndex) => {
            const line: BoardLine = { hints: rowTempl.map(Hint.of) } as BoardLine;
            line.cells = cells.filter((cell, cellIndex) => {
                if (Cell.inRow({ rowIndex, cellIndex })) {
                    cell.row = line;
                    return true;
                }
                return false;
            });
            return line;
        })
    }

    export function createCols(templates: number[][], cells: Cell[]): BoardLine[] {
        return templates.map((colTempl, colIndex) => {
            const line: BoardLine = { hints: colTempl.map(Hint.of) } as BoardLine;
            line.cells = cells.filter((cell, cellIndex) => {
                if (Cell.inCol({ colIndex, cellIndex, colCount: templates.length })) {
                    cell.col = line;
                    return true;
                }
                return false;
            });
            return line;
        })
    }

    export function split(line: BoardLine, byStatus?: CellStatus): CellSection[] {

        let currStatus = line.cells[0].status;
        let currStartIndex = 0;
        let currEndIndex = 0;

        const positions: CellSection[] = [];

        for (let i = 1; i < line.cells.length; i++) {

            const currCell = line.cells[i];

            let shouldMerge = currStatus === currCell.status;

            if (byStatus !== undefined && !shouldMerge) {
                shouldMerge = currStatus !== byStatus && currCell.status !== byStatus;
            }

            if (shouldMerge) {
                currEndIndex++;
            } else {
                positions.push(CellSection.create(currStartIndex, currEndIndex, currStatus));
                currStartIndex = currEndIndex + 1;
                currEndIndex = currStartIndex;
                currStatus = currCell.status;
            }
        }
        positions.push(CellSection.create(currStartIndex, currEndIndex, currStatus));

        return positions;
    }

    export function isCompleted(line: BoardLine): boolean {
        const secs = BoardLine.split(line).filter(s => s.status === CellStatus.Filled);
        
        if (secs.length !== line.hints.length) return false;

        for (let i = 0; i < secs.length; i++) {
            if (line.hints[i] !== secs[i].size) return false;
        }
        
        return true;
    }

    export function cellsAt(line: BoardLine, sec: CellSection): Cell[] {
        if (sec.endIndex > line.cells.length) {
            throw new Error("Section does not fit inside the board-line");
        }
        return line.cells.filter((_, i) => sec.startIndex <= i && i <= sec.endIndex);
    }

    export function print(line: BoardLine, hintPadding?: number) {
        let hints = line.hints.join(", ");
        if (hintPadding !== undefined && hintPadding > 1) {
            hints = hints.padStart(((hintPadding - 1) * 3) + 1, " ");
        }
        const cells = line.cells.map(Cell.display).join(" | ");
        console.log(`${hints} : ${cells}`);
    }
}
