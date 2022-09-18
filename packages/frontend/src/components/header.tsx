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

    loginPressed() {
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
                    Header
                    <button onClick={this.loginPressed} className="header-login" hidden={!this.props.showLoginButton ?? false}>
                        {this.props.auth0.isAuthenticated ? "Logout" : "Login"}
                    </button>
                </div>
            </div>
        );
    }
}

export default withAuth0(Header);