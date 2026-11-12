import { describe, expect, it } from 'vitest';
import { Board } from '../../src/solver/Board';
import { CellStatus } from '../../src/solver/CellStatus';
import { Examples } from '../../src/solver/Examples';
import { Strategies } from '../../src/solver/strategies/Strategies';

describe('Strategies.Orchestrator integration', () => {
  it('faults the Orchestrator with an informative error when given an invalid board template', () => {
    const invalidBoard = Board.create({
      size: 5,
      rows: [[5, 1], [], [], [], []],
      cols: [[], [], [], [], []],
    });

    const gen = Strategies.Orchestrator(invalidBoard, [Strategies.Intersection.Basic]);
    const res = gen.next();

    expect(res.done).toBe(true);
    expect(res.value).toEqual({
      type: 'Faulted',
      strategyName: 'Orchestrator',
      reason: 'Board is in an invalid state: Hints exceed line length on row 1.',
    });
  });

  it('halts immediately and returns Faulted when a validation strategy detects an invalid state', () => {
    const board = Board.create({
      size: 5,
      rows: [[2], [], [], [], []],
      cols: [[], [], [], [], []],
    });
    // Create an oversized block: 3 filled cells when max hint is 2
    board.rows[0].cells[0].status = CellStatus.Filled;
    board.rows[0].cells[1].status = CellStatus.Filled;
    board.rows[0].cells[2].status = CellStatus.Filled;

    const gen = Strategies.Orchestrator(board, [
      Strategies.Validation.OversizedBlock,
      Strategies.Intersection.Basic,
    ]);

    const res = gen.next();
    expect(res.done).toBe(true);
    expect(res.value.type).toBe('Faulted');
    if (res.value.type === 'Faulted') {
      expect(res.value.strategyName).toBe('Validation.OversizedBlock');
      expect(res.value.reason).toContain('exceeds maximum hint 2 on row 1');
    }
  });

  it('solves valid boards completely with the suite of deterministic sound strategies', () => {
    const board = Board.create(Examples.small);
    const activeStrategies = [
      Strategies.Intersection.Basic,
      Strategies.Anchor.Start,
      Strategies.Anchor.End,
      Strategies.Maximal.Basic,
      Strategies.AutoFill.strategy,
    ];

    const gen = Strategies.Orchestrator(board, activeStrategies);
    let res = gen.next();
    while (!res.done) {
      res = gen.next();
    }

    expect(res.value.type).toBe('Completed');
    expect(Board.isCompleted(board)).toBe(true);
  });
});
