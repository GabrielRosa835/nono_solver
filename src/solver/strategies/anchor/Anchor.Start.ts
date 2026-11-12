import { Board } from "../../Board";
import { BoardLine } from "../../BoardLine";
import { CellStatus } from "../../CellStatus";
import type { StrategyDetails } from "../StrategyDetails";
import { StrategyResult } from "../StrategyResult";

export const Details: StrategyDetails =
{
    id: 'Anchor.Start',
    label: 'Anchor.Start',
    description: 'Extends or bounds partially filled blocks touching the start boundary.',
    tier: 'working',
    strategy: strategy,
};

function* strategy(board: Board): Generator<StrategyResult.StepTaken | StrategyResult.CellChanged, StrategyResult, void>
{
    let changed = false;

    const processLine = function* (line: BoardLine): Generator<StrategyResult.CellChanged, boolean, void>
    {
        if (line.hints.length === 0) return false;

        const startBoundary = BoardLine.getFirstPlayableBoundary(line);
        if (startBoundary === -1) return false;

        // Only activates if a Filled block touches the first playable boundary
        if (line.cells[startBoundary].status !== CellStatus.Filled) return false;

        const firstHint = Number(line.hints[0]);
        let blockEnd = startBoundary;
        while (blockEnd + 1 < line.cells.length && line.cells[blockEnd + 1].status === CellStatus.Filled)
        {
            blockEnd++;
        }
        const currentBlockLength = blockEnd - startBoundary + 1;
        let lineChanged = false;

        // Partially filled block: fill remaining cells up to the first hint size
        if (currentBlockLength < firstHint)
        {
            const targetEnd = startBoundary + firstHint - 1;
            for (let k = blockEnd + 1; k <= targetEnd && k < line.cells.length; k++)
            {
                if (line.cells[k].status !== CellStatus.Filled)
                {
                    line.cells[k].status = CellStatus.Filled;
                    lineChanged = true;
                    yield StrategyResult.CellChanged("Anchor.Start");
                }
            }
        }

        // If the block now matches the first hint, bound it with an Empty cell
        const completedEnd = startBoundary + firstHint - 1;
        const separatorIndex = completedEnd + 1;
        if (separatorIndex < line.cells.length && line.cells[separatorIndex].status === CellStatus.Unknown)
        {
            line.cells[separatorIndex].status = CellStatus.Empty;
            lineChanged = true;
            yield StrategyResult.CellChanged("Anchor.Start");
        }

        return lineChanged;
    };

    for (let i = 0; i < board.size; i++)
    {
        const rowChanged = yield* processLine(board.rows[i]);
        const colChanged = yield* processLine(board.cols[i]);
        if (rowChanged || colChanged)
        {
            changed = true;
        }
    }

    if (changed)
    {
        return StrategyResult.Stalled("Anchor.Start", "Anchor.Start passed but board may have further changes.");
    } else
    {
        return StrategyResult.Stalled("Anchor.Start", "Anchor.Start stalled: no start anchors were updated.");
    }
}
