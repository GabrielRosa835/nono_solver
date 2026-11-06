# PEN_002: Remaining Strategy Generator Implementations

**Last Updated**: 05/11/2026 20:35
**Status**: Open
**Impacted Areas**: `src/solver/strategies/`, [`strategies/`](../architecture/strategies/summary.md), [`SRQ_001`](../requisites/system/SRQ_001-generator-strategy-execution.md)

### Context & Problem Statement
Out of the 13 concrete solving and validation strategies specified in [`docs/architecture/strategies/`](../architecture/strategies/summary.md), 3 have been implemented as atomic TypeScript Generators under `src/solver/strategies/` (`AutoFill.CompleteLine`, `Intersection.Basic`, and `Intersection.Smart`). The remaining 10 strategies (`Intersection.Perfect`, `Anchor.Start`, `Anchor.End`, `Anchor.Composite`, `Anchor.Overlap`, `Maximal.Basic`, `Maximal.Advanced`, `Validation.OversizedBlock`, `Validation.InsufficientSpace`, `Validation.UnmatchableBlock`) are still marked `Planned` and scheduled for Step 3 after the Interactive UI is completed.

### Open Questions
- In what priority order should the 10 remaining planned strategies be implemented into `src/solver/strategies/`?
- Which default strategy presets (e.g., Basic Human, Advanced Human, Exhaustive) should be offered when invoking `Strategies.Orchestrator`?

### Candidate Approaches
- **Option A (Incremental Family Rollout)**: Implement `Anchor` (`Start`, `End`, `Composite`, `Overlap`), `Validation` (`OversizedBlock`, `InsufficientSpace`, `UnmatchableBlock`), `Maximal` (`Basic`, `Advanced`), and finally `Intersection.Perfect`.
- **Option B (Validation + Anchor First)**: Implement `Validation` and `Anchor.Start`/`Anchor.End` first so the UI can demonstrate `Faulted` states and boundary deductions alongside `Intersection` and `AutoFill`.

### Resolution
Pending resolution (scheduled for Step 3 after Step 2 UI implementation).
