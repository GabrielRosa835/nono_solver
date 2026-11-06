# SRQ_002: Domain-Driven Board & Line Representation

**Last Updated**: 03/11/2026 20:34
**Category**: System Requirement
**Priority**: Required
**Related Docs**: [`overview.md`](../../architecture/overview.md), [`DEC_003`](../../decisions/DEC_003-pure-logical-mapping-and-domain-enrichment.md), [`URQ_001`](../user/URQ_001-interactive-nonogram-board.md)

### Objective & Statement
The solver domain must model the nonogram grid using shared cell references between rows and columns and expose semantic helper operations on `Board`, `BoardLine`, `Cell`, `CellSection`, and `Hint` so strategies remain expressive and free of low-level array manipulation.

### Acceptance Criteria
- **Shared Cell References**: `Board.create(template)` constructs a single pool of `Cell` objects referenced by both `board.rows` and `board.cols`, ensuring any mutation to a cell in a row is immediately visible in its intersecting column.
- **Validated Hints**: All row and column clues are validated as positive integers via the branded `Hint.of(value)` constructor.
- **Bidirectional Minimal Packing**: `BoardLine.getMinimalPositionsFromStart` and `BoardLine.getMinimalPositionsFromEnd` compute tight earliest and latest `CellSection` placements for a sequence of hints.
- **Line Splitting & Completion Checks**: `BoardLine.split(line, byStatus?)` partitions a line into contiguous `CellSection` ranges, and `BoardLine.isCompleted(line)` verifies whether all `Filled` sections exactly match the line's `Hint[]` sequence.

### Observations & Constraints
- Implemented across [`Board.ts`](../../../src/solver/Board.ts), [`BoardLine.ts`](../../../src/solver/BoardLine.ts), [`Cell.ts`](../../../src/solver/Cell.ts), [`CellSection.ts`](../../../src/solver/CellSection.ts), and [`Hint.ts`](../../../src/solver/Hint.ts).
