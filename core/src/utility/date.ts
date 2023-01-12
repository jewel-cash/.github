
export class DateTime {
    private readonly timestamp: number;

    public constructor(timestamp?: number | string) {
        if (timestamp == null) {
            const date = new Date();
            this.timestamp = Math.floor(date.getTime() / 1000);
        } else {
            this.timestamp = typeof timestamp === "string" ? parseInt(timestamp, 10) : timestamp;
        }
    }

    public isNow(tolerance = 300): boolean {
        const now = new DateTime();
        if (this.timestamp < now.timestamp - tolerance) {
            return false;
        }
        if (this.timestamp > now.timestamp + tolerance) {
            return false;
        }
        return true;
    }

    public relativeTo(other = new DateTime()): string {
        const thisBegin = this.timestamp - this.timestamp % 8.64e4;
        const otherBegin = other.timestamp - other.timestamp % 8.64e4;
        const isAfter = thisBegin > otherBegin;
        const diff = Math.abs(thisBegin - otherBegin);
        const days = Math.floor(diff / 8.64e4);
        if (days === 0) { return "today"; }
        const denotion = days === 1 ? " day" : " days";
        const prefix = isAfter ? "in " : "";
        const suffix = isAfter ? "" : " ago";
        return `${prefix}${Math.abs(days)}${denotion}${suffix}`;
    }

    public valueOf(): number {
        return this.timestamp;
    }

    public toString(): string {
        return this.timestamp.toString();
    }
}

export const DateTimeSchema = {
    type: Number,
    get: (x: string): DateTime => new DateTime(x),
    set: (x: DateTime): number => x.valueOf()
};
