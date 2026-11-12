import { Board } from "../../Board";
import { BoardLine } from "../../BoardLine";
import { CellStatus } from "../../CellStatus";
import type { StrategyDetails } from "../StrategyDetails";
import { StrategyResult } from "../StrategyResult";

export const Details: StrategyDetails = {
    id: 'AutoFill.CompleteLine',
    label: 'AutoFill.CompleteLine',
    description: 'Marks remaining Unknown cells as Empty when a line matches all its hints.',
    tier: 'working',
    strategy: strategy,
};

export function* strategy(board: Board): Generator<StrategyResult.StepTaken | StrategyResult.CellChanged, StrategyResult, void>
{
    let changed = false;

    for (let i = 0; i < board.size; i++)
    {
        const row = board.rows[i];
        const col = board.cols[i];

        if (BoardLine.isCompleted(row))
        {
            let changedCells = 0;
            for (const cell of row.cells)
            {
                if (cell.status === CellStatus.Unknown)
                {
                    cell.status = CellStatus.Empty;
                    changedCells++;
                    yield StrategyResult.CellChanged("AutoFill.CompleteLine");
                }
            }
            if (changedCells > 0)
            {
                changed = true;
            }
        }

        if (BoardLine.isCompleted(col))
        {
            let changedCells = 0;
            for (const cell of col.cells)
            {
                if (cell.status === CellStatus.Unknown)
                {
                    cell.status = CellStatus.Empty;
                    changedCells++;
                    yield StrategyResult.CellChanged("AutoFill.CompleteLine");
                }
            }
            if (changedCells > 0)
            {
                changed = true;
            }
        }
    }

    if (changed)
    {
        return StrategyResult.Stalled("AutoFill.CompleteLine", "AutoFill.CompleteLine passed but board may have further changes.");
    }
    else
    {
        return StrategyResult.Stalled("AutoFill.CompleteLine", "AutoFill.CompleteLine stalled: no lines were completed or changed.");
    }
}
