import type { Board } from "../Board";
import { StrategyContext } from "./StrategyContext";
import type { StrategyDetails } from "./StrategyDetails";
import type { StrategyResult } from "./StrategyResult";

/**
 * A Strategy is a generator function that yields StepTaken or CellChanged objects.
 * It returns a StrategyResult (Completed, Faulted, or Stalled) when finished.
 */
export type Strategy = (ctx: StrategyContext) => Generator<StrategyResult.StepTaken | StrategyResult.CellChanged, StrategyResult, void>;

export namespace Strategy
{
    export function create(details: StrategyDetails, board: Board)
    {
        return details.strategy(StrategyContext.create(board, details));
    }
}