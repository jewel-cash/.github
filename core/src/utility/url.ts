export const URLSchema = {
    type: String,
    get: (x: string) => new URL(x),
    set: (x: URL) => x.valueOf()
};