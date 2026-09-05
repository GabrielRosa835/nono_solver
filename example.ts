import { createBoard, printBoard } from "./helpers";
import { completeLines, fillIntersections } from "./solver";
import { Example } from "./types";

/*       2 1
 *   4 5 2 2 1
 * 4 . . . . .
 * 3 . . . . .
 * 2 . . . . .
 * 5 . . . . .
 * 3 . . . . .
 */

const example: Example = {
    size: 5,
    rowHints: [[4], [3], [2], [5], [3]],
    colHints: [[4], [5], [2, 2], [1, 2], [1]],
}

const board = createBoard(example);

printBoard(board);

fillIntersections(board);

printBoard(board);

completeLines(board);

printBoard(board);

fillIntersections(board);

printBoard(board);