# AutoFill.CompleteLine

## Goal
Complete lines that already have all of their required hints perfectly placed on the board.

## Logic
Checks if a specific line (row or column) has the exact same number of `Filled` blocks as the amount of hints, and that every block matches its corresponding hint size perfectly. If true, it sweeps through all the cells in that line and marks any remaining `Unknown` cells as `Empty` (crossing them out).

## Expectations
Expects to fill all `Unknown` cells in the line with `Empty`. If the line is not fully completed, no changes are made.

## Complexity
**Basic**: One of the most basic strategies that can exist, given how few decisions and checks are needed to execute it.

## Codebase
- **Status**: Implemented
- **Function**: `tryCompleteLine`
- **Parameters**: `line: BoardLine`

## Observations
Serves as the most basic "auto-fill" lower-power strategy.
