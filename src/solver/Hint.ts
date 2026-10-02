export type Hint = number & { readonly __brand: unique symbol; };

export namespace Hint {
    export function of(value: number): Hint {
        if (!Number.isInteger(value) || value <= 0) {
            throw Error("Hint must be a positive integer");
        }
        return value as Hint;
    }
}