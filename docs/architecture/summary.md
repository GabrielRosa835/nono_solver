# Architecture Summary

* **[overview.md](./overview.md)**: High-level architecture of Nonosolver, detailing the separation between the core solver domain (`Board`, `BoardLine`, `Cell`, `CellSection`, `Hint`), the generator-based `Strategy` engine (`Orchestrator`), and the React UI.
* **[strategies](./strategies)**: Subdirectory containing specifications for all nonogram solving and validation strategy families (`AutoFill`, `Intersection`, `Anchor`, `Maximal`, and `Validation`), detailing their logic, expectations, and codebase status.
* **[strategy-spec-format.md](./strategy-spec-format.md)**: Defines the mandatory documentation template for every solving and validation strategy specification in `docs/architecture/strategies/`, covering Goal, Logic, Expectations, Complexity, Codebase mapping, and Observations.
