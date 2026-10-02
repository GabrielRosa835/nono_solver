# Session: Strategy Contract Design (2026-09-29)

## Goal
Design the contract for nonogram solving strategies that supports step-by-step processing for an interactive UI.

## Decisions
- **TypeScript Generators**: We decided to use TypeScript Generator functions (`function*`) to represent the solving strategies. 
  - This pattern allows a strategy to `yield` progress information (e.g., cell changes) after each logical step.
  - The Web UI can iterate through the generator to pause, visualize the state, and resume, perfectly fulfilling the step-by-step requirement.
- **No Translation Yet**: Implemented the base contract in `src/solver/canva.ts`, but held off on transcribing existing strategies until the contract is fully settled and reviewed.

## Actions Taken
- Created the initial `docs/` folder structure, including `README.md` and `objectives.md`.
- Replaced the initial draft of `canva.ts` with the new Generator-based strategy contract.
