import "../styles/trolley.css";
import React, { Component } from "react";
import { withAuth0, WithAuth0Props } from "@auth0/auth0-react";
import { getTrolleyWidget } from "../modules/api";

interface IState {
    widgetLink?: string;
}

class Trolley extends Component<WithAuth0Props, IState> {
    constructor(props: any) {
        super(props);
        this.state = { };
        this.setState = this.setState.bind(this);
    }
    
    componentDidMount() {
        const email = this.props.auth0.user?.email ?? "";
        this.props.auth0.getAccessTokenSilently()
            .then(token => getTrolleyWidget(token, email))
            .then(this.setState)
            .catch(console.log);
    }

    render() {
        return (
            <div className="trolley">
                <div className="spinner" hidden={this.state.widgetLink != null}></div>
                <iframe className="trolley-frame" src={this.state.widgetLink} hidden={this.state.widgetLink == null} />
            </div>
        );
    }
}

export default withAuth0(Trolley);