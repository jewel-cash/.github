import BigNumber from "bignumber.js";
import { Schema, SchemaType, AnyObject } from "mongoose";

export class PreciseNumber extends BigNumber { }

export class PreciseNumberSchema extends SchemaType<BigNumber> {
    constructor(key: string, options: AnyObject) {
        super(key, options, "BigNumber");
    }
    
    cast(val: any) {
        const value = new BigNumber(val);
        if (value.isNaN()) {
            throw new Error("value for BigNumber cannot be NaN");
        }
        return value;
    }
}

declare module "mongoose" {
    namespace Schema {
        namespace Types {
            class PreciseNumberSchema extends SchemaType {}
        }
    }
}

Schema.Types.PreciseNumberSchema = PreciseNumberSchema;
