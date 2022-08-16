import "../styles/login.css";
import React, { Component, RefObject } from "react";
import { auth } from "../modules/firebase";
import { AuthProvider, createUserWithEmailAndPassword, GoogleAuthProvider, signInWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import { isValidEmail, isValidPassword } from "core";
import { faGoogle } from "@fortawesome/free-brands-svg-icons";
import { IconDefinition } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

interface IState {
    isCreateAccount: boolean
}

interface ILoginIntegration {
    provider: AuthProvider,
    icon: IconDefinition
}

const loginIntegrations: Array<ILoginIntegration> = [
    { provider: new GoogleAuthProvider(), icon: faGoogle }
];

export default class Login extends Component<any, IState> {
    emailFieldRef: RefObject<HTMLInputElement>;
    passwordFieldRef: RefObject<HTMLInputElement>;
    verifyFieldRef: RefObject<HTMLInputElement>;

    constructor(props: any) {
        super(props);
        this.state = { isCreateAccount: false };
        this.secondaryPressed = this.secondaryPressed.bind(this);
        this.primaryPressed = this.primaryPressed.bind(this);
        this.loginProviderPressed = this.loginProviderPressed.bind(this);
        this.emailFieldRef = React.createRef();
        this.passwordFieldRef = React.createRef();
        this.verifyFieldRef = React.createRef();
    }

    secondaryPressed() {
        this.setState({ isCreateAccount: !this.state.isCreateAccount });
    }

    primaryPressed() {
        const email = this.emailFieldRef.current?.value ?? "";
        const password = this.passwordFieldRef.current?.value ?? "";
        const verify = this.verifyFieldRef.current?.value ?? "";

        if (!isValidEmail(email)) {
            console.log("invalid email");
            return;
        }

        if (!isValidPassword(password)) {
            console.log("invalid pass");
            return;
        }

        if (this.state.isCreateAccount) {
            if (password !== verify) {
                console.log("pass don't match");
                return;
            }   

            createUserWithEmailAndPassword(auth, email, password)
                .catch((error) => {
                    console.log("sign up error" + error);
                });
        } else {
            signInWithEmailAndPassword(auth, email, password)
                .catch((error) => {
                    console.log("sign in error" + error);
                });

        }
    }

    loginProviderPressed(index: number) {
        signInWithPopup(auth, loginIntegrations[index].provider)
            .catch((error) => {
                console.log("sign in error" + error);
            });
    }

    render() {
        return (
            <div className="login-content">
                <span className="login-title">
                    {this.state.isCreateAccount === true ? "Sign up" : "Sign in"}
                </span>
                <input className="login-field" type="email" name="email" placeholder="Email" ref={this.emailFieldRef} />
                <input className="login-field" type="password" name="password" placeholder="Password" ref={this.passwordFieldRef} />
                { this.state.isCreateAccount && <input className="login-field" type="password" name="password" placeholder="Verify password" ref={this.verifyFieldRef} /> }
                <button className="login-button" onClick={this.secondaryPressed}>
                    {this.state.isCreateAccount === true ? "Back" : "Sign up"}
                </button>
                <button className="login-button" onClick={this.primaryPressed}>
                    {this.state.isCreateAccount === true ? "Sign up" : "Sign in"}
                </button>
                <span className="login-separator">Or use a third-party login</span>
                { loginIntegrations.map((x, i) => <FontAwesomeIcon className="login-icon" key={i} icon={x.icon} onClick={() => this.loginProviderPressed(i)}/>) }
                <div className="login-footer">
                    <a className="login-link" href="" target="_blank">Terms of Service</a>
                    <a className="login-link" href="" target="_blank">Privacy Policy</a>
                </div>
            </div>
        );
    }
}