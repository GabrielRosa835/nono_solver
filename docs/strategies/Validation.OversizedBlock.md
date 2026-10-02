# Validation.OversizedBlock

## Goal
Detect if a continuous block of filled cells has grown too large for the line.

## Logic
Scans the line for isolated continuous `Filled` blocks. If any block's length is strictly greater than the absolute largest hint defined in the line's template, it means a mathematical impossibility has occurred on the board.

## Expectations
If a violation is found, yields `StrategyResult.Faulted`, signaling an invalid state. Otherwise, completes its pass without modifying the board.

## Complexity
**Low**: A simple scan checking block lengths against a static maximum constraint.

## Codebase
- **Status**: Planned
- **Function**: `TBD`
- **Parameters**: `line: BoardLine`

## Observations
Nothing to add.
