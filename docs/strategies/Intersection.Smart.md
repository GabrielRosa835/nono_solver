# Intersection.Smart

## Goal
Apply the intersection overlap logic across lines that have been fractured into multiple playable sections by `Empty` cells.

## Logic
1. Splits the line by `Empty` cells.
2. Greedily attempts to pack hints left-to-right into the first section they physically fit.
3. Applies the intersection logic within those assumed sections.

## Expectations
Expects to mark cells as `Filled` based on greedy hint distribution.

## Complexity
**Medium**: Adds a layer of greedy distribution across multiple sections on top of basic intersection logic.

## Codebase
- **Status**: Implemented
- **Function**: `smartFillIntersections`
- **Parameters**: `line: BoardLine`

## Observations
Functions as a "weaker" strategy because its greedy assumption can fail if multiple valid distributions exist. Serves as an educational tool to demonstrate naive algorithms.
