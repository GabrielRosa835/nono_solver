# DEC_002: Atomic Cell Yielding and Structured Result Metadata

**Last Updated**: 03/11/2026 20:33
**Status**: Active
**Related Docs**: [`DEC_001`](./DEC_001-strategy-generator-contract.md), [`overview.md`](../architecture/overview.md), [`SRQ_001`](../requisites/system/SRQ_001-generator-strategy-execution.md), [`URQ_002`](../requisites/user/URQ_002-strategy-selection-and-playback.md)

### Objective
Enable fluid, cell-by-cell UI animations during strategy execution and provide structured metadata on every yielded or returned `StrategyResult` without requiring string parsing.

### Proposal
1. **Atomic Yielding (`CellChanged`)**: Instead of batching multiple cell mutations into a single coarse `StepTaken` event at the end of a line or strategy pass, strategies must `yield StrategyResult.cellChanged(strategyName)` immediately after every individual `Cell.status` mutation.
2. **Structured Result Metadata (`strategyName`)**: Every `StrategyResult` variant (`Completed`, `Faulted`, `Stalled`, `StepTaken`, and `CellChanged`) includes an explicit `strategyName: string` field rather than embedding the strategy identifier inside human-readable message strings.

### Observations
- `StrategyResult.StepTaken` remains supported in the union contract and `Orchestrator` for coarse or no-op steps, while active solving strategies (`AutoFill.CompleteLine`, `Intersection.Basic`) emit `CellChanged` per modified cell.
- Established during the 02/10/2026 Strategy Implementation session.
