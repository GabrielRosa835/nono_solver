# Anchor.Overlap

## Goal
Leverage edge proximity to fill cells, even if the hint isn't perfectly anchored to the boundary yet.

## Logic
If a `Filled` cell is found near the boundary, and it must belong to the first hint, calculate all valid placements for the first hint that encompass this cell. The intersection of these valid placements are guaranteed `Filled` cells.

## Expectations
Expects to mark specific cells as `Filled` near the edges based on intersection logic.

## Complexity
**High**: Combines anchor logic with partial permutation testing to find overlaps, representing an advanced deductive human trick.

## Codebase
- **Status**: Planned
- **Function**: `TBD`
- **Parameters**: `line: BoardLine`

## Observations
A highly advanced human trick.
