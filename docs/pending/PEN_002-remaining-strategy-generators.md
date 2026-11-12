# PEN_002: Remaining Strategy Generator Implementations

**Last Updated**: 08/11/2026 12:15
**Status**: Open
**Impacted Areas**: `src/solver/strategies/`, [`strategies/`](../architecture/strategies/summary.md), [`SRQ_001`](../requisites/system/SRQ_001-generator-strategy-execution.md)

### Context & Problem Statement
Out of the 13 concrete solving and validation strategies specified in [`docs/architecture/strategies/`](../architecture/strategies/summary.md), 7 have been implemented as atomic TypeScript Generators under `src/solver/strategies/` (`AutoFill.CompleteLine`, `Intersection.Basic`, `Intersection.Smart`, `Anchor.Start`, `Anchor.End`, `Maximal.Basic`, and `Validation.OversizedBlock`). The remaining 6 strategies (`Intersection.Perfect`, `Anchor.Composite`, `Anchor.Overlap`, `Maximal.Advanced`, `Validation.InsufficientSpace`, `Validation.UnmatchableBlock`) remain marked `Planned`.

### Open Questions
- In what priority order should the remaining 6 planned strategies (`Anchor.Composite`, `Anchor.Overlap`, `Maximal.Advanced`, `Validation.InsufficientSpace`, `Validation.UnmatchableBlock`, `Intersection.Perfect`) be implemented?
- Should `Anchor.Composite` be offered as a distinct atomic generator or as a UI macro preset combining `Anchor.Start` and `Anchor.End`?

### Candidate Approaches
- **Option A (Composite & Advanced Human First)**: Implement `Anchor.Composite`, `Anchor.Overlap`, and `Maximal.Advanced` to complete all human solving techniques.
- **Option B (Full Validation Suite First)**: Implement `Validation.InsufficientSpace` and `Validation.UnmatchableBlock` before finishing with exhaustive `Intersection.Perfect`.

### Resolution
Partially resolved on 08/11/2026 with implementation of `Anchor.Start`, `Anchor.End`, `Maximal.Basic`, and `Validation.OversizedBlock`, along with flawed strategy diagnostic flare in the UI. 6 strategies remain open.
