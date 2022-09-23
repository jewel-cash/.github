import "../styles/dash.css";
import React, { Component, ReactNode } from "react";
import { withAuth0, WithAuth0Props } from "@auth0/auth0-react";
import { decodeJwt } from "jose";

interface IState {
    tiles: Array<ReactNode>;
}

const defaultTiles: Array<ReactNode> = [
    <div key="abc" className="tile">1</div>,
    <div key="def" className="tile">2</div>,
    <div key="ghi" className="tile">3</div>,
    <div key="jkl" className="tile">4</div>
];

const adminTiles: Array<ReactNode> = [
    <div key="mno" className="tile">1</div>,
    <div key="pqr" className="tile">2</div>,
    <div key="stu" className="tile">3</div>,
    <div key="vwx" className="tile">4</div>
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