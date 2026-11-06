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

    export function* Smart(board: Board): Generator<StrategyResult.StepTaken | StrategyResult.CellChanged, StrategyResult, void> {
        let changed = false;

        const processLine = function* (line: BoardLine): Generator<StrategyResult.CellChanged, boolean, void> {
            const secs = BoardLine.split(line, CellStatus.Empty).filter(s => s.status !== CellStatus.Empty);
            if (secs.length === 0 || line.hints.length === 0) {
                return false;
            }

            let lineChanged = false;
            let currHintIndex = 0;

            for (let i = 0; i < secs.length; i++) {
                if (currHintIndex >= line.hints.length) break;

                if (line.hints[currHintIndex] > secs[i].size) {
                    continue;
                }

                const hints = [line.hints[currHintIndex]];
                let hintsSpaceTaken: number = line.hints[currHintIndex];

                while (++currHintIndex < line.hints.length) {
                    const nextSpace = line.hints[currHintIndex] + 1;
                    if (hintsSpaceTaken + nextSpace > secs[i].size) {
                        break;
                    }
                    hintsSpaceTaken += nextSpace;
                    hints.push(line.hints[currHintIndex]);
                }

                const maxDiff = secs[i].size - hintsSpaceTaken;
                const minimalPos = BoardLine.getMinimalPositionsFromStart(hints, secs[i].startIndex);

                for (let j = 0; j < minimalPos.length; j++) {
                    for (let k = minimalPos[j].startIndex + maxDiff; k <= minimalPos[j].endIndex; k++) {
                        if (line.cells[k].status !== CellStatus.Filled) {
                            line.cells[k].status = CellStatus.Filled;
                            lineChanged = true;
                            yield StrategyResult.cellChanged("Intersection.Smart");
                        }
                    }
                }
            }

            return lineChanged;
        };

        for (let i = 0; i < board.size; i++) {
            const rowChanged = yield* processLine(board.rows[i]);
            const colChanged = yield* processLine(board.cols[i]);
            if (rowChanged || colChanged) {
                changed = true;
            }
        }

        if (changed) {
            return StrategyResult.stalled("Intersection.Smart", "Intersection.Smart passed but board may have further changes.");
        } else {
            return StrategyResult.stalled("Intersection.Smart", "Intersection.Smart stalled: no new overlaps found.");
        }
    }
}
