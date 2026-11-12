import { describe, expect, it } from 'vitest';
import { Board } from '../../src/solver/Board';
import { CellStatus } from '../../src/solver/CellStatus';
import { Maximal } from '../../src/solver/strategies/maximal/Maximal.Basic';

describe('Maximal solving strategies', () => {
  describe('Maximal.Basic', () => {
    it('bounds a contiguous filled block matching the line max hint with Empty cells on both sides', () => {
      const board = Board.create({
        size: 5,
        rows: [[1, 2], [], [], [], []],
        cols: [[], [], [], [], []],
      });
      // Set cells 1 and 2 to Filled (length 2 === maxHint 2)
      board.rows[0].cells[1].status = CellStatus.Filled;
      board.rows[0].cells[2].status = CellStatus.Filled;

      const gen = Maximal.Basic(board);
      let res = gen.next();
      while (!res.done) {
        expect(res.value.type).toBe('CellChanged');
        expect(res.value.strategyName).toBe('Maximal.Basic');
        res = gen.next();
      }

      // Cells 0 and 3 should be bounded as Empty; cell 4 remains Unknown
      expect(board.rows[0].cells[0].status).toBe(CellStatus.Empty);
      expect(board.rows[0].cells[1].status).toBe(CellStatus.Filled);
      expect(board.rows[0].cells[2].status).toBe(CellStatus.Filled);
      expect(board.rows[0].cells[3].status).toBe(CellStatus.Empty);
      expect(board.rows[0].cells[4].status).toBe(CellStatus.Unknown);
    });

    it('bounds a maximal block when touching the line edge', () => {
      const board = Board.create({
        size: 5,
        rows: [[2], [], [], [], []],
        cols: [[], [], [], [], []],
      });
      board.rows[0].cells[0].status = CellStatus.Filled;
      board.rows[0].cells[1].status = CellStatus.Filled;

      const gen = Maximal.Basic(board);
      let res = gen.next();
      while (!res.done) {
        res = gen.next();
      }

      // Cell 2 should be bounded with Empty
      expect(board.rows[0].cells[2].status).toBe(CellStatus.Empty);
    });

    it('does not bound blocks that are strictly smaller than the maximum hint', () => {
      const board = Board.create({
        size: 5,
        rows: [[3], [], [], [], []],
        cols: [[], [], [], [], []],
      });
      // Block length 2, but max hint is 3
      board.rows[0].cells[1].status = CellStatus.Filled;
      board.rows[0].cells[2].status = CellStatus.Filled;

      const gen = Maximal.Basic(board);
      let res = gen.next();
      while (!res.done) {
        res = gen.next();
      }

      // Cells around it should remain Unknown
      expect(board.rows[0].cells[0].status).toBe(CellStatus.Unknown);
      expect(board.rows[0].cells[3].status).toBe(CellStatus.Unknown);
    });
  });
});
