import { Board, BoardLine, BoardTemplate } from "./Board";
import { completeLines, fillIntersections, smartFillIntersections } from "./solver";

/*       2 1
 *   4 5 2 2 1
 * 4 . . . . .
 * 3 . . . . .
 * 2 . . . . .
 * 5 . . . . .
 * 3 . . . . .
 */

const example: BoardTemplate = {
    size: 5,
    rowHints: [[4], [3], [2], [5], [3]],
    colHints: [[4], [5], [2, 2], [1, 2], [1]],
}

const board = Board.create(example);

Board.print(board);

fillIntersections(board);

Board.print(board);