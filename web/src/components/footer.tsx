import "../styles/footer.css";
import type { ReactElement } from "react";
import React, { Component, createRef } from "react";
import ReactMarkdown from "react-markdown";

interface IState {
    legalText?: string;
}

export default class Footer extends Component<object, IState> {
    private readonly legalDiv = createRef<HTMLDivElement>();

    public constructor(props: object) {
        super(props);
        this.state = { };
    }

    private sendEmail(): () => void {
        return (): void => {
            window.location.href = "mailto:contact@jewl.app";
        };
    }

    private openModal(page: string): () => void {
        return (): void => {
            window.fetch(page)
                .then(async x => x.text())
                .then(x => this.setState({ legalText: x }))
                .catch(console.log);
        };
    }

    private closeModal(): () => void {
        return (): void => {
            this.legalDiv.current?.scrollTo({ top: 0 });
            this.setState({ legalText: undefined });
        };
    }

    public shouldComponentUpdate(): boolean {
        return true;
    }

    public render(): ReactElement {
        return (
            <div className="footer">
                <div className="footer-content">
                    <span className="footer-left-long">Copyright © 2023 jewl.app</span>
                    <span className="footer-left-short">© 2022</span>
                    <span className="footer-right" onClick={this.openModal("./privacy.md")}>Privacy Policy</span>
                    <span className="footer-right" onClick={this.openModal("./terms.md")}>Terms of Service</span>
                    <span className="footer-right" onClick={this.sendEmail()}>Contact</span>
                </div>
                <div className="footer-legal-overlay" hidden={this.state.legalText == null} onClick={this.closeModal()} />
                <div className="footer-legal-content" hidden={this.state.legalText == null} ref={this.legalDiv}>
                    <ReactMarkdown>{this.state.legalText ?? ""}</ReactMarkdown>
                </div>
            </div>
        );
    }
}
