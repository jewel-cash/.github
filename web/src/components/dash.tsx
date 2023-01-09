import "../styles/dash.css";
import React, { Component } from "react";
import { withAuth0, WithAuth0Props } from "@auth0/auth0-react";
import { decodeJwt } from "jose";

class Dash extends Component<WithAuth0Props, any> {

    constructor(props: WithAuth0Props) {
        super(props);
    }

    componentDidMount() {
        this.props.auth0.getAccessTokenSilently()
            .then(this.handleAuthToken);
    }

    private handleAuthToken(token: string) {
        const claim = decodeJwt(token);
        const roles = claim.permissions as Array<string>;
        if (roles.includes("admin")) {
            //TODO: Implement:
            console.log("isAdmin: true");
        }
    }

    render() {
        return (
            <div className="dash">
                Hello
            </div>
        );
    }
}

export default withAuth0(Dash);