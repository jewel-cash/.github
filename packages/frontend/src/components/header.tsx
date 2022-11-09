import "../styles/header.css";
import React, { Component } from "react";
import { withAuth0, WithAuth0Props } from "@auth0/auth0-react";

interface IProps extends WithAuth0Props {
    showLoginButton?: boolean;
}

class Header extends Component<IProps> {
    constructor(props: IProps) {
        super(props);
        this.loginPressed = this.loginPressed.bind(this);
    }

    private loginPressed() {
        if (this.props.auth0.isAuthenticated) {
            this.props.auth0.logout();
        } else {
            this.props.auth0.loginWithRedirect();
        }
    }

    private isLoginButtonHidden() {
        if (this.props.auth0.isLoading) { return false; }
        return !this.props.showLoginButton;
    }

    render() {
        return (
            <div className="header">
                <div className="header-content">
                    <a href="/" className="header-link">
                        <img src="/apple-touch-icon.png" className="header-logo" />
                        <span className="header-title">jewel.cash</span>
                    </a>
                    <button onClick={this.loginPressed} className="header-login" hidden={this.isLoginButtonHidden()}>
                        {this.props.auth0.isAuthenticated ? "Logout" : "Login"}
                    </button>
                </div>
            </div>
        );
    }
}

export default withAuth0(Header);