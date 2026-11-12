import { BoardLine } from "../../BoardLine";
import { CellStatus } from "../../CellStatus";
import type { StrategyContext } from "../StrategyContext";
import type { StrategyDetails } from "../StrategyDetails";
import { StrategyResult } from "../StrategyResult";

export const Details: StrategyDetails = {
    id: 'Validation.OversizedBlock',
    label: 'Validation.OversizedBlock',
    description: 'Sanity check that immediately faults if a filled block exceeds the line maximum hint.',
    tier: 'validation',
    strategy: strategy,
};

function* strategy(ctx: StrategyContext): Generator<StrategyResult.StepTaken | StrategyResult.CellChanged, StrategyResult, void>
{
    for (let r = 0; r < ctx.board.rows.length; r++)
    {
        const row = ctx.board.rows[r];
        const maxHint = row.hints.length === 0 ? 0 : Math.max(...row.hints.map(Number));
        const blocks = BoardLine.getContiguousBlocks(row, CellStatus.Filled);

        for (const block of blocks)
        {
            if (block.size > maxHint)
            {
                return ctx.results.faulted(`Contiguous filled block of length ${block.size} exceeds maximum hint ${maxHint} on row ${r + 1}.`);
            }
        }
    }

    for (let c = 0; c < ctx.board.cols.length; c++)
    {
        const col = ctx.board.cols[c];
        const maxHint = col.hints.length === 0 ? 0 : Math.max(...col.hints.map(Number));
        const blocks = BoardLine.getContiguousBlocks(col, CellStatus.Filled);

        for (const block of blocks)
        {
            if (block.size > maxHint)
            {
                return ctx.results.faulted(`Contiguous filled block of length ${block.size} exceeds maximum hint ${maxHint} on column ${c + 1}.`);
            }
        }
    }

    return ctx.results.completed("All filled blocks are within maximum hint constraints.");
}
