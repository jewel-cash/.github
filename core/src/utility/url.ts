export const URLSchema = {
    type: String,
    get: (x: string): URL => new URL(x),
    set: (x: URL): string => x.toString()
};
