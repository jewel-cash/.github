import "../../styles/dashboard/trolley.css";
import React, { Component } from "react";
import { withAuth0, WithAuth0Props } from "@auth0/auth0-react";
import { getTrolleyWidget } from "../../modules/api";

interface IState {
    widgetLink?: string;
}

class Trolley extends Component<WithAuth0Props, IState> {
    constructor(props: any) {
        super(props);
        this.state = { };
    }
    
    componentDidMount() {
        const email = this.props.auth0.user?.email ?? "";
        this.props.auth0.getAccessTokenSilently()
            .then(token => getTrolleyWidget(token, email))
            .then(res => {
                this.setState({ widgetLink: res.widgetLink });
            }).catch(console.log);
    }

    render() {
        return (
            <div className="trolley">
                { this.state.widgetLink == null && "Loading" }
                { this.state.widgetLink != null && <iframe src={this.state.widgetLink} className="trolley-frame" /> }
            </div>
        );
    }
}

export default withAuth0(Trolley);