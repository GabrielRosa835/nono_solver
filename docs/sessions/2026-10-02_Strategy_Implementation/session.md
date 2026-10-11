# Session: Strategy Implementation & Domain Enrichment (2026-10-02)

## Goal
Begin implementing core nonogram-solving strategies as TypeScript Generators (`Strategy` contract), ensuring each strategy inherently reflects its specific logical concept without taking shortcuts through more complex logic.

## Decisions
- **Pure Logical Mapping**: Strategies will be implemented to natively match their conceptual logic. For instance, `Intersection.Basic` calculates overlap over an entire line ignoring empty cells, whereas `Intersection.Smart` correctly sections the line based on `Empty` cells.
- **Domain-Driven Expressions**: We will heavily utilize our domain helpers (namespaces like `BoardLine`, `Board`, `CellSection`) to keep the strategy implementations expressive and human-readable.
- **Enriching the Domain**: As we develop new strategies, we will extract common, domain-intrinsic operations into helpers (like `BoardLine.split` or `BoardLine.isCompleted`) rather than burying them inside strategy logic. This builds a robust, semantic foundation for the solver.
- **Event-Driven Generator Design**: Strategies will yield results mimicking an event-driven system to immediately update the UI.
- **Atomic Yielding**: Instead of grouping cell changes into a single `StepTaken` event, strategies must `yield` immediately after every individual cell modification (using `CellChanged`) to support fluid UI animations.
- **Result Metadata Enrichment**: Added `strategyName` explicitly to all result types (`Completed`, `Faulted`, `Stalled`) rather than injecting it into the message string, ensuring structured data access.

## Actions Taken
- Refactored `basicFillIntersections` in `src/solver/solver.ts` to implement pure overlap logic, correcting its previous implementation that "piggybacked" on sectioning logic.
- Implemented `AutoFill.CompleteLine` and `Intersection.Basic` under `src/solver/strategies/` using the atomic yielding pattern (`CellChanged`).
- Split `getMinimalPositions` into `getMinimalPositionsFromStart` and `getMinimalPositionsFromEnd` inside `BoardLine.ts` to natively support bidirectional calculation (paving the way for `Anchor.Start` and `Anchor.End`).
- Updated the `Orchestrator` to seamlessly process the new `CellChanged` events alongside existing `StepTaken` and status events.
