import "../styles/account.css";
import React, { Component } from "react";
import { IAccountLinkResponse } from "core";
import { withAuth0, WithAuth0Props } from "@auth0/auth0-react";
import { createAccountLink, deleteAccountLink, getAccountLinks, updateAccountLink } from "../modules/api";

interface IState {
    links?: Array<IAccountLinkResponse>;
    edit?: IAccountLinkResponse;
}

class Account extends Component<WithAuth0Props, IState> {
    constructor(props: WithAuth0Props) {
        super(props);
        this.state = { };
        this.componentDidMount = this.componentDidMount.bind(this);
        this.setState = this.setState.bind(this);
        this.didPressEdit = this.didPressEdit.bind(this);
        this.didPressDelete = this.didPressDelete.bind(this);
        this.didPressNew = this.didPressNew.bind(this);
        this.didPressCloseEdit = this.didPressCloseEdit.bind(this);
        this.didPressSaveEdit = this.didPressSaveEdit.bind(this);
    }

    componentDidMount() {
        this.props.auth0.getAccessTokenSilently()
            .then(getAccountLinks)
            .then(this.setState)
            .catch(console.log);
    }

    private didPressEdit(index: number) {
        return () => {
            if (this.state.links == null) { return; }
            const link = this.state.links[index];
            this.setState({ edit: link });
        };
    }

    private didPressDelete(index: number) {
        return () => {
            if (this.state.links == null) { return; }
            const link = this.state.links[index];
            this.props.auth0.getAccessTokenSilently()
                .then(t => deleteAccountLink(t, link))
                .then(() => this.setState({ links: this.state.links?.splice(index, 1) }))
                .catch(console.log);
        };
    }

    private didPressNew() {
        const newLink: IAccountLinkResponse = { slug: "abcd", title: "Title", description: "Desc", image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8cG9ydHJhaXR8ZW58MHx8MHx8&w=1000&q=80" };
        this.setState({ edit: newLink });
        this.didPressSaveEdit();
    }

    private didPressCloseEdit() {
        this.setState({ edit: undefined });
    }

    private didPressSaveEdit() {
        const link = this.state.edit;
        if (link == null) { return; }
        const slugs = this.state.links?.map(x => x.slug) ?? [];
        const index = slugs.indexOf(link.slug);
        const isNew = index == -1;
        const method = isNew ? createAccountLink : updateAccountLink;
        this.props.auth0.getAccessTokenSilently()
            .then(t => method(t, link))
            .then(x => isNew ? this.state.links?.concat([x]) : this.state.links?.splice(index, 1, x))
            .then(x => this.setState({ links: x, edit: undefined }))
            .catch(console.log);
    }

    render() {
        return (
            <div className="account">
                <div className="spinner" hidden={this.state.links != null}></div>
                <div className="account-edit" hidden={this.state.edit == null}>

                </div>
                <div className="account-recent" hidden={this.state.links == null}>
                    <span className="account-title">Pages</span>
                    <div className="account-list">
                        <span className="account-empty" hidden={this.state.links?.length !== 0}>
                            You haven&apos;t created any pages yet
                        </span>
                        { this.state.links?.map((x, i) => <span key={i}>{x.slug}</span>) }
                    </div>
                </div>
                <button className="transaction-download" hidden={this.state.links == null} onClick={this.didPressNew} disabled={this.state.links?.length === 5}>New</button>
            </div>
        );
    }
}

export default withAuth0(Account);