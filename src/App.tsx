import './App.css';
import { AvailableStrategies } from './AvailableStrategies';
import { NonogramBoard } from './components/NonogramBoard/NonogramBoard';
import { BoardTemplate } from "./solver/BoardTemplate";
import { Examples } from './solver/Examples';
import { useAppState } from './useAppState';

function App()
{
  const {
    board,
    editMode,
    selectedStrategyIds,
    lastResult,
    stepCount,
    isSolved,
    hadFlawedMutations,
    runState,
    stepDelayMs,
    setStepDelayMs,
    setEditMode,
    toggleStrategySelection,
    handleRunPauseToggle,
    handleStepClick,
    handleAddHint,
    handleApplyPreset,
    handleCellClick,
    handleLoadPreset,
    handleRemoveLastHint,
    handleResetCells,
    handleSizeChange,
    handleUpdateHint,
  } = useAppState();

  return (
    <main className="app-shell">
      <header className="app-header">
        <div>
          <h1 className="app-title">Nonosolver</h1>
          <p className="app-subtitle">
            Interactive nonogram builder &amp; step-by-step strategy visualizer
          </p>
        </div>

        <div className="toolbar-group">
          <label className="control-field">
            <span>Grid Size</span>
            <div className="size-stepper">
              <button
                type="button"
                className="btn btn--icon"
                aria-label="Decrease board size"
                disabled={board.size <= 2}
                onClick={() => handleSizeChange(board.size - 1)}
              >
                −
              </button>
              <input
                type="number"
                min={2}
                max={20}
                value={board.size}
                onChange={(e) =>
                {
                  const val = Number.parseInt(e.target.value, 10);
                  if (!Number.isNaN(val))
                  {
                    handleSizeChange(val);
                  }
                }}
              />
              <button
                type="button"
                className="btn btn--icon"
                aria-label="Increase board size"
                disabled={board.size >= 20}
                onClick={() => handleSizeChange(board.size + 1)}
              >
                +
              </button>
            </div>
          </label>

          <div className="control-field">
            <span>Presets</span>
            <div className="btn-row">
              <button
                type="button"
                className="btn"
                onClick={() => handleLoadPreset(Examples.small)}
              >
                Small (5×5)
              </button>
              <button
                type="button"
                className="btn"
                onClick={() => handleLoadPreset(Examples.medium)}
              >
                Medium (10×10)
              </button>
              <button
                type="button"
                className="btn"
                onClick={() => handleLoadPreset(BoardTemplate.createEmpty(board.size))}
              >
                Blank ({board.size}×{board.size})
              </button>
            </div>
          </div>
        </div>
      </header>

      <section className="workspace-grid">
        <div className="board-stage">
          <div className="board-scroll-container">
            <NonogramBoard
              board={board}
              onCellClick={handleCellClick}
              onAddHint={handleAddHint}
              onRemoveLastHint={handleRemoveLastHint}
              onUpdateHint={handleUpdateHint}
            />
          </div>

          {/* Bottom Mode Switch ('Filling' vs 'Empty') */}
          <div className="mode-switch-bar" role="region" aria-label="Cell editing mode">
            <span className="mode-switch-label">Click Mode:</span>
            <div className="mode-switch" role="radiogroup" aria-label="Cell click mode">
              <button
                type="button"
                role="radio"
                aria-checked={editMode === 'Filling'}
                className={`mode-switch__option ${editMode === 'Filling' ? 'mode-switch__option--active' : ''
                  }`}
                onClick={() => setEditMode('Filling')}
              >
                <span className="mode-preview mode-preview--filled" aria-hidden="true" />
                Filling Mode
              </button>
              <button
                type="button"
                role="radio"
                aria-checked={editMode === 'Empty'}
                className={`mode-switch__option ${editMode === 'Empty' ? 'mode-switch__option--active' : ''
                  }`}
                onClick={() => setEditMode('Empty')}
              >
                <span className="mode-preview mode-preview--empty" aria-hidden="true">
                  ×
                </span>
                Empty Mode
              </button>
            </div>
          </div>
        </div>

        <aside className="solver-sidebar">
          <div className="panel-card">
            <h2 className="panel-title">Solver Playback</h2>

            <div
              className={`status-banner ${runState === 'Faulted' ? 'status-banner--fault-flare' : ''}`}
              data-status={isSolved ? 'Completed' : runState}
            >
              <div className="status-banner__row">
                <span className="status-badge">{isSolved ? 'Solved' : runState}</span>
                <span className="step-counter">Steps: {stepCount}</span>
              </div>
              <p className="status-detail">
                {lastResult
                  ? `${lastResult.strategyName} — ${lastResult.type === 'CellChanged'
                    ? 'Updated cell state'
                    : lastResult.type === 'StepTaken'
                      ? lastResult.description
                      : lastResult.type === 'Faulted'
                        ? lastResult.reason
                        : lastResult.message
                  }`
                  : 'Click a cell or hint to edit, or step through active strategies.'}
              </p>
              {(runState === 'Stalled' || runState === 'Faulted') && hadFlawedMutations && (
                <div className="status-warning-callout" role="alert">
                  <strong>⚠️ Warning:</strong> A flawed heuristic strategy (<code>Intersection.Smart</code>) was active and modified cells in this session. Its naive greedy logic may have placed invalid cells, causing the solver to stall or fail.
                </div>
              )}
            </div>

            <div className="playback-controls">
              <button
                type="button"
                className="btn btn--primary"
                disabled={selectedStrategyIds.length === 0}
                onClick={handleRunPauseToggle}
              >
                {runState === 'Running' ? 'Pause' : 'Run'}
              </button>
              <button
                type="button"
                className="btn"
                disabled={selectedStrategyIds.length === 0 || runState === 'Running'}
                onClick={handleStepClick}
              >
                Step
              </button>
              <button type="button" className="btn" onClick={handleResetCells}>
                Reset Cells
              </button>
            </div>

            <label className="speed-control">
              <div className="speed-control__header">
                <span>Step Interval</span>
                <span>{stepDelayMs} ms</span>
              </div>
              <input
                type="range"
                min={20}
                max={500}
                step={20}
                value={stepDelayMs}
                onChange={(e) => setStepDelayMs(Number(e.target.value))}
              />
            </label>
          </div>

          <div className="panel-card">
            <div className="panel-header-row">
              <h2 className="panel-title">Active Strategies</h2>
              <div className="strategy-presets" role="group" aria-label="Strategy selection presets">
                <button
                  type="button"
                  className="btn btn--preset"
                  onClick={() => handleApplyPreset('sound')}
                  title="Select only mathematically sound strategies"
                >
                  Sound Only
                </button>
                <button
                  type="button"
                  className="btn btn--preset"
                  onClick={() => handleApplyPreset('all')}
                  title="Select all available strategies"
                >
                  All
                </button>
                <button
                  type="button"
                  className="btn btn--preset"
                  onClick={() => handleApplyPreset('validation')}
                  title="Toggle validation sanity checkers"
                >
                  ± Validation
                </button>
              </div>
            </div>
            <p className="panel-help">
              Select one strategy to run standalone, or multiple to run via{' '}
              <code>Strategies.Orchestrator</code>.
            </p>
            <div className="strategy-list">
              {AvailableStrategies.map((item) =>
              {
                const checked = selectedStrategyIds.includes(item.id);
                const isFlawed = item.tier === 'flawed';
                const isValidation = item.tier === 'validation';
                return (
                  <label
                    key={item.id}
                    className={`strategy-item ${checked ? 'strategy-item--active' : ''} ${isFlawed ? 'strategy-item--flawed' : ''
                      } ${isValidation ? 'strategy-item--validation' : ''}`}
                  >
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() => toggleStrategySelection(item.id)}
                    />
                    <div className="strategy-item__body">
                      <div className="strategy-item__header">
                        <span className="strategy-item__name">{item.label}</span>
                        {isFlawed && (
                          <span className="strategy-badge strategy-badge--flawed" title="Naive / Flawed Logic">
                            ⚠️ Flawed
                          </span>
                        )}
                        {isValidation && (
                          <span className="strategy-badge strategy-badge--validation" title="Sanity Checker">
                            🛡️ Validation
                          </span>
                        )}
                        {!isFlawed && !isValidation && (
                          <span className="strategy-badge strategy-badge--sound" title="Mathematically Sound">
                            ✓ Sound
                          </span>
                        )}
                      </div>
                      <span className="strategy-item__desc">{item.description}</span>
                      {item.warningNote && (
                        <span className="strategy-item__warning-note">
                          {item.warningNote}
                        </span>
                      )}
                    </div>
                  </label>
                );
              })}
            </div>
          </div>
        </aside>
      </section>
    </main>
  );
}

export default App;
