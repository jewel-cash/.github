
export enum EnvKeyTransform {
    SnakeCase,
    CamelCase,
    PascalCase
}

export const extractFromEnv = (prefix: string, transform: EnvKeyTransform = EnvKeyTransform.SnakeCase, env: any = process.env) => {
    const search = prefix.toLowerCase();
    const prefixCount = prefix.length + 1;
    const keys = Object.keys(env);
    const selected = keys.filter(x => x.toLowerCase().startsWith(search));
    const pairs = selected.map(x => [ x.slice(prefixCount), env[x] ?? "" ] );
    const filtered = pairs.filter(x => x[1] != "")
    const mappedKeys = filtered.map(x => [transformKey(transform, x[0]), x[1]])
    return Object.fromEntries(mappedKeys)
}

const transformKey = (transform: EnvKeyTransform, str: string): string => {
    switch (transform) {
    case EnvKeyTransform.SnakeCase: 
        return str.toLowerCase();
    case EnvKeyTransform.CamelCase: 
        const pascal = transformKey(EnvKeyTransform.PascalCase, str);
        return `${pascal.charAt(0).toLowerCase()}${pascal.slice(1)}`
    case EnvKeyTransform.PascalCase: 
        return str
            .split("_")
            .map(x => `${x.charAt(0).toUpperCase()}${x.slice(1).toLowerCase()}`)
            .join("");
    }
}