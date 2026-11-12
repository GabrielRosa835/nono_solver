import type { Board } from "../Board";
import { StrategyContext } from "./StrategyContext";
import type { StrategyDetails } from "./StrategyDetails";
import type { StrategyGenerator } from "./StrategyGenerator";

/**
 * A Strategy is a generator function that yields StepTaken or CellChanged objects.
 * It returns a StrategyResult (Completed, Faulted, or Stalled) when finished.
 */
export type Strategy = (ctx: StrategyContext) => StrategyGenerator;

export namespace Strategy
{
    export function create(details: StrategyDetails, board: Board)
    {
        return details.strategy(StrategyContext.create(board, details));
    }
}