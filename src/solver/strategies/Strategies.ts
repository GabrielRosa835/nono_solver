import { type StepInfo, type Strategy, StrategyResult } from "./Strategy";


export namespace Strategies {

    function* NoOpGenerator(): Generator<StepInfo, StrategyResult, void> {
        yield { strategyName: "NoOp", description: "Doing nothing", changedCells: 0 };
        return StrategyResult.Stalled;
    }

    export const NoOp: Strategy = NoOpGenerator;
}
