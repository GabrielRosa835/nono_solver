import { BoardLine, CellSection, CellStatus, Board } from "./types";

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

export function extractMinimalPositions(line: BoardLine): CellSection[] {

    let currStartIndex = 0;
    let currEndIndex = line.hints[0] - 1;

    const positions: CellSection[] = [{ 
        startIndex: currStartIndex, 
        endIndex: currEndIndex, 
        size: currEndIndex - currStartIndex + 1,
        status: CellStatus.Unknown,
    }];

    for (let i = 1; i < line.hints.length; i++) {
        currStartIndex = currStartIndex + line.hints[i - 1] + 1;
        currEndIndex = currStartIndex + line.hints[i] - 1;

        positions.push({ 
            startIndex: currStartIndex, 
            endIndex: currEndIndex, 
            size: currEndIndex - currStartIndex + 1,
            status: CellStatus.Unknown,
        });
    }
    
    return positions;
}

export function fillLineIntersections(line: BoardLine) {
    const rowHintsSum = line.hints.reduce((prev, curr) => prev + curr);
    const totalSpaceTaken = rowHintsSum + line.hints.length - 1;
    const maximumDifference = line.cells.length - totalSpaceTaken;
    const minimalPos = extractMinimalPositions(line);
    for (let j = 0; j < minimalPos.length; j++) {
        for (let k = minimalPos[j].startIndex + maximumDifference; k <= minimalPos[j].endIndex; k++) {
            line.cells[k].status = CellStatus.Filled;
        }
    }
}