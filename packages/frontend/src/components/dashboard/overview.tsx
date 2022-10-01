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
                    cumlative: res.cumlative,
                    pending: res.pending,
                    nextDate: `${res.nextPaymentDate}`
                });
            }).catch(console.log);
    }

    render() {
        return (
            <div className="overview">
                Cumlative: {this.state.cumlative}
                Pending: {this.state.pending}
                NextPayment: {this.state.nextDate}
            </div>
        );
    }
}

export default withAuth0(Overview);