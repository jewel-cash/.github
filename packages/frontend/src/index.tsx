import React, { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./components/app";

const Root = () => { 
    return (
        <StrictMode>
            <App />
        </StrictMode>
    );
};

const root = document.getElementById("root") ?? new HTMLElement();
createRoot(root).render(<Root />);