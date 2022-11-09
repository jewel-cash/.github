import "../styles/transaction.css";
import React, { Component } from "react";
import { IDashboardTransactionsResponse, IDashboardTransactionResponse } from "core";
import { withAuth0, WithAuth0Props } from "@auth0/auth0-react";
import { downloadDashboardTransactions, getDashboardTransactions } from "../modules/api";

interface IState {
    recent?: Array<IDashboardTransactionResponse>;
    top?: Array<IDashboardTransactionResponse>;
}

class Transaction extends Component<WithAuth0Props, IState> {
    constructor(props: WithAuth0Props) {
        super(props);
        this.state = { };
        this.sortTransactions = this.sortTransactions.bind(this);
        this.downloadTransactions = this.downloadTransactions.bind(this);
    }

    componentDidMount() {
        this.props.auth0.getAccessTokenSilently()
            .then(getDashboardTransactions)
            .then(this.sortTransactions)
            .catch(console.log);
    }

    private sortTransactions(response: IDashboardTransactionsResponse) {
        const top = response.transactions.sort((a, b) => b.proceeds - a.proceeds).slice(0, 5);
        const recent = response.transactions.sort((a, b) => a.timestamp - b.timestamp).slice(0, 5);
        this.setState({
            top,
            recent
        });
    }
    
    private downloadTransactions() {
        this.props.auth0.getAccessTokenSilently()
            .then(downloadDashboardTransactions)
            .catch(console.log);
    }

    render() {
        return (
            <div className="transaction">
                <div className="spinner" hidden={this.state.recent != null || this.state.top != null}></div>
                <div className="transaction-recent" hidden={this.state.recent == null}>
                    <span className="transaction-title">Recent Donations</span>
                    <div className="transaction-list">
                        <span className="transaction-empty" hidden={this.state.recent?.length !== 0}>
                            There haven&apos;t been any donations into your account yet
                        </span>
                        { this.state.recent?.map((x, i) => <span key={i}>{x.from}</span>) }
                    </div>
                </div>
                <div className="transaction-top" hidden={this.state.top?.length !== 0}>
                    <span className="transaction-title">Top Donations</span>
                    <div className="transaction-list">
                        <span className="transaction-empty" hidden={this.state.top?.length !== 0}>
                            There haven&apos;t been any donations into your account yet
                        </span>
                        { this.state.top?.map((x, i) => <span key={i}>{x.from}</span>) }
                    </div>
                </div>
                <button className="transaction-download" hidden={this.state.recent == null || this.state.top == null} onClick={this.downloadTransactions}>Download</button>
            </div>
        );
    }
}

export default withAuth0(Transaction);