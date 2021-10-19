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
    <div className="flex flex-col h-full place-items-center justify-center space-y-5">
      <h4 className="font-bold">Êtes-vous sûr de vouloir supprimer ce widget ?</h4>
      <div className="flex flex-row justify-around w-full">
        <Button onClick={props.onCancelButtonClicked} variant="contained" color="primary" className="cancelButton">
          Annuler
        </Button>
        <Button onClick={confirmDeleteWidget} variant="contained" color="error" className="validateDeletionButton">
          Supprimer
        </Button>
      </div>
    </div>
  );
}
