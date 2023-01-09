import { isValidEmail, isValidPassword } from "../../src/utility/regex.js";

it("Valid emails should be marked as valid", () => {
    const array = [
        "abc-d@mail.com",
        "abc.def@mail.com",
        "abc@mail.com",
        "abc_def@mail.com",
        "abc.def@mail.cc",
        "abc.def@mail-archive.com",
        "abc.def@mail.org",
        "abc.def@mail.com"
    ].map(isValidEmail);
    expect(array).not.toContain(false);
});

it("Invalid emails should be marked as invalid", () => {
    const array = [
        "abc..def@mail.com",
        ".abc@mail.com",
        "abc.def@mail.c",
        "abc.def@mail#archive.com",
        "abc.def@mail",
        "abc.def@mail..com"
    ].map(isValidEmail);
    expect(array).not.toContain(true);
});

it("Valid passwords should be marked as valid", () => {
    const array = [
        "abc123ABC!",
        "a1b2c3ABC@",
        "1x7yz8#1A",
        "owEwa%oia1",
        "aope^1Ab",
        "ow&Oawef13",
        "90AWEwoie*"
    ].map(isValidPassword);
    expect(array).not.toContain(false);
});

it("Invalid passwords should be marked as invalid", () => {
    const array = [
        "abc123abc!",
        "abc123ABC",
        "ABC123ABC!",
        "abcxyzABC!",
        "acb123ABC(",
        "acb123ABC)",
        "a1A!"
    ].map(isValidPassword);
    expect(array).not.toContain(true);
});
