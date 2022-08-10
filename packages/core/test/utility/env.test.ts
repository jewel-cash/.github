import { EnvKeyTransform, extractFromEnv } from "../../src/utility/env.js";

const testEnv = {
    "ABC": "value1",
    "ABC_DEF": "value2",
    "123": "value3",
    "123_456": "value4",
    "ABC_123": "value5",
    "123_ABC": "value6"
}

describe("Key Transform", () => {
    it("Should transform key to valid snake case.", () => {
        const object = extractFromEnv("", EnvKeyTransform.SnakeCase, testEnv);
        expect(Object.keys(object)).toBe(["abc", "abc_def", "123", "123_456", "abc_123", "123_abc"]);
        expect(Object.values(object)).toBe(Object.values(testEnv));
    });
    it("Should transform key to valid camel case.", () => {
        const object = extractFromEnv("", EnvKeyTransform.CamelCase, testEnv);
        expect(Object.keys(object)).toBe(["abc", "abc_def", "123", "123_456", "abc_123", "123_abc"]);
        expect(Object.values(object)).toBe(Object.values(testEnv));
    });
    it("Should transform key to valid pascal case.", () => {
        const object = extractFromEnv("", EnvKeyTransform.PascalCase, testEnv);
        expect(Object.keys(object)).toBe(["abc", "abc_def", "123", "123_456", "abc_123", "123_abc"]);
        expect(Object.values(object)).toBe(Object.values(testEnv));
    });
    it("Should default to snake case.", () => {
        const object = extractFromEnv("", undefined, testEnv);
        expect(Object.keys(object)).toBe(["abc", "abc_def", "123", "123_456", "abc_123", "123_abc"]);
        expect(Object.values(object)).toBe(Object.values(testEnv));
    })
});

describe("Extract Keys", () => {
    it("Should only extract keys with certain prefix.", () => {
        const object = extractFromEnv("ABC", EnvKeyTransform.SnakeCase, testEnv);
        expect(Object.keys(object)).toBe(["abc", "abc_def"]);
    });
});