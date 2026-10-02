# Intersection.Perfect

## Goal
The mathematically flawless approach to finding overlaps in highly fragmented, complex lines.

## Logic
1. Calculates every valid mathematical permutation of distributing the remaining hints across the remaining playable sections.
2. For each valid permutation, it maps out which cells would be `Filled` or `Empty`.
3. It only commits a change to the board if a cell shares the exact same state across 100% of the valid permutations.

## Expectations
Expects to definitively mark overlapping `Filled` and `Empty` cells without making greedy assumptions.

## Complexity
**Highest**: Requires an excessive amount of memory and computations to brute-force all valid permutations, making it something a human would never do by themselves.

## Codebase
- **Status**: Planned
- **Function**: `TBD`
- **Parameters**: `line: BoardLine`

## Observations
Highly computationally intensive and less "human-like", it serves as the ultimate safety net for puzzles that stall out basic human strategies.
