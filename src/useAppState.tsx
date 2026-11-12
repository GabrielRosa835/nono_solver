import React from 'react';
import { Board } from './solver/Board';
import { BoardLine } from './solver/BoardLine';
import type { BoardTemplate } from './solver/BoardTemplate';
import { CellStatus } from './solver/CellStatus';
import { Examples } from './solver/Examples';
import { Hint } from './solver/Hint';
import { type StrategyResult, Strategies } from './solver/strategies';
import type { StrategyGenerator } from './solver/strategies/StrategyGenerator';
import { AvailableStrategies } from './AvailableStrategies';

export type SolverRunState = 'Idle' | 'Running' | 'Paused' | 'Completed' | 'Stalled' | 'Faulted';

export type EditMode = 'Filling' | 'Empty';

export type AppState = {
  board: Board;
  editMode: EditMode;
  selectedStrategyIds: string[];
  lastResult: StrategyResult | null;
  stepCount: number;
  isSolved: boolean;
  hadFlawedMutations: boolean;
  runState: SolverRunState;
  stepDelayMs: number;
  setStepDelayMs: (value: number) => void;
  setEditMode: (value: EditMode) => void;
  toggleStrategySelection: (strategy: string) => void;
  handleRunPauseToggle: () => void;
  handleStepClick: () => void;
  handleAddHint: (axis: 'row' | 'col', lineIndex: number) => void;
  handleApplyPreset: (preset: 'sound' | 'all' | 'validation') => void;
  handleCellClick: (rowIndex: number, colIndex: number) => void;
  handleLoadPreset: (template: BoardTemplate) => void;
  handleRemoveLastHint: (axis: 'row' | 'col', lineIndex: number) => void;
  handleResetCells: () => void;
  handleSizeChange: (newSize: number) => void;
  handleUpdateHint: (axis: 'row' | 'col', lineIndex: number, hintIndex: number, newValue: number) => void;
};

export function useAppState(): AppState
{
  const [board, setBoard] = React.useState<Board>(() => Board.create(Examples.small));
  const [editMode, setEditMode] = React.useState<EditMode>('Filling');
  const [selectedStrategyIds, setSelectedStrategyIds] = React.useState<string[]>(() => AvailableStrategies.filter((s) => s.tier === 'working').map((s) => s.id)
  );
  const [runState, setRunState] = React.useState<SolverRunState>('Idle');
  const [stepCount, setStepCount] = React.useState<number>(0);
  const [lastResult, setLastResult] = React.useState<StrategyResult | null>(null);
  const [stepDelayMs, setStepDelayMs] = React.useState<number>(120);
  const [hadFlawedMutations, setHadFlawedMutations] = React.useState<boolean>(false);

  const workingBoardRef = React.useRef<Board | null>(null);
  const flawedMutationsRef = React.useRef<boolean>(false);
  const iteratorRef = React.useRef<StrategyGenerator | null>(null);

  const resetGeneratorSession = React.useCallback(() =>
  {
    iteratorRef.current = null;
    workingBoardRef.current = null;
    flawedMutationsRef.current = false;
    setHadFlawedMutations(false);
    setRunState('Idle');
    setStepCount(0);
    setLastResult(null);
  }, []);

  const executeSingleStep = React.useCallback((): boolean =>
  {
    if (selectedStrategyIds.length === 0)
    {
      return false;
    }

    if (!iteratorRef.current || !workingBoardRef.current)
    {
      const working = Board.clone(board);
      workingBoardRef.current = working;
      const activeStrategies = AvailableStrategies.filter((s) => selectedStrategyIds.includes(s.id));
      iteratorRef.current = Strategies.Orchestrator(working, activeStrategies);
    }

    const res = iteratorRef.current.next();
    const updatedSnapshot = Board.clone(workingBoardRef.current);
    setBoard(updatedSnapshot);
    setLastResult(res.value);

    if (res.value.strategyName === 'Intersection.Smart' &&
      (res.value.type === 'CellChanged' || (res.value.type === 'StepTaken' && res.value.changedCells > 0)))
    {
      flawedMutationsRef.current = true;
      setHadFlawedMutations(true);
    }

    if (!res.done)
    {
      setStepCount((c) => c + 1);
      return true;
    }

    // Generator finished
    iteratorRef.current = null;
    workingBoardRef.current = null;
    if (res.value.type === 'Completed')
    {
      setRunState('Completed');
    }
    else if (res.value.type === 'Faulted')
    {
      setRunState('Faulted');
    }

    else
    {
      setRunState(Board.isCompleted(updatedSnapshot) ? 'Completed' : 'Stalled');
    }
    return false;
  }, [board, selectedStrategyIds]);

  React.useEffect(() =>
  {
    if (runState !== 'Running') return;

    const timer = window.setInterval(() =>
    {
      const hasMore = executeSingleStep();
      if (!hasMore)
      {
        window.clearInterval(timer);
      }
    }, stepDelayMs);

    return () => window.clearInterval(timer);
  }, [executeSingleStep, runState, stepDelayMs]);

  const handleCellClick = (rowIndex: number, colIndex: number) =>
  {
    resetGeneratorSession();
    setBoard((prev) =>
    {
      const next = Board.clone(prev);
      const cell = next.rows[rowIndex].cells[colIndex];
      if (editMode === 'Filling')
      {
        cell.status =
          cell.status === CellStatus.Filled ? CellStatus.Unknown : CellStatus.Filled;
      }
      else
      {
        cell.status =
          cell.status === CellStatus.Empty ? CellStatus.Unknown : CellStatus.Empty;
      }
      return next;
    });
  };

  const handleAddHint = (axis: 'row' | 'col', lineIndex: number) =>
  {
    resetGeneratorSession();
    setBoard((prev) =>
    {
      const next = Board.clone(prev);
      const targetLine = axis === 'row' ? next.rows[lineIndex] : next.cols[lineIndex];
      if (BoardLine.canAddHint(targetLine.hints, next.size))
      {
        targetLine.hints.push(Hint.of(1));
      }
      return next;
    });
  };

  const handleRemoveLastHint = (axis: 'row' | 'col', lineIndex: number) =>
  {
    resetGeneratorSession();
    setBoard((prev) =>
    {
      const next = Board.clone(prev);
      const targetLine = axis === 'row' ? next.rows[lineIndex] : next.cols[lineIndex];
      if (targetLine.hints.length > 0)
      {
        targetLine.hints.pop();
      }
      return next;
    });
  };

  const handleUpdateHint = (
    axis: 'row' | 'col',
    lineIndex: number,
    hintIndex: number,
    newValue: number
  ) =>
  {
    resetGeneratorSession();
    setBoard((prev) =>
    {
      const next = Board.clone(prev);
      const targetLine = axis === 'row' ? next.rows[lineIndex] : next.cols[lineIndex];
      const maxAllowed = BoardLine.getMaxHintValue(targetLine.hints, hintIndex, next.size);
      const clamped = Math.max(1, Math.min(maxAllowed, Math.floor(newValue)));
      targetLine.hints[hintIndex] = Hint.of(clamped);
      return next;
    });
  };

  const handleSizeChange = (newSize: number) =>
  {
    resetGeneratorSession();
    setBoard((prev) => Board.cloneResizing(prev, newSize));
  };

  const handleLoadPreset = (template: BoardTemplate) =>
  {
    resetGeneratorSession();
    setBoard(Board.create(template));
  };

  const handleResetCells = () =>
  {
    resetGeneratorSession();
    setBoard((prev) => Board.create({
      size: prev.size,
      rows: prev.rows.map((r) => r.hints.map(Number)),
      cols: prev.cols.map((c) => c.hints.map(Number)),
    })
    );
  };

  const toggleStrategySelection = (id: string) =>
  {
    resetGeneratorSession();
    setSelectedStrategyIds((prev) => prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleApplyPreset = (preset: 'sound' | 'all' | 'validation') =>
  {
    resetGeneratorSession();
    if (preset === 'sound')
    {
      setSelectedStrategyIds(
        AvailableStrategies.filter((s) => s.tier === 'working').map((s) => s.id)
      );
    } else if (preset === 'all')
    {
      setSelectedStrategyIds(AvailableStrategies.map((s) => s.id));
    } else if (preset === 'validation')
    {
      setSelectedStrategyIds((prev) =>
      {
        const valIds = AvailableStrategies.filter((s) => s.tier === 'validation').map((s) => s.id);
        const hasAllVal = valIds.every((id) => prev.includes(id));
        if (hasAllVal)
        {
          return prev.filter((id) => !valIds.includes(id));
        }
        else
        {
          return Array.from(new Set([...prev, ...valIds]));
        }
      });
    }
  };

  const handleStepClick = () =>
  {
    if (runState === 'Running')
    {
      setRunState('Paused');
      return;
    }
    setRunState('Paused');
    executeSingleStep();
  };

  const handleRunPauseToggle = () =>
  {
    if (runState === 'Running')
    {
      setRunState('Paused');
    }
    else
    {
      setRunState('Running');
    }
  };

  const isSolved = Board.isCompleted(board);

  return {
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
    handleResetCells,
    handleAddHint,
    handleApplyPreset,
    handleCellClick,
    handleLoadPreset,
    handleRemoveLastHint,
    handleSizeChange,
    handleUpdateHint,
  };
}
