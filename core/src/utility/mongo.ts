import { set, pluralize, connect, disconnect, model } from "mongoose";

if (typeof window === "undefined") {
    set("strictQuery", false);
    pluralize(null);
}

export const mongoConnect = async (url: string) => {
    await connect(url);
};

export const mongoDisconnect = async () => {
    await disconnect();
};

export const createModel = (schema: any, name?: string) => {
    return model(name ?? "ephemeral", schema, undefined, { overwriteModels: name == null });
};