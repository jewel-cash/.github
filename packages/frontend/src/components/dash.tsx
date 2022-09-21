import "../styles/dash.css";
import React, { Component, ReactNode } from "react";
import { withAuth0, WithAuth0Props } from "@auth0/auth0-react";
import { decodeJwt } from "jose";

interface IState {
    tiles: Array<ReactNode>;
}

const defaultTiles: Array<ReactNode> = [
    <div></div>
];
const adminTiles: Array<ReactNode> = [];

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
                {this.state.tiles.map(x => <div className="tile">{x}</div>)}
            </div>
        );
    }
}

export default withAuth0(Dash);