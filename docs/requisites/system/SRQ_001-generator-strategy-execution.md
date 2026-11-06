# SRQ_001: Generator-Based Atomic Strategy Execution Engine

**Last Updated**: 03/11/2026 20:34
**Category**: System Requirement
**Priority**: Required
**Related Docs**: [`overview.md`](../../architecture/overview.md), [`DEC_001`](../../decisions/DEC_001-strategy-generator-contract.md), [`DEC_002`](../../decisions/DEC_002-atomic-cell-yielding-and-structured-results.md), [`URQ_002`](../user/URQ_002-strategy-selection-and-playback.md)

### Objective & Statement
The solver engine must execute strategies via a uniform TypeScript Generator contract that yields atomic cell modifications and returns structured terminal results, supporting both individual strategy passes and multi-strategy orchestration.

### Acceptance Criteria
- **Uniform Generator Contract**: Every solving and validation strategy implements `(board: Board) => Generator<StrategyResult.StepTaken | StrategyResult.CellChanged, StrategyResult, void>`.
- **Atomic Cell Yielding**: Whenever a strategy changes a cell's `status`, it immediately yields `StrategyResult.cellChanged(strategyName)` before modifying any subsequent cell.
- **Structured Result Metadata**: Every yielded or returned `StrategyResult` (`Completed`, `Faulted`, `Stalled`, `StepTaken`, `CellChanged`) includes an explicit `strategyName: string` field.
- **Orchestrator Termination**: `Strategies.Orchestrator` loops over the configured strategy list until `Board.isCompleted(board)` is satisfied (`Completed`), any strategy returns `Faulted`, or a full iteration across all strategies produces no cell changes (`Stalled`).

### Observations & Constraints
- Implemented in [`src/solver/strategies/Strategy.ts`](../../../src/solver/strategies/Strategy.ts) and [`src/solver/strategies/Strategies.ts`](../../../src/solver/strategies/Strategies.ts).
