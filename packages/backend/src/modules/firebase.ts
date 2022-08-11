import dotenv from "dotenv";
import firebase from "firebase-admin";
import { EnvKeyTransform, extractFromEnv } from "core";

dotenv.config();

const firebaseKey = extractFromEnv("FIREBASE", EnvKeyTransform.SnakeCase);
const app = firebase.initializeApp({ credential: firebase.credential.cert(firebaseKey) });

export const auth = firebase.auth(app);
export const appCheck = firebase.appCheck(app);