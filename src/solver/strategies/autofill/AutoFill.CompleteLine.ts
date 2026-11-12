import { BoardLine } from "../../BoardLine";
import { CellStatus } from "../../CellStatus";
import type { StrategyContext } from "../StrategyContext";
import type { StrategyDetails } from "../StrategyDetails";
import { StrategyResult } from "../StrategyResult";

export const Details: StrategyDetails = {
    id: 'AutoFill.CompleteLine',
    label: 'AutoFill.CompleteLine',
    description: 'Marks remaining Unknown cells as Empty when a line matches all its hints.',
    tier: 'working',
    strategy: strategy,
};

function* strategy(ctx: StrategyContext): Generator<StrategyResult.StepTaken | StrategyResult.CellChanged, StrategyResult, void>
{
    let changed = false;

    for (let i = 0; i < ctx.board.size; i++)
    {
        const row = ctx.board.rows[i];
        const col = ctx.board.cols[i];

        if (BoardLine.isCompleted(row))
        {
            let changedCells = 0;
            for (const cell of row.cells)
            {
                if (cell.status === CellStatus.Unknown)
                {
                    cell.status = CellStatus.Empty;
                    changedCells++;
                    yield ctx.results.cellChanged();
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
                    yield ctx.results.cellChanged();
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
        return ctx.results.stalled("AutoFill.CompleteLine passed but board may have further changes.");
    }
    else
    {
        return ctx.results.stalled("AutoFill.CompleteLine stalled: no lines were completed or changed.");
    }
}
