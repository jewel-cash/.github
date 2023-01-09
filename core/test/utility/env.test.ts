import { EnvKeyTransform, extractFromEnv } from "../../src/utility/env";

const testEnv = {
    "ABC": "value1",
    "ABC_DEF": "value2",
    "123": "value3",
    "123_456": "value4",
    "ABC_123": "value5",
    "123_ABC": "value6"
};

it("Should transform key to valid snake case.", () => {
    const object = extractFromEnv("", EnvKeyTransform.SnakeCase, testEnv);
    const expected = {
        "abc": "value1",
        "abc_def": "value2",
        "123": "value3",
        "123_456": "value4",
        "abc_123": "value5",
        "123_abc": "value6"
    };
    expect(object).toStrictEqual(expected);
});

it("Should transform key to valid camel case.", () => {
    const object = extractFromEnv("", EnvKeyTransform.CamelCase, testEnv);
    const expected = {
        "abc": "value1",
        "abcDef": "value2",
        "123": "value3",
        "123456": "value4",
        "abc123": "value5",
        "123Abc": "value6"
    };
    expect(object).toStrictEqual(expected);
});

it("Should transform key to valid pascal case.", () => {
    const object = extractFromEnv("", EnvKeyTransform.PascalCase, testEnv);
    const expected = {
        "Abc": "value1",
        "AbcDef": "value2",
        "123": "value3",
        "123456": "value4",
        "Abc123": "value5",
        "123Abc": "value6"
    };
    expect(object).toStrictEqual(expected);
});

it("Should default to snake case.", () => {
    const object = extractFromEnv("", undefined, testEnv);
    const expected = {
        "abc": "value1",
        "abc_def": "value2",
        "123": "value3",
        "123_456": "value4",
        "abc_123": "value5",
        "123_abc": "value6"
    };
    expect(object).toStrictEqual(expected);
});

it("Should only extract keys with certain prefix.", () => {
    const object = extractFromEnv("ABC", EnvKeyTransform.SnakeCase, testEnv);
    const expected = {
        "": "value1",
        "def": "value2",
        "123": "value5"
    };
    expect(object).toStrictEqual(expected);
});