# Strategy Documentation Format

All strategies must be documented following this template:

## Goal
The high-level objective of the strategy.

## Logic
Explanation of how to achieve the goal and the algorithm behind it.

## Expectations
A description of what we expect about the state of the game after applying the logic (e.g., specific cells marked empty, or an error/fault state).

## Complexity
An estimated level of complexity compared to other strategies, explaining in a few words why such an estimation was made.

## Codebase
Keeps information that relates the strategy with our code. Must include:
- **Status**: Implemented, Planned, etc.
- **Function**: The function name that implements this strategy.
- **Parameters**: Details about any parameters it takes.

## Observations
A wildcard field for adding extra info. Fill with 'Nothing to add' when no further observation is needed.
