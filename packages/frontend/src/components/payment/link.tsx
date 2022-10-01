import "../../styles/payment/link.css";
import React, { Component } from "react";
import { ICryptoTokenResponse } from "core";
import { getTokens } from "../../modules/api";

interface IProps {
    link: string;
}

interface IState {
    tokens: Array<ICryptoTokenResponse>;
}

export default class Link extends Component<IProps, IState> {

    constructor(props: IProps) {
        super(props);
        this.state = { tokens: [] };
    }

    componentDidMount() {
        getTokens(this.props.link)
            .then(res => { 
                this.setState({ tokens: res.tokens });
            })
            .catch(console.log);
    }

    render() {
        return (
            <div className="link">
                Link
                <p>
                    Tokens: {this.state.tokens.map(x => x.currency)}
                </p>
            </div>
        );
    }
}