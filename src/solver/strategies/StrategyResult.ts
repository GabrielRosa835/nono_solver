import type { StrategyDetails } from "./StrategyDetails";

export type StrategyResult =
    | StrategyResult.Completed
    | StrategyResult.Faulted
    | StrategyResult.Stalled
    | StrategyResult.StepTaken
    | StrategyResult.CellChanged;

export namespace StrategyResult
{
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

    export const Completed = (strategyName: string, message: string): Completed => ({
        type: "Completed",
        strategyName,
        message,
    });
    export const Faulted = (strategyName: string, reason: string): Faulted => ({
        type: "Faulted",
        strategyName,
        reason,
    });
    export const Stalled = (strategyName: string, message: string): Stalled => ({
        type: "Stalled",
        strategyName,
        message,
    });
    export const StepTaken = (strategyName: string, description: string, changedCells: number): StepTaken => ({
        type: "StepTaken",
        strategyName,
        description,
        changedCells,
    });
    export const CellChanged = (strategyName: string): CellChanged => ({
        type: "CellChanged",
        strategyName,
    });

    export type Factory = {
        completed: (message: string) => Completed,
        faulted: (reason: string) => Faulted,
        stalled: (message: string) => Stalled,
        stepTaken: (description: string, changedCells: number) => StepTaken,
        cellChanged: () => CellChanged,
    }

    export const forStrategy = (details: StrategyDetails): Factory => ({
        completed: (message: string): Completed => Completed(details.label, message),
        faulted: (reason: string): Faulted => Faulted(details.label, reason),
        stalled: (message: string): Stalled => Stalled(details.label, message),
        stepTaken: (description: string, changedCells: number): StepTaken => StepTaken(details.label, description, changedCells),
        cellChanged: (): CellChanged => CellChanged(details.label),
    });
}
