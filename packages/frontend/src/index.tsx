import "./styles/index.css";
import React, { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./components/app";
import { Auth0Provider } from "@auth0/auth0-react";

const authDomain = process.env.REACT_APP_AUTH0_DOMAIN ?? "";
const authId = process.env.REACT_APP_AUTH0_ID ?? "";
const audience = process.env.REACT_APP_SERVER_URL ?? "";
const redirect = process.env.REACT_APP_REDIRECT_URL ?? "";

const Root = () => {
    return (
        <StrictMode>
            <Auth0Provider domain={authDomain} clientId={authId} redirectUri={redirect} audience={audience}>
                <App />
            </Auth0Provider>
        </StrictMode>
    );
};

const root = document.getElementById("root") ?? new HTMLElement();
createRoot(root).render(<Root />);