import { describe, expect, it } from 'vitest';
import { Board } from '../Board';
import { BoardLine } from '../BoardLine';
import { Examples } from '../Examples';
import { Strategies } from '../strategies/Strategies';

describe('Hint validation and capacity checks', () => {
  it('correctly determines whether a hint can be added to a line', () => {
    // 5-cell line with hint 5 takes 5 cells, cannot add more
    expect(BoardLine.canAddHint([5], 5)).toBe(false);
    // 5-cell line with hints [2, 1] takes 2 + 1 + 1 = 4 cells; adding 1 would require 4 + 1 + 1 = 6 > 5
    expect(BoardLine.canAddHint([2, 1], 5)).toBe(false);
    // 5-cell line with hint 2 takes 2 cells; adding 1 requires 2 + 1 + 1 = 4 <= 5
    expect(BoardLine.canAddHint([2], 5)).toBe(true);
    // empty hints on 5-cell line can add
    expect(BoardLine.canAddHint([], 5)).toBe(true);
  });

  it('correctly calculates the maximum value an existing hint can have without exceeding line space', () => {
    // line size 5, hints [2, 1]: hint 0 can be at most 5 - 1 (other) - 1 (separator) = 3
    expect(BoardLine.getMaxHintValue([2, 1], 0, 5)).toBe(3);
    // hint 1 can be at most 5 - 2 (other) - 1 (separator) = 2
    expect(BoardLine.getMaxHintValue([2, 1], 1, 5)).toBe(2);
    // line size 5, single hint [2]: can be at most 5
    expect(BoardLine.getMaxHintValue([2], 0, 5)).toBe(5);
  });

  it('validates board hints and reports invalid lines', () => {
    const validBoard = Board.create(Examples.small);
    expect(Board.validateHints(validBoard)).toEqual({ valid: true });

    const invalidBoard = Board.create({
      size: 5,
      rows: [[5, 1], [], [], [], []],
      cols: [[], [], [], [], []],
    });
    const result = Board.validateHints(invalidBoard);
    expect(result.valid).toBe(false);
    if (!result.valid) {
      expect(result.reason).toContain('Hints exceed line length on row 1');
      expect(result.axis).toBe('row');
      expect(result.index).toBe(0);
    }
  });

  it('faults the Orchestrator with an informative error when given an invalid board state', () => {
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

  it('solves valid boards normally through the Orchestrator', () => {
    const board = Board.create(Examples.small);
    const gen = Strategies.Orchestrator(board, [
      Strategies.Intersection.Basic,
      Strategies.Intersection.Smart,
      Strategies.AutoFill.CompleteLine,
    ]);

    let res = gen.next();
    while (!res.done) {
      res = gen.next();
    }

    expect(res.value.type).toBe('Completed');
    expect(Board.isCompleted(board)).toBe(true);
  });
});
