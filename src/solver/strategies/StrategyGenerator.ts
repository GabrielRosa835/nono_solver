import type { StrategyResult } from "./StrategyResult";


export type StrategyGenerator = Generator<StrategyResult.StepTaken | StrategyResult.CellChanged, StrategyResult, void>;
