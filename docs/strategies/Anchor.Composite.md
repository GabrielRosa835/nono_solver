# Anchor.Composite

## Goal
A composite strategy that groups `Anchor.Start` and `Anchor.End`.

## Logic
Executes both atomic strategies sequentially to bound the edges of the line.

## Expectations
Expects to bound or fill hints at both extremes of the line if applicable.

## Complexity
**Low**: Just an orchestrated sequence of two low-complexity atomic strategies.

## Codebase
- **Status**: Planned
- **Function**: `TBD`
- **Parameters**: `line: BoardLine`

## Observations
Nothing to add.
