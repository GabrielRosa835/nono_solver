# URQ_001: Interactive & Editable Nonogram Board UI

**Last Updated**: 06/11/2026 18:44
**Category**: User Requirement
**Priority**: Required
**Related Docs**: [`overview.md`](../../architecture/overview.md), [`URQ_002`](./URQ_002-strategy-selection-and-playback.md), [`SRQ_002`](../system/SRQ_002-domain-driven-board-representation.md), [`PEN_001`](../../pending/resolved/PEN_001-interactive-board-ui-design.md)

### Objective & Statement
Provide a single-page interactive web interface where users can visually construct, resize, and edit any valid nonogram board, including toggling individual cell states and adding, removing, or editing row and column hints.

### Acceptance Criteria
- **Variable Grid Dimensions**: Users can configure the board size across a range of positive integer dimensions (`2` to `20`) or select a preset (`Small 5x5`, `Medium 10x10`, `Blank`) to build puzzles of varying sizes.
- **Three Visual Cell States**: Every board cell visually distinguishes between `Unknown` (a clear cell), `Filled` (a filled cell), and `Empty` (a cross `×` inside a clear cell).
- **Mode-Switched Cell Editing**: A mode switch at the bottom of the board toggles between `Filling` mode and `Empty` mode:
  - In **`Filling` mode**, clicking a `Filled` cell turns it into `Unknown`, while clicking an `Unknown` or `Empty` cell turns it into `Filled`.
  - In **`Empty` mode**, clicking an `Empty` cell turns it into `Unknown`, while clicking an `Unknown` or `Filled` cell turns it into `Empty`.
- **Row & Column Hint Controls**: Each row and column start includes `−` (minus) and `+` (plus) buttons to remove the last hint or append a new hint defaulting to `1`. Individual hint components (`HintInput`) allow editing their integer value and unhide stepper buttons only when focused.

### Observations & Constraints
- Implemented in [`src/App.tsx`](../../../src/App.tsx), [`src/components/NonogramBoard.tsx`](../../../src/components/NonogramBoard.tsx), and [`src/components/HintInput.tsx`](../../../src/components/HintInput.tsx) (resolving [`PEN_001`](../../pending/resolved/PEN_001-interactive-board-ui-design.md)).
