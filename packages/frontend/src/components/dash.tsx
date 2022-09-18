import "../styles/dash.css";
import React, { Component } from "react";
import { withAuth0, WithAuth0Props } from "@auth0/auth0-react";
import { IDashboardOverviewResponse } from "core";
import { getDashboardOverview } from "../modules/api";

interface IState {
    overview?: IDashboardOverviewResponse;
    error?: string;
}

class Dash extends Component<WithAuth0Props, IState> {

    constructor(props: WithAuth0Props) {
        super(props);
        this.state = { };
    }

    componentDidMount() {
        this.props.auth0.getAccessTokenSilently()
            .then(getDashboardOverview)
            .then(overview => this.setState({ overview }))
            .catch(_ => this.setState({ error: "Error" }));
    }

    render() {
        return (
            <div className="dash">
                {`Dash\n${this.state.error}\n${this.state.overview?.cumlative}`}
            </div>
        );
    }
}

export default withAuth0(Dash);