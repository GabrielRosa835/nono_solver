import { Board } from "../Board";
import { BoardLine } from "../BoardLine";
import { CellStatus } from "../CellStatus";
import { StrategyResult } from "./Strategy";

export namespace Intersection {

    export function* Basic(board: Board): Generator<StrategyResult.StepTaken | StrategyResult.CellChanged, StrategyResult, void> {
        let changed = false;

        for (let i = 0; i < board.size; i++) {
            const row = board.rows[i];
            const col = board.cols[i];

            // Row processing
            if (row.hints.length > 0) {
                const rowHintsSum = row.hints.reduce((prev, curr) => prev + curr, 0);
                const totalSpaceTaken = rowHintsSum + row.hints.length - 1;
                const maximumDifference = row.cells.length - totalSpaceTaken;
                
                const minimalPos = BoardLine.getMinimalPositionsFromStart(row.hints);

                let changedCells = 0;
                for (let j = 0; j < minimalPos.length; j++) {
                    for (let k = minimalPos[j].startIndex + maximumDifference; k <= minimalPos[j].endIndex; k++) {
                        if (row.cells[k].status !== CellStatus.Filled) {
                            row.cells[k].status = CellStatus.Filled;
                            changedCells++;
                            yield StrategyResult.cellChanged("Intersection.Basic");
                        }
                    }
                }
                if (changedCells > 0) {
                    changed = true;
                }
            }

            // Col processing
            if (col.hints.length > 0) {
                const colHintsSum = col.hints.reduce((prev, curr) => prev + curr, 0);
                const totalSpaceTaken = colHintsSum + col.hints.length - 1;
                const maximumDifference = col.cells.length - totalSpaceTaken;
                
                const minimalPos = BoardLine.getMinimalPositionsFromStart(col.hints);

                let changedCells = 0;
                for (let j = 0; j < minimalPos.length; j++) {
                    for (let k = minimalPos[j].startIndex + maximumDifference; k <= minimalPos[j].endIndex; k++) {
                        if (col.cells[k].status !== CellStatus.Filled) {
                            col.cells[k].status = CellStatus.Filled;
                            changedCells++;
                            yield StrategyResult.cellChanged("Intersection.Basic");
                        }
                    }
                }
                if (changedCells > 0) {
                    changed = true;
                }
            }
        }

        if (changed) {
            return StrategyResult.stalled("Intersection.Basic", "Intersection.Basic passed but board may have further changes.");
        } else {
            return StrategyResult.stalled("Intersection.Basic", "Intersection.Basic stalled: no new overlaps found.");
        }
    }
}
