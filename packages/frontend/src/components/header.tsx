import "../styles/header.css";
import React, { Component } from "react";
import Login from "./login";
import { auth } from "../firebase";

interface IProps {
    isLoggedIn: boolean
}

interface IState {
    showLoginPopup: boolean
}

export default class Header extends Component<IProps, IState> {
    constructor(props: IProps) {
        super(props);
        this.state = { showLoginPopup: false };
        this.loginPressed = this.loginPressed.bind(this);
        this.backgroundPressed = this.backgroundPressed.bind(this);

        auth.onAuthStateChanged(() => {
            this.setState({ showLoginPopup: false });
        });
    }

    loginPressed() {
        if (this.props.isLoggedIn) {
            auth.signOut();
        } else {
            this.setState({ showLoginPopup: true });
        }
    }

    backgroundPressed() {
        this.setState({ showLoginPopup: false });
    }

    render() {
        return (
            <div className="header">
                <div className="header-content">
                    Header
                    <button onClick={this.loginPressed} className="header-login">
                        {this.props.isLoggedIn ? "Logout" : "Login"}
                    </button>
                </div>
                { this.state.showLoginPopup && <button onClick={this.backgroundPressed} className="header-login-background" /> }
                { this.state.showLoginPopup && <Login /> }
            </div>
        );
    }
}