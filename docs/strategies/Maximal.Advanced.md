# Maximal.Advanced

## Goal
Isolate and bound blocks that match the largest *unsolved* hint.

## Logic
Regressively filters out hints that have already been definitively solved and isolated by other strategies. Determines the new `MAX` among the remaining unsolved hints. Applies the bounding logic of `Maximal.Basic` to the remaining floating blocks.

## Expectations
Expects to bound regressively-maximal blocks with `Empty` cells.

## Complexity
**Medium-High**: Requires tracking the solved state of individual hints before applying the maximal scanning logic.

## Codebase
- **Status**: Planned
- **Function**: `TBD`
- **Parameters**: `line: BoardLine`

## Observations
Nothing to add.
