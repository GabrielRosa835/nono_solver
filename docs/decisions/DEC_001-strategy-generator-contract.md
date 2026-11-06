# DEC_001: TypeScript Generator Contract for Solving Strategies

**Last Updated**: 03/11/2026 20:33
**Status**: Active
**Related Docs**: [`overview.md`](../architecture/overview.md), [`DEC_002`](./DEC_002-atomic-cell-yielding-and-structured-results.md), [`SRQ_001`](../requisites/system/SRQ_001-generator-strategy-execution.md), [`URQ_002`](../requisites/user/URQ_002-strategy-selection-and-playback.md)

### Objective
Design an execution contract for nonogram solving strategies that allows an interactive web UI to execute solving algorithms step-by-step, pause at any intermediate point to inspect the board, or run continuously without blocking the main thread.

### Proposal
Represent all solving strategies as TypeScript Generator functions (`function*`) conforming to the [`Strategy`](../../src/solver/strategies/Strategy.ts) signature:
```ts
export type Strategy = (board: Board) => Generator<StrategyResult.StepTaken | StrategyResult.CellChanged, StrategyResult, void>;
```
Each strategy generator yields progress events as it mutates the `Board` in-place and returns a final `StrategyResult` (`Completed`, `Faulted`, or `Stalled`) upon completing its pass. A higher-level generator, [`Strategies.Orchestrator`](../../src/solver/strategies/Strategies.ts), composes multiple `Strategy` functions in a loop, delegating yields directly to the caller until the board is solved, faulted, or no strategy makes progress in a full pass.

### Observations
- Pull-based iteration (`iterator.next()`) naturally lets the React UI drive execution either manually via a "Next Step" button or automatically via a timer/animation loop.
- Originally introduced during the 29/09/2026 Strategy Contract Design session before strategy migration began.
