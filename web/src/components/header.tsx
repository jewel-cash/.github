import "../styles/header.css";
import React, { Component } from "react";
import { withAuth0, WithAuth0Props } from "@auth0/auth0-react";

class Header extends Component<WithAuth0Props> {
    constructor(props: WithAuth0Props) {
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

    render() {
        return (
            <div className="header">
                <div className="header-content">
                    <a href="/" className="header-link">
                        <img src="/apple-touch-icon.png" className="header-logo" />
                        <span className="header-title">jewl.app</span>
                    </a>
                    <button onClick={this.loginPressed} className="header-login">
                        {this.props.auth0.isAuthenticated ? "Logout" : "Login"}
                    </button>
                </div>
            </div>
        );
    }
}

export default withAuth0(Header);