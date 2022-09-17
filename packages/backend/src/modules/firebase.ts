import firebase from "firebase-admin";
import { EnvKeyTransform, extractFromEnv } from "core";

const firebaseKey = extractFromEnv("FIREBASE", EnvKeyTransform.SnakeCase);
const app = firebase.initializeApp({ credential: firebase.credential.cert(firebaseKey) });

export const auth = firebase.auth(app);
export const appCheck = firebase.appCheck(app);