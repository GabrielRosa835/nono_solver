# DEC_003: Pure Logical Strategy Mapping and Domain Model Enrichment

**Last Updated**: 03/11/2026 20:33
**Status**: Active
**Related Docs**: [`overview.md`](../architecture/overview.md), [`strategies/`](../architecture/strategies/summary.md), [`SRQ_002`](../requisites/system/SRQ_002-domain-driven-board-representation.md)

### Objective
Ensure each solving strategy faithfully implements its specific mathematical deduction rule (so users can observe the difference between basic, greedy, and advanced strategies) while keeping strategy code concise and readable.

### Proposal
1. **Pure Logical Mapping**: Every strategy implementation must strictly match its conceptual specification without taking shortcuts through more advanced logic. For example, [`Intersection.Basic`](../../src/solver/strategies/Intersection.ts) computes overlap across an entire unpartitioned line ignoring `Empty` cells, whereas `Intersection.Smart` explicitly splits the line by `Empty` cells before greedily packing hints.
2. **Domain-Driven Expressions & Enrichment**: Strategy algorithms must express their logic through semantic domain helpers on [`Board`](../../src/solver/Board.ts), [`BoardLine`](../../src/solver/BoardLine.ts), [`Cell`](../../src/solver/Cell.ts), and [`CellSection`](../../src/solver/CellSection.ts). Whenever a strategy requires a general grid or line operation (such as `BoardLine.split`, `BoardLine.isCompleted`, `BoardLine.getMinimalPositionsFromStart`, or `BoardLine.getMinimalPositionsFromEnd`), that operation is extracted into the domain namespace rather than buried inside the strategy file.

### Observations
- Splitting `getMinimalPositions` into `getMinimalPositionsFromStart` and `getMinimalPositionsFromEnd` directly supports bidirectional strategies such as `Anchor.Start` and `Anchor.End`.
- Established during the 02/10/2026 Strategy Implementation session.
