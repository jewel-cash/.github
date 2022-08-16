import React, { StrictMode, useState } from "react";
import { createRoot } from "react-dom/client";
import Home from "./components/home";
import App from "./components/app";
import Header from "./components/header";
import Footer from "./components/footer";
import { auth } from "./modules/firebase";
import "./styles/index.css";
import { onAuthStateChanged } from "firebase/auth";

const Root = () => {
    const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);

    onAuthStateChanged(auth, (user: any) => {
        setIsLoggedIn(user != null);
    });

    return (
        <StrictMode>
            <Header isLoggedIn={isLoggedIn} />
            { isLoggedIn ? <App /> : <Home /> }
            <Footer />
        </StrictMode>
    );
};

const root = document.getElementById("root") ?? new HTMLElement();
createRoot(root).render(<Root />);