import "../../styles/dashboard/dash.css";
import React, { Component, ReactNode } from "react";
import { withAuth0, WithAuth0Props } from "@auth0/auth0-react";
import { decodeJwt } from "jose";
import Link from "./link";
import Overview from "./overview";
import Stripe from "./stripe";

interface IState {
    tiles: Array<ReactNode>;
}

const defaultTiles: Array<ReactNode> = [
    <div key="overview" className="tile"><Overview /></div>,
    <div key="link" className="tile"><Link /></div>,
    <div key="stripe" className="tile"><Stripe /></div>
];

const adminTiles: Array<ReactNode> = [
    <div key="7" className="tile">1</div>,
    <div key="8" className="tile">2</div>,
    <div key="9" className="tile">3</div>
];

class Dash extends Component<WithAuth0Props, IState> {

    constructor(props: WithAuth0Props) {
        super(props);
        this.state = { tiles: defaultTiles };
    }

    componentDidMount() {
        this.props.auth0.getAccessTokenSilently()
            .then(token => {
                const claim = decodeJwt(token);
                const roles = claim.permissions as Array<string>;
                if (roles.includes("admin")) {
                    this.setState({ tiles: defaultTiles.concat(adminTiles) });
                }
            });
    }

    render() {
        return (
            <div className="dash">
                {this.state.tiles}
            </div>
        );
    }
}

export default withAuth0(Dash);