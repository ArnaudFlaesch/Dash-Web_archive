import * as React from "react";

interface IProps {
    idWidget: number;
    onCancelButtonClicked: () => void;
    onDeleteButtonClicked: (idWidget: number) => void;
}

export default function DeleteWidget(props: IProps) {
    const confirmDeleteWidget = () => {
        props.onDeleteButtonClicked(props.idWidget);
    }
    
    return (
        <div>
            <h4>Êtes-vous sûr de vouloir supprimer ce widget ?</h4>
            <button onClick={props.onCancelButtonClicked} className="btn btn-primary cancelButton">Annuler</button>
            <button onClick={confirmDeleteWidget} className="btn btn-danger validateDeletionButton">Supprimer</button>
        </div>
    )
}