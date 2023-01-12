
export const queryToObject = (query: string): Record<string, string> => {
    return Object.fromEntries(query
        .split(",")
        .map((value): [string, string] => {
            const split = value.split("=");
            return [split[0], split[1]];
        })) as Record<string, string>;
};
