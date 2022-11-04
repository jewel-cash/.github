import "../styles/overview.css";
import React, { Component } from "react";
import { getDashboardOverview } from "../modules/api";
import { withAuth0, WithAuth0Props } from "@auth0/auth0-react";

interface IState {
    cumlative?: number;
    pending?: number;
    nextPaymentDate?: number;
}

class Overview extends Component<WithAuth0Props, IState> {
    constructor(props: WithAuth0Props) {
        super(props);
        this.state = { };
        this.setState = this.setState.bind(this);
    }
    
    componentDidMount() {
        this.props.auth0.getAccessTokenSilently()
            .then(getDashboardOverview)
            .then(this.setState)
            .catch(console.log);
    }

    render() {
        return (
            <div className="overview">
                Dashboard
                <p>Cumlative: {this.state.cumlative?.toFixed(2)} USD</p>
                <p>Pending: {this.state.pending?.toFixed(2)} USD</p>
                <p>NextPayment: {this.state.nextPaymentDate?.relativeTo()}</p>
            </div>
        );
    }
}

export default withAuth0(Overview);