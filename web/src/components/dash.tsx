import "../styles/dash.css";
import type { ReactElement } from "react";
import React, { Component } from "react";
import type { WithAuth0Props } from "@auth0/auth0-react";
import { withAuth0 } from "@auth0/auth0-react";
import { decodeJwt } from "jose";
import { coinbaseClient } from "../modules/network";

class Dash extends Component<WithAuth0Props, object> {

    public constructor(props: WithAuth0Props) {
        super(props);
        this.handleAuthToken = this.handleAuthToken.bind(this);
    }

    public componentDidMount(): void {
        this.props.auth0.getAccessTokenSilently()
            .then(this.handleAuthToken.bind(this))
            .catch(console.log);

        coinbaseClient.getProducts()
            .then(x => console.log(x.map(y => y.id)))
            .catch(console.log);
    }

    private handleAuthToken(token: string): void {
        const claim = decodeJwt(token);
        const roles = claim.permissions as Array<string>;
        if (roles.includes("admin")) {
            // TODO: Implement:
            console.log("isAdmin: true");
        }
    }

    public shouldComponentUpdate(): boolean {
        return true;
    }

    public render(): ReactElement {
        return (
            <div className="dash">
                Hello
            </div>
        );
    }
}

export default withAuth0(Dash);
