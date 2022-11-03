import "../styles/link.css";
import React, { Component, createRef } from "react";
import { ICryptoTokenResponse, isValidName } from "core";
import { createCryptoAddress, getTokens } from "../modules/api";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faClose } from "@fortawesome/free-solid-svg-icons";
import { QRCodeSVG } from "qrcode.react";

interface IProps {
    link: string;
}

interface IState {
    isLoading: boolean;
    submitEnabled: boolean;
    title?: string;
    description?: string;
    image?: string;
    tokens?: Array<ICryptoTokenResponse>;
    address?: string;
}

export default class Link extends Component<IProps, IState> {
    private currencyField = createRef<HTMLInputElement>();
    private nameField = createRef<HTMLInputElement>();
    private messageField = createRef<HTMLInputElement>();

    constructor(props: IProps) {
        super(props);
        this.state = { 
            isLoading: true,
            submitEnabled: false
        };
        this.setState = this.setState.bind(this);
        this.redirectToHome = this.redirectToHome.bind(this);
        this.submitSelection = this.submitSelection.bind(this);
        this.inputChanged = this.inputChanged.bind(this);
        this.copyAddressToClipboard = this.copyAddressToClipboard.bind(this);
        this.backPressed = this.backPressed.bind(this);
    }

    componentDidMount() {
        getTokens(this.props.link)
            .then(this.setState)
            .then(() => this.setState({ isLoading: false }))
            .catch(this.redirectToHome);
    }

    redirectToHome() {
        const hash = window.location.hash;
        const current = window.location.href;
        window.location.href = current.replace(hash, "");
    }

    submitSelection() {
        if (this.state.tokens == null) { return; }
        const currencyIndex = parseInt(this.currencyField.current?.value ?? "");
        if (isNaN(currencyIndex)) { return; }
        if (this.state.tokens.length < currencyIndex) { return; }
        const currency = this.state.tokens[currencyIndex];
        let name = this.nameField.current?.value.trim() ?? "";
        if (name === "") { name = "Anonymous"; }
        let message: string | undefined = this.messageField.current?.value.trim() ?? "";
        if (message === "") { message = undefined; }

        this.setState({ isLoading: true });
        createCryptoAddress(this.props.link, currency.slug, name, message)
            .then(this.setState)
            .then(() => this.setState({ isLoading: false }))
            .catch(console.log);
    }

    inputChanged() {
        const currencyIndex = parseInt(this.currencyField.current?.value ?? "");
        const currencyValid = !isNaN(currencyIndex);
        const name = this.nameField.current?.value.trim() ?? "";
        const nameValid = isValidName(name) || name === "";
        const message = this.messageField.current?.value.trim() ?? "";
        const messageValid = message.length <= 250;
        const allFieldsValid = currencyValid && nameValid && messageValid;
        this.setState({ submitEnabled: allFieldsValid });
    }

    copyAddressToClipboard() {
        navigator.clipboard.writeText(this.state.address ?? "");
    }

    backPressed() {
        this.setState({ address: undefined });
    }

    render() {
        return (
            <div className="link">
                <div className="link-content">
                    <div className="spinner" hidden={!this.state.isLoading}></div>

                    <div className="link-image">
                        <FontAwesomeIcon className="link-image-placeholder" icon={faUser} />
                        <img className="link-image-source" src={this.state.image} />
                    </div>

                    <div hidden={this.state.isLoading || this.state.address != null}>
                        <span className="link-title">{this.state.title}</span>
                        <span className="link-description">{this.state.description}</span>
                    </div>
                    
                    <div className="link-form" hidden={this.state.isLoading || this.state.address != null}>
                        <span className="link-form-title">Currency</span>
                        <input className="link-form-select" list="currencies" placeholder="Select a currency" ref={this.currencyField} onChange={this.inputChanged} />
                        <datalist id="currencies">
                            {this.state.tokens?.map((x, i) => <option className="link-form-select-item" key={x.slug} value={i}>{x.name}</option>)}
                        </datalist>
                        <span className="link-form-warning">If this network allows sending different coins/tokens/etc other than it self, this is not supported.</span>
                        <span className="link-form-title">Notification</span>
                        <input className="link-form-name" type="text" placeholder="Name" ref={this.nameField} onChange={this.inputChanged} />
                        <input className="link-form-message" type="text" placeholder="Message" ref={this.messageField} onChange={this.inputChanged} />
                        <button className="link-form-button" onClick={this.submitSelection} disabled={!this.state.submitEnabled}>Submit</button>
                        <span className="link-form-warning">Always generate a new address if you want your donation message to play.</span>
                    </div>

                    <div className="link-address" hidden={this.state.address == null}>
                        <QRCodeSVG className="link-address-qr" value={this.state.address ?? ""} />
                        <span className="link-address-text">{this.state.address}</span>
                        <button className="link-address-copy" onClick={this.copyAddressToClipboard}>Copy</button>
                        <button className="link-address-back" onClick={this.backPressed}>
                            <FontAwesomeIcon icon={faClose} />
                        </button>
                    </div>
                </div>
            </div>
        );
    }
}