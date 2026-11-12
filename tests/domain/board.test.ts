import { describe, expect, it } from 'vitest';
import { Board } from '../../src/solver/Board';
import { CellStatus } from '../../src/solver/CellStatus';
import { Examples } from '../../src/solver/Examples';

describe('Board domain operations', () => {
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

  it('correctly reports column violations in validateHints', () => {
    const invalidBoard = Board.create({
      size: 5,
      rows: [[], [], [], [], []],
      cols: [[], [3, 3], [], [], []],
    });
    const result = Board.validateHints(invalidBoard);
    expect(result.valid).toBe(false);
    if (!result.valid) {
      expect(result.reason).toContain('Hints exceed line length on column 2');
      expect(result.axis).toBe('col');
      expect(result.index).toBe(1);
    }
  });

  it('clones a board with all cell statuses preserved', () => {
    const board = Board.create(Examples.small);
    board.rows[0].cells[0].status = CellStatus.Filled;
    board.rows[1].cells[2].status = CellStatus.Empty;

    const cloned = Board.clone(board);
    expect(cloned.size).toBe(board.size);
    expect(cloned.rows[0].cells[0].status).toBe(CellStatus.Filled);
    expect(cloned.rows[1].cells[2].status).toBe(CellStatus.Empty);

    // Modifying clone does not mutate original
    cloned.rows[0].cells[0].status = CellStatus.Unknown;
    expect(board.rows[0].cells[0].status).toBe(CellStatus.Filled);
  });

  it('determines if board is completed correctly', () => {
    const board = Board.create({
      size: 2,
      rows: [[2], [1]],
      cols: [[2], [1]],
    });

    // Row 0: [Filled, Filled]
    // Row 1: [Filled, Empty]
    // Col 0: [Filled, Filled] -> 2
    // Col 1: [Filled, Empty] -> 1
    board.rows[0].cells[0].status = CellStatus.Filled;
    board.rows[0].cells[1].status = CellStatus.Filled;
    board.rows[1].cells[0].status = CellStatus.Filled;
    board.rows[1].cells[1].status = CellStatus.Empty;

    expect(Board.isCompleted(board)).toBe(true);

    board.rows[0].cells[0].status = CellStatus.Unknown;
    expect(Board.isCompleted(board)).toBe(false);
  });
});
