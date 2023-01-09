import "../styles/dash.css";
import React, { Component, ReactNode } from "react";
import { withAuth0, WithAuth0Props } from "@auth0/auth0-react";
import { decodeJwt } from "jose";
import Page from "./page";
import Overview from "./overview";
import Trolley from "./trolley";
import Transaction from "./transaction";

interface IState {
    tiles: Array<ReactNode>;
}

const defaultTiles: Array<ReactNode> = [
    <div key="overview" className="tile"><Overview /></div>,
    <div key="transaction" className="tile"><Transaction /></div>,
    <div key="account" className="tile"><Page /></div>,
    <div key="trolley" className="tile"><Trolley /></div>
];

const adminTiles: Array<ReactNode> = [
    <div key="admin-overview" className="tile">Overview</div>,
    <div key="admin-transactions" className="tile">Transactions</div>,
    <div key="admin-users" className="tile">Users</div>,
    <div key="admin-currencies" className="tile">Currency distribution</div>
];

class Dash extends Component<WithAuth0Props, IState> {

    constructor(props: WithAuth0Props) {
        super(props);
        this.state = { tiles: defaultTiles };
        this.showAdminTilesIfNeeded = this.showAdminTilesIfNeeded.bind(this);
    }

    componentDidMount() {
        this.props.auth0.getAccessTokenSilently()
            .then(this.showAdminTilesIfNeeded);
    }

    private showAdminTilesIfNeeded(token: string) {
        const claim = decodeJwt(token);
        const roles = claim.permissions as Array<string>;
        if (roles.includes("admin")) {
            this.setState({ tiles: defaultTiles.concat(adminTiles) });
        }
    }

    render() {
        return (
            <div className="dash">
                <div className="dash-content">
                    {this.state.tiles}
                </div>
            </div>
        );
    }
}

export default withAuth0(Dash);