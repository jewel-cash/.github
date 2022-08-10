import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getAnalytics } from "firebase/analytics";
import { getPerformance } from "firebase/performance";
import { initializeAppCheck, ReCaptchaEnterpriseProvider } from "firebase/app-check";
import { EnvKeyTransform, extractFromEnv } from "core";

console.log(process.env);

const firebaseKey = extractFromEnv("REACT_APP_FIREBASE", EnvKeyTransform.CamelCase);
const app = initializeApp(firebaseKey);

export const sginature = initializeAppCheck(app, {
    provider: new ReCaptchaEnterpriseProvider(firebaseKey.captchaKey),
    isTokenAutoRefreshEnabled: true
});

export const analytics = getAnalytics(app);
export const performance = getPerformance(app);
export const auth = getAuth(app);