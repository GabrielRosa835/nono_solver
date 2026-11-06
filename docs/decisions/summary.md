# Decisions Summary

* **[DEC_001-strategy-generator-contract.md](./DEC_001-strategy-generator-contract.md)**: Adopts TypeScript Generator functions (`Strategy`) and a composable `Orchestrator` generator so solving algorithms can yield incremental progress and be paused, stepped, or resumed by the interactive React UI.
* **[DEC_002-atomic-cell-yielding-and-structured-results.md](./DEC_002-atomic-cell-yielding-and-structured-results.md)**: Mandates yielding `StrategyResult.CellChanged` immediately after every single cell state mutation for smooth UI animations, and attaches an explicit `strategyName` property to all `StrategyResult` variants.
* **[DEC_003-pure-logical-mapping-and-domain-enrichment.md](./DEC_003-pure-logical-mapping-and-domain-enrichment.md)**: Establishes that each strategy must strictly implement its conceptual deduction level without shortcuts, while reusable line and section operations are extracted into semantic `BoardLine` and `CellSection` helpers.
