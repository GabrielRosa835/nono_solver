import { Board } from "../Board";
import type { StrategyResult } from "./StrategyResult";

/**
 * A Strategy is a generator function that yields StepTaken or CellChanged objects.
 * It returns a StrategyResult (Completed, Faulted, or Stalled) when finished.
 */
export type Strategy = (board: Board) => Generator<StrategyResult.StepTaken | StrategyResult.CellChanged, StrategyResult, void>;