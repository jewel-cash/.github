import "../../styles/index/footer.css";
import React, { Component } from "react";

export default class Footer extends Component<any, any> {
    constructor(props: any) {
        super(props);
        this.sendEmail = this.sendEmail.bind(this);
    }

    sendEmail() {
        window.location.href = "mailto:contact@jewel.cash";
    }

    render() {
        return (
            <div className="footer">
                <div className="footer-phantom">
                    <span>Copyright © 2022 jewel.cash</span>
                </div>
                <div className="footer-content">
                    <span>Copyright © 2022 jewel.cash</span>
                    <span className="footer-contact" onClick={this.sendEmail}>Contact</span>
                </div>
            </div>
        );
    }
}