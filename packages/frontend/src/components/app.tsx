import "../styles/app.css";
import React, { Component } from "react";
import Dash from "./dash";
import Front from "./front";
import Link from "./link";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../modules/firebase";
import Header from "./header";
import Footer from "./footer";

interface IState {
    isLoggedIn: boolean;
}

export default class App extends Component<any, IState> {
    private link: string;

    constructor(props: any) {
        super(props);
        const query = new URLSearchParams(window.location.search);
        this.link = query.keys().next().value;
        this.state = { isLoggedIn: false};
    }

    componentDidMount() {
        onAuthStateChanged(auth, user => {
            this.setState({isLoggedIn: user != null});
        });
    }

    render() {
        return (
            <div className="app">
                <Header isLoggedIn={this.link == null ? this.state.isLoggedIn : undefined} />
                {this.link == null ? this.state.isLoggedIn ? <Dash /> : <Front /> : <Link link={this.link} /> }
                <Footer />
            </div>
        );
    }
}