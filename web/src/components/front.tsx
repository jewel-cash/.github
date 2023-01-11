import "../styles/front.css";
import React, { Component } from "react";
import { coinbaseClient } from "../modules/network";

export default class Front extends Component {

    componentDidMount() {
        coinbaseClient.getProducts().then(x => console.log(x.map(y => y.id)));
    }

    render() {
        return (
            <div className="front">
                <div className="front-content">
                    Home
                </div>
            </div>
        );
    }
}