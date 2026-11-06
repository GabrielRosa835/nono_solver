import { useCallback, useEffect, useRef, useState } from 'react';
import './App.css';
import { NonogramBoard } from './components/NonogramBoard';
import { Board, type BoardTemplate } from './solver/Board';
import { CellStatus } from './solver/CellStatus';
import { Examples } from './solver/Examples';
import { Hint } from './solver/Hint';
import { Strategies } from './solver/strategies/Strategies';
import { type Strategy, type StrategyResult } from './solver/strategies/Strategy';

type EditMode = 'Filling' | 'Empty';

type StrategyOption = {
  id: string;
  label: string;
  description: string;
  strategy: Strategy;
};

const AVAILABLE_STRATEGIES: StrategyOption[] = [
  {
    id: 'Intersection.Basic',
    label: 'Intersection.Basic',
    description: 'Fills guaranteed overlaps across full lines without splitting on Empty cells.',
    strategy: Strategies.Intersection.Basic,
  },
  {
    id: 'Intersection.Smart',
    label: 'Intersection.Smart',
    description: 'Splits lines by Empty cells and greedily packs hints into sections.',
    strategy: Strategies.Intersection.Smart,
  },
  {
    id: 'AutoFill.CompleteLine',
    label: 'AutoFill.CompleteLine',
    description: 'Marks remaining Unknown cells as Empty when a line matches all its hints.',
    strategy: Strategies.AutoFill.CompleteLine,
  },
];

type SolverRunState = 'Idle' | 'Running' | 'Paused' | 'Completed' | 'Stalled' | 'Faulted';

function cloneBoardWithResize(prevBoard: Board, nextSize: number): Board {
  const safeSize = Math.max(2, Math.min(20, nextSize));
  const rowsTemplate: number[][] = Array.from({ length: safeSize }, (_, r) => {
    if (r >= prevBoard.size) return [];
    return prevBoard.rows[r].hints.map((h) => Math.min(Number(h), safeSize));
  });
  const colsTemplate: number[][] = Array.from({ length: safeSize }, (_, c) => {
    if (c >= prevBoard.size) return [];
    return prevBoard.cols[c].hints.map((h) => Math.min(Number(h), safeSize));
  });

  const nextBoard = Board.create({
    size: safeSize,
    rows: rowsTemplate,
    cols: colsTemplate,
  });

  const copyLimit = Math.min(prevBoard.size, safeSize);
  for (let r = 0; r < copyLimit; r++) {
    for (let c = 0; c < copyLimit; c++) {
      nextBoard.rows[r].cells[c].status = prevBoard.rows[r].cells[c].status;
    }
  }

  return nextBoard;
}

function createEmptyTemplate(size: number): BoardTemplate {
  return {
    size,
    rows: Array.from({ length: size }, () => []),
    cols: Array.from({ length: size }, () => []),
  };
}

function App() {
  const [board, setBoard] = useState<Board>(() => Board.create(Examples.small));
  const [editMode, setEditMode] = useState<EditMode>('Filling');
  const [selectedStrategyIds, setSelectedStrategyIds] = useState<string[]>(() =>
    AVAILABLE_STRATEGIES.map((s) => s.id),
  );
  const [runState, setRunState] = useState<SolverRunState>('Idle');
  const [stepCount, setStepCount] = useState<number>(0);
  const [lastResult, setLastResult] = useState<StrategyResult | null>(null);
  const [stepDelayMs, setStepDelayMs] = useState<number>(120);

  const workingBoardRef = useRef<Board | null>(null);
  const iteratorRef = useRef<Generator<
    StrategyResult.StepTaken | StrategyResult.CellChanged,
    StrategyResult,
    void
  > | null>(null);

  const resetGeneratorSession = useCallback(() => {
    iteratorRef.current = null;
    workingBoardRef.current = null;
    setRunState('Idle');
    setStepCount(0);
    setLastResult(null);
  }, []);

  const executeSingleStep = useCallback((): boolean => {
    if (selectedStrategyIds.length === 0) {
      return false;
    }

    if (!iteratorRef.current || !workingBoardRef.current) {
      const working = Board.clone(board);
      workingBoardRef.current = working;
      const activeStrategies = AVAILABLE_STRATEGIES.filter((s) =>
        selectedStrategyIds.includes(s.id),
      ).map((s) => s.strategy);

      iteratorRef.current =
        activeStrategies.length === 1
          ? activeStrategies[0](working)
          : Strategies.Orchestrator(working, activeStrategies);
    }

    const res = iteratorRef.current.next();
    const updatedSnapshot = Board.clone(workingBoardRef.current);
    setBoard(updatedSnapshot);
    setLastResult(res.value);

    if (!res.done) {
      setStepCount((c) => c + 1);
      return true;
    }

    // Generator finished
    iteratorRef.current = null;
    workingBoardRef.current = null;
    if (res.value.type === 'Completed') {
      setRunState('Completed');
    } else if (res.value.type === 'Faulted') {
      setRunState('Faulted');
    } else {
      setRunState(Board.isCompleted(updatedSnapshot) ? 'Completed' : 'Stalled');
    }
    return false;
  }, [board, selectedStrategyIds]);

  useEffect(() => {
    if (runState !== 'Running') return;

    const timer = window.setInterval(() => {
      const hasMore = executeSingleStep();
      if (!hasMore) {
        window.clearInterval(timer);
      }
    }, stepDelayMs);

    return () => window.clearInterval(timer);
  }, [executeSingleStep, runState, stepDelayMs]);

  const handleCellClick = (rowIndex: number, colIndex: number) => {
    resetGeneratorSession();
    setBoard((prev) => {
      const next = Board.clone(prev);
      const cell = next.rows[rowIndex].cells[colIndex];
      if (editMode === 'Filling') {
        cell.status =
          cell.status === CellStatus.Filled ? CellStatus.Unknown : CellStatus.Filled;
      } else {
        cell.status =
          cell.status === CellStatus.Empty ? CellStatus.Unknown : CellStatus.Empty;
      }
      return next;
    });
  };

  const handleAddHint = (axis: 'row' | 'col', lineIndex: number) => {
    resetGeneratorSession();
    setBoard((prev) => {
      const next = Board.clone(prev);
      const targetLine = axis === 'row' ? next.rows[lineIndex] : next.cols[lineIndex];
      if (targetLine.hints.length < next.size) {
        targetLine.hints.push(Hint.of(1));
      }
      return next;
    });
  };

  const handleRemoveLastHint = (axis: 'row' | 'col', lineIndex: number) => {
    resetGeneratorSession();
    setBoard((prev) => {
      const next = Board.clone(prev);
      const targetLine = axis === 'row' ? next.rows[lineIndex] : next.cols[lineIndex];
      if (targetLine.hints.length > 0) {
        targetLine.hints.pop();
      }
      return next;
    });
  };

  const handleUpdateHint = (
    axis: 'row' | 'col',
    lineIndex: number,
    hintIndex: number,
    newValue: number,
  ) => {
    resetGeneratorSession();
    setBoard((prev) => {
      const next = Board.clone(prev);
      const targetLine = axis === 'row' ? next.rows[lineIndex] : next.cols[lineIndex];
      const clamped = Math.max(1, Math.min(next.size, Math.floor(newValue)));
      targetLine.hints[hintIndex] = Hint.of(clamped);
      return next;
    });
  };

  const handleSizeChange = (newSize: number) => {
    resetGeneratorSession();
    setBoard((prev) => cloneBoardWithResize(prev, newSize));
  };

  const handleLoadPreset = (template: BoardTemplate) => {
    resetGeneratorSession();
    setBoard(Board.create(template));
  };

  const handleResetCells = () => {
    resetGeneratorSession();
    setBoard((prev) =>
      Board.create({
        size: prev.size,
        rows: prev.rows.map((r) => r.hints.map(Number)),
        cols: prev.cols.map((c) => c.hints.map(Number)),
      }),
    );
  };

  const toggleStrategySelection = (id: string) => {
    resetGeneratorSession();
    setSelectedStrategyIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id],
    );
  };

  const handleStepClick = () => {
    if (runState === 'Running') {
      setRunState('Paused');
      return;
    }
    setRunState('Paused');
    executeSingleStep();
  };

  const handleRunPauseToggle = () => {
    if (runState === 'Running') {
      setRunState('Paused');
    } else {
      setRunState('Running');
    }
  };

  const isSolved = Board.isCompleted(board);

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
                onChange={(e) => {
                  const val = Number.parseInt(e.target.value, 10);
                  if (!Number.isNaN(val)) {
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
                onClick={() => handleLoadPreset(createEmptyTemplate(board.size))}
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
                className={`mode-switch__option ${
                  editMode === 'Filling' ? 'mode-switch__option--active' : ''
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
                className={`mode-switch__option ${
                  editMode === 'Empty' ? 'mode-switch__option--active' : ''
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

            <div className="status-banner" data-status={isSolved ? 'Completed' : runState}>
              <div className="status-banner__row">
                <span className="status-badge">{isSolved ? 'Solved' : runState}</span>
                <span className="step-counter">Steps: {stepCount}</span>
              </div>
              <p className="status-detail">
                {lastResult
                  ? `${lastResult.strategyName} — ${
                      lastResult.type === 'CellChanged'
                        ? 'Updated cell state'
                        : lastResult.type === 'StepTaken'
                          ? lastResult.description
                          : lastResult.type === 'Faulted'
                            ? lastResult.reason
                            : lastResult.message
                    }`
                  : 'Click a cell or hint to edit, or step through active strategies.'}
              </p>
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
            <h2 className="panel-title">Active Strategies</h2>
            <p className="panel-help">
              Select one strategy to run standalone, or multiple to run via{' '}
              <code>Strategies.Orchestrator</code>.
            </p>
            <div className="strategy-list">
              {AVAILABLE_STRATEGIES.map((item) => {
                const checked = selectedStrategyIds.includes(item.id);
                return (
                  <label
                    key={item.id}
                    className={`strategy-item ${checked ? 'strategy-item--active' : ''}`}
                  >
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() => toggleStrategySelection(item.id)}
                    />
                    <div className="strategy-item__body">
                      <span className="strategy-item__name">{item.label}</span>
                      <span className="strategy-item__desc">{item.description}</span>
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
