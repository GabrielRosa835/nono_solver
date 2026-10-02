# Validation.InsufficientSpace

## Goal
Ensure there is still enough physical space left in the line to accommodate all remaining hints.

## Logic
Sums the sizes of all remaining unsolved hints, plus the mandatory `1` `Empty` space between each of them. Counts the number of available `Unknown` and `Filled` cells remaining in the valid sections. If available space is less than required space, the state is faulted.

## Expectations
Yields `StrategyResult.Faulted` if space is insufficient. Otherwise, completes without changes.

## Complexity
**Medium**: Requires accurately calculating the required span of unsolved hints against the scattered available playable sections.

## Codebase
- **Status**: Planned
- **Function**: `TBD`
- **Parameters**: `line: BoardLine`

## Observations
Nothing to add.
