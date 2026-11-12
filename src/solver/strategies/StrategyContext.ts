import type { Board } from "../Board";
import type { StrategyDetails } from "./StrategyDetails";
import { StrategyResult } from "./StrategyResult";

export type StrategyContext = {
    board: Board,
    results: StrategyResult.Factory,
}

export namespace StrategyContext {
    export function create(board: Board, strategy: StrategyDetails): StrategyContext {
        return {
            board: board,
            results: StrategyResult.forStrategy(strategy),
        }
    }
}