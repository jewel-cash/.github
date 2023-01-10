import { Schema, SchemaType, AnyObject } from "mongoose";

export class URLSchema extends SchemaType<URL> {
    constructor(key: string, options: AnyObject) {
        super(key, options, "URL");
    }
    
    cast(val: any) {
        return new URL(val);
    }
}

declare module "mongoose" {
    namespace Schema {
        namespace Types {
            class URLSchema extends SchemaType {}
        }
    }
}

Schema.Types.URLSchema = URLSchema;