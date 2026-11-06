# PEN_001: Interactive Board UI & Hint Editing Specification

**Last Updated**: 06/11/2026 18:44
**Status**: Resolved
**Impacted Areas**: `src/App.tsx`, `src/components/NonogramBoard.tsx`, `src/components/HintInput.tsx`, [`URQ_001`](../../requisites/user/URQ_001-interactive-nonogram-board.md), [`URQ_002`](../../requisites/user/URQ_002-strategy-selection-and-playback.md), [`overview.md`](../../architecture/overview.md)

### Context & Problem Statement
Initial UI notes in `notes.txt` defined the core single-page editable board concept (three cell states `Unknown`/`Filled`/`Empty`, a bottom `Filling` vs. `Empty` mode switch, and `-`/`+` buttons at the start of each row and column to remove or add hints). The user further specified that clicking `+` appends a hint defaulting to `1`, and individual hints are editable only when focused, which also reveals stepper buttons on the focused hint component.

### Open Questions
- Should the board support independent width and height dimensions ($N \times M$) or strictly square dimensions ($N \times N$, matching `Board.size` in `src/solver/Board.ts`), and what are the minimum/maximum allowed sizes?
- How should strategy selection and step/run/pause/reset controls be positioned relative to the board and the bottom `Filling`/`Empty` mode switch?

### Candidate Approaches
- **Focus-Activated Hint Input with Steppers (Confirmed)**: Each hint renders as a focusable component defaulting to `1` when added via `+`. Focusing a hint enables editing its integer value and unhides increment/decrement stepper buttons; `-` at the line start removes the last hint.
- **Square Grid & Playback Toolbar (Selected)**: Use a square `size` selector (`2` to `20`) and preset selector (`Small 5x5`, `Medium 10x10`, `Blank`), with strategy selection and Step/Run/Pause/Reset controls grouped in the solver sidebar alongside the board.

### Resolution
Resolved by implementing the single-page Interactive Nonogram UI in [`src/App.tsx`](../../../src/App.tsx), [`src/components/NonogramBoard.tsx`](../../../src/components/NonogramBoard.tsx), and [`src/components/HintInput.tsx`](../../../src/components/HintInput.tsx) fulfilling [`URQ_001`](../../requisites/user/URQ_001-interactive-nonogram-board.md) and [`URQ_002`](../../requisites/user/URQ_002-strategy-selection-and-playback.md):
1. **`HintInput` (`src/components/HintInput.tsx`)**: Renders each hint as a focusable chip that stays read-only with hidden steppers while unfocused; focusing the component enables numeric input (`1..board.size`) and unhides the `−` / `+` stepper buttons.
2. **Row & Column `-` / `+` Controls (`src/components/NonogramBoard.tsx`)**: Placed at the start of every row and column header to remove the last hint or append a new hint defaulting to `1`.
3. **3-State Cells & Bottom Mode Switch (`src/App.tsx`)**: Placed the `Filling Mode` vs. `Empty Mode` radio switch at the bottom of the board stage so clicking cells toggles `Filled <-> Unknown` or `Empty <-> Unknown` accordingly.
4. **Strategy Selection & Generator Playback (`src/App.tsx`)**: Added sidebar controls for selecting active strategies (`Intersection.Basic`, `Intersection.Smart`, `AutoFill.CompleteLine`), stepping atomically, running/pausing with an adjustable step interval (`20–500 ms`), and resetting cells.
