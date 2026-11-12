import { BoardLine } from "../../BoardLine";
import { CellStatus } from "../../CellStatus";
import type { StrategyContext } from "../StrategyContext";
import type { StrategyDetails } from "../StrategyDetails";
import { StrategyResult } from "../StrategyResult";

export const Details: StrategyDetails = {
    id: 'Intersection.Smart',
    label: 'Intersection.Smart',
    description: 'Splits lines by Empty cells and greedily packs hints into sections.',
    tier: 'flawed',
    warningNote: 'Greedy heuristic: packs hints without backtracking. May incorrectly fill cells and prevent the board from being solved.',
    strategy: strategy,
};

function* strategy(ctx: StrategyContext): Generator<StrategyResult.StepTaken | StrategyResult.CellChanged, StrategyResult, void>
{
    let changed = false;

    const processLine = function* (line: BoardLine): Generator<StrategyResult.CellChanged, boolean, void>
    {
        const secs = BoardLine.split(line, CellStatus.Empty).filter(s => s.status !== CellStatus.Empty);
        if (secs.length === 0 || line.hints.length === 0)
        {
            return false;
        }

        let lineChanged = false;
        let currHintIndex = 0;

        for (let i = 0; i < secs.length; i++)
        {
            if (currHintIndex >= line.hints.length) break;

            if (line.hints[currHintIndex] > secs[i].size)
            {
                continue;
            }

            const hints = [line.hints[currHintIndex]];
            let hintsSpaceTaken: number = line.hints[currHintIndex];

            while (++currHintIndex < line.hints.length)
            {
                const nextSpace = line.hints[currHintIndex] + 1;
                if (hintsSpaceTaken + nextSpace > secs[i].size)
                {
                    break;
                }
                hintsSpaceTaken += nextSpace;
                hints.push(line.hints[currHintIndex]);
            }

            const maxDiff = secs[i].size - hintsSpaceTaken;
            const minimalPos = BoardLine.getMinimalPositionsFromStart(hints, secs[i].startIndex);

            for (let j = 0; j < minimalPos.length; j++)
            {
                for (let k = minimalPos[j].startIndex + maxDiff; k <= minimalPos[j].endIndex; k++)
                {
                    if (line.cells[k].status !== CellStatus.Filled)
                    {
                        line.cells[k].status = CellStatus.Filled;
                        lineChanged = true;
                        yield ctx.results.cellChanged();
                    }
                }
            }
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
        return ctx.results.stalled("Intersection.Smart passed but board may have further changes.");
    }
    else
    {
        return ctx.results.stalled("Intersection.Smart stalled: no new overlaps found.");
    }
}
