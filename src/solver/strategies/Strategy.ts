import { Board } from "../Board";

export type StrategyResult = 
    | StrategyResult.Completed 
    | StrategyResult.Faulted
    | StrategyResult.Stalled 
    | StrategyResult.StepTaken
    | StrategyResult.CellChanged; 

export namespace StrategyResult {

    export type Completed = {
        type: "Completed";
        strategyName: string;
        message: string;
    };
    export type Faulted = {
        type: "Faulted";
        strategyName: string;
        reason: string;
    };
    export type Stalled = {
        type: "Stalled";
        strategyName: string;
        message: string;
    };
    export type StepTaken = {
        type: "StepTaken";
        strategyName: string;
        description: string;
        changedCells: number;
    };
    export type CellChanged = {
        type: "CellChanged";
        strategyName: string;
    };

    export const completed = (strategyName: string, message: string): Completed => ({ type: "Completed", strategyName, message });
    export const faulted = (strategyName: string, reason: string): Faulted => ({ type: "Faulted", strategyName, reason });
    export const stalled = (strategyName: string, message: string): Stalled => ({ type: "Stalled", strategyName, message });
    export const stepTaken = (strategyName: string, description: string, changedCells: number): StepTaken => ({
        type: "StepTaken", strategyName, description, changedCells
    });
    export const cellChanged = (strategyName: string): CellChanged => ({ type: "CellChanged", strategyName });
}

/**
 * A Strategy is a generator function that yields StepTaken or CellChanged objects.
 * It returns a StrategyResult (Completed, Faulted, or Stalled) when finished.
 */
export type Strategy = (board: Board) => Generator<StrategyResult.StepTaken | StrategyResult.CellChanged, StrategyResult, void>;