import BigNumber from "bignumber.js";

export class PreciseNumber extends BigNumber { }

export const PreciseNumberSchema = {
    type: String,
    get: (x: string) => new PreciseNumber(x),
    set: (x: PreciseNumber) => x.valueOf()
};