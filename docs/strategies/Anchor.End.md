# Anchor.End

## Goal
Securely identify and bound the last hint of the line.

## Logic
Scanning backwards from the end (right/bottom), skipping any `Empty` cells: applies the mirrored logic of `Anchor.Start` to bound or complete the last hint.

## Expectations
Expects to place an `Empty` boundary cell before the last hint, or fill the trailing cells of the last hint.

## Complexity
**Low**: Mirrored logic of Anchor.Start, requiring only basic boundary checks.

## Codebase
- **Status**: Planned
- **Function**: `TBD`
- **Parameters**: `line: BoardLine`

## Observations
Nothing to add.
