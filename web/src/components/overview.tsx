import "../styles/overview.css";
import React, { Component } from "react";
import { getDashboardOverview } from "../modules/api";
import { withAuth0, WithAuth0Props } from "@auth0/auth0-react";

interface IState {
    cumlative?: number;
    pending?: number;
    nextPaymentDate?: number;
    isLoading: boolean;
}

class Overview extends Component<WithAuth0Props, IState> {
    constructor(props: WithAuth0Props) {
        super(props);
        this.state = { isLoading: true };
        this.setState = this.setState.bind(this);
    }
    
    componentDidMount() {
        this.props.auth0.getAccessTokenSilently()
            .then(getDashboardOverview)
            .then(this.setState)
            .then(() => this.setState({ isLoading: false }))
            .catch(console.log);
    }

    render() {
        return (
            <div className="overview">
                <div className="spinner" hidden={!this.state.isLoading}></div>
                <div className="overview-content" hidden={this.state.isLoading}>
                    <span className="overview-title">Dashboard</span>
                    <span className="overview-sub">Cumlative earnings</span>
                    <span className="overview-main">${this.state.cumlative?.toFixed(2)}</span>
                    <span className="overview-sub">Pending balance</span>
                    <span className="overview-main">${this.state.pending?.toFixed(2)}</span>
                    <span className="overview-sub">Next payment<sup>*</sup></span>
                    <span className="overview-main">{this.state.nextPaymentDate?.relativeTo()}</span>
                    <span className="overview-disclaimer">
                        <sup>*</sup>Pending balance will be paid out only if it exceeds $100. Pending balance not paid out will carry over to the period.
                    </span>
                </div>
            </div>
        );
    }
}

export default withAuth0(Overview);