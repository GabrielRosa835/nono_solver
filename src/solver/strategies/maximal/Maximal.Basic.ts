import { Board } from "../../Board";
import { BoardLine } from "../../BoardLine";
import { CellStatus } from "../../CellStatus";
import type { StrategyDetails } from "../StrategyDetails";
import { StrategyResult } from "../StrategyResult";

export const Details: StrategyDetails = {
    id: 'Maximal.Basic',
    label: 'Maximal.Basic',
    description: 'Bounds contiguous filled blocks matching the largest hint with Empty cells.',
    tier: 'working',
    strategy: strategy,
};

function* strategy(board: Board): Generator<StrategyResult.StepTaken | StrategyResult.CellChanged, StrategyResult, void>
{
    let changed = false;

    const processLine = function* (line: BoardLine): Generator<StrategyResult.CellChanged, boolean, void>
    {
        if (line.hints.length === 0) return false;

        const maxHint = Math.max(...line.hints.map(Number));
        if (maxHint <= 0) return false;

        const filledBlocks = BoardLine.getContiguousBlocks(line, CellStatus.Filled);
        let lineChanged = false;

        for (const block of filledBlocks)
        {
            if (block.size === maxHint)
            {
                const beforeIndex = block.startIndex - 1;
                if (beforeIndex >= 0 && line.cells[beforeIndex].status === CellStatus.Unknown)
                {
                    line.cells[beforeIndex].status = CellStatus.Empty;
                    lineChanged = true;
                    yield StrategyResult.CellChanged("Maximal.Basic");
                }

                const afterIndex = block.endIndex + 1;
                if (afterIndex < line.cells.length && line.cells[afterIndex].status === CellStatus.Unknown)
                {
                    line.cells[afterIndex].status = CellStatus.Empty;
                    lineChanged = true;
                    yield StrategyResult.CellChanged("Maximal.Basic");
                }
            }
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
        return StrategyResult.Stalled("Maximal.Basic", "Maximal.Basic passed but board may have further changes.");
    } else
    {
        return StrategyResult.Stalled("Maximal.Basic", "Maximal.Basic stalled: no maximal blocks were bounded.");
    }
}
