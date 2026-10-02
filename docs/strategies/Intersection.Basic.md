# Intersection.Basic

## Goal
Safely identify and fill overlapping cells when the entire line consists of a single continuous playable section.

## Logic
1. Calculates the "earliest possible" start positions for all hints.
2. Calculates the difference (`maxDiff`) between the available space and the minimum required space.
3. If a hint is larger than `maxDiff`, its earliest and latest positions will overlap. 
4. The strategy strictly fills these overlapping cells with `Filled`.

## Expectations
Expects to mark specific guaranteed overlapping cells as `Filled`.

## Complexity
**Low-Medium**: Requires calculating space differences and minimal positions, but relies on a straightforward mathematical overlap rule without dealing with permutations.

## Codebase
- **Status**: Implemented
- **Function**: `basicFillIntersections`
- **Parameters**: `line: BoardLine`

## Observations
Highly reliable but safely limited to lines without internal `Empty` divisions.
