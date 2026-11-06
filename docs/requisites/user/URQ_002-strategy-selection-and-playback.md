# URQ_002: Strategy Selection and Step-by-Step Playback Controls

**Last Updated**: 03/11/2026 20:34
**Category**: User Requirement
**Priority**: Required
**Related Docs**: [`overview.md`](../../architecture/overview.md), [`URQ_001`](./URQ_001-interactive-nonogram-board.md), [`DEC_001`](../../decisions/DEC_001-strategy-generator-contract.md), [`DEC_002`](../../decisions/DEC_002-atomic-cell-yielding-and-structured-results.md), [`SRQ_001`](../system/SRQ_001-generator-strategy-execution.md)

### Objective & Statement
Allow users to choose which solving strategies are active and control solver execution either step-by-step or continuously with pause and resume capabilities so they can observe how each strategy solves the board.

### Acceptance Criteria
- **Strategy Selection**: Users can select individual solving strategies or combine multiple strategies via the orchestrator to compare their deduction capabilities.
- **Step-by-Step Execution**: Users can advance the solver one atomic step (`CellChanged` / `StepTaken`) at a time and immediately see the updated cell on the board.
- **Continuous Run, Pause & Resume**: Users can run the solver continuously, pause between steps to inspect the current board state, and resume execution without losing solver progress.
- **Terminal Status Feedback**: The UI clearly communicates when a strategy or orchestrator run finishes as `Completed` (solved), `Stalled` (no further deductions possible with active strategies), or `Faulted` (invalid/impossible board state).

### Observations & Constraints
- Powered directly by the TypeScript Generator contract defined in [`DEC_001`](../../decisions/DEC_001-strategy-generator-contract.md) and atomic `CellChanged` yields defined in [`DEC_002`](../../decisions/DEC_002-atomic-cell-yielding-and-structured-results.md).
