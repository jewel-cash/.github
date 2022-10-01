import "../../styles/dashboard/stripe.css";
import React, { Component } from "react";

interface IState {
    setupCompleted: boolean;
}


export default class Stripe extends Component<any, IState> {
    constructor(props: any) {
        super(props);
        this.state = { setupCompleted: false };
    }
    
    componentDidMount() {
        
    }

    render() {
        return (
            <div className="stripe">
                Stripe
            </div>
        );
    }
}