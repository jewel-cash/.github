import "../styles/app.css";
import React, { Component } from "react";
import Dash from "./dash";
import Front from "./front";
import Header from "./header";
import Footer from "./footer";
import { withAuth0, WithAuth0Props } from "@auth0/auth0-react";

class App extends Component<WithAuth0Props> {
    private link: string | null;

    constructor(props: any) {
        super(props);
        const hash = window.location.hash.slice(2);
        this.link = hash.length === 0 ? null : hash;
    }

    private content() {
        if (this.props.auth0.isLoading) {
            return (<div className="spinner"></div>);
        }

        if (this.props.auth0.isAuthenticated) {
            return (<Dash />);
        }

        return (<Front />);
    }

    render() {
        return (
            <div className="app">
                <Header showLoginButton={this.link == null} />
                {this.content()}
                <Footer />
            </div>
        );
    }
}

export default withAuth0(App);