import { CellStatus } from "./CellStatus";

export type CellSection = {
    startIndex: number;
    endIndex: number;
    size: number;
    status: CellStatus;
}

export const CellSection = {
    create(startIndex: number, endIndex: number, status: CellStatus): CellSection {
        if (startIndex < 0 || endIndex < 0) {
            throw new Error(`Indexes cannot be negative (${startIndex}, ${endIndex})`);
        }
        if (startIndex > endIndex) {
            throw new Error(`Sections start (${startIndex}) must come before its end (${endIndex})`);
        }
        return {
            startIndex: startIndex,
            endIndex: endIndex,
            size: endIndex - startIndex + 1,
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
    print(...secs: CellSection[]) {
        const buffer: CellStatus[] = [];
        for (let i = 0; i < secs.length; i++) {
            for (let j = secs[i].startIndex; j <= secs[i].endIndex; j++) {
                buffer.push(secs[i].status);
            }
        }
        const line = buffer.map(CellStatus.display).join(" | ");
        console.log(line);
    },
    merge(first: CellSection, second: CellSection): CellSection {
        if (first.status !== second.status) {
            throw new Error(`Sections with different statuses cannot be merged (${CellStatus.name(first.status)}, ${CellStatus.name(second.status)})`);
        }
        return CellSection.create(
            Math.min(first.startIndex, second.startIndex), 
            Math.max(first.endIndex, second.endIndex), 
            first.status);
    }
}