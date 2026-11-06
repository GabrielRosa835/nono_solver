# System Requisites Summary

* **[SRQ_001-generator-strategy-execution.md](./SRQ_001-generator-strategy-execution.md)**: Specifies the generator-based `Strategy` and `Orchestrator` execution engine, requiring atomic `CellChanged` yields on every cell mutation and structured `strategyName` metadata across all `StrategyResult` variants.
* **[SRQ_002-domain-driven-board-representation.md](./SRQ_002-domain-driven-board-representation.md)**: Specifies the core solver domain model (`Board`, `BoardLine`, `Cell`, `CellSection`, `Hint`), including shared row/column cell references, branded positive integer hints, line splitting, and bidirectional minimal hint packing.
