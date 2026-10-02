import { Board } from "./Board";
import { BoardLine } from "./BoardLine";
import { Hint } from "./Hint";
import { CellSection } from "./CellSection";
import { CellStatus } from "./CellStatus";

export function tryCompleteLine(line: BoardLine) {

    if (!BoardLine.isCompleted(line)) return;

    const secs = BoardLine.split(line);
    let secIndex = 0;

    for (let i = 0; i < line.cells.length; i++) {
        line.cells[i].status = secs[secIndex].status === CellStatus.Unknown
            ? CellStatus.Empty
            : secs[secIndex].status;
        if (i >= secs[secIndex].endIndex) {
            secIndex++;
        }
    }
}

export function basicFillIntersections(line: BoardLine) {
    const secs = BoardLine.split(line, CellStatus.Empty).filter(s => s.status !== CellStatus.Empty);

    if (secs.length !== 1) return;

    let currHintIndex = 0;
    const hints = [line.hints[currHintIndex]];
    let hintsSpaceTaken: number = line.hints[currHintIndex];

    while (++currHintIndex < line.hints.length) {
        const nextSpace = line.hints[currHintIndex] + 1;
        if (hintsSpaceTaken + nextSpace > secs[0].size) break;
        hintsSpaceTaken += nextSpace;
        hints.push(line.hints[currHintIndex]);
    }

    const maxDiff = secs[0].size - hintsSpaceTaken;
    const minimalPos = extractMinimalPositions(hints, secs[0].startIndex);

    for (let j = 0; j < minimalPos.length; j++) {
        for (let k = minimalPos[j].startIndex + maxDiff; k <= minimalPos[j].endIndex; k++) {
            line.cells[k].status = CellStatus.Filled;
        }
    }
}

export function smartFillIntersections(line: BoardLine) {

    const secs = BoardLine.split(line, CellStatus.Empty).filter(s => s.status !== CellStatus.Empty);

    if (secs.length === 0) {
        return;
    }

    let currHintIndex = 0;

    for (let i = 0; i < secs.length; i++) {
        if (currHintIndex >= line.hints.length) break;

        const hints = [line.hints[currHintIndex]];
        let hintsSpaceTaken: number = line.hints[currHintIndex];

        while (++currHintIndex < line.hints.length) {
            const nextSpace = line.hints[currHintIndex] + 1;
            if (hintsSpaceTaken + nextSpace > secs[i].size) {
                break;
            }
            hintsSpaceTaken += nextSpace;
            hints.push(line.hints[currHintIndex]);
        }

        const maxDiff = secs[i].size - hintsSpaceTaken;

        const minimalPos = extractMinimalPositions(hints, secs[i].startIndex);

        for (let j = 0; j < minimalPos.length; j++) {
            for (let k = minimalPos[j].startIndex + maxDiff; k <= minimalPos[j].endIndex; k++) {
                line.cells[k].status = CellStatus.Filled;
            }
        }
    }
}

export function extractMinimalPositions(hints: Hint[], startIndex: number = 0): CellSection[] {

    let currStartIndex = startIndex;
    let currEndIndex = startIndex + hints[0] - 1;

    const positions: CellSection[] = [{
        startIndex: currStartIndex,
        endIndex: currEndIndex,
        size: currEndIndex - currStartIndex + 1,
        status: CellStatus.Unknown,
    }];

    for (let i = 1; i < hints.length; i++) {
        currStartIndex = currStartIndex + hints[i - 1] + 1;
        currEndIndex = currStartIndex + hints[i] - 1;

        positions.push({
            startIndex: currStartIndex,
            endIndex: currEndIndex,
            size: currEndIndex - currStartIndex + 1,
            status: CellStatus.Unknown,
        });
    }

    return positions;
}

export function completeLines(board: Board) {
    for (let i = 0; i < board.size; i++) {
        tryCompleteLine(board.cols[i]);
        tryCompleteLine(board.rows[i]);
    }
}

export function fillIntersections(board: Board) {
    for (let i = 0; i < board.size; i++) {
        smartFillIntersections(board.cols[i]);
        smartFillIntersections(board.rows[i]);
    }
}

export function solveIterating(board: Board, maxIterations: number = 5) {
    for(let i = 0; i < maxIterations; i++) {
        fillIntersections(board);      
        completeLines(board);
        if (Board.isCompleted(board)) {
            break;
        }
    }
}