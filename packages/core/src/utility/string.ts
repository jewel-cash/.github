
export const queryToObject = (query: string) => {
    return Object.fromEntries(query
        .split(",")
        .map(value => {
            const split = value.split("=");
            return [ split[0], split[1] ];
        }));
};