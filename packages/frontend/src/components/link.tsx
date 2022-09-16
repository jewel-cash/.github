import "../styles/link.css";
import React, { Component } from "react";
import { ICryptoTokenResponse } from "core";
import { getTokens } from "../modules/api";

interface IProps {
    link: string;
}

interface IState {
    tokens: Array<ICryptoTokenResponse>;
    error?: string;
}

export default class Link extends Component<IProps, IState> {

    constructor(props: IProps) {
        super(props);
        this.state = { tokens: [] };
    }

    componentDidMount() {
        console.log("a");
        getTokens(this.props.link)
            .then(tokens => this.setState({ tokens }))
            .catch(_ => this.setState({ error: "Not Found" }));
    }

    render() {
        return (
            <div className="link">
                {`Link\n${this.state.error}\n${this.state.tokens.map(x => x.currency)}`}
            </div>
        );
    }
}