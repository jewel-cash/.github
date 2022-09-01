declare global {
    interface Date {
        toUnix(): number
    }
}

Date.prototype.toUnix = () => {
    const date = this ?? new Date();
    return Math.floor(date.getTime() / 1000);
};

export const nextMonday = () => {
    const date = new Date();
    const miliseconds = date.setDate(date.getDate() + (7 - date.getDay()) % 7 + 1);
    const time = date.getTime() % 8.64e+7;
    const day = miliseconds - time;
    return Math.floor(day / 1000);
};