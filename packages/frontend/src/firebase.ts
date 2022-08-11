import { initializeApp } from "firebase/app";
import { getAuth, onIdTokenChanged } from "firebase/auth";
import { getAnalytics } from "firebase/analytics";
import { getPerformance } from "firebase/performance";
import { initializeAppCheck, onTokenChanged, ReCaptchaEnterpriseProvider } from "firebase/app-check";
import { EnvKeyTransform, extractFromEnv } from "core";

const firebaseKey = extractFromEnv("REACT_APP_FIREBASE", EnvKeyTransform.CamelCase);
const app = initializeApp(firebaseKey);



export const appCheck = initializeAppCheck(app, {
    provider: new ReCaptchaEnterpriseProvider(firebaseKey.captchaKey),
    isTokenAutoRefreshEnabled: true
});
export const analytics = getAnalytics(app);
export const performance = getPerformance(app);
export const auth = getAuth(app);

onTokenChanged(appCheck, (result) => {
    console.log(result.token);
});

onIdTokenChanged(auth, async (user) => {
    const token = await user?.getIdTokenResult();
    console.log(token);
});