import * as React from 'react';

interface IProps {
    onUrlSubmitted: (url: string) => void;
}

interface IState {
    url: string;
}

export default class EmptyRSSWidget extends React.Component<IProps, IState> {

    constructor(props: IProps) {
        super(props);
        this.onChangeHandler = this.onChangeHandler.bind(this);
        this.onValidation = this.onValidation.bind(this);
    }

    public onChangeHandler(event: any) {
        this.setState({url: event.target.value});
    }

    public onValidation() {
        this.props.onUrlSubmitted(this.state.url);
    }

    public render() {
        return (
            <div>
                <input name="url" onChange={this.onChangeHandler} placeholder="Saisissez l'URL du flux RSS"/>
                <button onClick={this.onValidation} className="btn btn-success">Valider</button>
            </div>
        )
    }
}