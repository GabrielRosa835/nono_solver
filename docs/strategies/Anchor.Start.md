# Anchor.Start

## Goal
Securely identify and bound the first hint of the line.

## Logic
Scanning from the start (left/top), skipping any `Empty` cells: If a `Filled` block touches the boundary and matches the exact size of the first hint, the hint is fully satisfied. We mark the cell immediately after this block as `Empty`. If the boundary is known but the block is only partially filled starting from the boundary, we fill the remaining cells up to the size of the first hint.

## Expectations
Expects to place an `Empty` boundary cell after the first hint, or fill the initial cells of the first hint.

## Complexity
**Low**: Only requires scanning from one edge and performing a simple size match against the first hint.

## Codebase
- **Status**: Planned
- **Function**: `TBD`
- **Parameters**: `line: BoardLine`

## Observations
Nothing to add.
