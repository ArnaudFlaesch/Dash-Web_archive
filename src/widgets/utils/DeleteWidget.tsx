import * as React from "react";

interface IProps {
    idWidget: number;
    onCancelButtonClicked: () => void;
    onDeleteButtonClicked: (idWidget: number) => void;
}

export default class DeleteWidget extends React.Component<IProps, any> {
    constructor(props: IProps) {
        super(props);
        this.confirmDeleteWidget = this.confirmDeleteWidget.bind(this);
    }

    public render() {
        return (
            <div>
                <h4>Êtes-vous sûr de vouloir supprimer ce widget ?</h4>
                <button onClick={this.props.onCancelButtonClicked} className="btn btn-primary">Annuler</button>
                <button onClick={this.confirmDeleteWidget} className="btn btn-danger">Supprimer</button>
            </div>
        )
    }

    private confirmDeleteWidget() {
        this.props.onDeleteButtonClicked(this.props.idWidget);
    }
}