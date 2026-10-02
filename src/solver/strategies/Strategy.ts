import { Board } from "../Board";

/**
 * A Strategy is a generator function that yields information about each step it takes.
 * It yields StepInfo so the UI can pause and display changes, and eventually
 * returns a StrategyResult indicating if it completed the board, stalled, or found a fault.
 */
export type Strategy = (board: Board) => Generator<StepInfo, StrategyResult, void>;

export enum StrategyResult {
    Completed = 0,
    Faulted = 1,
    Stalled = 2, // When a strategy cannot make any more progress
}

export type StepInfo = {
    strategyName: string;
    description: string;
    changedCells: number; // Number of cells modified in this step
};

/**
 * Orchestrator that runs multiple strategies continuously until the board is completed or stalled.
 * Since it is also a generator, the UI can iterate through it step by step.
 */
export function* executeStrategies(board: Board, strategies: Strategy[]): Generator<StepInfo, StrategyResult, void> {
    while (!Board.isCompleted(board)) {
        let changedInIteration = false;

        for (const strategy of strategies) {

            const strategyIterator = strategy(board);
            let result = strategyIterator.next();
            
            while (!result.done) {
                if (result.value.changedCells > 0) {
                    changedInIteration = true;
                }
                yield result.value;
                result = strategyIterator.next();
            }

            if (result.value === StrategyResult.Faulted) {
                return StrategyResult.Faulted; // Board is in an invalid state
            }
        }

        if (!changedInIteration) {
            // None of the strategies could make a change in this full pass
            return StrategyResult.Stalled;
        }
    }

    return StrategyResult.Completed;
}
