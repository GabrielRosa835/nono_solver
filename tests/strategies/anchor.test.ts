import { describe, expect, it } from 'vitest';
import { Board } from '../../src/solver/Board';
import { CellStatus } from '../../src/solver/CellStatus';
import { Anchor } from "../../src/solver/strategies/anchor/Anchor.End";

describe('Anchor solving strategies', () => {
  describe('Anchor.Start', () => {
    it('extends a partially filled block touching the start boundary to hint size and bounds it', () => {
      const board = Board.create({
        size: 5,
        rows: [[3], [], [], [], []],
        cols: [[], [], [], [], []],
      });
      board.rows[0].cells[0].status = CellStatus.Filled;

      const gen = Anchor.Start(board);
      let res = gen.next();
      while (!res.done) {
        expect(res.value.type).toBe('CellChanged');
        expect(res.value.strategyName).toBe('Anchor.Start');
        res = gen.next();
      }

      // Hint 3: cells 0, 1, 2 must be Filled, cell 3 must be bounded with Empty
      expect(board.rows[0].cells[0].status).toBe(CellStatus.Filled);
      expect(board.rows[0].cells[1].status).toBe(CellStatus.Filled);
      expect(board.rows[0].cells[2].status).toBe(CellStatus.Filled);
      expect(board.rows[0].cells[3].status).toBe(CellStatus.Empty);
      expect(board.rows[0].cells[4].status).toBe(CellStatus.Unknown);
    });

    it('bounds an already complete first hint touching boundary with Empty', () => {
      const board = Board.create({
        size: 5,
        rows: [[2], [], [], [], []],
        cols: [[], [], [], [], []],
      });
      board.rows[0].cells[0].status = CellStatus.Filled;
      board.rows[0].cells[1].status = CellStatus.Filled;

      const gen = Anchor.Start(board);
      let res = gen.next();
      while (!res.done) {
        res = gen.next();
      }

      expect(board.rows[0].cells[2].status).toBe(CellStatus.Empty);
    });

    it('skips leading Empty cells to find start boundary', () => {
      const board = Board.create({
        size: 5,
        rows: [[2], [], [], [], []],
        cols: [[], [], [], [], []],
      });
      board.rows[0].cells[0].status = CellStatus.Empty;
      board.rows[0].cells[1].status = CellStatus.Filled;

      const gen = Anchor.Start(board);
      let res = gen.next();
      while (!res.done) {
        res = gen.next();
      }

      // Boundary is index 1. Hint 2 means cells 1 and 2 are Filled, cell 3 is Empty
      expect(board.rows[0].cells[1].status).toBe(CellStatus.Filled);
      expect(board.rows[0].cells[2].status).toBe(CellStatus.Filled);
      expect(board.rows[0].cells[3].status).toBe(CellStatus.Empty);
    });

    it('does nothing when the boundary cell is Unknown', () => {
      const board = Board.create({
        size: 5,
        rows: [[2], [], [], [], []],
        cols: [[], [], [], [], []],
      });
      // cell 0 is Unknown, cell 1 is Filled
      board.rows[0].cells[1].status = CellStatus.Filled;

      const gen = Anchor.Start(board);
      let res = gen.next();
      while (!res.done) {
        res = gen.next();
      }

      // cell 0 and cell 2 are not mutated by Anchor.Start because block does not touch boundary
      expect(board.rows[0].cells[0].status).toBe(CellStatus.Unknown);
      expect(board.rows[0].cells[2].status).toBe(CellStatus.Unknown);
    });
  });

  describe('Anchor.End', () => {
    it('extends a partially filled block touching the end boundary backwards and bounds it', () => {
      const board = Board.create({
        size: 5,
        rows: [[3], [], [], [], []],
        cols: [[], [], [], [], []],
      });
      board.rows[0].cells[4].status = CellStatus.Filled;

      const gen = Anchor.End(board);
      let res = gen.next();
      while (!res.done) {
        res = gen.next();
      }

      // Hint 3: cells 4, 3, 2 are Filled, cell 1 is Empty
      expect(board.rows[0].cells[4].status).toBe(CellStatus.Filled);
      expect(board.rows[0].cells[3].status).toBe(CellStatus.Filled);
      expect(board.rows[0].cells[2].status).toBe(CellStatus.Filled);
      expect(board.rows[0].cells[1].status).toBe(CellStatus.Empty);
      expect(board.rows[0].cells[0].status).toBe(CellStatus.Unknown);
    });

    it('skips trailing Empty cells to find end boundary', () => {
      const board = Board.create({
        size: 5,
        rows: [[2], [], [], [], []],
        cols: [[], [], [], [], []],
      });
      board.rows[0].cells[4].status = CellStatus.Empty;
      board.rows[0].cells[3].status = CellStatus.Filled;

      const gen = Anchor.End(board);
      let res = gen.next();
      while (!res.done) {
        res = gen.next();
      }

      // Boundary is index 3. Hint 2 means cells 3 and 2 are Filled, cell 1 is Empty
      expect(board.rows[0].cells[3].status).toBe(CellStatus.Filled);
      expect(board.rows[0].cells[2].status).toBe(CellStatus.Filled);
      expect(board.rows[0].cells[1].status).toBe(CellStatus.Empty);
    });
  });
});
