import { Board } from "../Board";
import { type Strategy } from "./Strategy";
import { StrategyResult } from "./StrategyResult";

import { Anchor as _Anchor } from "./anchor";
import { AutoFill as _AutoFill } from "./autofill";
import { Intersection as _Intersection } from "./intersection";
import { Maximal as _Maximal } from "./maximal";
import { Validation as _Validation } from "./validation";

export namespace Strategies
{
    export const Anchor = _Anchor;
    export const AutoFill = _AutoFill;
    export const Intersection = _Intersection;
    export const Maximal = _Maximal;
    export const Validation = _Validation;

    export function* NoOpGenerator(): Generator<StrategyResult.StepTaken | StrategyResult.CellChanged, StrategyResult, void>
    {
        yield StrategyResult.StepTaken("NoOp", "Doing nothing", 0);
        return StrategyResult.Stalled("NoOp", "NoOp strategy always stalls.");
    }

    /**
     * Orchestrator that runs multiple strategies continuously until the board is completed or stalled.
     */
    export function* Orchestrator(board: Board, strategies: Strategy[]): Generator<StrategyResult.StepTaken | StrategyResult.CellChanged, StrategyResult, void>
    {
        const validation = Board.validateHints(board);
        if (!validation.valid)
        {
            return StrategyResult.Faulted("Orchestrator", `Board is in an invalid state: ${validation.reason}.`);
        }

        while (!Board.isCompleted(board))
        {
            let changedInIteration = false;

            for (const strategy of strategies)
            {
                const strategyIterator = strategy(board);
                let result = strategyIterator.next();

                while (!result.done)
                {
                    if (result.value.type === "StepTaken" && result.value.changedCells > 0)
                    {
                        changedInIteration = true;
                    } else if (result.value.type === "CellChanged")
                    {
                        changedInIteration = true;
                    }
                    yield result.value;
                    result = strategyIterator.next();
                }

                if (result.value.type === "Faulted")
                {
                    return result.value;
                }
            }

            if (!changedInIteration)
            {
                return StrategyResult.Stalled("Orchestrator", "Orchestrator passed all strategies but board is unchanged.");
            }
        }

        return StrategyResult.Completed("Orchestrator", "Board is completely solved!");
    }


}
