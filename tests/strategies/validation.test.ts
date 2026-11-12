import { describe, expect, it } from 'vitest';
import { Board } from '../../src/solver/Board';
import { CellStatus } from '../../src/solver/CellStatus';
import { Validation } from '../../src/solver/strategies/validation/Validation.OversizedBlock';

describe('Validation strategies', () => {
  describe('Validation.OversizedBlock', () => {
    it('returns Completed when all filled blocks are within maximum hint constraints', () => {
      const board = Board.create({
        size: 5,
        rows: [[3], [2], [], [], []],
        cols: [[1], [1], [1], [], []],
      });
      // Row 0 has block of size 3 (equal to hint 3)
      board.rows[0].cells[0].status = CellStatus.Filled;
      board.rows[0].cells[1].status = CellStatus.Filled;
      board.rows[0].cells[2].status = CellStatus.Filled;

      const gen = Validation.OversizedBlock(board);
      const res = gen.next();

      expect(res.done).toBe(true);
      expect(res.value).toEqual({
        type: 'Completed',
        strategyName: 'Validation.OversizedBlock',
        message: 'All filled blocks are within maximum hint constraints.',
      });
    });

    it('faults when a contiguous filled block exceeds the maximum hint in a row', () => {
      const board = Board.create({
        size: 5,
        rows: [[2], [], [], [], []],
        cols: [[], [], [], [], []],
      });
      // Draw 3 filled cells on row 0 when max hint is 2
      board.rows[0].cells[0].status = CellStatus.Filled;
      board.rows[0].cells[1].status = CellStatus.Filled;
      board.rows[0].cells[2].status = CellStatus.Filled;

      const gen = Validation.OversizedBlock(board);
      const res = gen.next();

      expect(res.done).toBe(true);
      expect(res.value.type).toBe('Faulted');
      if (res.value.type === 'Faulted') {
        expect(res.value.strategyName).toBe('Validation.OversizedBlock');
        expect(res.value.reason).toContain('Contiguous filled block of length 3 exceeds maximum hint 2 on row 1');
      }
    });

    it('faults when a contiguous filled block exceeds the maximum hint in a column', () => {
      const board = Board.create({
        size: 5,
        rows: [[3], [3], [3], [], []],
        cols: [[], [1], [], [], []],
      });
      // In column 1, max hint is 1. Put filled cells at row 0 and row 1
      board.rows[0].cells[1].status = CellStatus.Filled;
      board.rows[1].cells[1].status = CellStatus.Filled;

      const gen = Validation.OversizedBlock(board);
      const res = gen.next();

      expect(res.done).toBe(true);
      expect(res.value.type).toBe('Faulted');
      if (res.value.type === 'Faulted') {
        expect(res.value.strategyName).toBe('Validation.OversizedBlock');
        expect(res.value.reason).toContain('Contiguous filled block of length 2 exceeds maximum hint 1 on column 2');
      }
    });

    it('faults when filled cells exist on a line with no hints', () => {
      const board = Board.create({
        size: 3,
        rows: [[], [], []],
        cols: [[], [], []],
      });
      board.rows[0].cells[0].status = CellStatus.Filled;

      const gen = Validation.OversizedBlock(board);
      const res = gen.next();

      expect(res.done).toBe(true);
      expect(res.value.type).toBe('Faulted');
      if (res.value.type === 'Faulted') {
        expect(res.value.reason).toContain('exceeds maximum hint 0 on row 1');
      }
    });
  });
});
