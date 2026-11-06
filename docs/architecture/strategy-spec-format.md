# Strategy Specification Standard

**Last Updated**: 03/11/2026 20:32
**Related Docs**: [`overview.md`](./overview.md), [`strategies/`](./strategies/summary.md), [`DEC_003`](../decisions/DEC_003-pure-logical-mapping-and-domain-enrichment.md)

All nonogram solving and validation strategies in [`docs/architecture/strategies/`](./strategies/summary.md) must be documented following this standardized template:

## Goal
The high-level objective of the strategy.

## Logic
Explanation of how to achieve the goal and the algorithm behind it.

## Expectations
A description of what we expect about the state of the game after applying the logic (e.g., specific cells marked `Empty` or `Filled`, or returning a `StrategyResult.Faulted` state).

## Complexity
An estimated level of complexity compared to other strategies, explaining in a few words why such an estimation was made.

## Codebase
Keeps information that relates the strategy with our code. Must include:
- **Status**: `Implemented`, `Planned`, etc.
- **Function**: The function or generator name that implements this strategy.
- **Parameters**: Details about any parameters it takes (e.g., `board: Board` or `line: BoardLine`).

## Observations
A wildcard field for adding extra info. Fill with `Nothing to add.` when no further observation is needed.
