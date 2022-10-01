declare global {
    interface Date {
        toUnix(): number;
        isNow(tolerance: number): boolean;
        daysSince(other: Date): string;
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

Date.prototype.daysSince = function(other = new Date) {
    const days = Math.round((this.getTime() - other.getTime()) / 8.64e7);
    if (days == 0) { return "today"; }
    const denotion = Math.abs(days) == 1 ? " day" : " days";
    const prefix = days > 0 ? "in " : "";
    const suffix = days < 0 ? " ago" : "";
    return `${prefix}${Math.abs(days)}${denotion}${suffix}`;
};

export const nextMonday = () => {
    const date = new Date();
    const miliseconds = date.setDate(date.getDate() + (7 - date.getDay()) % 7 + 1);
    const time = date.getTime() % 8.64e7;
    const day = miliseconds - time;
    return new Date(day);
};
