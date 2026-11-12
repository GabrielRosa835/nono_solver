import { BoardLine } from "../../BoardLine";
import { CellStatus } from "../../CellStatus";
import type { StrategyContext } from "../StrategyContext";
import type { StrategyDetails } from "../StrategyDetails";
import { StrategyResult } from "../StrategyResult";

export const Details: StrategyDetails = {
    id: 'Intersection.Basic',
    label: 'Intersection.Basic',
    description: 'Fills guaranteed overlaps across full lines without splitting on Empty cells.',
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

        // Row processing
        if (row.hints.length > 0)
        {
            const rowHintsSum = row.hints.reduce((prev, curr) => prev + curr, 0);
            const totalSpaceTaken = rowHintsSum + row.hints.length - 1;
            const maximumDifference = row.cells.length - totalSpaceTaken;

            const minimalPos = BoardLine.getMinimalPositionsFromStart(row.hints);

            let changedCells = 0;
            for (let j = 0; j < minimalPos.length; j++)
            {
                for (let k = minimalPos[j].startIndex + maximumDifference; k <= minimalPos[j].endIndex; k++)
                {
                    if (row.cells[k].status !== CellStatus.Filled)
                    {
                        row.cells[k].status = CellStatus.Filled;
                        changedCells++;
                        yield ctx.results.cellChanged();
                    }
                }
            }
            if (changedCells > 0)
            {
                changed = true;
            }
        }

        // Col processing
        if (col.hints.length > 0)
        {
            const colHintsSum = col.hints.reduce((prev, curr) => prev + curr, 0);
            const totalSpaceTaken = colHintsSum + col.hints.length - 1;
            const maximumDifference = col.cells.length - totalSpaceTaken;

            const minimalPos = BoardLine.getMinimalPositionsFromStart(col.hints);

            let changedCells = 0;
            for (let j = 0; j < minimalPos.length; j++)
            {
                for (let k = minimalPos[j].startIndex + maximumDifference; k <= minimalPos[j].endIndex; k++)
                {
                    if (col.cells[k].status !== CellStatus.Filled)
                    {
                        col.cells[k].status = CellStatus.Filled;
                        changedCells++;
                        yield ctx.results.cellChanged();
                    }
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
        return ctx.results.stalled("Intersection.Basic passed but board may have further changes.");
    }
    else
    {
        return ctx.results.stalled("Intersection.Basic stalled: no new overlaps found.");
    }
}
