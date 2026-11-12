# Anchor.End

**Last Updated**: 08/11/2026 12:15

## Goal
Securely identify and bound the last hint of the line.

## Logic
Scanning backwards from the end (right/bottom), skipping any `Empty` cells: applies the mirrored logic of `Anchor.Start` to bound or complete the last hint.

## Expectations
Expects to place an `Empty` boundary cell before the last hint, or fill the trailing cells of the last hint.

## Complexity
**Low**: Mirrored logic of Anchor.Start, requiring only basic boundary checks.

## Codebase
- **Status**: Implemented
- **Function**: `Anchor.End` (generator in `src/solver/strategies/Anchor.ts`)
- **Parameters**: `board: Board`

## Observations
Nothing to add.
