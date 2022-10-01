declare global {
    interface Number {
        isNow(tolerance?: number): boolean;
        relativeTo(other?: number): string;
    }
    interface Date {
        toUnix(): number;
    }
}

Date.prototype.toUnix = function() {
    return Math.floor(this.getTime() / 1000);
};

Number.prototype.isNow = function(tolerance = 300) {
    const nowTimestamp = now();
    if (this < nowTimestamp - tolerance) { return false; }
    if (this > nowTimestamp + tolerance) { return false; }
    return true;
};

Number.prototype.relativeTo = function(other = now()) {
    const thisBegin = +this - (+this % 8.64e4);
    const otherBegin = other - (other % 8.64e4);
    const isAfter = thisBegin > otherBegin;
    const diff = Math.abs(thisBegin - otherBegin);
    const days = Math.floor(diff / 8.64e4);
    if (days == 0) { return "today"; }
    const denotion = days == 1 ? " day" : " days";
    const prefix = isAfter ? "in " : "";
    const suffix = isAfter ? "" : " ago";
    return `${prefix}${Math.abs(days)}${denotion}${suffix}`;
};

export const now = () => {
    const date = new Date();
    return Math.floor(date.getTime() / 1000);
};

export const nextMonday = () => {
    const date = new Date();
    const miliseconds = date.setDate(date.getDate() + (7 - date.getDay()) % 7 + 1);
    const time = date.getTime() % 8.64e7;
    const day = miliseconds - time;
    return Math.floor(day / 1000);
};
