import { now } from "../../src/utility/date";

it("Now should return unix timestamp", () => {
    const object = now();
    const expected = Math.floor(new Date().getTime() / 1000);
    expect(object).toStrictEqual(expected);
});

it("Should transform date into unix timestamp", () => {
    const object = new Date("2022-09-22T20:21:40Z").toUnix();
    const expected = 1663878100;
    expect(object).toStrictEqual(expected);
});

it("Should be able to determine if a timestamp is now", () => {
    const object = [ now(), now() + 300, now() + 301, now() - 300, now() - 301 ].map(x => x.isNow());
    const expected = [ true, true, false, true, false ];
    expect(object).toStrictEqual(expected);
});

it("Should be able to change the tolerance when determining if a timestamp is now", () => {
    const object = [ now(), now() + 200, now() + 201, now() - 200, now() - 201 ].map(x => x.isNow(200));
    const expected = [ true, true, false, true, false ];
    expect(object).toStrictEqual(expected);
});

it("Should be able to determine the amount of days between to timestamps", () => {
    const oneDay = 8.64e4;
    const twoDays = oneDay * 2;
    const object = [ now(), now() + oneDay, now() + twoDays, now() - oneDay, now() - twoDays ].map(x => x.relativeTo());
    const expected = [ "today", "in 1 day", "in 2 days", "1 day ago", "2 days ago" ];
    expect(object).toStrictEqual(expected);
});