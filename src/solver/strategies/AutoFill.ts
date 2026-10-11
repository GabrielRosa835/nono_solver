import { Board } from "../Board";
import { BoardLine } from "../BoardLine";
import { CellStatus } from "../CellStatus";
import { StrategyResult } from "./Strategy";

export namespace AutoFill {

    export function* CompleteLine(board: Board): Generator<StrategyResult.StepTaken | StrategyResult.CellChanged, StrategyResult, void> {
        let changed = false;

        for (let i = 0; i < board.size; i++) {
            const row = board.rows[i];
            const col = board.cols[i];

            if (BoardLine.isCompleted(row)) {
                let changedCells = 0;
                for (const cell of row.cells) {
                    if (cell.status === CellStatus.Unknown) {
                        cell.status = CellStatus.Empty;
                        changedCells++;
                        yield StrategyResult.cellChanged("AutoFill.CompleteLine");
                    }
                }
                if (changedCells > 0) {
                    changed = true;
                }
            }

            if (BoardLine.isCompleted(col)) {
                let changedCells = 0;
                for (const cell of col.cells) {
                    if (cell.status === CellStatus.Unknown) {
                        cell.status = CellStatus.Empty;
                        changedCells++;
                        yield StrategyResult.cellChanged("AutoFill.CompleteLine");
                    }
                }
                if (changedCells > 0) {
                    changed = true;
                }
            }
        }

        if (changed) {
            return StrategyResult.stalled("AutoFill.CompleteLine", "AutoFill.CompleteLine passed but board may have further changes.");
        } else {
            return StrategyResult.stalled("AutoFill.CompleteLine", "AutoFill.CompleteLine stalled: no lines were completed or changed.");
        }
    }
}
