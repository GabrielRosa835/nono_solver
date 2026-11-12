import { BoardLine } from "../../BoardLine";
import { CellStatus } from "../../CellStatus";
import type { StrategyContext } from "../StrategyContext";
import type { StrategyDetails } from "../StrategyDetails";
import { StrategyResult } from "../StrategyResult";

export const Details: StrategyDetails =
{
    id: 'Anchor.End',
    label: 'Anchor.End',
    description: 'Extends or bounds partially filled blocks touching the end boundary.',
    tier: 'working',
    strategy: stragegy,
};

function* stragegy(ctx: StrategyContext): Generator<StrategyResult.StepTaken | StrategyResult.CellChanged, StrategyResult, void>
{
    let changed = false;

    const processLine = function* (line: BoardLine): Generator<StrategyResult.CellChanged, boolean, void>
    {
        if (line.hints.length === 0) return false;

        const lastBoundary = BoardLine.getLastPlayableBoundary(line);
        if (lastBoundary === -1) return false;

        // Only activates if a Filled block touches the last playable boundary
        if (line.cells[lastBoundary].status !== CellStatus.Filled) return false;

        const lastHint = Number(line.hints[line.hints.length - 1]);
        let blockStart = lastBoundary;
        while (blockStart - 1 >= 0 && line.cells[blockStart - 1].status === CellStatus.Filled)
        {
            blockStart--;
        }
        const currentBlockLength = lastBoundary - blockStart + 1;
        let lineChanged = false;

        // Partially filled block: fill remaining cells backwards up to last hint size
        if (currentBlockLength < lastHint)
        {
            const targetStart = lastBoundary - lastHint + 1;
            for (let k = blockStart - 1; k >= targetStart && k >= 0; k--)
            {
                if (line.cells[k].status !== CellStatus.Filled)
                {
                    line.cells[k].status = CellStatus.Filled;
                    lineChanged = true;
                    yield ctx.results.cellChanged();
                }
            }
        }

        // If the block now matches the last hint, bound it with an Empty cell
        const completedStart = lastBoundary - lastHint + 1;
        const separatorIndex = completedStart - 1;
        if (separatorIndex >= 0 && line.cells[separatorIndex].status === CellStatus.Unknown)
        {
            line.cells[separatorIndex].status = CellStatus.Empty;
            lineChanged = true;
            yield ctx.results.cellChanged();
        }

        return lineChanged;
    };

    for (let i = 0; i < ctx.board.size; i++)
    {
        const rowChanged = yield* processLine(ctx.board.rows[i]);
        const colChanged = yield* processLine(ctx.board.cols[i]);
        if (rowChanged || colChanged)
        {
            changed = true;
        }
    }

    if (changed)
    {
        return ctx.results.stalled("Anchor.End passed but board may have further changes.");
    }
    else
    {
        return ctx.results.stalled("Anchor.End stalled: no end anchors were updated.");
    }
}