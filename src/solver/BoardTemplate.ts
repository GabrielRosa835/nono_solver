export type BoardTemplate = {
    size: number;
    rows: number[][];
    cols: number[][];
};

export namespace BoardTemplate
{
    export function createEmpty(size: number): BoardTemplate
    {
        return {
            size,
            rows: Array.from({ length: size }, () => []),
            cols: Array.from({ length: size }, () => []),
        };
    }
}