import "../styles/app.css";
import React, { Component } from "react";
import Dash from "./dash";
import Front from "./front";
import Header from "./header";
import Footer from "./footer";
import { withAuth0, WithAuth0Props } from "@auth0/auth0-react";

class App extends Component<WithAuth0Props> {
    constructor(props: any) {
        super(props);
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
                <Header />
                {this.content()}
                <Footer />
            </div>
        );
    }
}

export default withAuth0(App);