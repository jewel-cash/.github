import "../../styles/dashboard/stripe.css";
import React, { Component } from "react";
import { withAuth0, WithAuth0Props } from "@auth0/auth0-react";
import { getAccountStatus } from "../../modules/api";

interface IState {
    setupCompleted: boolean;
}


class Stripe extends Component<WithAuth0Props, IState> {
    constructor(props: any) {
        super(props);
        this.state = { setupCompleted: false };
    }
    
    componentDidMount() {
        this.props.auth0.getAccessTokenSilently()
            .then(getAccountStatus)
            .then(res => {
                this.setState({ setupCompleted: res.onboarded });
            })
            .catch(console.log);
    }

    render() {
        return (
            <div className="stripe">
                Stripe
                <p>Connected: {`${this.state.setupCompleted}`}</p>
            </div>
        );
    }
}

export default withAuth0(Stripe);