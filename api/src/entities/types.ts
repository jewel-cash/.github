import { BigNumber } from "bignumber.js";
import mongoose from "mongoose";

export class BigNumberSchema extends mongoose.SchemaType<BigNumber> {
    constructor(key: string, options: mongoose.AnyObject) {
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
            class BigNumberSchema extends SchemaType {}
        }
    }
}

mongoose.Schema.Types.BigNumberSchema = BigNumberSchema;