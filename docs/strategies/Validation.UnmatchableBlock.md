# Validation.UnmatchableBlock

## Goal
Detect if a `Filled` block exists in a section that logically cannot contain it.

## Logic
Checks if an isolated playable section contains `Filled` cells, but all remaining hints for the entire line are too large to physically fit inside that section. If so, it is impossible to resolve that filled cell.

## Expectations
Yields `StrategyResult.Faulted` if a block is unmatchable. Otherwise, completes without changes.

## Complexity
**Medium**: Needs to check isolated sections against the global pool of remaining hints to prove an impossibility.

## Codebase
- **Status**: Planned
- **Function**: `TBD`
- **Parameters**: `line: BoardLine`

## Observations
Nothing to add.
