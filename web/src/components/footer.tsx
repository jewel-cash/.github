import "../styles/footer.css";
import React, { Component, createRef } from "react";
import ReactMarkdown from "react-markdown";

interface IState {
    legalText?: string;
}

export default class Footer extends Component<any, IState> {
    private legalDiv = createRef<HTMLDivElement>();

    constructor(props: any) {
        super(props);
        this.state = { };
        this.sendEmail = this.sendEmail.bind(this);
        this.openModal = this.openModal.bind(this);
        this.closeModal = this.closeModal.bind(this);
    }

    private sendEmail() {
        window.location.href = "mailto:contact@jewl.app";
    }

    private openModal(page: string) {
        return () => {
            window.fetch(page)
                .then(x => x.text())
                .then(x => this.setState({ legalText: x }));
        };
    }

    private closeModal() {
        this.legalDiv.current?.scrollTo({ top: 0 });
        this.setState({ legalText: undefined });
    }

    render() {
        return (
            <div className="footer">
                <div className="footer-content">
                    <span className="footer-left-long">Copyright © 2023 jewl.app</span>
                    <span className="footer-left-short">© 2022</span>
                    <span className="footer-right" onClick={this.openModal("./privacy.md")}>Privacy Policy</span>
                    <span className="footer-right" onClick={this.openModal("./terms.md")}>Terms of Service</span>
                    <span className="footer-right" onClick={this.sendEmail}>Contact</span>
                </div>
                <div className="footer-legal-overlay" hidden={this.state.legalText == null} onClick={this.closeModal} />
                <div className="footer-legal-content" hidden={this.state.legalText == null} ref={this.legalDiv}>
                    <ReactMarkdown>{this.state.legalText ?? ""}</ReactMarkdown>
                </div>
            </div>
        );
    }
}