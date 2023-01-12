
export enum EnvKeyTransform {
    SnakeCase = 0,
    CamelCase = 1,
    PascalCase = 2
}

const transformKey = (transform: EnvKeyTransform, str: string): string => {
    switch (transform) {
        case EnvKeyTransform.SnakeCase:
            return str.toLowerCase();
        case EnvKeyTransform.CamelCase:
            const pascal = transformKey(EnvKeyTransform.PascalCase, str);
            return `${pascal.slice(0, 1).toLowerCase()}${pascal.slice(1)}`;
        case EnvKeyTransform.PascalCase:
            return str
                .split("_")
                .map(x => `${x.slice(0, 1).toUpperCase()}${x.slice(1).toLowerCase()}`)
                .join("");
        default: return str;
    }
};

export const extractFromEnv = (prefix = "", transform: EnvKeyTransform = EnvKeyTransform.SnakeCase, env: NodeJS.ProcessEnv = process.env): object => {
    const search = prefix.toLowerCase();
    const prefixCount = prefix === "" ? 0 : prefix.length + 1;
    const keys = Object.keys(env);
    const selected = keys.filter(x => x.toLowerCase().startsWith(search));
    const pairs = selected.map(x => [x.slice(prefixCount), env[x] ?? ""]);
    const filtered = pairs.filter(x => x[1] !== "");
    const mappedKeys = filtered.map(x => [transformKey(transform, x[0]), x[1]]);
    return Object.fromEntries(mappedKeys) as object;
};


