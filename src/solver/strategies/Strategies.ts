import { Board } from "../Board";
import { type Strategy, StrategyResult } from "./Strategy";
import { AutoFill as AutoFillStrat } from "./AutoFill";
import { Intersection as IntersectionStrat } from "./Intersection";

export namespace Strategies {

    export const AutoFill = AutoFillStrat;
    export const Intersection = IntersectionStrat;

    export function* NoOpGenerator(): Generator<StrategyResult.StepTaken | StrategyResult.CellChanged, StrategyResult, void> {
        yield StrategyResult.stepTaken("NoOp", "Doing nothing", 0);
        return StrategyResult.stalled("NoOp", "NoOp strategy always stalls.");
    }

    /**
     * Orchestrator that runs multiple strategies continuously until the board is completed or stalled.
     */
    function* Orchestrator(board: Board, strategies: Strategy[]): Generator<StrategyResult.StepTaken | StrategyResult.CellChanged, StrategyResult, void> {
        while (!Board.isCompleted(board)) {
            let changedInIteration = false;

            for (const strategy of strategies) {
                const strategyIterator = strategy(board);
                let result = strategyIterator.next();

                while (!result.done) {
                    if (result.value.type === "StepTaken" && result.value.changedCells > 0) {
                        changedInIteration = true;
                    } else if (result.value.type === "CellChanged") {
                        changedInIteration = true;
                    }
                    yield result.value;
                    result = strategyIterator.next();
                }

                if (result.value.type === "Faulted") {
                    return result.value;
                }
            }

            if (!changedInIteration) {
                return StrategyResult.stalled("Orchestrator", "Orchestrator passed all strategies but board is unchanged.");
            }
        }

        return StrategyResult.completed("Orchestrator", "Board is completely solved!");
    }


}
