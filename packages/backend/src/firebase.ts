import { initializeApp } from "firebase-admin/app";
import firebase from "firebase-admin";
import { EnvKeyTransform, extractFromEnv } from "core";

const firebaseKey = extractFromEnv("FIREBASE", EnvKeyTransform.SnakeCase);
const app = initializeApp({ credential: firebase.credential.cert(firebaseKey) });

export const verifyAuthToken = async (token: string) => {
    return await firebase.auth(app).verifyIdToken(token, true);
};

export const verifySignatureToken = async (token: string) => {
    return await firebase.appCheck(app).verifyToken(token);
};
