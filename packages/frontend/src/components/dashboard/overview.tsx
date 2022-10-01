import "../../styles/dashboard/overview.css";
import React, { Component } from "react";
import { getDashboardOverview } from "../../modules/api";
import { withAuth0, WithAuth0Props } from "@auth0/auth0-react";

interface IState {
    cumlative: string;
    pending: string;
    nextDate: string;
}

class Overview extends Component<WithAuth0Props, IState> {
    constructor(props: WithAuth0Props) {
        super(props);
        this.state = { 
            cumlative: "? USD",
            pending: "? USD",
            nextDate: "?"
        };
    }
    
    componentDidMount() {
        this.props.auth0.getAccessTokenSilently()
            .then(getDashboardOverview)
            .then(res => {
                this.setState({
                    cumlative: `${res.cumlative.toFixed(2)} USD`,
                    pending: `${res.cumlative.toFixed(2)} USD`,
                    nextDate: res.nextPaymentDate.relativeTo()
                });
            }).catch(console.log);
    }

    render() {
        return (
            <div className="overview">
                Dashboard
                <p>Cumlative: {this.state.cumlative}</p>
                <p>Pending: {this.state.pending}</p>
                <p>NextPayment: {this.state.nextDate}</p>
            </div>
        );
    }
}

export default withAuth0(Overview);