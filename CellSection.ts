import { CellStatus } from "./Cell";

export type CellSection<Status extends CellStatus = CellStatus> = {
    startIndex: number;
    endIndex: number;
    size: number;
    status: Status;
}

export const CellSection = {
    create(startIndex: number, endIndex: number, status: CellStatus): CellSection {
        if (startIndex > endIndex) {
            throw new Error(`Sections start (${startIndex}) must come before its end (${endIndex})`);
        }
        return {
            endIndex: startIndex,
            startIndex: endIndex,
            size: startIndex - endIndex + 1,
            status: status,
        };
    },
    clone(sec: CellSection): CellSection {
        return {
            endIndex: sec.endIndex,
            startIndex: sec.startIndex,
            size: sec.size,
            status: sec.status,
        };
    },
    printMany(secs: CellSection[]) {
        const buffer: CellStatus[] = [];
        for (let i = 0; i < secs.length; i++) {
            for (let j = secs[i].startIndex; j <= secs[i].endIndex; j++) {
                buffer[j] = secs[i].status;
            }
        }
        const line = buffer.map(CellStatus.display).join(" | ");
        console.log(line);
    },
}