# Validation.OversizedBlock

**Last Updated**: 08/11/2026 12:15

## Goal
Detect if a continuous block of filled cells has grown too large for the line.

## Logic
Scans the line for isolated continuous `Filled` blocks. If any block's length is strictly greater than the absolute largest hint defined in the line's template, it means a mathematical impossibility has occurred on the board.

## Expectations
If a violation is found, returns `StrategyResult.Faulted`, signaling an invalid state. Otherwise, completes its pass without modifying the board.

## Complexity
**Low**: A simple scan checking block lengths against a static maximum constraint.

## Codebase
- **Status**: Implemented
- **Function**: `Validation.OversizedBlock` (generator in `src/solver/strategies/Validation.ts`)
- **Parameters**: `board: Board`

## Observations
Nothing to add.
