# Maximal.Basic

**Last Updated**: 08/11/2026 12:15

## Goal
Isolate and bound blocks that match the absolute largest hint in the line.

## Logic
Find the maximum hint value for the entire line (e.g., `MAX = 7`). Scan the line for any continuous block of `Filled` cells that has a size exactly equal to `MAX`. Because no hint is larger than `MAX`, this block cannot grow. Safely mark the `Unknown` cells immediately before and after this block as `Empty`.

## Expectations
Expects to bound maximal blocks with `Empty` cells.

## Complexity
**Low-Medium**: Requires scanning the entire line to match block sizes against a globally known maximum.

## Codebase
- **Status**: Implemented
- **Function**: `Maximal.Basic` (generator in `src/solver/strategies/Maximal.ts`)
- **Parameters**: `board: Board`

## Observations
Nothing to add.
