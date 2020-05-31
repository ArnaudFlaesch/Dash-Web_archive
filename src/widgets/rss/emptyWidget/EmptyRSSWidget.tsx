import * as React from 'react';
import "./EmptyRSSWidget.scss";

interface IProps {
    url?: string;
    onUrlSubmitted: (url: string) => void;
}

interface IState {
    url: string;
}

export default class EmptyRSSWidget extends React.Component<IProps, IState> {

    constructor(props: IProps) {
        super(props);
        this.state = (this.props.url) ? { url: this.props.url } : { url: "" }
        this.onChangeHandler = this.onChangeHandler.bind(this);
        this.onValidation = this.onValidation.bind(this);
    }

    public onChangeHandler(event: any) {
        this.setState({ url: event.target.value });
    }

    public onValidation() {
        this.props.onUrlSubmitted(this.state.url);
    }

    public render() {
        return (
            <div>
                <input name="url" onChange={this.onChangeHandler} value={this.state.url} placeholder="Saisissez l'URL du flux RSS" />
                <button onClick={this.onValidation} disabled={this.state?.url.length < 1} className="btn btn-success">Valider</button>
            </div>
        )
    }
}