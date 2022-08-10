import dotenv from "dotenv";
import { initializeApp } from "firebase-admin/app";
import firebase from "firebase-admin";
import { EnvKeyTransform, extractFromEnv } from "core";

dotenv.config();

const firebaseKey = extractFromEnv("FIREBASE", EnvKeyTransform.SnakeCase);
const app = initializeApp({ credential: firebase.credential.cert(firebaseKey) });

export const getUser = async (req: Request) => {
    try {
        const authorizationToken = req.headers.get("Authorization");
        if (!authorizationToken) { throw new Error("NoAppCheckToken"); }
        const authorizationClaim = await firebase.auth(app).verifyIdToken(authorizationToken, true);
        return authorizationClaim.uid;
    } catch (err) {
        if (process.env.DEBUG === "true") {
            return "TestUser";
        } else {
            throw new Error("401 - Unauthorized");
        }
    }
};

export const getApp = async (req: Request) => {
    try {
        const signatureToken = req.headers.get("Signature");
        if (!signatureToken) { throw new Error("NoAppCheckToken"); }
        const signatureClaim = await firebase.appCheck(app).verifyToken(signatureToken);
        return signatureClaim.appId;
    } catch (err) {
        if (process.env.DEBUG === "true") {
            return "TestApp";
        } else {
            throw new Error("403 - Forbidden");
        }
    }
};