import { BoardLine, Board, Hint } from "./Board";
import { CellSection } from "./CellSection";
import { Cell, CellStatus } from "./Cell";

export function log<T>(subject: T): T {
    console.log(subject);
    return subject;
}

export function groupSections(line: BoardLine): CellSection[] {

    let currSec: CellSection = {
        startIndex: 0,
        endIndex: 0,
        size: 1,
        status: line.cells[0].status,
    };

    const positions: CellSection[] = [];

    for (let i = 1; i < line.cells.length; i++) {
        const currCell = line.cells[i];
        if (currSec.status === currCell.status) {
            currSec.endIndex++;
            currSec.size++;
        } else {
            positions.push(currSec);
            currSec = {
                startIndex: currSec.endIndex + 1,
                endIndex: currSec.endIndex + 1,
                size: 1,
                status: currCell.status,
            };
        }
    }
    positions.push(currSec);

    return positions;
}

export function tryCompleteLine(line: BoardLine) {

    if (!isLineCompleted(line)) return;

    const secs = groupSections(line);
    let secIndex = 0;

    for(let i = 0; i < line.cells.length; i++) {
        const cell = line.cells[i];
        const sec = secs[secIndex];
        if (sec.status === CellStatus.Unknown) {
            cell.status = CellStatus.Empty;
        }
        else {
            cell.status = sec.status;
        }
        if (i >= sec.endIndex) {
            secIndex++;
        }
    }
}

export function completeLines(board: Board) {
    for (let i = 0; i < board.size; i++) {
        tryCompleteLine(board.rows[i]);
        tryCompleteLine(board.cols[i]);
    }
}

export function fillIntersections(board: Board) {
    for (let i = 0; i < board.size; i++) {
        fillLineIntersections(board.rows[i]);
        fillLineIntersections(board.cols[i]);
    }
}

export function isLineCompleted(line: BoardLine): boolean {
    const secs = groupSections(line).filter(s => s.status === CellStatus.Filled);
    let completed = false;
    for(let i = 0; i < secs.length; i++) {
        const hint = line.hints[i];
        const sec = secs[i];
        if (hint !== undefined && hint === sec.size) {
            completed = true;
        }
        else {
            completed = false;
        }
    }
    return completed;
}

export function smartExtractLineMinimalPositions(line: BoardLine): CellSection[] {

    const usefulSecs = groupSections(line).filter(s => s.status !== CellStatus.Empty);
    const mergedSecs: CellSection[] = [];

    for (let i = 0; i < usefulSecs.length - 1; i++) {
        if (usefulSecs[i].endIndex === usefulSecs[i + 1].startIndex - 1) {
            mergedSecs.push({
                startIndex: 0,
                size: 0,
                endIndex: 0,
                status: 0,
            });
        }
    }

}

export function extractMinimalPosition(hint: number, sec: CellSection): CellSection<CellStatus.Filled> | null {

    const maxLeftOver = sec.size - hint;

    if (sec.status === CellStatus.Empty || maxLeftOver < 0 || maxLeftOver > hint) {
        return null;
    }

    const startIndex = sec.startIndex + maxLeftOver;
    const endIndex = sec.endIndex - maxLeftOver;

    return {
        startIndex: startIndex,
        endIndex: endIndex,
        size: endIndex - startIndex + 1,
        status: CellStatus.Filled,
    };
}

export function fillLineIntersections(line: BoardLine) {
    const rowHintsSum = line.hints.reduce((prev, curr) => prev + curr);
    const totalSpaceTaken = rowHintsSum + line.hints.length - 1;
    const maximumDifference = line.cells.length - totalSpaceTaken;
    const minimalPos = extractMinimalPositions(line.hints);
    for (let j = 0; j < minimalPos.length; j++) {
        for (let k = minimalPos[j].startIndex + maximumDifference; k <= minimalPos[j].endIndex; k++) {
            line.cells[k].status = CellStatus.Filled;
        }
    }
}

export function extractMinimalPositions(hints: Hint[]): CellSection[] {

    let currStartIndex = 0;
    let currEndIndex = hints[0] - 1;

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