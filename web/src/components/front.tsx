import "../styles/front.css";
import type { ReactElement } from "react";
import React, { Component } from "react";
import { coinbaseClient } from "../modules/network";

export default class Front extends Component {

    public componentDidMount(): void {
        coinbaseClient.getProducts()
            .then(x => console.log(x.map(y => y.id)))
            .catch(console.log);
    }

    public shouldComponentUpdate(): boolean {
        return true;
    }

    public render(): ReactElement {
        return (
            <div className="front">
                <div className="front-content">
                    Home
                </div>
            </div>
        );
    }
}
