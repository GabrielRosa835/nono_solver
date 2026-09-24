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

const smallExample: BoardTemplate = {
    size: 5,
    rowHints: [[4], [3], [2], [5], [3]],
    colHints: [[4], [5], [2, 2], [1, 2], [1]],
}

/*        3 5 2 1 1 2 5 3
 *      1 2 3 5 4 4 5 3 2 1
 *  4   . . . . . . . . . .
 *  2 2 . . . . . . . . . .
 *  2 2 . . . . . . . . . .
 *  2 2 . . . . . . . . . .
 *  2 2 . . . . . . . . . .
 *  2 2 . . . . . . . . . .
 *  4   . . . . . . . . . .
 *  6   . . . . . . . . . .
 *  8   . . . . . . . . . .
 * 10   . . . . . . . . . .
 */

const mediumExample: BoardTemplate = {
    size: 10,
    rowHints: [[4], [2, 2], [2, 2], [2, 2], [2, 2], [2, 2], [4], [6] ,[8] , [10]],
    colHints: [[1], [3, 2], [5, 3], [2, 5], [1, 4], [1, 4], [2, 5], [5, 3], [3, 2], [1]],
}

const board = Board.create(smallExample);
Board.print(board);

for(let i = 0; i < 5; i++) {

    console.log(`----- ${i+1} -----`);

    fillIntersections(board);
    Board.print(board);
    
    completeLines(board);
    Board.print(board);

    if (Board.isCompleted(board)) {
        break;
    }

}