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

    export const withName = (strategyName: string) => ({
        Completed: (message: string): Completed => Completed(strategyName, message),
        Faulted: (reason: string): Faulted => Faulted(strategyName, reason),
        Stalled: (message: string): Stalled => Stalled(strategyName, message),
        StepTaken: (description: string, changedCells: number): StepTaken => StepTaken(strategyName, description, changedCells),
        CellChanged: (): CellChanged => CellChanged(strategyName),
    });
}
