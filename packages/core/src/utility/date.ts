declare global {
    interface Date {
        toUnix(): number;
        isNow(tolerance: number): boolean;
    }
}

Date.prototype.toUnix = function() {
    return Math.floor(this.getTime() / 1000);
};

Date.prototype.isNow = function(tolerance = 300) {
    const timestamp = this.toUnix();
    const now = new Date().toUnix();
    if (timestamp < now - tolerance) { return false; }
    if (timestamp > now + tolerance) { return false; }
    return true;
};

export const nextMonday = () => {
    const date = new Date();
    const miliseconds = date.setDate(date.getDate() + (7 - date.getDay()) % 7 + 1);
    const time = date.getTime() % 8.64e+7;
    const day = miliseconds - time;
    return Math.floor(day / 1000);
};
