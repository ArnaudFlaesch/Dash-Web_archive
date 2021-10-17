import { Button } from '@mui/material';
import { ReactElement } from 'react';

interface IProps {
  idWidget: number;
  onCancelButtonClicked: () => void;
  onDeleteButtonClicked: (idWidget: number) => void;
}

export default function DeleteWidget(props: IProps): ReactElement {
  const confirmDeleteWidget = () => {
    props.onDeleteButtonClicked(props.idWidget);
  };

  return (
    <div>
      <h4>Êtes-vous sûr de vouloir supprimer ce widget ?</h4>
      <Button onClick={props.onCancelButtonClicked} variant="contained" color="primary" className="cancelButton">
        Annuler
      </Button>
      <Button onClick={confirmDeleteWidget} variant="contained" color="error" className="validateDeletionButton">
        Supprimer
      </Button>
    </div>
  );
}
